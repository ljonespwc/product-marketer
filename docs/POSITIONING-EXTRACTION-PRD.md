# PRD: Positioning Extraction & Synthesis Engine

**Working Name:** *Mirror Your Positioning*  
*Subtitle: See what your site actually communicates—before the market tells you*

**Version:** 1.0  
**Author:** [Your Name]  
**Last Updated:** January 2025

---

## 1. Problem Statement

PMMs and founders are too close to their own positioning.

They know what they *meant* to say. They know the strategy behind the words. But they've never seen their positioning reflected back by an outside observer who only knows what the website communicates.

**The result:**
- Messaging that's clear internally but vague externally
- Value props that assume context buyers don't have
- Differentiation claims that are invisible or generic
- ICP targeting that's muddled across pages
- Proof points that are missing, buried, or unconvincing

**Current state:**
- PMMs review their own sites with insider knowledge baked in
- Feedback comes from colleagues who already understand the product
- Real market feedback arrives too late—after launch, after spend, after damage

**This tool exists to answer:**

> "What does my site actually communicate to someone who knows nothing about us?"

Not what you intended. Not what you briefed. **What someone would conclude from 60 seconds on your pages.**

---

## 2. Target Users

### Primary: Solo / Senior PMM (B2B SaaS)
- Owns positioning and website messaging
- Needs an outside perspective without hiring an agency
- Preparing for a refresh, launch, or executive review
- Wants to validate (or challenge) assumptions about current positioning

### Secondary: Startup Founding Team (Seed–Series B)
- Built the site themselves or with minimal PMM input
- Suspect the messaging is "off" but can't articulate why
- Need a structured view of what they're actually saying

### Tertiary: PMM / GTM Consultant
- Uses this as a diagnostic tool with new clients
- "Here's what your site communicates" as a conversation starter
- Fast way to identify positioning gaps before strategic work begins

---

## 3. Core User Job To Be Done

> "Show me what my website actually communicates about who we are, who we're for, and why we're different—so I can see the gaps before my buyers do."

---

## 4. Product Principles (Non-Negotiable)

1. **Mirror, don't judge** — The tool reflects what's there, not what should be
2. **Specificity is the metric** — Vague = weak. Concrete = strong. Always surface this.
3. **Outside-in perspective** — Analyze as a stranger, not an insider
4. **Surface gaps, not fixes** — Show what's missing; don't write the copy
5. **Uncomfortable but useful** — The best insights are the ones that sting
6. **Fast to value** — URLs in, insights out. No lengthy setup.

---

## 5. User Flow (End to End)

### Step 1: Authentication
- Google OAuth via Supabase
- User lands on dashboard showing past extraction sessions

---

### Step 2: New Extraction Session

**Session Name** (optional, auto-generated if blank)

**URL Input:**

| Field | Description |
|-------|-------------|
| Company Name | Required |
| URLs | 5-10 URLs from your site |

**URL Input UX:**
- Start with one input field
- "Add another URL" button (up to 10)
- Suggested URL types shown as helper text:
  - Homepage
  - Primary product/features page
  - Pricing page
  - About/Company page
  - Case study or customer page
  - Any landing page with key messaging

**Validation:**
- All URLs must be from the same domain (or subdomains)
- Minimum 3 URLs to proceed
- Maximum 10 URLs

---

### Step 2b: Analysis Options

**Screenshot Analysis** (default: on)

☑️ Capture homepage screenshot for visual hierarchy analysis

> "We'll screenshot your homepage and analyze what visitors actually *see* in the first 5 seconds—which sometimes differs from what your HTML says."

**Customer Review Enrichment** (default: off)

☐ Include G2/Capterra review analysis

> "We'll pull customer reviews and compare how your customers describe you vs. how you describe yourself. Adds ~15 seconds to analysis time."

| Field | Description |
|-------|-------------|
| G2 URL | (optional) Direct link to your G2 product page |
| Capterra URL | (optional) Direct link to your Capterra page |

If left blank, system will attempt to find listings automatically by company name.

---

### Step 3: Extraction Processing

User clicks "Analyze My Positioning" (or similar CTA).

**System Process:**

1. **Scrape** — Pull content from all submitted URLs
2. **Extract** — Identify messaging elements (headlines, value props, proof points, CTAs, etc.)
3. **Synthesize** — AI constructs a unified view of positioning
4. **Identify Gaps** — Surface missing elements, inconsistencies, and weaknesses
5. **Generate Report** — Produce structured output for user review

**Estimated runtime:** 20-40 seconds  
**Progress indicator:** Show which URL is being processed

---

### Step 4: Extraction Results (The Mirror)

Tabbed interface with the following sections:

---

#### Tab 1: Positioning Synthesis

**Draft Positioning Statement**

AI-generated one-liner in the format:
> "We help [who] do [what] so they can [outcome]."

With note: *"This is what your site communicates. Edit if it's not what you intended."*

Editable text field below for user to revise.

---

**Category Placement**

> "Based on your messaging, you're positioning as a: **[Category]**"

Examples:
- "Sales engagement platform"
- "AI writing assistant for marketers"
- "Project management tool for agencies"

With note: *"Is this the category you want to compete in?"*

Editable field for user to confirm or change.

---

**Claimed Value Hierarchy**

Ranked list of what the site emphasizes most, based on structural placement and frequency:

| Rank | Value Theme | Structural Placement | Evidence | Strength |
|------|-------------|---------------------|----------|----------|
| 1 | Ease of use | H1 on homepage, H2 on features | "Simple," "intuitive," "get started in minutes" | Strong |
| 2 | Time savings | H2 on homepage, body on features | "Save 10 hours/week," "faster workflows" | Moderate |
| 3 | AI-powered | Body text only (never in headlines) | Mentioned 4x but never explained | Weak (buried) |
| 4 | Enterprise-ready | Only on pricing page, paragraph text | No proof, no structural emphasis | Very weak |

With note: *"Is this the hierarchy you intended? Notice that 'AI-powered' appears 4 times but never in a headline—suggesting it's not your actual priority despite being a potential differentiator."*

---

**Structural Emphasis Gaps**

Where your content hierarchy doesn't match apparent strategy:

| Gap Type | What Should Be Emphasized | Where It Actually Is | Severity |
|----------|---------------------------|---------------------|----------|
| Differentiation buried | "Brand voice AI" (your unique feature) | Body text on features page | Critical |
| Generic claim promoted | "Trusted by thousands" | Homepage H1 | High |
| Proof underemphasized | Customer case study reference | Footer link only | Medium |

