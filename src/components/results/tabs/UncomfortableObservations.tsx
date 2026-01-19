'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults, CriticalObservation } from '@/types/database'
import { CitationList, SeverityBadge, EffortImpactBadge } from '../CitationTooltip'
import { Eye, Target, AlertOctagon, Lightbulb, Zap, Wrench, FileText, Shield, ChevronRight } from 'lucide-react'

interface UncomfortableObservationsProps {
  results: ExtractionResults
}

// Score color helper
function getScoreColors(score: number) {
  if (score >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-200' }
  if (score >= 70) return { text: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-200' }
  if (score >= 40) return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' }
  return { text: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' }
}

// Differentiation strength badge colors
function getDifferentiationColors(strength?: string) {
  switch (strength) {
    case 'strong': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'moderate': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'weak': return 'bg-orange-100 text-orange-700 border-orange-200'
    case 'generic': return 'bg-red-100 text-red-700 border-red-200'
    default: return ''
  }
}

// Category icon for recommendations
function getCategoryIcon(category: string) {
  switch (category) {
    case 'quick_win': return <Zap className="h-4 w-4 text-emerald-500" />
    case 'structural_change': return <Wrench className="h-4 w-4 text-orange-500" />
    case 'content_gap': return <FileText className="h-4 w-4 text-blue-500" />
    case 'proof_needed': return <Shield className="h-4 w-4 text-amber-500" />
    default: return <ChevronRight className="h-4 w-4" />
  }
}

// Category colors
function getCategoryColors(category: string) {
  switch (category) {
    case 'quick_win': return 'bg-emerald-50 border-emerald-200 text-emerald-800'
    case 'structural_change': return 'bg-orange-50 border-orange-200 text-orange-800'
    case 'content_gap': return 'bg-blue-50 border-blue-200 text-blue-800'
    case 'proof_needed': return 'bg-amber-50 border-amber-200 text-amber-800'
    default: return 'bg-gray-50 border-gray-200 text-gray-800'
  }
}

// Check if critical observations are enhanced (objects) or legacy (strings)
function isEnhancedObservation(obs: CriticalObservation | string): obs is CriticalObservation {
  return typeof obs === 'object' && 'observation' in obs
}

export function UncomfortableObservations({ results }: UncomfortableObservationsProps) {
  const specificityColors = results.specificity_score !== undefined
    ? getScoreColors(results.specificity_score)
    : null

  const hasRecommendations = results.actionable_recommendations && results.actionable_recommendations.length > 0

  // Sort recommendations by priority and category (quick_wins first)
  const sortedRecommendations = hasRecommendations
    ? [...results.actionable_recommendations!].sort((a, b) => {
        // Quick wins first
        if (a.category === 'quick_win' && b.category !== 'quick_win') return -1
        if (b.category === 'quick_win' && a.category !== 'quick_win') return 1
        // Then by priority
        return a.priority - b.priority
      })
    : []

  return (
    <div className="space-y-4 mt-4">
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">10-Second Takeaway</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {results.ten_second_takeaway ? (
            <p className="text-lg font-medium">{results.ten_second_takeaway}</p>
          ) : (
            <p className="text-muted-foreground italic">
              What would a visitor remember after 10 seconds on your site?
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid sm:grid-cols-2 gap-4">
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2 border-b border-orange-100">
            <CardTitle className="text-base">Specificity Score</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {results.specificity_score !== undefined && specificityColors ? (
              <div className={`p-4 rounded-xl ${specificityColors.bg} ${specificityColors.border} border`}>
                <div className={`text-3xl font-bold ${specificityColors.text}`}>
                  {results.specificity_score}
                  <span className="text-sm text-muted-foreground font-normal">/100</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {results.specificity_score >= 90 ? 'Highly specific and concrete' :
                   results.specificity_score >= 70 ? 'Specific and concrete' :
                   results.specificity_score >= 40 ? 'Could be more specific' :
                   'Too vague and generic'}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground italic">Not calculated</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="pb-2 border-b border-orange-100">
            <CardTitle className="text-base">Differentiation</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {results.differentiation_strength ? (
              <Badge
                variant="outline"
                className={`text-lg px-4 py-2 ${getDifferentiationColors(results.differentiation_strength)}`}
              >
                {results.differentiation_strength.charAt(0).toUpperCase() + results.differentiation_strength.slice(1)}
              </Badge>
            ) : (
              <p className="text-muted-foreground italic">Not assessed</p>
            )}
          </CardContent>
        </Card>
      </div>

      {results.so_what_gaps && results.so_what_gaps.length > 0 && (
        <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
          <CardHeader className="border-b border-orange-100">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-base">&quot;So What?&quot; Gaps</CardTitle>
            </div>
            <CardDescription>
              Claims that don&apos;t answer the customer&apos;s &quot;so what?&quot; question. The higher the severity, the more prominent the claim.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {results.so_what_gaps.map((gap, index) => (
                <div key={index} className="border border-orange-100 rounded-xl p-3 bg-orange-50/50">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-sm">&quot;{gap.claim}&quot;</p>
                    {gap.severity && <SeverityBadge severity={gap.severity} />}
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Missing: {gap.missing_context}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    {gap.structural_level && (
                      <Badge variant="outline" className="text-xs">{gap.structural_level}</Badge>
                    )}
                    {gap.evidence_id && (
                      <CitationList
                        evidenceIds={[gap.evidence_id]}
                        evidenceBank={results.evidence_bank}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.critical_observations && results.critical_observations.length > 0 && (
        <Card className="shadow-lg border-red-200 bg-red-50/80 backdrop-blur-sm">
          <CardHeader className="border-b border-red-200">
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-red-600" />
              <CardTitle className="text-base text-red-800">Critical Observations</CardTitle>
            </div>
            <CardDescription className="text-red-700">
              Honest, blunt feedback on your positioning. Sorted by severity.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {results.critical_observations.map((observation, index) => {
                const isEnhanced = isEnhancedObservation(observation)

                if (isEnhanced) {
                  return (
                    <li key={index} className="p-3 border border-red-200 rounded-xl bg-white">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <Lightbulb className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-red-900">{observation.observation}</span>
                        </div>
                        <SeverityBadge severity={observation.severity} />
                      </div>
                      {observation.evidence_ids && observation.evidence_ids.length > 0 && (
                        <CitationList
                          evidenceIds={observation.evidence_ids}
                          evidenceBank={results.evidence_bank}
                          className="mt-2 ml-7"
                        />
                      )}
                      {observation.category && (
                        <Badge variant="outline" className="mt-2 ml-7 text-xs capitalize">
                          {observation.category.replace('_', ' ')}
                        </Badge>
                      )}
                    </li>
                  )
                }

                // Legacy string observation
                return (
                  <li key={index} className="flex items-start gap-3 p-3 border border-red-200 rounded-xl bg-white">
                    <Lightbulb className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-900">{observation as unknown as string}</span>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Actionable Recommendations - NEW */}
      {hasRecommendations && (
        <Card className="shadow-lg border-emerald-200 bg-emerald-50/80 backdrop-blur-sm">
          <CardHeader className="border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-emerald-600" />
              <CardTitle className="text-base text-emerald-800">Actionable Recommendations</CardTitle>
            </div>
            <CardDescription className="text-emerald-700">
              Prioritized fixes. Quick wins (high impact, low effort) are listed first.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-3">
              {sortedRecommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 border rounded-xl ${getCategoryColors(rec.category)}`}
                >
                  <div className="flex items-start gap-3">
                    {getCategoryIcon(rec.category)}
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-medium text-sm">{rec.recommendation}</p>
                        <Badge variant="outline" className="text-xs flex-shrink-0">
                          Priority {rec.priority}
                        </Badge>
                      </div>

                      <p className="text-sm mt-2 opacity-80">{rec.rationale}</p>

                      <div className="flex items-center justify-between mt-3">
                        <EffortImpactBadge effort={rec.effort} impact={rec.impact} />
                        {rec.evidence_ids && rec.evidence_ids.length > 0 && (
                          <CitationList
                            evidenceIds={rec.evidence_ids}
                            evidenceBank={results.evidence_bank}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
