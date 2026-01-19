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
  rich_elements?: RichExtractedElements          // Enhanced extraction with citations
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
  positioning_confidence?: 'high' | 'medium' | 'low'
  positioning_evidence?: string[]                // Evidence IDs supporting positioning

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
  cross_page_contradictions?: CrossPageContradiction[]

  // Uncomfortable Observations
  specificity_score?: number
  so_what_gaps?: SoWhatGap[]
  differentiation_strength?: 'strong' | 'moderate' | 'weak' | 'generic'
  ten_second_takeaway?: string
  critical_observations?: CriticalObservation[]

  // Enhanced Analysis (new)
  evidence_bank?: EvidenceBank
  structural_misalignments?: StructuralMisalignment[]
  actionable_recommendations?: ActionableRecommendation[]
  executive_summary?: ExecutiveSummary

  created_at: string
  updated_at: string
}

// Enhanced critical observation with citations
export interface CriticalObservation {
  observation: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  evidence_ids: string[]
  category: 'structural_gap' | 'specificity' | 'differentiation' | 'proof' | 'consistency' | 'audience'
}

export interface ValueHierarchyItem {
  rank: number
  value_proposition: string
  emphasis_score: number
  page_appearances: string[]
  evidence_ids?: string[]  // Citation references (Q1, S2, etc.)
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
  evidence_id?: string                           // Reference to evidence bank
  raw_text?: string                              // Original text from page
  page_url?: string
}

export interface NavigationAnalysis {
  primary_ctas: string[]
  cta_consistency_score: number
  nav_priority_alignment: string
}

export interface MessagingVariant {
  concept: string
  variants: {
    text: string
    page_url: string
    structural_level: 'h1' | 'h2' | 'h3' | 'body'
    evidence_id?: string
  }[]
  consistency_score: number
}

export interface SoWhatGap {
  claim: string
  missing_context: string
  structural_level?: 'h1' | 'h2' | 'h3' | 'body'
  severity?: 'critical' | 'high' | 'medium' | 'low'
  evidence_id?: string
}

// ========== EVIDENCE BANK TYPES ==========

export interface EvidenceQuote {
  id: string                                    // "Q1", "Q2", etc.
  text: string                                  // Exact quote (max 150 chars)
  page_url: string
  structural_context: 'h1' | 'h2' | 'h3' | 'body' | 'testimonial' | 'cta'
  category: 'value_prop' | 'differentiation' | 'proof' | 'audience' | 'pain' | 'trust' | 'pricing'
  specificity_rating: number                    // 1-5
}

export interface StatisticalClaim {
  id: string                                    // "S1", "S2", etc.
  claim: string
  page_url: string
  specificity: 'specific' | 'vague' | 'unverifiable'
  context: string
}

export interface CustomerVoice {
  id: string                                    // "CV1", "CV2", etc.
  quote: string
  attribution?: string
  page_url: string
  credibility: 'high' | 'medium' | 'low'        // Named company/role = high, generic = low
}

export interface EvidenceBank {
  quotes: EvidenceQuote[]
  statistical_claims: StatisticalClaim[]
  customer_voice: CustomerVoice[]
}

// ========== RICH EXTRACTED ELEMENTS ==========

export interface RichHeadlineItem {
  text: string
  level: 'h1' | 'h2' | 'h3'
  emphasis_score: number
  page_section: 'hero' | 'features' | 'benefits' | 'social_proof' | 'pricing' | 'footer' | 'other'
  raw_text: string
}

export interface RichValueProposition {
  claim: string
  raw_text: string
  page_section: 'hero' | 'features' | 'benefits' | 'social_proof' | 'pricing' | 'footer' | 'other'
  structural_level: 'h1' | 'h2' | 'h3' | 'body'
  specificity_rating: number                    // 1-5
  specificity_reason: string
}

export interface RichProofPoint {
  claim: string
  proof_type: 'statistic' | 'testimonial' | 'case_study' | 'logo' | 'award' | 'certification' | 'none'
  specificity: 'specific' | 'vague' | 'missing'
  raw_text: string
  page_section: 'hero' | 'features' | 'benefits' | 'social_proof' | 'pricing' | 'footer' | 'other'
  structural_level: 'h1' | 'h2' | 'h3' | 'body'
  specificity_reason: string
}

export interface RichExtractedElements {
  headlines: RichHeadlineItem[]
  value_propositions: RichValueProposition[]
  proof_points: RichProofPoint[]
  ctas: CtaItem[]
  target_audience_signals: {
    signal: string
    raw_text: string
    explicit: boolean                           // true = "for marketing teams", false = jargon-implied
    structural_level: 'h1' | 'h2' | 'h3' | 'body'
  }[]
  competitive_positioning: {
    claim: string
    raw_text: string
    structural_level: 'h1' | 'h2' | 'h3' | 'body'
  }[]
  pricing_signals: string[]
  trust_signals: {
    signal: string
    raw_text: string
    signal_type: 'logo' | 'testimonial' | 'certification' | 'award' | 'press' | 'stat'
  }[]
  internal_contradictions?: {
    topic: string
    statement_a: string
    statement_b: string
    severity: 'high' | 'medium' | 'low'
  }[]
}

// ========== CROSS-PAGE ANALYSIS TYPES ==========

export interface CrossPageContradiction {
  topic: string
  page_a: {
    url: string
    says: string
    evidence_id: string
  }
  page_b: {
    url: string
    says: string
    evidence_id: string
  }
  severity: 'critical' | 'moderate' | 'minor'
}

export interface StructuralMisalignment {
  issue: string
  whats_in_h1: {
    text: string
    evidence_id: string
  }
  whats_buried: {
    text: string
    evidence_id: string
    location: string
  }
  severity: 'critical' | 'high' | 'medium'
}

export interface ActionableRecommendation {
  priority: number                              // 1-5
  category: 'quick_win' | 'structural_change' | 'content_gap' | 'proof_needed'
  recommendation: string
  rationale: string
  evidence_ids: string[]
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
}

export interface ExecutiveSummary {
  ten_second_takeaway: string
  three_key_strengths: {
    strength: string
    evidence: string[]
  }[]
  three_key_weaknesses: {
    weakness: string
    evidence: string[]
    severity: 'critical' | 'high' | 'medium' | 'low'
  }[]
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