With note: *"Your most unique capability is buried in body text while a generic trust claim gets H1 placement. This is a structural positioning mistake."*

---

#### Tab 2: ICP Extraction

**Target Persona Profile**

> "Your site appears to be targeting:"

| Attribute | Extracted Signal | Confidence |
|-----------|------------------|------------|
| Role | Marketing managers, content leads | High |
| Seniority | Mid-level (IC or team lead) | Medium |
| Company Size | SMB to mid-market (50-500 employees) | Medium |
| Industry | B2B SaaS, agencies | Low (implied, not stated) |
| Sophistication | Assumes familiarity with content marketing | High |

With note: *"Does this match your actual ICP? Where is the site unclear?"*

Editable fields for user to confirm or revise each attribute.

---

**Pain Points Inventory**

What problems does your site claim to solve?

| Pain Point | Where Found | How Specific? |
|------------|-------------|---------------|
| "Content takes too long to create" | Homepage hero, features page | Moderately specific |
| "Hard to maintain brand voice at scale" | Features page | Specific |
| "Disconnected tools slow teams down" | Homepage | Vague |

With note: *"Are these the pain points your buyers actually feel? What's missing?"*

---

**Implied Buyer Sophistication**

> "Your messaging assumes the buyer already knows:"
> - What a content calendar is
> - Why brand consistency matters
> - The pain of managing multiple writers

> "Your messaging does NOT explain:"
> - What the product actually does
> - How it's different from Google Docs + templates
> - Why AI is better than human editing

With note: *"Is this the right level for your buyer? Are you over-assuming?"*

---

**Navigation Analysis**

Top-level navigation items reveal strategic priorities:

| Nav Item | Signal |
|----------|--------|
| Features | Standard—expected |
| Pricing | Transparent—PLG signal |
| Customers | ✅ Proof prioritized |
| Resources | Content marketing play |

**Missing from nav:**
- "Why Us" or "vs. Alternatives" — suggests weak differentiation confidence
- "Security" or "Enterprise" — despite claiming enterprise-ready on pricing page

With note: *"Your navigation says you're confident about proof (Customers) but not about differentiation (no comparison page). Is that intentional?"*

---

**CTA Analysis**

| CTA | Location | Type | Frequency |
|-----|----------|------|-----------|
| "Start Free Trial" | Homepage hero, features page | Primary | 4x |
| "Book a Demo" | Pricing page, enterprise section | Secondary | 2x |
| "Learn More" | Throughout | Tertiary | 6x |

**Primary CTA signal:** "Start Free Trial" as primary = PLG motion, self-serve confidence

**Consistency check:** ⚠️ Pricing page switches to "Book a Demo" for higher tiers, which is fine, but "enterprise-ready" claims elsewhere aren't supported by a clear enterprise CTA path.

With note: *"Your CTAs signal PLG confidence for SMB but your enterprise path is unclear. Is that intentional?"*

---

#### Tab 3: Proof & Credibility Audit

**Proof Point Inventory**

| Type | Found | Details |
|------|-------|---------|
| Customer Logos | ✅ Yes | 6 logos on homepage (Acme, Globex, Initech...) |
| Testimonials | ✅ Yes | 2 quotes, both from "Marketing Manager" titles |
| Case Studies | ❌ No | None found |
| Metrics/Stats | ⚠️ Weak | "10,000+ users" — no outcome metrics |
| Awards/Press | ❌ No | None found |
| Certifications | ❌ No | SOC2, GDPR not mentioned |

---

**Proof Gaps**

> "A skeptical buyer would notice:"
> - No case studies showing real results
> - Testimonials lack company names and outcomes
> - "10,000 users" doesn't answer "did it work for them?"
> - No enterprise credibility signals (security, compliance)
> - No industry-specific proof for claimed verticals

---

**Proof Strength Score: 35/100**

| Component | Score | Issue |
|-----------|-------|-------|
| Social Proof (logos) | 60 | Present but not contextualized |
| Outcome Evidence | 20 | No metrics, no case studies |
| Trust Signals | 25 | No certifications, no press |

---

#### Tab 4: Messaging Consistency Check

**Cross-Page Coherence**

| Element | Homepage | Features | Pricing | About | Consistent? |
|---------|----------|----------|---------|-------|-------------|
| Primary value prop | "Create content faster" | "AI-powered writing" | "Plans for every team" | "Founded to help marketers" | ⚠️ Drifts |
| Target persona | Marketing teams | Content creators | Teams & enterprises | Marketers | ⚠️ Vague |
| Differentiation | "10x faster" | "Brand voice AI" | Not mentioned | "Human + AI" | ❌ Inconsistent |
| Tone | Casual, friendly | Technical | Transactional | Inspirational | ⚠️ Varies |

---

**Tone Drift Analysis**

> "Your homepage sounds like a friendly startup. Your features page sounds like enterprise software. Your about page sounds like a manifesto. A buyer visiting multiple pages might wonder if this is all the same company."

---

#### Tab 5: The Uncomfortable Observations

**Specificity Score: 42/100**

> "Your messaging is more vague than specific. You say 'faster' but not how much faster. You say 'AI-powered' but not what the AI does. You say 'built for teams' but not which teams."

| Claim | Structural Placement | Specificity | Issue |
|-------|---------------------|-------------|-------|
| "Create content 10x faster" | H2 on homepage | High ✅ | Concrete number—good |
| "AI-powered writing assistant" | Body text only | Low ❌ | Generic, plus structurally buried |
| "Built for modern teams" | H1 on about page | Very Low ❌ | Meaningless AND prominently placed |
| "Enterprise-grade security" | Pricing page body | Low ❌ | No proof, no details |

With note: *"'Built for modern teams' is your About page H1—the most prominent position—but it says nothing. That's your worst structural-specificity combination."*

---

**The 10-Second Takeaway**

Based on homepage H1, H2s, and primary CTA:

> "If a buyer spent 10 seconds on your homepage, they'd conclude: 'This is some kind of AI writing tool for marketers. Unclear how it's different from Jasper or Copy.ai. They seem confident enough to offer a free trial. Might be worth a look if I have time.'"

With note: *"Is that the reaction you want? What should they think instead?"*

---

**"So What?" Gaps**

Claims that don't answer why the buyer should care:

