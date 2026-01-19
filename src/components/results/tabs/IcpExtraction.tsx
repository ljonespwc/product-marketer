'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExtractionResults } from '@/types/database'
import { User, Users, AlertCircle, Navigation, MousePointerClick } from 'lucide-react'

interface IcpExtractionProps {
  results: ExtractionResults
}

// Score color helper
function getScoreColors(score: number) {
  if (score >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500' }
  if (score >= 70) return { text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500' }
  if (score >= 40) return { text: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-500' }
  return { text: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500' }
}

export function IcpExtraction({ results }: IcpExtractionProps) {
  return (
    <div className="space-y-4 mt-4">
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">Primary Persona</CardTitle>
          </div>
          <CardDescription>
            Your site appears to be targeting this buyer. Does this match your actual ICP?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.primary_persona ? (
            <div className="space-y-3">
              <div>
                <Badge className="text-base px-3 py-1 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white">
                  {results.primary_persona.title}
                </Badge>
                {results.primary_persona.seniority && (
                  <Badge variant="outline" className="ml-2 border-orange-200">
                    {results.primary_persona.seniority}
                  </Badge>
                )}
                {results.primary_persona.industry && (
                  <Badge variant="outline" className="ml-2 border-orange-200">
                    {results.primary_persona.industry}
                  </Badge>
                )}
              </div>

              {results.primary_persona.pain_points.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Pain Points</p>
                  <ul className="space-y-1">
                    {results.primary_persona.pain_points.map((pain, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-red-500 mt-0.5">-</span>
                        {pain}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {results.primary_persona.desired_outcomes.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Desired Outcomes</p>
                  <ul className="space-y-1">
                    {results.primary_persona.desired_outcomes.map((outcome, i) => (
                      <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                        <span className="text-emerald-500 mt-0.5">+</span>
                        {outcome}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No primary persona identified</p>
          )}
        </CardContent>
      </Card>

      {results.secondary_personas && results.secondary_personas.length > 0 && (
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-base">Secondary Personas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-4">
              {results.secondary_personas.map((persona, index) => (
                <div key={index}>
                  <div className="space-y-2">
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700">{persona.title}</Badge>
                    {persona.pain_points.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Pain points: {persona.pain_points.join(', ')}
                      </p>
                    )}
                  </div>
                  {index < results.secondary_personas!.length - 1 && (
                    <Separator className="my-3 bg-orange-100" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">Pain Points (Aggregated)</CardTitle>
          </div>
          <CardDescription>
            Problems your site claims to solve. Are these the pain points your buyers actually feel?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.pain_points && results.pain_points.length > 0 ? (
            <div className="space-y-2">
              {results.pain_points.map((point, index) => (
                <div key={index} className="flex items-start justify-between gap-4 p-3 border border-orange-100 rounded-xl bg-white/50">
                  <span className="text-sm">{point.pain}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs border-orange-200 text-orange-700">
                      {point.frequency}x mentioned
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No pain points extracted</p>
          )}
        </CardContent>
      </Card>

      {/* Navigation Analysis - PRD Section 4, Lines 265-280 */}
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <Navigation className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">Navigation Analysis</CardTitle>
          </div>
          <CardDescription>
            Top-level navigation items reveal strategic priorities. What&apos;s missing is also a signal.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.navigation_analysis ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Primary CTAs Found</p>
                <div className="flex flex-wrap gap-2">
                  {results.navigation_analysis.primary_ctas.map((cta, i) => (
                    <Badge key={i} variant="secondary" className="bg-orange-100 text-orange-700">{cta}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div>
                  <p className="text-sm font-medium">CTA Consistency</p>
                  {(() => {
                    const colors = getScoreColors(results.navigation_analysis.cta_consistency_score)
                    return (
                      <p className={`text-2xl font-bold ${colors.text}`}>
                        {results.navigation_analysis.cta_consistency_score}
                        <span className="text-sm text-muted-foreground font-normal">/100</span>
                      </p>
                    )
                  })()}
                </div>
              </div>

              {results.navigation_analysis.nav_priority_alignment && (
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="text-sm font-medium mb-1 text-orange-800">Navigation Insights</p>
                  <p className="text-sm text-orange-700">
                    {results.navigation_analysis.nav_priority_alignment}
                  </p>
                </div>
              )}

              {/* PRD: Flag missing nav items like "Why Us", "Security", "Pricing" */}
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Missing from nav might signal:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>No &quot;Why Us&quot; or &quot;vs. Competitors&quot; = weak differentiation confidence</li>
                  <li>No &quot;Pricing&quot; = friction/enterprise signal</li>
                  <li>No &quot;Customers&quot; or &quot;Case Studies&quot; = proof gap</li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No navigation analysis available</p>
          )}
        </CardContent>
      </Card>

      {/* CTA Analysis - PRD Section 4, Lines 284-296 */}
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <MousePointerClick className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">CTA Analysis</CardTitle>
          </div>
          <CardDescription>
            Your primary CTA reveals your conversion strategy and confidence level.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.navigation_analysis?.primary_ctas && results.navigation_analysis.primary_ctas.length > 0 ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Primary CTA Signal</p>
                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                  <p className="font-medium text-orange-800">{results.navigation_analysis.primary_ctas[0]}</p>
                  <p className="text-sm text-orange-700 mt-1">
                    {results.navigation_analysis.primary_ctas[0]?.toLowerCase().includes('free') ||
                     results.navigation_analysis.primary_ctas[0]?.toLowerCase().includes('start') ||
                     results.navigation_analysis.primary_ctas[0]?.toLowerCase().includes('try')
                      ? '-> PLG signal: Self-serve confidence, low friction'
                      : results.navigation_analysis.primary_ctas[0]?.toLowerCase().includes('demo') ||
                        results.navigation_analysis.primary_ctas[0]?.toLowerCase().includes('book')
                      ? '-> Sales-led signal: Higher friction, enterprise or complex sale'
                      : results.navigation_analysis.primary_ctas[0]?.toLowerCase().includes('contact')
                      ? '-> Enterprise signal: High-touch, unclear value prop, or complex sale'
                      : '-> Analyze CTA text for conversion strategy signal'}
                  </p>
                </div>
              </div>

              {/* PRD: Consistency check - does CTA match messaging? */}
              <div className="text-xs text-muted-foreground border-t border-orange-100 pt-3">
                <p className="font-medium mb-1">Consistency Check:</p>
                <p>Does your CTA match your messaging? &quot;Start Free Trial&quot; + enterprise claims = mismatch.</p>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground italic">No CTA data extracted</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
