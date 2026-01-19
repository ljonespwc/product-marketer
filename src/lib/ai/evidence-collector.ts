import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  EvidenceBank,
  EvidenceQuote,
  StatisticalClaim,
  CustomerVoice,
  RichExtractedElements
} from '@/types/database'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

interface PageData {
  url: string
  raw_markdown: string
  rich_elements: RichExtractedElements
}

const EVIDENCE_COLLECTION_PROMPT = `You are building an evidence bank from a B2B SaaS website.

YOUR TASK:
Extract ALL quotable evidence from the provided pages. Every piece of evidence must be:
1. An EXACT quote from the page (max 150 characters)
2. Tagged with its structural context (where it appears)
3. Categorized by type
4. Rated for specificity

CRITICAL: This evidence bank will be used to cite claims in the analysis. Missing evidence = incomplete citations.

PAGES DATA:
{PAGES_DATA}

Extract evidence in this JSON format:

{
  "quotes": [
    {
      "id": "Q1",
      "text": "exact quote from page (max 150 chars)",
      "page_url": "source URL",
      "structural_context": "h1|h2|h3|body|testimonial|cta",
      "category": "value_prop|differentiation|proof|audience|pain|trust|pricing",
      "specificity_rating": 1-5 (5=very specific with numbers/names, 1=completely vague)
    }
  ],
  "statistical_claims": [
    {
      "id": "S1",
      "claim": "the statistical claim",
      "page_url": "source URL",
      "specificity": "specific|vague|unverifiable",
      "context": "surrounding context that validates or weakens this stat"
    }
  ],
  "customer_voice": [
    {
      "id": "CV1",
      "quote": "customer testimonial or quote",
      "attribution": "name, company, title (if available)",
      "page_url": "source URL",
      "credibility": "high|medium|low (high = named person/company, medium = company only, low = anonymous)"
    }
  ]
}

EVIDENCE COLLECTION PRINCIPLES:

1. QUOTES (Q1, Q2, Q3...):
   - Extract H1s and H2s - these are positioning statements
   - Extract value propositions from any structural level
   - Extract differentiation claims
   - Extract proof claims (statistics, social proof)
   - Extract audience statements ("for X teams")
   - Keep quotes SHORT (max 150 chars) but COMPLETE enough to be meaningful
   - ID format: Q1, Q2, Q3, etc.

2. STATISTICAL CLAIMS (S1, S2, S3...):
   - ANY number or percentage mentioned
   - Time savings ("10 hours/week")
   - User/customer counts ("10,000+ customers")
   - Performance metrics ("99.9% uptime")
   - Growth claims ("3x increase")
   - Mark as "specific" if verifiable, "vague" if not ("thousands" = vague)
   - ID format: S1, S2, S3, etc.

3. CUSTOMER VOICE (CV1, CV2, CV3...):
   - Direct quotes from customers
   - Testimonials (even partial)
   - Case study excerpts
   - Rate credibility based on attribution quality
   - ID format: CV1, CV2, CV3, etc.

BE EXHAUSTIVE. The quality of the final analysis depends on the completeness of this evidence bank.
`

export interface EvidenceCollectorResult {
  evidence_bank: EvidenceBank
  quote_count: number
  stat_count: number
  voice_count: number
}

/**
 * Collect all quotable evidence from pages into a citation bank
 * This enables "Your differentiation is buried [Q7: 'AI-powered brand voice' - body text]"
 */
export async function collectEvidence(
  pages: PageData[]
): Promise<EvidenceCollectorResult | null> {
  try {
    // Build pages data for prompt
    const pagesData = pages.map((page, i) => {
      // Include both raw markdown (for context) and extracted elements
      const elementsJson = JSON.stringify({
        headlines: page.rich_elements.headlines,
        value_propositions: page.rich_elements.value_propositions,
        proof_points: page.rich_elements.proof_points,
        target_audience_signals: page.rich_elements.target_audience_signals,
        competitive_positioning: page.rich_elements.competitive_positioning,
        trust_signals: page.rich_elements.trust_signals,
      }, null, 2)

      // Truncate markdown if too long (keep first 3000 chars for context)
      const truncatedMarkdown = page.raw_markdown.length > 3000
        ? page.raw_markdown.slice(0, 3000) + '\n\n[...truncated...]'
        : page.raw_markdown

      return `
=== PAGE ${i + 1}: ${page.url} ===

RAW CONTENT (for exact quotes):
${truncatedMarkdown}

EXTRACTED ELEMENTS (already identified):
${elementsJson}
`
    }).join('\n---\n')

    const prompt = EVIDENCE_COLLECTION_PROMPT.replace('{PAGES_DATA}', pagesData)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonStr = jsonMatch[1]?.trim() || text.trim()

    const parsed = JSON.parse(jsonStr) as EvidenceBank

    // Ensure arrays exist and validate IDs
    const quotes: EvidenceQuote[] = (parsed.quotes || []).map((q, i) => ({
      ...q,
      id: q.id || `Q${i + 1}`,
    }))

    const statistical_claims: StatisticalClaim[] = (parsed.statistical_claims || []).map((s, i) => ({
      ...s,
      id: s.id || `S${i + 1}`,
    }))

    const customer_voice: CustomerVoice[] = (parsed.customer_voice || []).map((cv, i) => ({
      ...cv,
      id: cv.id || `CV${i + 1}`,
    }))

    return {
      evidence_bank: {
        quotes,
        statistical_claims,
        customer_voice,
      },
      quote_count: quotes.length,
      stat_count: statistical_claims.length,
      voice_count: customer_voice.length,
    }
  } catch (error) {
    console.error('Evidence collection error:', error)
    return null
  }
}

/**
 * Find evidence by ID from the evidence bank
 */
export function findEvidence(
  evidenceBank: EvidenceBank,
  evidenceId: string
): EvidenceQuote | StatisticalClaim | CustomerVoice | null {
  if (evidenceId.startsWith('Q')) {
    return evidenceBank.quotes.find(q => q.id === evidenceId) || null
  }
  if (evidenceId.startsWith('S')) {
    return evidenceBank.statistical_claims.find(s => s.id === evidenceId) || null
  }
  if (evidenceId.startsWith('CV')) {
    return evidenceBank.customer_voice.find(cv => cv.id === evidenceId) || null
  }
  return null
}

/**
 * Format an evidence citation for display
 * e.g., [Q7: "AI-powered brand voice" - body text]
 */
export function formatCitation(
  evidenceBank: EvidenceBank,
  evidenceId: string
): string {
  const evidence = findEvidence(evidenceBank, evidenceId)
  if (!evidence) return `[${evidenceId}: not found]`

  if ('text' in evidence) {
    // EvidenceQuote
    const quote = evidence as EvidenceQuote
    const truncatedText = quote.text.length > 50
      ? quote.text.slice(0, 47) + '...'
      : quote.text
    return `[${quote.id}: "${truncatedText}" - ${quote.structural_context}]`
  }

  if ('claim' in evidence) {
    // StatisticalClaim
    const stat = evidence as StatisticalClaim
    return `[${stat.id}: ${stat.claim} - ${stat.specificity}]`
  }

  if ('quote' in evidence) {
    // CustomerVoice
    const voice = evidence as CustomerVoice
    const truncatedQuote = voice.quote.length > 50
      ? voice.quote.slice(0, 47) + '...'
      : voice.quote
    const attr = voice.attribution || 'anonymous'
    return `[${voice.id}: "${truncatedQuote}" - ${attr}]`
  }

  return `[${evidenceId}]`
}