| Claim | Structural Placement | The Missing "So What?" |
|-------|---------------------|------------------------|
| "AI-powered" | Body text | So what? What does that mean for me? |
| "Built for scale" | H2 on features | So what? I have 3 people on my team. |
| "Integrates with your stack" | List item | So what? What specifically? |
| "Trusted by thousands" | Homepage H1 | So what? Did it work for them? |

With note: *"Your homepage H1 is 'Trusted by thousands'—which uses your most valuable real estate to say something that doesn't answer 'so what?' This is a structural positioning mistake."*

---

**Differentiation Signal Strength: Weak**

> "Based on your site content, here's what could NOT be copy-pasted onto a competitor's homepage:"

| Unique Element | Structural Placement | Visibility |
|----------------|---------------------|------------|
| "Brand voice fingerprinting" | Features page, body text | Buried |
| Specific customer: "Webflow uses us for..." | Nowhere | Missing |

> "Your only potentially unique element—'brand voice fingerprinting'—is buried in body text on the features page. It's not in any headline, not in your navigation, not emphasized anywhere. Your differentiation exists but is structurally invisible."

With note: *"Everything in your headlines—'AI-powered,' 'faster content,' 'easy to use'—appears on most competitor sites. Your structural emphasis is on generic claims; your unique value is buried."*

---

#### Tab 6: Visual Reality Check (Screenshot Analysis)

**Above-the-Fold Analysis**

Based on homepage screenshot (viewport: 1280x800):

**Visual Hierarchy Assessment:**

| Element | Visual Dominance | Notes |
|---------|------------------|-------|
| Hero Image | 60% of viewport | Stock photo of diverse team in meeting room |
| Headline | 15% of viewport | "AI-Powered Content Creation" — readable but not dominant |
| Subheadline | 10% of viewport | "Create better content, faster" |
| Primary CTA | 5% of viewport | Blue button, "Start Free Trial" |
| Logo wall | Not visible | Below the fold |

**Hero Imagery Type:** Stock Photo (Generic)

> "Your hero image is a stock photo of people in a meeting. This signals 'collaboration' and 'enterprise,' but your H1 emphasizes 'AI.' The visual doesn't reinforce your differentiation."

**Visual vs. Structural Mismatch:**

| Mismatch Type | What Structure Says | What Visuals Show | Severity |
|---------------|---------------------|-------------------|----------|
| Differentiation invisible | H1: "AI-Powered" | No AI/tech imagery; generic team photo | High |
| Proof buried | 6 customer logos in HTML | Logos below the fold | Medium |
| CTA understated | Primary CTA in markup | Button is small, low contrast | Medium |

**Design Quality Assessment:**

> "Clean, professional design. Adequate whitespace. Feels mid-market SaaS—not scrappy startup, not enterprise polish. The stock imagery undercuts the 'innovative AI' positioning."

**The 5-Second Visual Takeaway:**

> "A visitor glancing at your homepage for 5 seconds sees: a team collaboration photo, a headline about AI, and a blue 'Start Free Trial' button. They'd think: 'Some kind of team tool with AI features. Probably worth a quick look.' They would NOT think: 'This is a differentiated AI content platform.'"

With note: *"Your visuals and your structure are telling different stories. The stock photo says 'team collaboration tool.' Your H1 says 'AI content creation.' Pick one."*

---

#### Tab 7: Customer Voice Analysis (Optional Enrichment)

*This tab appears only if user enabled G2/Capterra enrichment*

**Review Platform Data:**

| Platform | Listed | Category | Rating | Review Count |
|----------|--------|----------|--------|--------------|
| G2 | ✅ Yes | Content Creation Software | 4.3/5 | 127 reviews |
| Capterra | ✅ Yes | Content Marketing Software | 4.1/5 | 84 reviews |

**How Customers Describe You:**

Top themes extracted from review text (frequency-ranked):

| Theme | Mentions | Example Quote |
|-------|----------|---------------|
| Saves time on first drafts | 34 | "Gets me 80% of the way there fast" |
| Good for social media posts | 28 | "I use it daily for LinkedIn content" |
| Easy to learn | 22 | "Was up and running in 10 minutes" |
| Limited integrations | 18 | "Wish it connected to our CMS" |
| Outputs need editing | 15 | "Always have to polish what it produces" |

**Customer Voice vs. Company Voice:**

| Dimension | You Say | Customers Say | Gap |
|-----------|---------|---------------|-----|
| Category | "AI Marketing Platform" | "Content creation tool" | You're broader; they're narrower |
| Primary benefit | "Enterprise-grade AI" | "Saves time on drafts" | You're aspirational; they're practical |
| Target user | "Content teams at scale" | "Solo marketers," "freelancers" | You target teams; they're individuals |
| Differentiation | "Brand voice AI" | Rarely mentioned | Your differentiator isn't landing |
| Pain solved | "Content consistency at scale" | "Writer's block," "first draft speed" | Different problem framing entirely |

**Voice Gap Analysis:**

> "You position as an 'enterprise-grade AI marketing platform for content teams.' Your customers describe you as 'a helpful tool for getting first drafts done quickly.' This is a significant positioning gap."
>
> "Your claimed differentiator—'brand voice AI'—appears in only 3 of 127 reviews. Either customers don't experience it as the primary value, or your marketing isn't landing this message."

**Customer Use Cases vs. Intended Use Cases:**

| Use Case | You Target | Customers Mention | Match |
|----------|-----------|-------------------|-------|
| Blog posts | ✅ Yes | 45 mentions | ✅ Match |
| Social media content | ⚠️ Secondary | 52 mentions | ⚠️ Primary for them |
| Enterprise documentation | ✅ Yes | 4 mentions | ❌ Gap |
| Email campaigns | ✅ Yes | 12 mentions | ⚠️ Underperforming |

**Competitive Mentions in Reviews:**

| Competitor | Times Mentioned | Context |
|------------|-----------------|---------|
| Jasper | 23 | "Switched from Jasper because..." |
| Copy.ai | 18 | "Similar to Copy.ai but..." |
| ChatGPT | 31 | "Better than just using ChatGPT because..." |

> "Customers frequently compare you to Jasper and Copy.ai. They see you as a direct competitor in the 'AI writing tool' category—not as a differentiated 'brand voice platform.' Your positioning isn't creating separation."

With note: *"The market has decided what category you're in. You can fight that or lean into it—but you should know the gap exists."*

---

### Step 5: User Review & Confirmation

At the bottom of results:

