import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  ExtractedElements,
  ExtractionUrl,
  RichExtractedElements,
  EvidenceBank,
  CrossPageContradiction,
  MessagingVariant,
} from '@/types/database'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

/**
 * Helper to extract JSON from LLM response that may be wrapped in markdown code fences
 */
function extractJsonFromResponse(text: string): string {
  let cleaned = text.trim()

  // Remove markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '')
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

const ENHANCED_SYNTHESIS_PROMPT = `You are a positioning analyst examining a B2B SaaS company's website.

YOUR PERSPECTIVE:
- You are a first-time visitor who knows nothing about this company
- You have no insider context—only what the pages communicate
- You notice what's said AND where it's said (structure = emphasis)
- What appears in H1 is their #1 priority. What's buried in paragraphs is deprioritized.

CRITICAL: You have access to an EVIDENCE BANK with citation IDs. Every claim you make MUST reference relevant evidence IDs.

EVIDENCE BANK:
{EVIDENCE_BANK}

PAGES DATA (with raw markdown for context):
{PAGES_DATA}

YOUR TASK:

1. POSITIONING STATEMENT
Write a single sentence: "We help [who] do [what] so they can [outcome]"
Based ONLY on what the site says. Do not infer or improve—mirror what's there.
Include evidence_ids that support this positioning.

2. POSITIONING CONFIDENCE
Rate your confidence in the positioning:
- "high": Clear, consistent messaging across pages with strong evidence
- "medium": Some clarity but inconsistencies or gaps exist
- "low": Unclear, contradictory, or insufficient evidence to determine positioning

3. CATEGORY PLACEMENT
What category is this company placing itself in?
Be specific (not "software" but "sales engagement platform" or "AI writing assistant")
Include evidence_ids.

4. VALUE HIERARCHY
Rank the top 5 value themes by STRUCTURAL PROMINENCE:
- What appears in H1s across pages = highest weight
- What appears in H2s = secondary weight
- What's only in body text = lowest weight
- Include evidence_ids for each value proposition

5. PRIMARY PERSONA
Based on target audience signals, who is the primary buyer?
Note where this is structurally emphasized vs. buried.
Flag where the site is unclear or contradictory.
Include evidence_ids.

6. SECONDARY PERSONAS
Any other personas mentioned? How prominently?
Include evidence_ids.

7. PAIN POINTS
List every problem the site claims to solve.
Note structural placement (H1/H2/body) for each.
Include evidence_ids.

8. NAVIGATION ANALYSIS
- What do the top-level nav items reveal about strategic priorities?
- What's conspicuously missing from navigation?
- Primary CTAs across pages: what's the conversion strategy signal?
  ("Start Free Trial" = PLG, "Request Demo" = sales-led, "Contact Us" = enterprise/unclear)

9. MESSAGING VARIANTS
For key concepts, track how messaging varies across pages.
Include page URLs and structural level for each variant.
Include evidence_ids.

10. CROSS-PAGE CONTRADICTIONS
Identify where different pages say contradictory things.
This is CRITICAL for surfacing positioning inconsistencies.
Include evidence_ids from both pages.

11. OVERALL CONSISTENCY SCORE
0-100: How coherent is the positioning across all pages?

Return as JSON:
{
  "positioning_statement": "string",
  "positioning_confidence": "high|medium|low",
  "positioning_evidence": ["Q1", "Q2", ...],
  "category_claimed": "string",
  "category_evidence": ["Q3", ...],
  "value_hierarchy": [
    {
      "rank": 1,
      "value_proposition": "string",
      "emphasis_score": number,
      "page_appearances": ["url"],
      "evidence_ids": ["Q4", "Q5"]
    }
  ],
  "primary_persona": {
    "title": "string",
    "seniority": "string|null",
    "industry": "string|null",
    "pain_points": ["string"],
    "desired_outcomes": ["string"],
    "evidence_ids": ["Q6", ...]
  },
  "secondary_personas": [
    {
      "title": "string",
      "pain_points": ["string"],
      "desired_outcomes": ["string"],
      "evidence_ids": ["Q7", ...]
    }
  ],
  "pain_points": [
    {
      "pain": "string",
      "frequency": number,
      "pages_mentioned": ["url"],
      "evidence_ids": ["Q8", ...]
    }
  ],
  "navigation_analysis": {
    "primary_ctas": ["string"],
    "cta_consistency_score": number,
    "nav_priority_alignment": "string description of what nav reveals and what's missing"
  },
  "messaging_variants": [
    {
      "concept": "string",
      "variants": [
        {
          "text": "string",
          "page_url": "url",
          "structural_level": "h1|h2|h3|body",
          "evidence_id": "Q9"
        }
      ],
      "consistency_score": number
    }
  ],
  "cross_page_contradictions": [
    {
      "topic": "what's being contradicted",
      "page_a": {
        "url": "url1",
        "says": "statement from page 1",
        "evidence_id": "Q10"
      },
      "page_b": {
        "url": "url2",
        "says": "contradictory statement from page 2",
        "evidence_id": "Q11"
      },
      "severity": "critical|moderate|minor"
    }
  ],
  "overall_consistency_score": number
}

ALWAYS cite evidence IDs. If you can't find evidence for a claim, note that it's inferred.
`

// Legacy prompt for backwards compatibility
const LEGACY_SYNTHESIS_PROMPT = `You are a positioning analyst examining a B2B SaaS company's website.

YOUR PERSPECTIVE:
- You are a first-time visitor who knows nothing about this company
- You have no insider context—only what the pages communicate
- You notice what's said AND where it's said (structure = emphasis)
- What appears in H1 is their #1 priority. What's buried in paragraphs is deprioritized.

CRITICAL FRAMING:
The HIERARCHY of content reveals positioning priorities:
- H1 headline = The single most important claim
- H2 headlines = Secondary value propositions
- Body paragraphs = Supporting details (deprioritized)
- Navigation labels = Strategic priorities (what deserves top-level attention)
- Primary CTA = The action they most want visitors to take

If their differentiation claim is in paragraph 4 but "trusted by 10,000 users" is the H1, that tells you what they're actually prioritizing—regardless of what they'd say in a strategy meeting.

PAGES DATA:
{PAGES_DATA}

YOUR TASK:

1. POSITIONING STATEMENT
Write a single sentence: "We help [who] do [what] so they can [outcome]"
Based ONLY on what the site says. Do not infer or improve—mirror what's there.

2. CATEGORY PLACEMENT
What category is this company placing itself in?
Be specific (not "software" but "sales engagement platform" or "AI writing assistant")

3. VALUE HIERARCHY
Rank the top 5 value themes by STRUCTURAL PROMINENCE:
- What appears in H1s across pages = highest weight
- What appears in H2s = secondary weight
- What's only in body text = lowest weight
- Frequency across pages is secondary to structural placement

4. PRIMARY PERSONA
Based on target audience signals, who is the primary buyer?
Note where this is structurally emphasized vs. buried.
Flag where the site is unclear or contradictory.

5. SECONDARY PERSONAS
Any other personas mentioned? How prominently?

6. PAIN POINTS
List every problem the site claims to solve.
Note structural placement (H1/H2/body) for each.

7. NAVIGATION ANALYSIS
- What do the top-level nav items reveal about strategic priorities?
- What's conspicuously missing from navigation?
- Primary CTAs across pages: what's the conversion strategy signal?
  ("Start Free Trial" = PLG, "Request Demo" = sales-led, "Contact Us" = enterprise/unclear)

8. MESSAGING VARIANTS
For key concepts, track how messaging varies across pages.
Inconsistency in both content AND structural emphasis matters.

9. OVERALL CONSISTENCY SCORE
0-100: How coherent is the positioning across all pages?

Return as JSON:
{
  "positioning_statement": "string",
  "category_claimed": "string",
  "value_hierarchy": [
    { "rank": 1, "value_proposition": "string", "emphasis_score": number, "page_appearances": ["url"] }
  ],
  "primary_persona": {
    "title": "string",
    "seniority": "string|null",
    "industry": "string|null",
    "pain_points": ["string"],
    "desired_outcomes": ["string"]
  },
  "secondary_personas": [
    { "title": "string", "pain_points": ["string"], "desired_outcomes": ["string"] }
  ],
  "pain_points": [
    { "pain": "string", "frequency": number, "pages_mentioned": ["url"] }
  ],
  "navigation_analysis": {
    "primary_ctas": ["string"],
    "cta_consistency_score": number,
    "nav_priority_alignment": "string description of what nav reveals and what's missing"
  },
  "messaging_variants": [
    { "concept": "string", "variants": ["string"], "consistency_score": number }
  ],
  "overall_consistency_score": number
}
`

interface SynthesisInput {
  url: string
  elements: ExtractedElements
}

interface EnhancedSynthesisInput {
  url: string
  raw_markdown: string
  rich_elements: RichExtractedElements
}

export interface SynthesisResult {
  positioning_statement: string
  category_claimed: string
  value_hierarchy: Array<{
    rank: number
    value_proposition: string
    emphasis_score: number
    page_appearances: string[]
  }>
  primary_persona: {
    title: string
    seniority?: string
    industry?: string
    pain_points: string[]
    desired_outcomes: string[]
  }
  secondary_personas: Array<{
    title: string
    pain_points: string[]
    desired_outcomes: string[]
  }>
  pain_points: Array<{
    pain: string
    frequency: number
    pages_mentioned: string[]
  }>
  navigation_analysis: {
    primary_ctas: string[]
    cta_consistency_score: number
    nav_priority_alignment: string
  }
  messaging_variants: Array<{
    concept: string
    variants: string[]
    consistency_score: number
  }>
  overall_consistency_score: number
}

export interface EnhancedSynthesisResult {
  positioning_statement: string
  positioning_confidence: 'high' | 'medium' | 'low'
  positioning_evidence: string[]
  category_claimed: string
  category_evidence?: string[]
  value_hierarchy: Array<{
    rank: number
    value_proposition: string
    emphasis_score: number
    page_appearances: string[]
    evidence_ids: string[]
  }>
  primary_persona: {
    title: string
    seniority?: string
    industry?: string
    pain_points: string[]
    desired_outcomes: string[]
    evidence_ids?: string[]
  }
  secondary_personas: Array<{
    title: string
    pain_points: string[]
    desired_outcomes: string[]
    evidence_ids?: string[]
  }>
  pain_points: Array<{
    pain: string
    frequency: number
    pages_mentioned: string[]
    evidence_ids?: string[]
  }>
  navigation_analysis: {
    primary_ctas: string[]
    cta_consistency_score: number
    nav_priority_alignment: string
  }
  messaging_variants: MessagingVariant[]
  cross_page_contradictions: CrossPageContradiction[]
  overall_consistency_score: number
}

/**
 * Enhanced synthesis with evidence bank and raw markdown context
 * Produces citations and detects cross-page contradictions
 */
export async function synthesizeWithEvidence(
  pages: EnhancedSynthesisInput[],
  evidenceBank: EvidenceBank
): Promise<EnhancedSynthesisResult | null> {
  try {
    if (pages.length === 0) {
      return null
    }

    // Build evidence bank JSON
    const evidenceBankJson = JSON.stringify(evidenceBank, null, 2)

    // Build pages data with raw markdown and rich elements
    const pagesData = pages.map((page, i) => {
      const elementsJson = JSON.stringify({
        headlines: page.rich_elements.headlines,
        value_propositions: page.rich_elements.value_propositions,
        proof_points: page.rich_elements.proof_points,
        target_audience_signals: page.rich_elements.target_audience_signals,
        competitive_positioning: page.rich_elements.competitive_positioning,
        internal_contradictions: page.rich_elements.internal_contradictions,
      }, null, 2)

      // Truncate markdown if too long
      const truncatedMarkdown = page.raw_markdown.length > 2000
        ? page.raw_markdown.slice(0, 2000) + '\n\n[...truncated...]'
        : page.raw_markdown

      return `
=== PAGE ${i + 1}: ${page.url} ===

RAW CONTENT (for context):
${truncatedMarkdown}

EXTRACTED ELEMENTS:
${elementsJson}
`
    }).join('\n---\n')

    const prompt = ENHANCED_SYNTHESIS_PROMPT
      .replace('{EVIDENCE_BANK}', evidenceBankJson)
      .replace('{PAGES_DATA}', pagesData)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const jsonStr = extractJsonFromResponse(text)

    const parsed = JSON.parse(jsonStr) as EnhancedSynthesisResult

    // Ensure all required fields have defaults
    return {
      positioning_statement: parsed.positioning_statement || '',
      positioning_confidence: parsed.positioning_confidence || 'medium',
      positioning_evidence: parsed.positioning_evidence || [],
      category_claimed: parsed.category_claimed || '',
      category_evidence: parsed.category_evidence || [],
      value_hierarchy: (parsed.value_hierarchy || []).map(v => ({
        ...v,
        evidence_ids: v.evidence_ids || [],
      })),
      primary_persona: {
        ...parsed.primary_persona,
        evidence_ids: parsed.primary_persona?.evidence_ids || [],
      },
      secondary_personas: (parsed.secondary_personas || []).map(p => ({
        ...p,
        evidence_ids: p.evidence_ids || [],
      })),
      pain_points: (parsed.pain_points || []).map(p => ({
        ...p,
        evidence_ids: p.evidence_ids || [],
      })),
      navigation_analysis: parsed.navigation_analysis || {
        primary_ctas: [],
        cta_consistency_score: 0,
        nav_priority_alignment: '',
      },
      messaging_variants: (parsed.messaging_variants || []).map(mv => ({
        concept: mv.concept,
        variants: mv.variants || [],
        consistency_score: mv.consistency_score || 0,
      })),
      cross_page_contradictions: parsed.cross_page_contradictions || [],
      overall_consistency_score: parsed.overall_consistency_score || 0,
    }
  } catch (error) {
    console.error('Enhanced synthesis error:', error)
    return null
  }
}

/**
 * Legacy synthesis function for backwards compatibility
 */
export async function synthesizePositioning(
  urls: ExtractionUrl[]
): Promise<SynthesisResult | null> {
  try {
    const inputs: SynthesisInput[] = urls
      .filter(u => u.extracted_elements)
      .map(u => ({
        url: u.url,
        elements: u.extracted_elements as ExtractedElements,
      }))

    if (inputs.length === 0) {
      return null
    }

    const pagesData = inputs.map((input, i) => `
PAGE ${i + 1}: ${input.url}
Headlines: ${JSON.stringify(input.elements.headlines)}
Value Props: ${JSON.stringify(input.elements.value_propositions)}
Proof Points: ${JSON.stringify(input.elements.proof_points)}
CTAs: ${JSON.stringify(input.elements.ctas)}
Target Audience: ${JSON.stringify(input.elements.target_audience_signals)}
Competitive: ${JSON.stringify(input.elements.competitive_positioning)}
`).join('\n---\n')

    const prompt = LEGACY_SYNTHESIS_PROMPT.replace('{PAGES_DATA}', pagesData)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const jsonStr = extractJsonFromResponse(text)

    return JSON.parse(jsonStr) as SynthesisResult
  } catch (error) {
    console.error('Synthesis error:', error)
    return null
  }
}
