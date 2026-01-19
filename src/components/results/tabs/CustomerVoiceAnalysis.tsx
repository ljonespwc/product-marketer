'use client'

/**
 * Tab 7: Customer Voice Analysis - PRD Section 4, Lines 452-511
 *
 * PHASE 2 FEATURE - NOT YET IMPLEMENTED
 *
 * This tab will display G2/Capterra review analysis including:
 * - How customers describe the product vs how company positions it
 * - Customer theme extraction from reviews
 * - Voice gap analysis (company says X, customers say Y)
 * - Use case comparison (intended vs actual)
 * - Competitor mentions in reviews
 *
 * Implementation requires:
 * 1. G2/Capterra scraping integration
 * 2. Review text analysis via Gemini
 * 3. New database table: review_enrichment
 * 4. Analysis options toggle in session creation form
 *
 * PRD Reference: Section 7, Lines 662-702 (Technical Architecture)
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults } from '@/types/database'
import { MessageSquare, Users, TrendingUp, GitCompare, Quote } from 'lucide-react'

interface CustomerVoiceAnalysisProps {
  results: ExtractionResults
  // TODO: Add review_enrichment data type when schema is extended
}

export function CustomerVoiceAnalysis({ results }: CustomerVoiceAnalysisProps) {
  // TODO: Replace with actual review_enrichment data from database
  const isImplemented = false

  if (!isImplemented) {
    return (
      <div className="space-y-4 mt-4">
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Customer Voice Analysis</CardTitle>
              <Badge variant="outline" className="ml-2">Coming Soon</Badge>
            </div>
            <CardDescription>
              Compare how you describe yourself vs how customers describe you on G2 and Capterra.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                This feature will analyze your G2/Capterra reviews to reveal:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Customer Themes</strong> — What customers actually mention most</li>
                <li><strong>Voice Gap Analysis</strong> — Company says X, customers say Y</li>
                <li><strong>Use Case Comparison</strong> — Intended use vs actual use</li>
                <li><strong>Competitor Mentions</strong> — Who customers compare you to</li>
              </ul>
              <div className="p-3 bg-muted/50 rounded-lg mt-4">
                <p className="text-xs">
                  <strong>Why this matters:</strong> How customers describe you is often wildly different
                  from how you describe yourself. This gap is a critical positioning signal.
                  If you say &quot;enterprise-grade AI platform&quot; but customers say &quot;helpful for quick drafts,&quot;
                  that&apos;s a positioning problem.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder cards showing intended structure */}
        <Card className="border-dashed opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <CardTitle className="text-base">Customer Themes</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Will show top themes extracted from reviews, ranked by frequency with example quotes.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
              <CardTitle className="text-base">Voice Gap Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Will compare company positioning to customer language across dimensions:
              category, primary benefit, target user, differentiation, pain solved.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle className="text-base">Use Case Comparison</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Will compare intended use cases vs what customers actually mention using the product for.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Quote className="h-5 w-5" />
              <CardTitle className="text-base">Competitor Mentions</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Will show which competitors customers mention in reviews and in what context
              (switched from, compared to, better/worse than).
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // TODO: Implement actual customer voice analysis display when feature is built
  return (
    <div className="space-y-4 mt-4">
      {/* Actual implementation will go here */}
    </div>
  )
}