**Confirm Your Positioning**

Before proceeding to stress testing, confirm or edit:

| Field | Extracted | Your Version |
|-------|-----------|--------------|
| Positioning Statement | "We help marketing teams create content faster with AI" | [Editable] |
| Category | AI writing assistant | [Editable] |
| Target Persona | Mid-level marketing managers at B2B SaaS | [Editable] |
| Primary Value Prop | Speed (10x faster content) | [Editable] |
| Differentiation Claim | Brand voice AI | [Editable] |
| Primary Pain Point | Content creation is slow and inconsistent | [Editable] |

**Save & Continue to Stress Test →**

(Links to the Stress Test flow in future product phase)

---

### Step 6: Session Management

- Sessions auto-save
- Dashboard shows past sessions with:
  - Date
  - Company name
  - Specificity score
  - Quick actions: View, Edit, Re-run, Delete

---

## 6. What This Tool Explicitly Does NOT Do

| ❌ Does Not | Why |
|-------------|-----|
| Write better copy | This is a mirror, not a copywriter |
| Tell you what to say | That's the PMM's job |
| Score "good" vs "bad" | It scores specificity, consistency, and completeness |
| Compare to competitors | That's a separate tool (Stress Test Engine) |
| Fix your positioning | It shows gaps; you decide how to fill them |

---

## 7. Technical Architecture

### Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14+ (App Router), React, Tailwind CSS |
| Backend | Supabase (Postgres, Auth, Edge Functions) |
| Hosting | Vercel |
| AI/LLM | Google Gemini Flash 2.5 (extraction), Gemini Pro (synthesis fallback) |
| Web Scraping | Jina Reader API (primary), Firecrawl (fallback) |

---

### Scraping Strategy: Preserving Structure

**Why Structure Matters:**

Raw text loses critical positioning signals. The *hierarchy* of content reveals what a company thinks is important—often more than the words themselves.

| Structural Element | Positioning Signal |
|--------------------|-------------------|
| H1 headline | The single most important claim |
| H2 headlines | Secondary value props and section framing |
| H3 and below | Supporting details, features |
| Paragraph position | Early = emphasized; late = buried |
| Navigation labels | What they think deserves top-level attention |
| CTA text + placement | Primary action they want visitors to take |
| Lists vs. prose | Feature dumps vs. narrative positioning |
| Links | What they connect to (proof, pricing, competitors) |

**Jina Reader Output:**

Jina returns markdown with structure preserved:
- Headers (H1/H2/H3) intact
- Links with anchor text
- Lists (bulleted/numbered)
- Basic content sections

**What We Extract From Structure:**

1. **Emphasis Hierarchy**
   - H1 = top priority claim
   - H2s = supporting value props
   - Body text = details and proof
   - If differentiation is in paragraph 4 but social proof is H1, that's a diagnosis

2. **Navigation Architecture**
   - Top-level nav items reveal strategic priorities
   - "Why Us," "vs. Competitors," "Security," "Enterprise" as nav items = signals
   - What's missing from nav is also a signal

3. **Content Density Pattern**
   - Long-form = enterprise positioning (more explanation, more proof needed)
   - Short-form = PLG positioning (self-serve, low friction)
   - Ratio of proof to claims

4. **CTA Inventory**
   - Primary CTA text ("Start Free Trial" vs. "Request Demo" vs. "Contact Sales")
   - CTA frequency and placement
   - Secondary CTAs and their framing

**Storage:**

Scraped content is stored as markdown in `extracted_elements.raw_markdown` to preserve structure for AI analysis.

---

### Homepage Screenshot Analysis (Visual Layer)

**Why This Matters:**

HTML structure and visual reality often diverge. The H1 might say "AI-Powered Platform" but visually, a stock photo of people in a meeting dominates the viewport. Structure lies; visuals don't.

**What We Capture:**

Automated screenshot of homepage viewport (above-the-fold, ~1280x800).

**What Gemini Vision Analyzes:**

| Visual Element | Positioning Signal |
|----------------|-------------------|
| Visual hierarchy | What actually dominates the viewport (headline? image? CTA?) |
| Hero imagery type | Product screenshot (confident) vs. illustration (vibe) vs. stock photo (generic) |
| Logo wall presence | Proof above the fold vs. buried |
| CTA visual weight | Bold button vs. text link vs. buried in nav |
| Design quality | Polish = credibility; scrappy = early-stage |
| White space vs. density | Enterprise (breathing room) vs. PLG (dense, action-oriented) |
| Color/brand signals | Enterprise navy vs. startup bright vs. developer dark mode |

**Key Output:**

"Visual vs. Structural Mismatch" analysis—where what you *see* differs from what the HTML *says*.

**Implementation:**

- Puppeteer/Playwright screenshot on session creation
- Pass viewport image to Gemini Vision
- Compare visual analysis to structural analysis for mismatches

---

### Optional Enrichment: G2/Capterra Reviews

**Why This Matters:**

How customers describe you is often wildly different from how you describe yourself. This gap is a positioning signal.

**User Control:**

Toggle on session creation: "Include customer review analysis (G2/Capterra)"

Default: Off (to keep core flow fast; user opts in for deeper analysis)

**What We Scrape:**

- Product page on G2 and/or Capterra (if listed)
- Category placement (how the platform categorizes them)
- Overall rating
- Top 5-10 review snippets (pros, cons, use cases mentioned)
- Common phrases/themes in reviews

**What We Surface:**

| Analysis | Example Output |
|----------|----------------|
| Customer category vs. company category | "G2 lists you under 'Content Creation' but you position as 'Marketing Platform'" |
| Top customer-mentioned benefits | "Customers most mention: 'saves time on first drafts,' 'good for social posts'" |
| Top customer-mentioned pain points | "Common complaints: 'limited integrations,' 'learning curve'" |
| Voice gap analysis | "You say 'enterprise-grade AI platform.' Customers say 'helpful for quick drafts.'" |
| Use case gap | "You target 'content teams.' Reviews mention 'solo marketers' and 'freelancers.'" |

**Key Output:**

"Customer Voice vs. Company Voice" analysis—where market perception differs from positioning intent.

**Implementation:**

- Scrape G2/Capterra product page (or use unofficial API)
- Extract review snippets and metadata
- Gemini synthesizes themes and compares to company positioning
- Flag as "enrichment data" in results (clearly marked as optional layer)

---

### Database Schema (Supabase)

