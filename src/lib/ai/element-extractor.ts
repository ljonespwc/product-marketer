import { GoogleGenerativeAI } from '@google/generative-ai'
import { ExtractedElements } from '@/types/database'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const EXTRACTION_PROMPT = `You are analyzing a single page from a B2B SaaS website.

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

export async function extractElements(markdown: string): Promise<ExtractedElements | null> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' })

    const result = await model.generateContent(EXTRACTION_PROMPT + markdown)
    const response = result.response
    const text = response.text()

    // Extract JSON from response (may be wrapped in markdown code blocks)
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/) || [null, text]
    const jsonStr = jsonMatch[1]?.trim() || text.trim()

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
