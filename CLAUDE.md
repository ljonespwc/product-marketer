# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## ⚠️ IMPORTANT: Development Workflow

**Build verification strategy (to save time):**
- **UI/Component changes only**: Run `npm run build 2>&1 | head -n 50` (partial build check - catches most issues quickly)
- **Backend/API/calculation changes**: Run full `npm run build` (complete verification required)
- **Type changes or library updates**: Run full `npm run build` (complete verification required)

**DO NOT push to git or deploy to Vercel.** The user will handle all git commits, pushes, and deployments manually.

Your job is to:
1. Make the requested changes
2. Run appropriate build verification (partial or full based on change type)
3. Report the results to the user
4. Let the user handle git/deployment

## ⚠️ CRITICAL: Hands-Off Components

**DO NOT modify the following critical components without explicit permission:**



**Always ask for permission before modifying:**
- 

**UI/UX changes are generally safe** - components, styling, forms, labels, tooltips, dark mode, etc.

## Project Overview

**Mirror Your Positioning** — *See what your site actually communicates—before the market tells you*

A positioning extraction tool that analyzes B2B SaaS websites to show PMMs and founders what their site actually communicates to first-time visitors who know nothing about the company.

### Problem Solved

PMMs and founders are too close to their own positioning. They know what they *meant* to say, but they've never seen their positioning reflected back by an outside observer. This results in:
- Messaging that's clear internally but vague externally
- Value props that assume context buyers don't have
- Differentiation claims that are invisible or generic
- Proof points that are missing, buried, or unconvincing

**Core question answered:** "What does my site actually communicate to someone who knows nothing about us?"

### Core Functionality

1. **URL Input**: User provides 3-10 URLs from the same domain
2. **Jina Scraping**: Pull content with structural hierarchy preserved (H1 > H2 > H3)
3. **Element Extraction**: AI extracts headlines, value props, proof points, CTAs per page
4. **Cross-Page Synthesis**: AI synthesizes positioning statement, category, value hierarchy, ICP
5. **Gap Analysis**: AI identifies specificity gaps, "so what?" gaps, differentiation strength
6. **Results Dashboard**: 5 tabbed views with editable confirmation panel

### Product Principles

1. **Mirror, don't judge** — Reflect what's there, not what should be
2. **Specificity is the metric** — Vague = weak. Concrete = strong.
3. **Outside-in perspective** — Analyze as a stranger, not an insider
4. **Surface gaps, not fixes** — Show what's missing; don't write the copy
5. **Uncomfortable but useful** — The best insights are the ones that sting
6. **Fast to value** — URLs in, insights out. No lengthy setup.

### Target Users

- **Primary**: Solo/Senior PMM (B2B SaaS) — owns positioning, needs outside perspective
- **Secondary**: Startup Founding Team (Seed–Series B) — built site themselves, suspect messaging is "off"
- **Tertiary**: PMM/GTM Consultant — uses as diagnostic tool with new clients 

## MCP Tool Configuration

### Supabase MCP

**Project ID**: `hovqfkmrrjrswkxbhymp`
Always use this project_id when interacting with Supabase MCP tools.

### Playwright MCP

**Browser Testing**: For all browser-related testing tasks (UI testing, visual regression, E2E testing, screenshot capture, etc.), use the Playwright MCP tools instead of manually running browser commands.

Available Playwright MCP tools:
- `browser_navigate` - Navigate to URLs
- `browser_snapshot` - Capture accessibility snapshots (better than screenshots for actions)
- `browser_take_screenshot` - Take visual screenshots
- `browser_click` - Perform clicks
- `browser_fill_form` - Fill multiple form fields
- `browser_type` - Type text into elements
- `browser_evaluate` - Execute JavaScript
- `browser_wait_for` - Wait for conditions
- `browser_console_messages` - Get console output
- `browser_network_requests` - Inspect network activity

**Example use cases**:
- Verifying form field updates
- Capturing screenshots of results
- Testing responsive design across viewports
- Debugging browser console errors

**Workflow**: Always use `browser_snapshot` first to understand page structure, then use action tools (click, type, etc.) as needed.

#### Database Tables

- `extraction_sessions` - User sessions (user_id, company_name, status)
- `extraction_urls` - URLs per session (url, raw_markdown, extracted_elements, scrape_status)
- `extraction_results` - AI synthesis output (positioning, value hierarchy, ICP, proof audit, consistency, observations)
- `confirmed_positioning` - User-edited/approved positioning

#### Key Types (src/types/database.ts)

- `ExtractionSession`, `ExtractionUrl`, `ExtractionResults`, `ConfirmedPositioning`
- `ExtractedElements` - Per-page extraction (headlines, value_propositions, proof_points, ctas)
- `ValueHierarchyItem`, `PersonaProfile`, `PainPoint`, `AuditedProofPoint`

#### AI Pipeline (src/lib/ai/)

- `element-extractor.ts` - Per-URL extraction using gemini-2.0-flash-lite
- `synthesizer.ts` - Cross-page synthesis using gemini-2.0-flash
- `gap-analyzer.ts` - Gap analysis using gemini-2.0-flash

#### Scraper (src/lib/scraper/)

- `jina.ts` - Jina Reader API scraper with 3 retries, exponential backoff, 45s timeout



## Tech Stack

### Core Framework
- **Next.js 14** (App Router) with TypeScript
- **React 18** with React DOM
- **Tailwind CSS** with PostCSS and Autoprefixer

### Database & Auth
- **Supabase** (@supabase/supabase-js, @supabase/ssr) - PostgreSQL backend + Google OAuth

### AI
- **Google Gemini** (@google/generative-ai) - gemini-2.0-flash-lite and gemini-2.0-flash models

### UI & Styling
- **shadcn/ui** - Component library (Radix UI primitives)
- **Lucide React** - Icon system
- **clsx** + **tailwind-merge** - Utility for conditional CSS classes
- **class-variance-authority** - Component variant styling
- **date-fns** - Date formatting

### Development Tools
- **TypeScript** (strict mode)

## Commands

```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint

# Test Scripts (in src/scripts/)

```

## Environment Setup

Environment variables are configured in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` - Supabase anon/public key
- `SUPABASE_SECRET_KEY` - Supabase service role key (server-side only)
- `GEMINI_API_KEY` - Google Gemini API key for AI pipeline

Run `npm run dev` to start development.

## Path Aliases

This project uses TypeScript path aliases:
- `@/*` maps to `./src/*`

Example: `import { MyComponent } from '@/components/MyComponent'`

## Development Progress

See `docs/PROGRESS.md` for detailed development history and upcoming work.