```sql
-- Users (handled by Supabase Auth)

-- Extraction Sessions
CREATE TABLE extraction_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT,
  company_name TEXT NOT NULL,
  
  -- Analysis options
  include_screenshot BOOLEAN DEFAULT TRUE,
  include_review_enrichment BOOLEAN DEFAULT FALSE,
  g2_url TEXT,
  capterra_url TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending' -- pending, processing, complete, failed
);

-- URLs for extraction
CREATE TABLE extraction_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES extraction_sessions(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  page_type TEXT, -- homepage, features, pricing, about, case_study, landing, other
  raw_markdown TEXT, -- Preserved markdown with structure (H1/H2/H3, lists, links)
  scraped_content JSONB,
  extracted_elements JSONB, -- {
    -- headlines: [{level, text, type}],
    -- value_props: [{claim, placement, specificity}],
    -- proof_points: [{type, content, placement}],
    -- nav_items: [...],
    -- ctas: [{text, type, action_type}],
    -- content_pattern: {density, style, tone}
  -- }
  scrape_status TEXT DEFAULT 'pending', -- pending, success, failed
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Homepage Screenshot Analysis
CREATE TABLE screenshot_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES extraction_sessions(id) ON DELETE CASCADE,
  
  screenshot_url TEXT, -- Stored screenshot (Supabase Storage or external)
  viewport_width INTEGER DEFAULT 1280,
  viewport_height INTEGER DEFAULT 800,
  
  -- Visual analysis results
  visual_hierarchy JSONB, -- [{element, dominance_percent, notes}]
  hero_imagery_type TEXT, -- product_screenshot, illustration, stock_photo, abstract, none
  hero_imagery_analysis TEXT,
  visual_structural_mismatches JSONB, -- [{mismatch_type, structure_says, visual_shows, severity}]
  design_quality_assessment TEXT,
  five_second_takeaway TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- G2/Capterra Review Enrichment
CREATE TABLE review_enrichment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES extraction_sessions(id) ON DELETE CASCADE,
  
  -- Platform data
  g2_listed BOOLEAN,
  g2_category TEXT,
  g2_rating DECIMAL(2,1),
  g2_review_count INTEGER,
  g2_scraped_reviews JSONB,
  
  capterra_listed BOOLEAN,
  capterra_category TEXT,
  capterra_rating DECIMAL(2,1),
  capterra_review_count INTEGER,
  capterra_scraped_reviews JSONB,
  
  -- Synthesized analysis
  customer_themes JSONB, -- [{theme, mentions, example_quote}]
  voice_gap_analysis JSONB, -- [{dimension, company_says, customers_say, gap}]
  use_case_comparison JSONB, -- [{use_case, company_targets, customer_mentions, match}]
  competitor_mentions JSONB, -- [{competitor, times_mentioned, context}]
  customer_voice_summary TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Extraction Results
CREATE TABLE extraction_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES extraction_sessions(id) ON DELETE CASCADE,
  
  -- Positioning Synthesis
  draft_positioning_statement TEXT,
  category_placement TEXT,
  value_hierarchy JSONB, -- [{rank, theme, structural_placement, evidence, strength}]
  structural_emphasis_gaps JSONB, -- [{gap_type, should_be, actually_is, severity}]
  
  -- ICP Extraction
  persona_profile JSONB, -- {role, seniority, company_size, industry, sophistication}
  pain_points JSONB, -- [{pain, where_found, structural_placement, specificity}]
  buyer_assumptions JSONB, -- {assumes: [], does_not_explain: []}
  
  -- Navigation & CTA Analysis
  nav_analysis JSONB, -- {items: [], signals: [], missing: []}
  cta_analysis JSONB, -- {primary_cta, frequency, cta_inventory: [], motion_signal}
  
  -- Proof Audit
  proof_inventory JSONB, -- [{type, found, details, structural_placement}]
  proof_gaps TEXT[],
  proof_score INTEGER,
  
  -- Consistency Check
  cross_page_coherence JSONB, -- [{element, by_page, consistent}]
  tone_drift_analysis TEXT,
  
  -- Uncomfortable Observations
  specificity_score INTEGER,
  specificity_breakdown JSONB, -- [{claim, structural_placement, score, issue}]
  ten_second_takeaway TEXT,
  so_what_gaps JSONB, -- [{claim, structural_placement, missing_so_what}]
  differentiation_strength TEXT, -- strong, moderate, weak
  unique_elements JSONB, -- [{element, structural_placement, visibility}]
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-Confirmed Positioning (editable fields)
CREATE TABLE confirmed_positioning (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES extraction_sessions(id) ON DELETE CASCADE,
  
  positioning_statement TEXT,
  category TEXT,
  target_persona TEXT,
  primary_value_prop TEXT,
  differentiation_claim TEXT,
  primary_pain_point TEXT,
  
  confirmed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### API Routes

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/extractions` | GET, POST | List/create extraction sessions |
| `/api/extractions/[id]` | GET, PUT, DELETE | Session CRUD |
| `/api/extractions/[id]/urls` | POST, DELETE | Add/remove URLs |
| `/api/extractions/[id]/screenshot` | POST | Capture and analyze homepage screenshot |
| `/api/extractions/[id]/reviews` | POST | Fetch and analyze G2/Capterra reviews |
| `/api/extractions/[id]/run` | POST | Trigger full extraction analysis |
| `/api/extractions/[id]/results` | GET | Fetch extraction results |
| `/api/extractions/[id]/confirm` | POST | Save user-confirmed positioning |

---

### AI Prompt Architecture

**Layer 1: URL Scraping & Element Extraction**

One prompt per URL. Receives markdown with structure preserved.

Extracts:
- **Structural hierarchy**: H1 (primary claim), H2s (secondary claims), H3+ (supporting details)
- **Emphasis analysis**: What's positioned as most important based on header level and placement
- Page type classification
- Headlines with their hierarchy level
- Value propositions (noting where they appear: H1? H2? buried in body?)
- Target audience signals (and their prominence)
- Proof points (logos, testimonials, stats) with placement context
- Navigation items (top-level = strategic priorities)
- CTAs: text, prominence, primary vs. secondary
- Content density (long-form vs. short-form, prose vs. lists)
- Tone indicators

The prompt explicitly instructs the model to treat H1 > H2 > H3 > paragraph as a priority hierarchy.

Model: Gemini Flash 2.5

---

**Layer 2: Cross-Page Synthesis**

