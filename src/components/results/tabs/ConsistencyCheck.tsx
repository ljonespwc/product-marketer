'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults } from '@/types/database'
import { Repeat, Navigation, MessageSquare } from 'lucide-react'

interface ConsistencyCheckProps {
  results: ExtractionResults
}

// Score color helper
function getScoreColors(score: number) {
  if (score >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500', border: 'border-emerald-200' }
  if (score >= 70) return { text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500', border: 'border-amber-200' }
  if (score >= 40) return { text: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-500', border: 'border-orange-200' }
  return { text: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500', border: 'border-red-200' }
}

export function ConsistencyCheck({ results }: ConsistencyCheckProps) {
  const consistencyColors = results.overall_consistency_score !== undefined
    ? getScoreColors(results.overall_consistency_score)
    : null

  return (
    <div className="space-y-4 mt-4">
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Repeat className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-base">Overall Consistency</CardTitle>
            </div>
            {results.overall_consistency_score !== undefined && consistencyColors && (
              <div className={`text-2xl font-bold ${consistencyColors.text}`}>
                {results.overall_consistency_score}
                <span className="text-sm text-muted-foreground font-normal">/100</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {results.overall_consistency_score !== undefined && consistencyColors ? (
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${consistencyColors.bar}`}
                style={{ width: `${results.overall_consistency_score}%` }}
              />
            </div>
          ) : (
            <p className="text-muted-foreground italic">No consistency score calculated</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">Navigation & CTA Analysis</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {results.navigation_analysis ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Primary CTAs</p>
                <div className="flex flex-wrap gap-2">
                  {results.navigation_analysis.primary_ctas.map((cta, index) => (
                    <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-700">{cta}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">CTA Consistency</span>
                {(() => {
                  const ctaColors = getScoreColors(results.navigation_analysis.cta_consistency_score)
                  return (
                    <span className={`font-medium ${ctaColors.text}`}>
                      {results.navigation_analysis.cta_consistency_score}/100
                    </span>
                  )
                })()}
              </div>

              {results.navigation_analysis.nav_priority_alignment && (
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-sm font-medium mb-1 text-orange-800">Navigation Priority Alignment</p>
                  <p className="text-sm text-orange-700">
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

      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">Messaging Variants</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {results.messaging_variants && results.messaging_variants.length > 0 ? (
            <div className="space-y-4">
              {results.messaging_variants.map((variant, index) => {
                const variantColors = getScoreColors(variant.consistency_score)
                return (
                  <div key={index} className="border border-orange-100 rounded-xl p-3 bg-white/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{variant.concept}</span>
                      <span className={`text-sm font-medium ${variantColors.text}`}>
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
                )
              })}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No messaging variants found</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
