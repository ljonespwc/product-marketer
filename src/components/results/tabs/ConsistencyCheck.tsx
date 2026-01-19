'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults, MessagingVariant } from '@/types/database'
import { CitationList, SeverityBadge } from '../CitationTooltip'
import { Repeat, Navigation, MessageSquare, AlertOctagon, ArrowLeftRight, ExternalLink } from 'lucide-react'

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

// Format URL for display
function formatUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.pathname === '/' ? parsed.hostname : `${parsed.hostname}${parsed.pathname}`
  } catch {
    return url
  }
}

// MessagingVariant can have either enhanced object variants or legacy approach
// We need to handle both cases at runtime
type EnhancedVariantItem = {
  text: string
  page_url: string
  structural_level: string
  evidence_id?: string
}

// Check if variant items are enhanced (objects) or legacy (strings)
function isEnhancedVariantItem(item: unknown): item is EnhancedVariantItem {
  return typeof item === 'object' && item !== null && 'text' in item && 'page_url' in item
}

export function ConsistencyCheck({ results }: ConsistencyCheckProps) {
  const consistencyColors = results.overall_consistency_score !== undefined
    ? getScoreColors(results.overall_consistency_score)
    : null

  const hasContradictions = results.cross_page_contradictions && results.cross_page_contradictions.length > 0

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

      {/* Cross-Page Contradictions - NEW */}
      {hasContradictions && (
        <Card className="shadow-lg border-red-200 bg-red-50/80 backdrop-blur-sm">
          <CardHeader className="border-b border-red-200">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-red-600" />
              <CardTitle className="text-base text-red-800">Cross-Page Contradictions</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              Your pages say different things about the same topic. This confuses visitors and weakens positioning.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {results.cross_page_contradictions!.map((contradiction, index) => (
                <div key={index} className="p-4 bg-white border border-red-200 rounded-xl">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <ArrowLeftRight className="h-4 w-4 text-red-600" />
                      <span className="font-medium text-red-900">{contradiction.topic}</span>
                    </div>
                    <SeverityBadge severity={contradiction.severity === 'moderate' ? 'medium' : contradiction.severity === 'minor' ? 'low' : 'critical'} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-3">
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-600 mb-1 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {formatUrl(contradiction.page_a.url)}
                      </p>
                      <p className="text-sm text-red-900">&quot;{contradiction.page_a.says}&quot;</p>
                      {contradiction.page_a.evidence_id && (
                        <CitationList
                          evidenceIds={[contradiction.page_a.evidence_id]}
                          evidenceBank={results.evidence_bank}
                          className="mt-2"
                        />
                      )}
                    </div>

                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs text-red-600 mb-1 flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {formatUrl(contradiction.page_b.url)}
                      </p>
                      <p className="text-sm text-red-900">&quot;{contradiction.page_b.says}&quot;</p>
                      {contradiction.page_b.evidence_id && (
                        <CitationList
                          evidenceIds={[contradiction.page_b.evidence_id]}
                          evidenceBank={results.evidence_bank}
                          className="mt-2"
                        />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
          <CardDescription>
            How key concepts are expressed across different pages. Low consistency = confused messaging.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.messaging_variants && results.messaging_variants.length > 0 ? (
            <div className="space-y-4">
              {results.messaging_variants.map((variant, index) => {
                const variantColors = getScoreColors(variant.consistency_score)
                const firstItem = variant.variants[0]
                const isEnhanced = firstItem && isEnhancedVariantItem(firstItem)

                return (
                  <div key={index} className="border border-orange-100 rounded-xl p-3 bg-white/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{variant.concept}</span>
                      <span className={`text-sm font-medium ${variantColors.text}`}>
                        {variant.consistency_score}/100
                      </span>
                    </div>
                    <div className="space-y-2">
                      {isEnhanced ? (
                        // Enhanced variants with page info
                        (variant.variants as EnhancedVariantItem[]).map((v, i) => (
                          <div key={i} className="p-2 bg-orange-50/50 rounded-lg">
                            <p className="text-sm text-gray-900">&quot;{v.text}&quot;</p>
                            <div className="flex items-center justify-between mt-1">
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" />
                                {formatUrl(v.page_url)}
                                <Badge variant="outline" className="ml-1 text-xs">{v.structural_level}</Badge>
                              </span>
                              {v.evidence_id && (
                                <CitationList
                                  evidenceIds={[v.evidence_id]}
                                  evidenceBank={results.evidence_bank}
                                />
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        // Legacy string variants - handle the case where variants might still be strings
                        variant.variants.map((v, i) => {
                          const text = typeof v === 'string' ? v : (v as EnhancedVariantItem).text
                          return (
                            <p key={i} className="text-xs text-muted-foreground p-2 bg-orange-50/50 rounded">
                              &quot;{text}&quot;
                            </p>
                          )
                        })
                      )}
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
