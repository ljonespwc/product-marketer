'use client'

/**
 * Tab 6: Visual Reality Check - PRD Section 4, Lines 412-450
 *
 * PHASE 2 FEATURE - NOT YET IMPLEMENTED
 *
 * This tab will display homepage screenshot analysis including:
 * - Visual hierarchy assessment (what dominates the viewport)
 * - Hero imagery classification (product screenshot, illustration, stock photo, etc.)
 * - Visual vs structural mismatch analysis
 * - 5-second visual takeaway
 *
 * Implementation requires:
 * 1. Screenshot capture via Puppeteer/Playwright on session creation
 * 2. Gemini Vision API integration for visual analysis
 * 3. New database table: screenshot_analysis
 * 4. New schema fields for visual hierarchy, hero imagery type, mismatches
 *
 * PRD Reference: Section 7, Lines 628-659 (Technical Architecture)
 */

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults } from '@/types/database'
import { Camera, Eye, ImageIcon, AlertTriangle } from 'lucide-react'

interface VisualRealityCheckProps {
  results: ExtractionResults
  // TODO: Add screenshot_analysis data type when schema is extended
}

export function VisualRealityCheck({ results }: VisualRealityCheckProps) {
  // TODO: Replace with actual screenshot_analysis data from database
  const isImplemented = false

  if (!isImplemented) {
    return (
      <div className="space-y-4 mt-4">
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-base">Visual Reality Check</CardTitle>
              <Badge variant="outline" className="ml-2">Coming Soon</Badge>
            </div>
            <CardDescription>
              Screenshot analysis of your homepage to see what visitors actually see in the first 5 seconds.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground space-y-4">
              <p>
                This feature will analyze your homepage screenshot to reveal:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>Visual Hierarchy</strong> — What actually dominates the viewport</li>
                <li><strong>Hero Imagery Type</strong> — Product screenshot vs illustration vs stock photo</li>
                <li><strong>Visual vs Structural Mismatch</strong> — When what you see differs from what the HTML says</li>
                <li><strong>5-Second Takeaway</strong> — What visitors conclude from a glance</li>
              </ul>
              <div className="p-3 bg-muted/50 rounded-lg mt-4">
                <p className="text-xs">
                  <strong>Why this matters:</strong> HTML structure and visual reality often diverge.
                  The H1 might say &quot;AI-Powered Platform&quot; but visually, a stock photo of people
                  in a meeting dominates the viewport. Structure can lie; visuals don&apos;t.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder cards showing intended structure */}
        <Card className="border-dashed opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <CardTitle className="text-base">Above-the-Fold Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Will show visual hierarchy breakdown with percentage of viewport attention per element.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              <CardTitle className="text-base">Hero Imagery Classification</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Will classify hero imagery and analyze what it communicates about positioning.
            </p>
          </CardContent>
        </Card>

        <Card className="border-dashed opacity-60">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              <CardTitle className="text-base">Visual vs Structural Mismatches</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground italic">
              Will identify where visual emphasis differs from structural emphasis (e.g., H1 says &quot;AI&quot; but hero shows generic team photo).
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // TODO: Implement actual visual analysis display when feature is built
  return (
    <div className="space-y-4 mt-4">
      {/* Actual implementation will go here */}
    </div>
  )
}
