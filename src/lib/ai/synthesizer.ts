import { GoogleGenerativeAI } from '@google/generative-ai'
import { ExtractedElements, ExtractionUrl } from '@/types/database'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const SYNTHESIS_PROMPT = `You are a positioning analyst examining a B2B SaaS company's website.

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

    const prompt = SYNTHESIS_PROMPT.replace('{PAGES_DATA}', pagesData)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonStr = jsonMatch[1]?.trim() || text.trim()

    return JSON.parse(jsonStr) as SynthesisResult
  } catch (error) {
    console.error('Synthesis error:', error)
    return null
  }
}
