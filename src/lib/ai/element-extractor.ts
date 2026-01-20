import { GoogleGenerativeAI } from '@google/generative-ai'
import { ExtractedElements, RichExtractedElements } from '@/types/database'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const RICH_EXTRACTION_PROMPT = `You are analyzing a single page from a B2B SaaS website.

YOUR PERSPECTIVE:
- You are a first-time visitor who knows nothing about this company
- You have no insider context—only what the page communicates
- You notice what's said AND where it's said (structure = emphasis)

INPUT FORMAT:
The page content is MARKDOWN with structure preserved:
- # = H1 (highest priority claim - what company considers MOST important)
- ## = H2 (secondary claims)
- ### = H3 (supporting details)
- Regular paragraphs = explanatory content (lowest priority)
- Lists = feature inventories or proof points
- [Link text](url) = navigation and CTAs

CRITICAL INSTRUCTIONS:
1. Treat header hierarchy as EMPHASIS HIERARCHY. What appears in H1 is what the company considers most important.
2. FIND ALL PROOF POINTS - don't just get the obvious ones. Look for:
   - Statistics (even small ones like "10+ years")
   - Testimonials (even partial quotes)
   - Logos mentioned or implied
   - Awards and certifications
   - Case study references
   - ANY claim with evidence
3. For every extracted item, include the EXACT text from the page (raw_text)
4. Detect internal contradictions on this single page

YOUR TASK:
Extract the following from this page in JSON format:

{
  "headlines": [
    {
      "text": "exact headline text",
      "level": "h1|h2|h3",
      "emphasis_score": 10 for H1, 7 for H2, 4 for H3, adjust +/-2 based on placement,
      "page_section": "hero|features|benefits|social_proof|pricing|footer|other",
      "raw_text": "exact text as it appears on page"
    }
  ],
  "value_propositions": [
    {
      "claim": "the benefit statement",
      "raw_text": "exact text as it appears on page",
      "page_section": "hero|features|benefits|social_proof|pricing|footer|other",
      "structural_level": "h1|h2|h3|body",
      "specificity_rating": 1-5 (5=very specific with numbers/outcomes, 1=completely vague),
      "specificity_reason": "why this rating"
    }
  ],
  "proof_points": [
    {
      "claim": "the claim being made",
      "proof_type": "statistic|testimonial|case_study|logo|award|certification|none",
      "specificity": "specific|vague|missing",
      "raw_text": "exact text from page",
      "page_section": "hero|features|benefits|social_proof|pricing|footer|other",
      "structural_level": "h1|h2|h3|body",
      "specificity_reason": "why specific/vague/missing"
    }
  ],
  "ctas": [
    {
      "text": "button/link text",
      "placement": "hero|navigation|inline|footer",
      "action_type": "signup|demo|contact|learn_more|pricing|other"
    }
  ],
  "target_audience_signals": [
    {
      "signal": "who this is for",
      "raw_text": "exact text",
      "explicit": true if stated directly ("for marketing teams"), false if implied (jargon),
      "structural_level": "h1|h2|h3|body"
    }
  ],
  "competitive_positioning": [
    {
      "claim": "differentiation or competitive statement",
      "raw_text": "exact text",
      "structural_level": "h1|h2|h3|body"
    }
  ],
  "pricing_signals": ["pricing tiers, 'free trial', 'enterprise', etc."],
  "trust_signals": [
    {
      "signal": "the trust indicator",
      "raw_text": "exact text",
      "signal_type": "logo|testimonial|certification|award|press|stat"
    }
  ],
  "internal_contradictions": [
    {
      "topic": "what's being contradicted",
      "statement_a": "first statement",
      "statement_b": "contradicting statement",
      "severity": "high|medium|low"
    }
  ]
}

EXTRACTION PRINCIPLES:
1. If a differentiator appears only in body text while generic claims are in H1, note that structural placement
2. "Trusted by thousands" in H1 vs "AI-powered brand voice" in paragraph 4 reveals actual priorities
3. Navigation items reveal strategic priorities (what deserves top-level attention)
4. Primary CTA text reveals conversion strategy (free trial = PLG, demo = sales-led)
5. Specificity matters: "Save 10 hours/week" (5) > "Save time" (2) > "Improve efficiency" (1)
6. Look for HIDDEN proof points - stats in body text, logos mentioned in passing, implicit case studies
7. Internal contradictions can be claims that don't align (e.g., "enterprise-grade" + "self-serve")

BE THOROUGH. Missing proof points means the analysis will be incomplete.

PAGE CONTENT:
`

