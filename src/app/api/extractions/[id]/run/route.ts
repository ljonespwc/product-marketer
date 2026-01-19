import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { scrapeUrl } from '@/lib/scraper/jina'
import { extractElements } from '@/lib/ai/element-extractor'
import { synthesizePositioning } from '@/lib/ai/synthesizer'
import { analyzeGaps } from '@/lib/ai/gap-analyzer'
import { ExtractionUrl } from '@/types/database'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/extractions/[id]/run - Trigger scraping + AI pipeline
export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify session ownership and status
  const { data: session } = await supabase
    .from('extraction_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  if (session.status !== 'pending') {
    return NextResponse.json({ error: 'Session already processed' }, { status: 400 })
  }

  // Update session to processing (include user_id to prevent race condition)
  await supabase
    .from('extraction_sessions')
    .update({ status: 'processing' })
    .eq('id', id)
    .eq('user_id', user.id)

  // Start async processing (don't await - let client poll for status)
  processExtraction(id, supabase).catch(error => {
    console.error('Pipeline error:', error)
  })

  return NextResponse.json({ status: 'processing' })
}

async function processExtraction(sessionId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  try {
    // Get URLs
    const { data: urls } = await supabase
      .from('extraction_urls')
      .select('*')
      .eq('session_id', sessionId)

    if (!urls || urls.length === 0) {
      throw new Error('No URLs found')
    }

    // Phase 1: Scrape all URLs
    for (const urlRecord of urls) {
      await supabase
        .from('extraction_urls')
        .update({ scrape_status: 'scraping' })
        .eq('id', urlRecord.id)

      const scrapeResult = await scrapeUrl(urlRecord.url)

      if (!scrapeResult.success) {
        await supabase
          .from('extraction_urls')
          .update({
            scrape_status: 'failed',
            error_message: scrapeResult.error,
          })
          .eq('id', urlRecord.id)
        continue
      }

      await supabase
        .from('extraction_urls')
        .update({
          raw_markdown: scrapeResult.markdown,
          scrape_status: 'extracting',
        })
        .eq('id', urlRecord.id)

      // Phase 2: Extract elements
      const elements = await extractElements(scrapeResult.markdown!)

      if (elements) {
        await supabase
          .from('extraction_urls')
          .update({
            extracted_elements: elements,
            scrape_status: 'complete',
          })
          .eq('id', urlRecord.id)
      } else {
        await supabase
          .from('extraction_urls')
          .update({
            scrape_status: 'failed',
            error_message: 'Element extraction failed',
          })
          .eq('id', urlRecord.id)
      }
    }

    // Get updated URLs with extracted elements
    const { data: processedUrls } = await supabase
      .from('extraction_urls')
      .select('*')
      .eq('session_id', sessionId)

    const successfulUrls = (processedUrls || []).filter(
      (u: ExtractionUrl) => u.scrape_status === 'complete' && u.extracted_elements
    )

    if (successfulUrls.length === 0) {
      await supabase
        .from('extraction_sessions')
        .update({ status: 'failed' })
        .eq('id', sessionId)
      return
    }

    // Phase 3: Cross-page synthesis
    const synthesis = await synthesizePositioning(successfulUrls as ExtractionUrl[])

    if (!synthesis) {
      await supabase
        .from('extraction_sessions')
        .update({ status: 'failed' })
        .eq('id', sessionId)
      return
    }

    // Phase 4: Gap analysis
    const gaps = await analyzeGaps(synthesis)

    // Save results
    const resultsData = {
      session_id: sessionId,
      positioning_statement: synthesis.positioning_statement,
      category_claimed: synthesis.category_claimed,
      value_hierarchy: synthesis.value_hierarchy,
      primary_persona: synthesis.primary_persona,
      secondary_personas: synthesis.secondary_personas,
      pain_points: synthesis.pain_points,
      navigation_analysis: synthesis.navigation_analysis,
      messaging_variants: synthesis.messaging_variants,
      overall_consistency_score: synthesis.overall_consistency_score,
      ...(gaps && {
        specificity_score: gaps.specificity_score,
        so_what_gaps: gaps.so_what_gaps,
        differentiation_strength: gaps.differentiation_strength,
        ten_second_takeaway: gaps.ten_second_takeaway,
        critical_observations: gaps.critical_observations,
        proof_score: gaps.proof_score,
        proof_points: gaps.proof_points,
        unsubstantiated_claims: gaps.unsubstantiated_claims,
      }),
    }

    await supabase
      .from('extraction_results')
      .insert(resultsData)

    // Update session to complete
    await supabase
      .from('extraction_sessions')
      .update({ status: 'complete' })
      .eq('id', sessionId)

  } catch (error) {
    console.error('Pipeline error:', error)
    await supabase
      .from('extraction_sessions')
      .update({ status: 'failed' })
      .eq('id', sessionId)
  }
}