Single prompt that receives all extracted elements. Produces:
- Draft positioning statement
- Category placement
- Value hierarchy (ranked)
- ICP profile
- Pain points inventory
- Consistency analysis
- Tone drift assessment

Model: Gemini Flash 2.5 (or Pro for complex sites)

---

**Layer 3: Gap Analysis & Scoring**

Single prompt focused on critical evaluation. Produces:
- Specificity score and breakdown
- Proof score and gaps
- "So what?" gaps
- Differentiation signal strength
- 10-second takeaway
- Unique elements inventory

Model: Gemini Flash 2.5

---

## 8. Key Prompt: Element Extraction (Per-URL)

```
You are analyzing a single page from a B2B SaaS website.

INPUT FORMAT:
You will receive the page content as MARKDOWN with structure preserved:
- # = H1 (highest priority claim)
- ## = H2 (secondary claims)
- ### = H3 (supporting details)
- Regular paragraphs = explanatory content
- Lists = feature inventories or proof points
- [Link text](url) = navigation and CTAs

CRITICAL INSTRUCTION:
Treat header hierarchy as EMPHASIS HIERARCHY. What appears in H1 is what the company considers most important. What's buried in body paragraphs is deprioritized. This structural placement is a positioning signal.

YOUR TASK:
Extract the following from this page:

1. PAGE TYPE
Classify as: homepage, features, pricing, about, case_study, landing, other

2. HEADLINE INVENTORY
For each headline found:
{level: "H1"|"H2"|"H3", text: "...", type: "value_prop"|"social_proof"|"feature"|"pain_point"|"cta"|"other"}

3. VALUE PROPOSITIONS
For each claim/benefit found:
{claim: "...", placement: "H1"|"H2"|"body"|"list_item", specificity: "high"|"medium"|"low"}

4. TARGET AUDIENCE SIGNALS
{signal: "...", placement: "...", explicitness: "direct"|"implied"}

5. PROOF POINTS
{type: "logo"|"testimonial"|"stat"|"case_study"|"certification", content: "...", placement: "prominent"|"secondary"|"buried"}

6. NAVIGATION ITEMS (if visible)
Top-level nav labels indicate strategic priorities.
{nav_items: [...], strategic_signals: "..."}

7. CTAs
{text: "...", type: "primary"|"secondary", action_type: "free_trial"|"demo"|"contact"|"learn_more"|"other"}

8. CONTENT PATTERN
{density: "long_form"|"short_form", style: "prose_heavy"|"list_heavy"|"balanced", tone: "..."}

PAGE CONTENT (MARKDOWN):
{markdown_content}

Respond in JSON format.
```

---

## 9. Key Prompt: Cross-Page Synthesis

```
You are a positioning analyst examining a B2B SaaS company's website.

YOUR PERSPECTIVE:
- You are a first-time visitor who knows nothing about this company
- You have no insider context—only what the pages communicate
- You notice what's said AND where it's said (structure = emphasis)
- What appears in H1 is their #1 priority. What's buried in paragraphs is deprioritized.

CRITICAL FRAMING:
The HIERARCHY of content reveals positioning priorities:
- H1 headline = The single most important claim
- H2 headlines = Secondary value propositions  
- Body paragraphs = Supporting details
- Navigation labels = Strategic priorities
- Primary CTA = The action they most want visitors to take

If their differentiation claim is in paragraph 4 but "trusted by 10,000 users" is the H1, that tells you what they're actually prioritizing—regardless of what they'd say in a strategy meeting.

YOU HAVE BEEN GIVEN:
Extracted content from {n} pages of {company_name}'s website, with structural hierarchy preserved.

YOUR TASK:

1. POSITIONING STATEMENT
Write a single sentence: "We help [who] do [what] so they can [outcome]"
Based ONLY on what the site says. Do not infer or improve.

2. CATEGORY PLACEMENT
What category is this company placing itself in?
Be specific (not "software" but "sales engagement platform")

3. VALUE HIERARCHY
Rank the top 5 value themes by STRUCTURAL PROMINENCE:
- What appears in H1s across pages = highest weight
- What appears in H2s = secondary weight
- What's only in body text = lowest weight
- Frequency across pages is secondary to structural placement

For each: {rank, theme, evidence, structural_placement, signal_strength}

4. EMPHASIS VS. INTENT GAPS
Where is there a mismatch between what's structurally emphasized (H1s, primary CTAs) vs. what seems strategically important?
Example: "Differentiation claim appears only in body text on features page, while generic 'trusted by thousands' is the homepage H1."

5. TARGET PERSONA
Extract: role, seniority, company size, industry, sophistication level
Note where this is structurally emphasized vs. buried
Flag where the site is unclear or contradictory

6. PAIN POINTS
List every problem the site claims to solve
Note structural placement (H1/H2/body) for each

7. NAVIGATION ANALYSIS
What do the top-level nav items reveal about strategic priorities?
What's conspicuously missing from navigation?

8. CTA ANALYSIS
What's the primary CTA across pages? (This reveals their conversion strategy)
{primary_cta: "...", frequency: n, implication: "PLG"|"sales-led"|"hybrid"}

9. CROSS-PAGE CONSISTENCY
Compare how key elements (value prop, persona, differentiation, tone) 
appear across pages. Flag inconsistencies in both content AND structural emphasis.

PAGE DATA:
{extracted_content_from_all_pages}

Respond in JSON format.
```

---

## 10. Key Prompt: Gap Analysis

