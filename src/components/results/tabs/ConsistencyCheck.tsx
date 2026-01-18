'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults } from '@/types/database'
import { Repeat, Navigation, MessageSquare } from 'lucide-react'

interface ConsistencyCheckProps {
  results: ExtractionResults
}

export function ConsistencyCheck({ results }: ConsistencyCheckProps) {
  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-green-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-destructive'
  }

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5" />
              <CardTitle className="text-base">Overall Consistency</CardTitle>
            </div>
            {results.overall_consistency_score !== undefined && (
              <div className={`text-2xl font-bold ${getScoreColor(results.overall_consistency_score)}`}>
                {results.overall_consistency_score}
                <span className="text-sm text-muted-foreground font-normal">/100</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {results.overall_consistency_score !== undefined ? (
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  results.overall_consistency_score >= 70 ? 'bg-green-500' :
                  results.overall_consistency_score >= 40 ? 'bg-yellow-500' : 'bg-destructive'
                }`}
                style={{ width: `${results.overall_consistency_score}%` }}
              />
            </div>
          ) : (
            <p className="text-muted-foreground italic">No consistency score calculated</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            <CardTitle className="text-base">Navigation & CTA Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {results.navigation_analysis ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Primary CTAs</p>
                <div className="flex flex-wrap gap-2">
                  {results.navigation_analysis.primary_ctas.map((cta, index) => (
                    <Badge key={index} variant="secondary">{cta}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">CTA Consistency</span>
                <span className={`font-medium ${getScoreColor(results.navigation_analysis.cta_consistency_score)}`}>
                  {results.navigation_analysis.cta_consistency_score}/100
                </span>
              </div>

              {results.navigation_analysis.nav_priority_alignment && (
                <div>
                  <p className="text-sm font-medium mb-1">Navigation Priority Alignment</p>
                  <p className="text-sm text-muted-foreground">
                    {results.navigation_analysis.nav_priority_alignment}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No navigation analysis available</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            <CardTitle className="text-base">Messaging Variants</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {results.messaging_variants && results.messaging_variants.length > 0 ? (
            <div className="space-y-4">
              {results.messaging_variants.map((variant, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{variant.concept}</span>
                    <span className={`text-sm ${getScoreColor(variant.consistency_score)}`}>
                      {variant.consistency_score}/100
                    </span>
                  </div>
                  <div className="space-y-1">
                    {variant.variants.map((v, i) => (
                      <p key={i} className="text-xs text-muted-foreground">
                        &quot;{v}&quot;
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No messaging variants found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