// Legacy extraction for backwards compatibility
const LEGACY_EXTRACTION_PROMPT = `You are analyzing a single page from a B2B SaaS website.

YOUR PERSPECTIVE:
- You are a first-time visitor who knows nothing about this company
- You have no insider context—only what the page communicates
- You notice what's said AND where it's said (structure = emphasis)

INPUT FORMAT:
The page content is MARKDOWN with structure preserved:
- # = H1 (highest priority claim - what company considers MOST important)
- ## = H2 (secondary claims)
- ### = H3 (supporting details)
- Regular paragraphs = explanatory content (lowest priority)
- Lists = feature inventories or proof points
- [Link text](url) = navigation and CTAs

CRITICAL INSTRUCTION:
Treat header hierarchy as EMPHASIS HIERARCHY. What appears in H1 is what the company considers most important. What's buried in body paragraphs is deprioritized. This structural placement is a positioning signal—often more revealing than the words themselves.

YOUR TASK:
Extract the following from this page in JSON format:

{
  "headlines": [
    {
      "text": "exact headline text",
      "level": "h1|h2|h3",
      "emphasis_score": 10 for H1, 7 for H2, 4 for H3, adjust +/-2 based on placement (hero area = higher)
    }
  ],
  "value_propositions": [
    "benefit statements - note: H1/H2 claims are structurally prioritized over body text claims"
  ],
  "proof_points": [
    {
      "claim": "the claim being made",
      "proof_type": "statistic|testimonial|case_study|logo|award|certification|none",
      "specificity": "specific (concrete numbers/names)|vague (generic claims)|missing (claim without proof)",
      "raw_text": "the actual text from the page"
    }
  ],
  "ctas": [
    {
      "text": "button/link text",
      "placement": "hero|navigation|inline|footer",
      "action_type": "signup|demo|contact|learn_more|pricing|other"
    }
  ],
  "target_audience_signals": [
    "phrases indicating who this is for - note whether explicit ('for marketing teams') or implied (jargon that assumes knowledge)"
  ],
  "competitive_positioning": [
    "any statements about alternatives, competitors, or differentiation"
  ],
  "pricing_signals": [
    "pricing tiers, 'free trial', 'enterprise', or pricing-related messaging"
  ],
  "trust_signals": [
    "logos, testimonials, certifications, awards, press mentions"
  ]
}

EXTRACTION PRINCIPLES:
1. If a differentiator appears only in body text while generic claims are in H1, note that—it's a structural gap
2. "Trusted by thousands" in H1 vs "AI-powered brand voice" in paragraph 4 reveals actual priorities
3. Navigation items reveal strategic priorities (what deserves top-level attention)
4. Primary CTA text reveals conversion strategy (free trial = PLG, demo = sales-led)
5. Specificity matters: "Save 10 hours/week" > "Save time" > "Improve efficiency"

PAGE CONTENT:
`

/**
 * Helper to extract JSON from LLM response that may be wrapped in markdown code fences
 */
function extractJsonFromResponse(text: string): string {
  let cleaned = text.trim()

  // Remove markdown code fences if present
  if (cleaned.startsWith('```')) {
    // Remove opening fence (```json or ```)
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '')
    // Remove closing fence
    cleaned = cleaned.replace(/\n?```\s*$/, '')
  }

  // Find JSON object boundaries as fallback
  const jsonStart = cleaned.indexOf('{')
  const jsonEnd = cleaned.lastIndexOf('}')

  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.slice(jsonStart, jsonEnd + 1)
  }

  return cleaned.trim()
}

/**
 * Extract rich elements with enhanced schema, citations, and contradiction detection
 * Uses gemini-2.0-flash for better quality
 */
export async function extractRichElements(markdown: string): Promise<RichExtractedElements | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const result = await model.generateContent(RICH_EXTRACTION_PROMPT + markdown)
    const response = result.response
    const text = response.text()

    // Extract JSON from response (handles markdown code fences)
    const jsonStr = extractJsonFromResponse(text)

    const parsed = JSON.parse(jsonStr) as RichExtractedElements

    return {
      headlines: parsed.headlines || [],
      value_propositions: parsed.value_propositions || [],
      proof_points: parsed.proof_points || [],
      ctas: parsed.ctas || [],
      target_audience_signals: parsed.target_audience_signals || [],
      competitive_positioning: parsed.competitive_positioning || [],
      pricing_signals: parsed.pricing_signals || [],
      trust_signals: parsed.trust_signals || [],
      internal_contradictions: parsed.internal_contradictions || [],
    }
  } catch (error) {
    console.error('Rich element extraction error:', error)
    return null
  }
}

/**
 * Convert rich elements to legacy format for backwards compatibility
 */
export function richToLegacyElements(rich: RichExtractedElements): ExtractedElements {
  return {
    headlines: rich.headlines.map(h => ({
      text: h.text,
      level: h.level,
      emphasis_score: h.emphasis_score,
    })),
    value_propositions: rich.value_propositions.map(v => v.claim),
    proof_points: rich.proof_points.map(p => ({
      claim: p.claim,
      proof_type: p.proof_type,
      specificity: p.specificity,
      raw_text: p.raw_text,
    })),
    ctas: rich.ctas,
    target_audience_signals: rich.target_audience_signals.map(t => t.signal),
    competitive_positioning: rich.competitive_positioning.map(c => c.claim),
    pricing_signals: rich.pricing_signals,
    trust_signals: rich.trust_signals.map(t => t.signal),
  }
}

/**
 * Legacy extraction function for backwards compatibility
 * Uses gemini-2.0-flash-lite (cheaper but less thorough)
 */
export async function extractElements(markdown: string): Promise<ExtractedElements | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

    const result = await model.generateContent(LEGACY_EXTRACTION_PROMPT + markdown)
    const response = result.response
    const text = response.text()

    // Extract JSON from response (handles markdown code fences)
    const jsonStr = extractJsonFromResponse(text)

    const parsed = JSON.parse(jsonStr) as ExtractedElements

    return {
      headlines: parsed.headlines || [],
      value_propositions: parsed.value_propositions || [],
      proof_points: parsed.proof_points || [],
      ctas: parsed.ctas || [],
      target_audience_signals: parsed.target_audience_signals || [],
      competitive_positioning: parsed.competitive_positioning || [],
      pricing_signals: parsed.pricing_signals || [],
      trust_signals: parsed.trust_signals || [],
    }
  } catch (error) {
    console.error('Element extraction error:', error)
    return null
  }
}
