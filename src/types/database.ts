// Extraction Session
export interface ExtractionSession {
  id: string
  user_id: string
  name?: string // Optional session name, auto-generated if blank (PRD Step 2, Line 85)
  company_name: string
  status: 'pending' | 'processing' | 'complete' | 'failed'
  created_at: string
  updated_at: string
}

// Extraction URL
export interface ExtractionUrl {
  id: string
  session_id: string
  url: string
  page_type?: string
  raw_markdown?: string
  extracted_elements?: ExtractedElements
  scrape_status: 'pending' | 'scraping' | 'extracting' | 'complete' | 'failed'
  error_message?: string
  created_at: string
  updated_at: string
}

// Extracted Elements (per-page AI extraction)
export interface ExtractedElements {
  headlines: HeadlineItem[]
  value_propositions: string[]
  proof_points: ProofPoint[]
  ctas: CtaItem[]
  target_audience_signals: string[]
  competitive_positioning: string[]
  pricing_signals: string[]
  trust_signals: string[]
}

export interface HeadlineItem {
  text: string
  level: 'h1' | 'h2' | 'h3'
  emphasis_score: number // 1-10 based on placement
}

export interface ProofPoint {
  claim: string
  proof_type: 'statistic' | 'testimonial' | 'case_study' | 'logo' | 'award' | 'certification' | 'none'
  specificity: 'specific' | 'vague' | 'missing'
  raw_text: string
}

export interface CtaItem {
  text: string
  placement: 'hero' | 'navigation' | 'inline' | 'footer'
  action_type: 'signup' | 'demo' | 'contact' | 'learn_more' | 'pricing' | 'other'
}

// Extraction Results (cross-page synthesis)
export interface ExtractionResults {
  id: string
  session_id: string

  // Positioning Synthesis
  positioning_statement?: string
  category_claimed?: string
  value_hierarchy?: ValueHierarchyItem[]

  // ICP Extraction
  primary_persona?: PersonaProfile
  secondary_personas?: PersonaProfile[]
  pain_points?: PainPoint[]

  // Proof Audit
  proof_points?: AuditedProofPoint[]
  unsubstantiated_claims?: string[]
  proof_score?: number

  // Consistency Check
  navigation_analysis?: NavigationAnalysis
  messaging_variants?: MessagingVariant[]
  overall_consistency_score?: number

  // Uncomfortable Observations
  specificity_score?: number
  so_what_gaps?: SoWhatGap[]
  differentiation_strength?: 'strong' | 'moderate' | 'weak' | 'generic'
  ten_second_takeaway?: string
  critical_observations?: string[]

  created_at: string
  updated_at: string
}

export interface ValueHierarchyItem {
  rank: number
  value_proposition: string
  emphasis_score: number
  page_appearances: string[]
}

export interface PersonaProfile {
  title: string
  seniority?: string
  industry?: string
  pain_points: string[]
  desired_outcomes: string[]
}

export interface PainPoint {
  pain: string
  frequency: number
  pages_mentioned: string[]
}

export interface AuditedProofPoint {
  claim: string
  proof_type: string
  specificity_score: number
  location: string
  verdict: 'strong' | 'weak' | 'missing'
}

export interface NavigationAnalysis {
  primary_ctas: string[]
  cta_consistency_score: number
  nav_priority_alignment: string
}

export interface MessagingVariant {
  concept: string
  variants: string[]
  consistency_score: number
}

export interface SoWhatGap {
  claim: string
  missing_context: string
}

// Confirmed Positioning (user-edited)
export interface ConfirmedPositioning {
  id: string
  session_id: string
  positioning_statement?: string
  category?: string
  primary_value_prop?: string
  target_persona?: string
  key_differentiator?: string
  proof_points?: string[]
  confirmed_at?: string
  created_at: string
  updated_at: string
}

// API Request/Response Types
export interface CreateExtractionRequest {
  name?: string // Optional session name (PRD Step 2, Line 85)
  company_name: string
  urls: string[]
}

export interface ExtractionSessionWithUrls extends ExtractionSession {
  extraction_urls: ExtractionUrl[]
}

export interface FullExtractionData extends ExtractionSession {
  extraction_urls: ExtractionUrl[]
  extraction_results?: ExtractionResults
  confirmed_positioning?: ConfirmedPositioning
}
