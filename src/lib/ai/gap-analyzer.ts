import { GoogleGenerativeAI } from '@google/generative-ai'
import { EnhancedSynthesisResult, SynthesisResult } from './synthesizer'
import {
  EvidenceBank,
  CriticalObservation,
  StructuralMisalignment,
  ActionableRecommendation,
  ExecutiveSummary,
  SoWhatGap,
  AuditedProofPoint,
  RichExtractedElements,
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

interface PageData {
  url: string
  raw_markdown: string
  rich_elements: RichExtractedElements
}

const ENHANCED_GAP_ANALYSIS_PROMPT = `You are a critical analyst evaluating B2B SaaS positioning.

YOUR MINDSET:
- You are looking for weaknesses, not strengths
- Vague claims are failures
- Missing proof is a red flag
- "Everyone says that" is not differentiation
- Your job is to surface uncomfortable truths
- EVERY observation must cite evidence IDs

CRITICAL: You have access to an EVIDENCE BANK. EVERY claim you make must reference specific evidence IDs.

EVIDENCE BANK:
{EVIDENCE_BANK}

SYNTHESIS DATA:
{SYNTHESIS_DATA}

RAW PAGE CONTENT (for context):
{RAW_CONTENT}

YOUR TASK:

1. EXECUTIVE SUMMARY
Create a summary with:
- ten_second_takeaway: One sentence that captures the #1 issue
- three_key_strengths: What's working (with evidence IDs)
- three_key_weaknesses: What's broken (with evidence IDs and severity)

2. SPECIFICITY SCORE (0-100)
Rate how concrete vs. vague the overall messaging is.
CRITICAL: Structurally prominent but vague claims are WORSE than buried vague claims.
Include evidence_ids supporting your rating.

3. "SO WHAT?" GAPS
For claims that don't answer "why should I care?":
- The claim
- Its structural level (h1/h2/h3/body)
- What's missing
- Severity (critical if H1/H2, high if prominent, medium/low if buried)
- Evidence ID
H1-level claims without clear "so what" = critical issue.

4. DIFFERENTIATION STRENGTH
What on this site could NOT be copy-pasted onto a competitor's homepage?
- "strong": Unique claims in prominent positions (H1/H2)
- "moderate": Some uniqueness but not structurally emphasized
- "weak": Differentiation exists but buried in body text
- "generic": H1s and H2s contain only category-standard claims

5. STRUCTURAL MISALIGNMENTS
CRITICAL: Identify where the BEST content is buried while GENERIC content is prominent.
For each misalignment:
- What's in H1 (the generic/wasted claim) with evidence_id
- What's buried (the better claim) with evidence_id and location
- Severity (critical if differentiation is buried, high otherwise)

Example: "Your differentiation ('AI-powered brand voice') is buried in paragraph 4 while 'trusted by thousands' is your H1"

6. CRITICAL OBSERVATIONS
List 5-7 blunt, uncomfortable truths. For each:
- The observation
- Severity: critical, high, medium, or low
- Evidence IDs supporting this observation
- Category: structural_gap, specificity, differentiation, proof, consistency, audience

Include observations like:
- "Your differentiation is buried while generic claims are prominent"
- "Navigation has no 'Why Us' or competitor comparison—signals weak differentiation confidence"
- "CTAs signal PLG but messaging claims 'enterprise-grade'—mixed signals"
- "Your H1 is a claim everyone makes—you're leading with commoditized value"

7. PROOF AUDIT
For each proof point:
- The claim
- Proof type
- Specificity score (1-5)
- Location (H1/H2/H3/body/buried)
- Verdict (strong/weak/missing)
- Evidence ID
- Raw text from page
- Page URL

8. UNSUBSTANTIATED CLAIMS
List claims without proof, especially prominent ones.
Include evidence IDs.

9. ACTIONABLE RECOMMENDATIONS
For each recommendation:
- Priority (1-5, where 1 is highest priority)
- Category: quick_win, structural_change, content_gap, proof_needed
- The recommendation
- Rationale (why this matters)
- Evidence IDs supporting this recommendation
- Effort: low, medium, high
- Impact: low, medium, high

Sort by: quick_wins first (high impact + low effort), then by priority.

Examples:
- "Move 'AI-powered brand voice' from body to H1 [Q7]" (quick_win, effort: low, impact: high)
- "Add specific ROI metrics to replace 'save time' claims [Q3, Q5]" (content_gap, effort: medium, impact: high)
- "Create a 'Why Us' page with competitor comparisons" (structural_change, effort: high, impact: high)

Return as JSON:
{
  "executive_summary": {
    "ten_second_takeaway": "string - the #1 issue in one sentence",
    "three_key_strengths": [
      { "strength": "string", "evidence": ["Q1", "Q2"] }
    ],
    "three_key_weaknesses": [
      { "weakness": "string", "evidence": ["Q3"], "severity": "critical|high|medium|low" }
    ]
  },
  "specificity_score": number,
  "so_what_gaps": [
    {
      "claim": "string",
      "missing_context": "string",
      "structural_level": "h1|h2|h3|body",
      "severity": "critical|high|medium|low",
      "evidence_id": "Q4"
    }
  ],
  "differentiation_strength": "strong|moderate|weak|generic",
  "structural_misalignments": [
    {
      "issue": "string description of the misalignment",
      "whats_in_h1": { "text": "string", "evidence_id": "Q5" },
      "whats_buried": { "text": "string", "evidence_id": "Q6", "location": "paragraph 3" },
      "severity": "critical|high|medium"
    }
  ],
  "ten_second_takeaway": "string - be honest about what sticks (or doesn't)",
  "critical_observations": [
    {
      "observation": "string - uncomfortable truth",
      "severity": "critical|high|medium|low",
      "evidence_ids": ["Q7", "Q8"],
      "category": "structural_gap|specificity|differentiation|proof|consistency|audience"
    }
  ],
  "proof_score": number,
  "proof_points": [
    {
      "claim": "string",
      "proof_type": "string",
      "specificity_score": number,
      "location": "H1|H2|H3|body|buried",
      "verdict": "strong|weak|missing",
      "evidence_id": "Q9",
      "raw_text": "string",
      "page_url": "url"
    }
  ],
  "unsubstantiated_claims": ["string - claims without proof"],
  "actionable_recommendations": [
    {
      "priority": 1,
      "category": "quick_win|structural_change|content_gap|proof_needed",
      "recommendation": "string",
      "rationale": "string",
      "evidence_ids": ["Q10"],
      "effort": "low|medium|high",
      "impact": "low|medium|high"
    }
  ]
}

Be direct. Be uncomfortable. Be useful. ALWAYS cite evidence.
`

// Legacy prompt for backwards compatibility
const LEGACY_GAP_ANALYSIS_PROMPT = `You are a critical analyst evaluating B2B SaaS positioning.

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

export interface EnhancedGapAnalysisResult {
  executive_summary: ExecutiveSummary
  specificity_score: number
  so_what_gaps: SoWhatGap[]
  differentiation_strength: 'strong' | 'moderate' | 'weak' | 'generic'
  structural_misalignments: StructuralMisalignment[]
  ten_second_takeaway: string
  critical_observations: CriticalObservation[]
  proof_score: number
  proof_points: AuditedProofPoint[]
  unsubstantiated_claims: string[]
  actionable_recommendations: ActionableRecommendation[]
}

/**
 * Enhanced gap analysis with evidence citations, severity levels,
 * structural misalignments, and actionable recommendations
 */
export async function analyzeGapsWithEvidence(
  synthesis: EnhancedSynthesisResult,
  evidenceBank: EvidenceBank,
  pages: PageData[]
): Promise<EnhancedGapAnalysisResult | null> {
  try {
    const synthesisData = JSON.stringify(synthesis, null, 2)
    const evidenceBankJson = JSON.stringify(evidenceBank, null, 2)

    // Build raw content summary
    const rawContent = pages.map((page, i) => {
      const truncated = page.raw_markdown.length > 1500
        ? page.raw_markdown.slice(0, 1500) + '\n[...truncated...]'
        : page.raw_markdown
      return `=== PAGE ${i + 1}: ${page.url} ===\n${truncated}`
    }).join('\n---\n')

    const prompt = ENHANCED_GAP_ANALYSIS_PROMPT
      .replace('{EVIDENCE_BANK}', evidenceBankJson)
      .replace('{SYNTHESIS_DATA}', synthesisData)
      .replace('{RAW_CONTENT}', rawContent)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const jsonStr = extractJsonFromResponse(text)

    const parsed = JSON.parse(jsonStr) as EnhancedGapAnalysisResult

    // Ensure all fields have proper defaults
    return {
      executive_summary: parsed.executive_summary || {
        ten_second_takeaway: '',
        three_key_strengths: [],
        three_key_weaknesses: [],
      },
      specificity_score: parsed.specificity_score || 0,
      so_what_gaps: (parsed.so_what_gaps || []).map(g => ({
        claim: g.claim || '',
        missing_context: g.missing_context || '',
        structural_level: g.structural_level,
        severity: g.severity,
        evidence_id: g.evidence_id,
      })),
      differentiation_strength: parsed.differentiation_strength || 'generic',
      structural_misalignments: parsed.structural_misalignments || [],
      ten_second_takeaway: parsed.ten_second_takeaway || '',
      critical_observations: (parsed.critical_observations || []).map(o => ({
        observation: o.observation || '',
        severity: o.severity || 'medium',
        evidence_ids: o.evidence_ids || [],
        category: o.category || 'specificity',
      })),
      proof_score: parsed.proof_score || 0,
      proof_points: (parsed.proof_points || []).map(p => ({
        claim: p.claim || '',
        proof_type: p.proof_type || 'none',
        specificity_score: p.specificity_score || 0,
        location: p.location || '',
        verdict: p.verdict || 'missing',
        evidence_id: p.evidence_id,
        raw_text: p.raw_text,
        page_url: p.page_url,
      })),
      unsubstantiated_claims: parsed.unsubstantiated_claims || [],
      actionable_recommendations: (parsed.actionable_recommendations || []).map(r => ({
        priority: r.priority || 5,
        category: r.category || 'content_gap',
        recommendation: r.recommendation || '',
        rationale: r.rationale || '',
        evidence_ids: r.evidence_ids || [],
        effort: r.effort || 'medium',
        impact: r.impact || 'medium',
      })),
    }
  } catch (error) {
    console.error('Enhanced gap analysis error:', error)
    return null
  }
}

/**
 * Legacy gap analysis for backwards compatibility
 */
export async function analyzeGaps(
  synthesis: SynthesisResult
): Promise<GapAnalysisResult | null> {
  try {
    const synthesisData = JSON.stringify(synthesis, null, 2)
    const prompt = LEGACY_GAP_ANALYSIS_PROMPT.replace('{SYNTHESIS_DATA}', synthesisData)

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    const jsonStr = extractJsonFromResponse(text)

    return JSON.parse(jsonStr) as GapAnalysisResult
  } catch (error) {
    console.error('Gap analysis error:', error)
    return null
  }
}
