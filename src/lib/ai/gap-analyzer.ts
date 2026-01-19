import { GoogleGenerativeAI } from '@google/generative-ai'
import { SynthesisResult } from './synthesizer'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const GAP_ANALYSIS_PROMPT = `You are a critical analyst evaluating B2B SaaS positioning.

YOUR MINDSET:
- You are looking for weaknesses, not strengths
- Vague claims are failures
- Missing proof is a red flag
- "Everyone says that" is not differentiation
- Your job is to surface uncomfortable truths

STRUCTURAL ANALYSIS LENS:
A company's priorities are revealed by WHERE they place content:
- H1 = What they think matters most
- H2 = What they think matters second
- Body text = What they're downplaying
- Navigation = Strategic priorities
- Primary CTA = Conversion strategy

If important claims are structurally buried, that's a gap—regardless of whether the words exist somewhere on the site.

SYNTHESIS DATA:
{SYNTHESIS_DATA}

YOUR TASK:

1. SPECIFICITY SCORE (0-100)
Rate how concrete vs. vague the overall messaging is.
CRITICAL: Structurally prominent but vague claims are WORSE than buried vague claims.
- 90-100: H1s contain specific, concrete claims with numbers/outcomes
- 70-89: Mostly specific, some vague elements
- 40-69: Mix of specific and generic—or specific claims buried while vague claims prominent
- 0-39: Generic messaging dominates, especially in H1/H2 positions

2. "SO WHAT?" GAPS
For claims that don't answer "why should I care?":
- The claim
- Its structural placement (H1/H2/body)
- What's missing
H1-level claims without clear "so what" = critical issue.
Example: "Trusted by thousands" as H1 uses most valuable real estate to say something that doesn't answer "so what?"

3. DIFFERENTIATION STRENGTH
What on this site could NOT be copy-pasted onto a competitor's homepage?
- "strong": Unique claims in prominent positions (H1/H2)
- "moderate": Some uniqueness but not structurally emphasized
- "weak": Differentiation exists but buried in body text
- "generic": H1s and H2s contain only category-standard claims

Note: If differentiation exists but is structurally buried, that's a critical gap.

4. 10-SECOND TAKEAWAY
Based on H1, H2s, and primary CTA only:
What would a busy buyer conclude from 10 seconds on the homepage?
Be honest, not kind. Is it memorable or forgettable?

5. CRITICAL OBSERVATIONS
List 3-5 blunt, uncomfortable truths. Include structural gaps:
- "Your differentiation ('brand voice AI') is buried in paragraph 4 while 'trusted by thousands' is your H1"
- "Navigation has no 'Why Us' or competitor comparison—signals weak differentiation confidence"
- "CTAs signal PLG ('Start Free Trial') but messaging claims 'enterprise-grade'—mixed signals"
- "Your H1 is '[Generic claim everyone makes]'—you're leading with commoditized value"

6. PROOF SCORE (0-100)
Rate strength of evidence. Consider BOTH existence and placement.
Proof that's buried when it should be prominent = lower score.

7. NAVIGATION GAPS
What's conspicuously missing from top-level navigation?
- No "Why Us" or "vs. Competitors" = weak differentiation confidence
- No "Pricing" = friction/enterprise signal
- No "Customers" or "Case Studies" = proof gap
- No "Security" despite enterprise claims = credibility gap

8. CTA CONSISTENCY
Does the primary CTA match the positioning?
- "Start Free Trial" + "enterprise messaging" = mismatch
- "Request Demo" + "self-serve messaging" = mismatch
- "Contact Us" for everything = unclear value prop

Return as JSON:
{
  "specificity_score": number,
  "so_what_gaps": [
    { "claim": "string", "missing_context": "string" }
  ],
  "differentiation_strength": "strong|moderate|weak|generic",
  "ten_second_takeaway": "string - be honest about what sticks (or doesn't)",
  "critical_observations": ["string - uncomfortable truths including structural gaps"],
  "proof_score": number,
  "proof_points": [
    {
      "claim": "string",
      "proof_type": "string",
      "specificity_score": number,
      "location": "where it appears (H1/H2/body/buried)",
      "verdict": "strong|weak|missing"
    }
  ],
  "unsubstantiated_claims": ["string - claims without proof, especially prominent ones"]
}

Be direct. Be uncomfortable. Be useful.
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
