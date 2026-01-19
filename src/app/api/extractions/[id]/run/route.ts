import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { scrapeUrl } from '@/lib/scraper/jina'
import { extractRichElements, richToLegacyElements } from '@/lib/ai/element-extractor'
import { collectEvidence } from '@/lib/ai/evidence-collector'
import { synthesizeWithEvidence } from '@/lib/ai/synthesizer'
import { analyzeGapsWithEvidence } from '@/lib/ai/gap-analyzer'
import { ExtractionUrl, RichExtractedElements, CriticalObservation } from '@/types/database'

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

    // Phase 1: Scrape all URLs and extract rich elements
    console.log(`[Pipeline] Starting scrape and extraction for ${urls.length} URLs`)

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

      // Phase 2: Extract RICH elements (enhanced with citations)
      console.log(`[Pipeline] Extracting rich elements from ${urlRecord.url}`)
      const richElements = await extractRichElements(scrapeResult.markdown!)

      if (richElements) {
        // Convert to legacy format for backwards compatibility
        const legacyElements = richToLegacyElements(richElements)

        await supabase
          .from('extraction_urls')
          .update({
            extracted_elements: legacyElements,
            rich_elements: richElements,
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
      (u: ExtractionUrl) => u.scrape_status === 'complete' && u.rich_elements
    ) as (ExtractionUrl & { raw_markdown: string; rich_elements: RichExtractedElements })[]

    if (successfulUrls.length === 0) {
      await supabase
        .from('extraction_sessions')
        .update({ status: 'failed' })
        .eq('id', sessionId)
      return
    }

    // Phase 3: Collect evidence from all pages
    console.log(`[Pipeline] Collecting evidence from ${successfulUrls.length} pages`)
    const evidenceResult = await collectEvidence(
      successfulUrls.map(u => ({
        url: u.url,
        raw_markdown: u.raw_markdown,
        rich_elements: u.rich_elements,
      }))
    )

    if (!evidenceResult) {
      console.error('[Pipeline] Evidence collection failed')
      await supabase
        .from('extraction_sessions')
        .update({ status: 'failed' })
        .eq('id', sessionId)
      return
    }

    console.log(`[Pipeline] Collected ${evidenceResult.quote_count} quotes, ${evidenceResult.stat_count} stats, ${evidenceResult.voice_count} customer voices`)

    // Phase 4: Cross-page synthesis with evidence
    console.log('[Pipeline] Synthesizing positioning with evidence')
    const synthesis = await synthesizeWithEvidence(
      successfulUrls.map(u => ({
        url: u.url,
        raw_markdown: u.raw_markdown,
        rich_elements: u.rich_elements,
      })),
      evidenceResult.evidence_bank
    )

    if (!synthesis) {
      console.error('[Pipeline] Synthesis failed')
      await supabase
        .from('extraction_sessions')
        .update({ status: 'failed' })
        .eq('id', sessionId)
      return
    }

    // Phase 5: Gap analysis with evidence
    console.log('[Pipeline] Analyzing gaps with evidence')
    const gaps = await analyzeGapsWithEvidence(
      synthesis,
      evidenceResult.evidence_bank,
      successfulUrls.map(u => ({
        url: u.url,
        raw_markdown: u.raw_markdown,
        rich_elements: u.rich_elements,
      }))
    )

    // Save results with new enhanced fields
    const resultsData = {
      session_id: sessionId,

      // Positioning Synthesis
      positioning_statement: synthesis.positioning_statement,
      category_claimed: synthesis.category_claimed,
      value_hierarchy: synthesis.value_hierarchy,
      positioning_confidence: synthesis.positioning_confidence,
      positioning_evidence: synthesis.positioning_evidence,

      // ICP Extraction
      primary_persona: synthesis.primary_persona,
      secondary_personas: synthesis.secondary_personas,
      pain_points: synthesis.pain_points,

      // Navigation & Consistency
      navigation_analysis: synthesis.navigation_analysis,
      messaging_variants: synthesis.messaging_variants,
      overall_consistency_score: synthesis.overall_consistency_score,
      cross_page_contradictions: synthesis.cross_page_contradictions,

      // Evidence Bank
      evidence_bank: evidenceResult.evidence_bank,

      // Gap Analysis
      ...(gaps && {
        specificity_score: gaps.specificity_score,
        so_what_gaps: gaps.so_what_gaps,
        differentiation_strength: gaps.differentiation_strength,
        ten_second_takeaway: gaps.ten_second_takeaway,
        critical_observations: gaps.critical_observations,
        proof_score: gaps.proof_score,
        proof_points: gaps.proof_points,
        unsubstantiated_claims: gaps.unsubstantiated_claims,
        structural_misalignments: gaps.structural_misalignments,
        actionable_recommendations: gaps.actionable_recommendations,
        executive_summary: gaps.executive_summary,
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

    console.log('[Pipeline] Extraction complete')

  } catch (error) {
    console.error('Pipeline error:', error)
    await supabase
      .from('extraction_sessions')
      .update({ status: 'failed' })
      .eq('id', sessionId)
  }
}
