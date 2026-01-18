import { GoogleGenerativeAI } from '@google/generative-ai'
import { SynthesisResult } from './synthesizer'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const GAP_ANALYSIS_PROMPT = `You are a brutally honest positioning critic. Your job is to find the gaps, weaknesses, and "so what?" moments in a company's positioning.

SYNTHESIS DATA:
{SYNTHESIS_DATA}

Analyze critically and provide:

1. SPECIFICITY SCORE (0-100): How specific vs generic is their messaging?
   - 90-100: Highly specific with concrete numbers, named outcomes, clear differentiators
   - 70-89: Mostly specific with some vague elements
   - 40-69: Mix of specific and generic claims
   - 0-39: Mostly generic, could apply to any competitor

2. SO WHAT GAPS: For each claim that doesn't answer "so what does that mean for me?", identify:
   - The claim
   - What context is missing
   - Example: "AI-powered" - missing what outcome the AI delivers

3. DIFFERENTIATION STRENGTH:
   - "strong": Clear unique positioning that competitors can't claim
   - "moderate": Some differentiation but not unique
   - "weak": Differentiation exists but easily copied
   - "generic": Could be any company in the space

4. 10-SECOND TAKEAWAY: What would a visitor remember after 10 seconds on their homepage? Be honest - is it memorable and clear, or forgettable and confusing?

5. CRITICAL OBSERVATIONS: List 3-5 blunt, uncomfortable truths about their positioning. Be direct and specific. Examples:
   - "You claim to be 'the leader' but provide zero evidence"
   - "Your homepage says 5 different things - what ARE you?"
   - "Every competitor makes the exact same claims"

6. PROOF SCORE (0-100): How well-substantiated are their claims?
   - Count claims with specific proof vs claims without

Return as JSON:
{
  "specificity_score": number,
  "so_what_gaps": [
    { "claim": "string", "missing_context": "string" }
  ],
  "differentiation_strength": "strong|moderate|weak|generic",
  "ten_second_takeaway": "string - be honest about what sticks",
  "critical_observations": ["string - uncomfortable truths"],
  "proof_score": number,
  "proof_points": [
    {
      "claim": "string",
      "proof_type": "string",
      "specificity_score": number,
      "location": "string",
      "verdict": "strong|weak|missing"
    }
  ],
  "unsubstantiated_claims": ["string - claims without proof"]
}
`

export interface GapAnalysisResult {
  specificity_score: number
  so_what_gaps: Array<{
    claim: string
    missing_context: string
  }>
  differentiation_strength: 'strong' | 'moderate' | 'weak' | 'generic'
  ten_second_takeaway: string
  critical_observations: string[]
  proof_score: number
  proof_points: Array<{
    claim: string
    proof_type: string
    specificity_score: number
    location: string
    verdict: 'strong' | 'weak' | 'missing'
  }>
  unsubstantiated_claims: string[]
}

export async function analyzeGaps(
  synthesis: SynthesisResult
): Promise<GapAnalysisResult | null> {
  try {
    const synthesisData = JSON.stringify(synthesis, null, 2)
    const prompt = GAP_ANALYSIS_PROMPT.replace('{SYNTHESIS_DATA}', synthesisData)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonStr = jsonMatch[1]?.trim() || text.trim()

    return JSON.parse(jsonStr) as GapAnalysisResult
  } catch (error) {
    console.error('Gap analysis error:', error)
    return null
  }
}
