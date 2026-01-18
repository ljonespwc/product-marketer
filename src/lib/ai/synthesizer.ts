import { GoogleGenerativeAI } from '@google/generative-ai'
import { ExtractedElements, ExtractionUrl } from '@/types/database'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const SYNTHESIS_PROMPT = `You are an expert positioning strategist. Analyze extracted elements from multiple pages of a company website and synthesize their positioning.

PAGES DATA:
{PAGES_DATA}

Based on ALL pages, synthesize:

1. POSITIONING STATEMENT: Write a clear positioning statement in the format:
   "For [target customer], [company] is the [category] that [key differentiator] because [proof point]."

2. CATEGORY: What market category does this company claim to be in?

3. VALUE HIERARCHY: Rank the top 5 value propositions by emphasis (considering frequency across pages, headline prominence, placement). Include which pages each appears on.

4. PRIMARY PERSONA: Based on target audience signals, who is the primary buyer persona? Include:
   - Title/role
   - Seniority level (if discernible)
   - Industry (if specific)
   - Their pain points
   - Their desired outcomes

5. SECONDARY PERSONAS: Any other personas mentioned?

6. PAIN POINTS: Aggregate all pain points mentioned, with frequency count and pages.

7. NAVIGATION ANALYSIS:
   - What are the primary CTAs across pages?
   - How consistent are they?
   - Does nav structure align with stated priorities?

8. MESSAGING VARIANTS: For key concepts, track how messaging varies across pages.

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
    "nav_priority_alignment": "string description"
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