```
You are a critical analyst evaluating B2B SaaS positioning.

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

YOU HAVE BEEN GIVEN:
Synthesized positioning analysis for {company_name}, including structural hierarchy data.

YOUR TASK:

1. SPECIFICITY SCORE (0-100)
Rate how concrete vs. vague the overall messaging is.
For each major claim, note: {claim, specificity_score, structural_placement, issue}
Structurally prominent but vague claims are worse than buried vague claims.

2. STRUCTURAL EMPHASIS GAPS
Where is the hierarchy misaligned with apparent strategy?
- Differentiation in body text while generic claims are H1 = critical gap
- Important proof buried while features are prominent = credibility gap
- ICP signals only in body text = targeting gap

List: {gap_type, what_should_be_emphasized, where_it_actually_is, severity}

3. PROOF SCORE (0-100)
Rate the strength of evidence and credibility signals.
Consider BOTH existence and structural placement.
List what's present, what's missing, and what's buried when it should be prominent.

4. "SO WHAT?" GAPS
For each claim that doesn't answer "why should I care?", note:
{claim, structural_placement, missing_so_what}
H1-level claims without clear "so what" = critical issue.

5. DIFFERENTIATION SIGNAL STRENGTH (strong/moderate/weak)
What on this site could NOT appear on a competitor's site?
Note structural placement of any unique elements.
If differentiation exists but is structurally buried, note that as a gap.

6. NAVIGATION GAPS
What's conspicuously missing from top-level navigation?
- No "Why Us" or "vs. Competitors" = weak differentiation confidence
- No "Pricing" = friction/enterprise signal
- No "Customers" or "Case Studies" = proof gap

7. CTA ANALYSIS
What does the primary CTA reveal?
- "Start Free Trial" = PLG confidence
- "Request Demo" = sales-led, higher friction
- "Contact Us" = enterprise or unclear value prop
Does the CTA match the apparent positioning?

8. 10-SECOND TAKEAWAY
Write one sentence: what would a busy buyer conclude from 
10 seconds on the homepage? Base this primarily on H1, H2, and primary CTA.
Be honest, not kind.

9. BUYER ASSUMPTIONS
What does this messaging assume the buyer already knows?
What does it fail to explain that a new buyer might need?

SYNTHESIS DATA:
{synthesis_results}

Be direct. Be uncomfortable. Be useful.
Respond in JSON format.
```

---

## 11. Key Prompt: Visual Analysis (Screenshot)

```
You are analyzing a screenshot of a B2B SaaS homepage.

YOUR PERSPECTIVE:
- You are a first-time visitor who landed on this page
- You have 5 seconds to form an impression
- You notice what VISUALLY dominates, not what the HTML says
- Visual hierarchy often differs from structural hierarchy

YOU HAVE BEEN GIVEN:
A screenshot of the homepage viewport (approximately 1280x800 pixels).

YOUR TASK:

1. VISUAL HIERARCHY
What dominates the viewport? Estimate percentage of visual attention:
For each major element: {element, dominance_percent, notes}
Elements: hero_image, headline, subheadline, cta_button, navigation, logo_wall, product_screenshot, other

2. HERO IMAGERY CLASSIFICATION
Classify the hero imagery:
- product_screenshot: Actual product UI shown (signals confidence)
- illustration: Custom illustrated graphics (signals brand investment, vibe marketing)
- stock_photo: Generic stock photography (signals generic positioning)
- abstract: Abstract shapes/patterns (signals design-forward but unclear product)
- none: Text-only hero (signals copy confidence or enterprise approach)

Provide analysis of what the imagery choice communicates.

3. PROOF VISIBILITY
Is social proof (logos, testimonials, stats) visible above the fold?
Where is it positioned? How prominent?

4. CTA VISUAL WEIGHT
How visually prominent is the primary CTA?
- Button size, color contrast, position
- Does it compete with other elements or stand out?

5. DESIGN QUALITY SIGNALS
What does the visual design communicate about the company?
- Polish level (startup scrappy vs. established vs. enterprise)
- Design era (modern vs. dated)
- Target market signals (SMB friendly vs. enterprise serious)

6. 5-SECOND VISUAL TAKEAWAY
In one sentence: what would a visitor conclude about this company from 5 seconds of looking at this page? Base this ONLY on visual impression, not on reading the copy carefully.

7. VISUAL VS STRUCTURAL MISMATCHES
You will also receive the structural analysis (H1, H2, etc.) of this page.
Identify where visual emphasis differs from structural emphasis:
{mismatch_type, structure_says, visual_shows, severity}

Example mismatches:
- H1 says "AI-Powered" but hero image shows people in meeting (no tech visual)
- Structural emphasis on "enterprise" but visual design feels SMB
- Navigation emphasizes "Pricing" but CTA is "Request Demo" (friction mismatch)

STRUCTURAL DATA FOR COMPARISON:
{structural_analysis}

Respond in JSON format.
```

---

## 12. Key Prompt: Customer Review Analysis (G2/Capterra)

```
You are analyzing customer reviews to understand how the market perceives a B2B SaaS product.

YOUR PERSPECTIVE:
- Customers describe products based on their EXPERIENCE, not marketing
- How customers talk about a product often differs dramatically from how the company positions it
- Review themes reveal actual value delivered, not promised value
- Competitor mentions reveal category perception

YOU HAVE BEEN GIVEN:
- Company positioning data (how they describe themselves)
- G2 and/or Capterra review data (how customers describe them)

YOUR TASK:

1. CUSTOMER THEME EXTRACTION
From the review text, identify the top 5-7 themes customers mention:
{theme, mention_count, sentiment (positive/negative/neutral), example_quote}

Prioritize:
- Benefits/outcomes mentioned
- Use cases described
- Pain points or complaints
- Feature mentions

2. VOICE GAP ANALYSIS
Compare company positioning to customer language:
For each major positioning dimension:
{dimension, company_says, customers_say, gap_type, severity}

Dimensions to analyze:
- Category (how company categorizes vs. how reviews categorize)
- Primary benefit (what company promises vs. what customers value)
- Target user (who company targets vs. who reviews suggest uses it)
- Differentiation (what company claims is unique vs. what customers mention as unique)
- Pain solved (what problem company claims to solve vs. what customers say it solved)

3. USE CASE COMPARISON
Compare intended vs. actual use cases:
{use_case, company_targets (yes/no/secondary), customer_mention_count, match_status}

4. DIFFERENTIATOR VALIDATION
Does the company's claimed differentiator appear in customer reviews?
- If yes: how frequently? In what context?
- If no: what DO customers cite as reasons for choosing this product?

5. COMPETITOR PERCEPTION
Which competitors do customers mention in reviews?
{competitor, mention_count, typical_context (switched_from, compared_to, better_than, worse_than)}

What does this reveal about category perception?

6. CUSTOMER VOICE SUMMARY
In 2-3 sentences: How do customers describe this product in their own words? 
How does this differ from company positioning?

COMPANY POSITIONING DATA:
{company_positioning}

REVIEW DATA:
{review_data}

Be direct about gaps. The goal is to surface where market perception differs from positioning intent.
Respond in JSON format.
```

---

## 13. UI/UX Notes

### Design Principles
- Clean, professional, slightly editorial (feels like a report)
- Light mode default (easier to read dense information)
- Clear visual hierarchy—scores and summaries prominent, details expandable
- Editable fields feel collaborative, not bureaucratic
- Optional enrichment clearly marked as supplementary data

