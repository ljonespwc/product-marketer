'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults } from '@/types/database'
import { Eye, Target, AlertOctagon, Lightbulb } from 'lucide-react'

interface UncomfortableObservationsProps {
  results: ExtractionResults
}

export function UncomfortableObservations({ results }: UncomfortableObservationsProps) {
  const getDifferentiationColor = (strength?: string) => {
    switch (strength) {
      case 'strong': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'moderate': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'weak': return 'bg-orange-500/10 text-orange-700 border-orange-200'
      case 'generic': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return ''
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            <CardTitle className="text-base">10-Second Takeaway</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
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
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Specificity Score</CardTitle>
          </CardHeader>
          <CardContent>
            {results.specificity_score !== undefined ? (
              <div>
                <div className="text-3xl font-bold">
                  {results.specificity_score}
                  <span className="text-sm text-muted-foreground font-normal">/100</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {results.specificity_score >= 70 ? 'Specific and concrete' :
                   results.specificity_score >= 40 ? 'Could be more specific' :
                   'Too vague and generic'}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground italic">Not calculated</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Differentiation</CardTitle>
          </CardHeader>
          <CardContent>
            {results.differentiation_strength ? (
              <Badge
                variant="outline"
                className={`text-lg px-4 py-2 ${getDifferentiationColor(results.differentiation_strength)}`}
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              <CardTitle className="text-base">&quot;So What?&quot; Gaps</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Claims that don&apos;t answer the customer&apos;s &quot;so what?&quot; question
            </p>
            <div className="space-y-3">
              {results.so_what_gaps.map((gap, index) => (
                <div key={index} className="border rounded-lg p-3 bg-muted/20">
                  <p className="font-medium text-sm">&quot;{gap.claim}&quot;</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Missing: {gap.missing_context}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.critical_observations && results.critical_observations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-destructive" />
              <CardTitle className="text-base">Critical Observations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-3">
              Honest, blunt feedback on your positioning
            </p>
            <ul className="space-y-2">
              {results.critical_observations.map((observation, index) => (
                <li key={index} className="flex items-start gap-3 p-3 border rounded-lg bg-destructive/5">
                  <Lightbulb className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{observation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
