'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExtractionResults } from '@/types/database'
import { AlertTriangle, Target } from 'lucide-react'

interface PositioningSynthesisProps {
  results: ExtractionResults
}

export function PositioningSynthesis({ results }: PositioningSynthesisProps) {
  // Derive structural emphasis gaps from critical observations that mention structural issues
  // PRD specifies: Gap Type | What Should Be Emphasized | Where It Actually Is | Severity
  // For now, we surface this from critical_observations until we add dedicated schema field
  const structuralGaps = results.critical_observations?.filter(obs =>
    obs.toLowerCase().includes('buried') ||
    obs.toLowerCase().includes('h1') ||
    obs.toLowerCase().includes('h2') ||
    obs.toLowerCase().includes('body text') ||
    obs.toLowerCase().includes('paragraph') ||
    obs.toLowerCase().includes('navigation') ||
    obs.toLowerCase().includes('structural')
  ) || []

  return (
    <div className="space-y-4 mt-4">
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">Positioning Statement</CardTitle>
          </div>
          <CardDescription>
            This is what your site communicates. Edit in the confirmation panel if it&apos;s not what you intended.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.positioning_statement ? (
            <p className="text-lg">{results.positioning_statement}</p>
          ) : (
            <p className="text-muted-foreground italic">No positioning statement extracted</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <CardTitle className="text-base">Category Claimed</CardTitle>
          <CardDescription>
            Based on your messaging, you&apos;re positioning as this category. Is this where you want to compete?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.category_claimed ? (
            <Badge className="text-base px-4 py-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white">
              {results.category_claimed}
            </Badge>
          ) : (
            <p className="text-muted-foreground italic">No category identified</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <CardTitle className="text-base">Value Hierarchy</CardTitle>
          <CardDescription>
            Ranked by structural prominence: H1s = highest weight, H2s = secondary, body text = lowest.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.value_hierarchy && results.value_hierarchy.length > 0 ? (
            <div className="space-y-3">
              {results.value_hierarchy.map((item, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white flex items-center justify-center text-sm font-medium">
                      {item.rank}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.value_proposition}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          Emphasis: {item.emphasis_score}/10
                        </span>
                        {item.page_appearances && item.page_appearances.length > 0 && (
                          <>
                            <Separator orientation="vertical" className="h-3" />
                            <span className="text-xs text-muted-foreground">
                              Found on {item.page_appearances.length} page(s)
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  {index < results.value_hierarchy!.length - 1 && (
                    <Separator className="my-3 bg-orange-100" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No value hierarchy extracted</p>
          )}
        </CardContent>
      </Card>

      {/* Structural Emphasis Gaps - PRD Section 4, Lines 201-212 */}
      <Card className="shadow-lg border-amber-200 bg-amber-50/80 backdrop-blur-sm">
        <CardHeader className="border-b border-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base text-amber-800">Structural Emphasis Gaps</CardTitle>
          </div>
          <CardDescription className="text-amber-700">
            Where your content hierarchy doesn&apos;t match apparent strategy. If differentiation is in body text while generic claims are H1, that&apos;s a structural positioning mistake.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {structuralGaps.length > 0 ? (
            <div className="space-y-3">
              {structuralGaps.map((gap, index) => (
                <div key={index} className="p-3 bg-white border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-900">{gap}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-amber-700 italic text-sm">
              No obvious structural emphasis gaps detected. Your content hierarchy appears consistent with your positioning priorities.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
