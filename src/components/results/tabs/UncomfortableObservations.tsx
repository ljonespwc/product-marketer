'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults } from '@/types/database'
import { Eye, Target, AlertOctagon, Lightbulb } from 'lucide-react'

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

export function UncomfortableObservations({ results }: UncomfortableObservationsProps) {
  const specificityColors = results.specificity_score !== undefined
    ? getScoreColors(results.specificity_score)
    : null

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
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground mb-3">
              Claims that don&apos;t answer the customer&apos;s &quot;so what?&quot; question
            </p>
            <div className="space-y-3">
              {results.so_what_gaps.map((gap, index) => (
                <div key={index} className="border border-orange-100 rounded-xl p-3 bg-orange-50/50">
                  <p className="font-medium text-sm">&quot;{gap.claim}&quot;</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Missing: {gap.missing_context}
                  </p>
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
          </CardHeader>
          <CardContent className="pt-4">
            <p className="text-sm text-red-700 mb-3">
              Honest, blunt feedback on your positioning
            </p>
            <ul className="space-y-2">
              {results.critical_observations.map((observation, index) => (
                <li key={index} className="flex items-start gap-3 p-3 border border-red-200 rounded-xl bg-white">
                  <Lightbulb className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-red-900">{observation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
