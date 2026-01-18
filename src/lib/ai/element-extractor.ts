import { GoogleGenerativeAI } from '@google/generative-ai'
import { ExtractedElements } from '@/types/database'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

const EXTRACTION_PROMPT = `You are a marketing positioning analyst. Analyze the following webpage markdown and extract key messaging elements.

IMPORTANT: Headlines use markdown heading syntax:
- # = H1 (highest emphasis, usually main value proposition)
- ## = H2 (secondary emphasis)
- ### = H3 (tertiary emphasis)

For each element, assign an emphasis_score (1-10) based on:
- Placement (hero/above fold = higher score)
- Heading level (H1 > H2 > H3)
- Repetition across the page

Extract the following in JSON format:

{
  "headlines": [
    { "text": "string", "level": "h1|h2|h3", "emphasis_score": number }
  ],
  "value_propositions": ["string array of benefit statements"],
  "proof_points": [
    {
      "claim": "the claim being made",
      "proof_type": "statistic|testimonial|case_study|logo|award|certification|none",
      "specificity": "specific|vague|missing",
      "raw_text": "the actual text"
    }
  ],
  "ctas": [
    {
      "text": "button/link text",
      "placement": "hero|navigation|inline|footer",
      "action_type": "signup|demo|contact|learn_more|pricing|other"
    }
  ],
  "target_audience_signals": ["phrases indicating who this is for"],
  "competitive_positioning": ["statements about alternatives/competition"],
  "pricing_signals": ["any pricing or tier information"],
  "trust_signals": ["logos, testimonials, certifications mentioned"]
}

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