### Key Screens

1. **Dashboard** — Past sessions, "New Extraction" CTA
2. **URL Input** — Simple form, progressive disclosure for adding URLs
3. **Analysis Options** — Screenshot toggle (default on), Review enrichment toggle (default off)
4. **Processing State** — Progress bar showing stages: Scraping → Screenshot → Reviews (if enabled) → Analyzing
5. **Results** — Tabbed interface (7 tabs when all options enabled):
   - Tab 1: Positioning Synthesis (+ Structural Emphasis Gaps)
   - Tab 2: ICP Extraction (+ Nav Analysis, CTA Analysis)
   - Tab 3: Proof & Credibility Audit
   - Tab 4: Messaging Consistency Check
   - Tab 5: Uncomfortable Observations
   - Tab 6: Visual Reality Check (screenshot) — *only if enabled*
   - Tab 7: Customer Voice Analysis (G2/Capterra) — *only if enabled*
6. **Confirmation** — Review/edit extracted positioning before saving

### Interaction Details
- Expandable sections for detailed evidence
- Inline editing for all "confirm/edit" fields
- Tooltips explaining scoring methodology
- Color-coded scores (red/yellow/green bands)
- "Copy to clipboard" for key outputs
- Visual mismatch highlights (side-by-side structure vs. visual)
- Screenshot displayed inline in Tab 6 with overlay annotations
- Review quotes displayed with source attribution in Tab 7

---

## 14. Stretch Goals (Post-Initial Build)

| Feature | Value | Complexity |
|---------|-------|------------|
| PDF Export | Consultant deliverable | Medium |
| Side-by-Side Comparison | Compare two extraction sessions | Medium |
| Historical Tracking | "Your specificity improved from 42→67" | Low |
| Suggested Improvements Mode | "Here's what you could say instead" | Medium |
| Competitor Extraction | Run same analysis on competitor URLs | Low (reuse same system) |
| Additional Review Sources | ProductHunt, TrustRadius, app store reviews | Medium |
| LinkedIn/Crunchbase Enrichment | Company stage, funding, hiring signals | Medium |
| Blog Content Analysis | What they think their audience cares about | Low |

---

## 16. Relationship to Stress Test Engine

This tool is **Step 1** in a two-part flow:

1. **Mirror Your Positioning** (this PRD)
   - Input: 5-10 URLs + optional screenshot + optional review enrichment
   - Output: Extracted positioning, gaps, scores, visual analysis, customer voice
   - User Action: Review, edit, confirm

2. **Break Your Positioning** (Stress Test PRD)
   - Input: Confirmed positioning from Step 1 + competitor URLs
   - Output: Adversarial critique, competitive comparison
   - User Action: Identify weaknesses to address

The `confirmed_positioning` table bridges the two systems.

---

## 17. Build Sequence (Suggested)

| Phase | Scope | Hours |
|-------|-------|-------|
| 1 | Auth + session CRUD + database setup | 4 |
| 2 | URL input form + validation + options toggles | 4 |
| 3 | Web scraping integration (Jina Reader) | 4 |
| 4 | Element extraction prompts (per-URL) | 4 |
| 5 | Synthesis prompt + results generation | 5 |
| 6 | Gap analysis prompt + scoring | 4 |
| 7 | Homepage screenshot capture (Puppeteer/Playwright) | 3 |
| 8 | Visual analysis prompt (Gemini Vision) | 3 |
| 9 | G2/Capterra scraping integration | 4 |
| 10 | Customer review analysis prompt | 3 |
| 11 | Results dashboard UI (all 7 tabs) | 10 |
| 12 | Editable confirmation flow | 3 |
| 13 | Polish, error handling, loading states | 5 |
| 14 | Testing + prompt refinement | 4 |
| **Total** | | **~60 hours** |

**Build Priority Notes:**

- **Core flow (Phases 1-6, 11-14):** ~43 hours — Ship this first as functional MVP
- **Screenshot analysis (Phases 7-8):** ~6 hours — High value, add immediately after core
- **Review enrichment (Phases 9-10):** ~7 hours — Optional layer, can defer if time-constrained

**Recommended approach:** Build core flow first, then screenshot analysis, then review enrichment. Each layer is independently valuable.

---

## 18. Success Metrics

**Demo Success:**
- Can complete full flow in <3 minutes during interview
- Extraction feels insightful, not generic
- "10-second takeaway" lands as uncomfortably accurate
- Visual mismatch analysis reveals something the user hadn't noticed
- Customer voice gap (if enabled) surfaces perception vs. positioning disconnect
- Gaps surfaced are non-obvious

**Technical Signals:**
- Scraping works reliably across different site structures
- Screenshot capture works consistently
- G2/Capterra scraping handles various page structures
- Processing completes in <60 seconds for 10 URLs + screenshot + reviews
- Graceful handling of failures (missing G2 listing, blocked scraping, etc.)
- Scores feel calibrated and defensible

**PMM Signals:**
- Output would be useful in a real positioning audit
- Visual hierarchy analysis matches what a human would observe
- Customer theme extraction aligns with actual review content
- Voice gap analysis surfaces actionable positioning insights
- Specificity score methodology makes sense
- Confirmation flow captures the right fields for stress testing

---

## 19. How to Pitch This

**Don't say:**
> "I built an AI tool that analyzes websites"

**Say:**
> "I built a positioning mirror. You give it your site URLs and it shows you three things: what your site actually communicates (not what you think it says), what visitors see in the first 5 seconds (which is often different from your copy), and how your customers describe you (which is often wildly different from your marketing). Most PMMs have never seen their positioning from the outside. This shows you the gaps before your buyers find them."

**In interviews:**
> "Before you can stress-test positioning, you need to know what you're actually saying. Most PMMs are too close to their own messaging. This tool extracts what your site communicates structurally, compares it to what visitors visually experience, and optionally pulls in how customers describe you on G2. The gaps between those three views are where positioning breaks down."

**For consulting:**
> "Before we start any positioning work, I'll run your site through my extraction tool. You'll see exactly what your pages communicate—the value hierarchy, the ICP signals, the proof gaps. Then I'll show you what your homepage actually looks like to someone glancing at it for 5 seconds. And if you have G2 reviews, I'll show you how customers describe you versus how you describe yourself. It's like seeing your positioning through three different lenses: structure, visuals, and market perception."

---

*End of PRD*
