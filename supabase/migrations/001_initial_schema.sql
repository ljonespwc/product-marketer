-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Extraction Sessions table
CREATE TABLE extraction_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'complete', 'failed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Extraction URLs table
CREATE TABLE extraction_urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES extraction_sessions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  page_type TEXT, -- e.g., 'homepage', 'pricing', 'features', 'about', 'product'
  raw_markdown TEXT,
  extracted_elements JSONB,
  scrape_status TEXT NOT NULL DEFAULT 'pending' CHECK (scrape_status IN ('pending', 'scraping', 'extracting', 'complete', 'failed')),
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Extraction Results table (AI synthesis output)
CREATE TABLE extraction_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL UNIQUE REFERENCES extraction_sessions(id) ON DELETE CASCADE,

  -- Positioning Synthesis
  positioning_statement TEXT,
  category_claimed TEXT,
  value_hierarchy JSONB, -- Array of { rank, value_proposition, emphasis_score, page_appearances }

  -- ICP Extraction
  primary_persona JSONB, -- { title, seniority, pain_points, desired_outcomes }
  secondary_personas JSONB, -- Array of persona objects
  pain_points JSONB, -- Array of { pain, frequency, pages_mentioned }

  -- Proof Audit
  proof_points JSONB, -- Array of { claim, proof_type, specificity_score, location }
  unsubstantiated_claims JSONB, -- Array of claims without proof
  proof_score INTEGER, -- 0-100

  -- Consistency Check
  navigation_analysis JSONB, -- { primary_ctas, cta_consistency_score, nav_priority_alignment }
  messaging_variants JSONB, -- Array of { concept, variants, consistency_score }
  overall_consistency_score INTEGER, -- 0-100

  -- Uncomfortable Observations
  specificity_score INTEGER, -- 0-100
  so_what_gaps JSONB, -- Array of { claim, missing_context }
  differentiation_strength TEXT, -- 'strong', 'moderate', 'weak', 'generic'
  ten_second_takeaway TEXT,
  critical_observations JSONB, -- Array of blunt observations

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Confirmed Positioning table (user-edited/approved)
CREATE TABLE confirmed_positioning (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL UNIQUE REFERENCES extraction_sessions(id) ON DELETE CASCADE,

  positioning_statement TEXT,
  category TEXT,
  primary_value_prop TEXT,
  target_persona TEXT,
  key_differentiator TEXT,
  proof_points JSONB, -- Array of selected/edited proof points

  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_extraction_sessions_user_id ON extraction_sessions(user_id);
CREATE INDEX idx_extraction_sessions_status ON extraction_sessions(status);
CREATE INDEX idx_extraction_urls_session_id ON extraction_urls(session_id);
CREATE INDEX idx_extraction_urls_scrape_status ON extraction_urls(scrape_status);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_extraction_sessions_updated_at
  BEFORE UPDATE ON extraction_sessions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_extraction_urls_updated_at
  BEFORE UPDATE ON extraction_urls
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_extraction_results_updated_at
  BEFORE UPDATE ON extraction_results
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_confirmed_positioning_updated_at
  BEFORE UPDATE ON confirmed_positioning
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies

-- Enable RLS
ALTER TABLE extraction_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE extraction_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE confirmed_positioning ENABLE ROW LEVEL SECURITY;

-- extraction_sessions: users can only access their own sessions
CREATE POLICY "Users can view own sessions"
  ON extraction_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON extraction_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON extraction_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own sessions"
  ON extraction_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- extraction_urls: access based on session ownership
CREATE POLICY "Users can view urls for own sessions"
  ON extraction_urls FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = extraction_urls.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert urls for own sessions"
  ON extraction_urls FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = extraction_urls.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update urls for own sessions"
  ON extraction_urls FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = extraction_urls.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete urls for own sessions"
  ON extraction_urls FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = extraction_urls.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

-- extraction_results: access based on session ownership
CREATE POLICY "Users can view results for own sessions"
  ON extraction_results FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = extraction_results.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert results for own sessions"
  ON extraction_results FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = extraction_results.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update results for own sessions"
  ON extraction_results FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = extraction_results.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

-- confirmed_positioning: access based on session ownership
CREATE POLICY "Users can view confirmed for own sessions"
  ON confirmed_positioning FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = confirmed_positioning.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert confirmed for own sessions"
  ON confirmed_positioning FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = confirmed_positioning.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

CREATE POLICY "Users can update confirmed for own sessions"
  ON confirmed_positioning FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM extraction_sessions
    WHERE extraction_sessions.id = confirmed_positioning.session_id
    AND extraction_sessions.user_id = auth.uid()
  ));

-- Service role bypass for API routes (server-side operations)
-- Note: The service role key bypasses RLS by default in Supabase
