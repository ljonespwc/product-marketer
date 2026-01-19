'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults } from '@/types/database'
import { CheckCircle, AlertTriangle, XCircle, Award } from 'lucide-react'

interface ProofAuditProps {
  results: ExtractionResults
}

// Score color helper
function getScoreColors(score: number) {
  if (score >= 90) return { text: 'text-emerald-600', bg: 'bg-emerald-50', bar: 'bg-emerald-500', border: 'border-emerald-200' }
  if (score >= 70) return { text: 'text-amber-600', bg: 'bg-amber-50', bar: 'bg-amber-500', border: 'border-amber-200' }
  if (score >= 40) return { text: 'text-orange-600', bg: 'bg-orange-50', bar: 'bg-orange-500', border: 'border-orange-200' }
  return { text: 'text-red-600', bg: 'bg-red-50', bar: 'bg-red-500', border: 'border-red-200' }
}

export function ProofAudit({ results }: ProofAuditProps) {
  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'strong':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'weak':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />
      case 'missing':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'strong': return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'weak': return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'missing': return 'bg-red-50 text-red-700 border-red-200'
      default: return ''
    }
  }

  const scoreColors = results.proof_score !== undefined ? getScoreColors(results.proof_score) : null

  return (
    <div className="space-y-4 mt-4">
      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-base">Proof Score</CardTitle>
            </div>
            {results.proof_score !== undefined && scoreColors && (
              <div className={`text-2xl font-bold ${scoreColors.text}`}>
                {results.proof_score}
                <span className="text-sm text-muted-foreground font-normal">/100</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {results.proof_score !== undefined && scoreColors ? (
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${scoreColors.bar}`}
                style={{ width: `${results.proof_score}%` }}
              />
            </div>
          ) : (
            <p className="text-muted-foreground italic">No proof score calculated</p>
          )}
        </CardContent>
      </Card>

      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <CardTitle className="text-base">Proof Points</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          {results.proof_points && results.proof_points.length > 0 ? (
            <div className="space-y-3">
              {results.proof_points.map((proof, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-xl ${getVerdictColor(proof.verdict)}`}
                >
                  <div className="flex items-start gap-3">
                    {getVerdictIcon(proof.verdict)}
                    <div className="flex-1">
                      <p className="font-medium text-sm">{proof.claim}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {proof.proof_type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          Specificity: {proof.specificity_score}/10
                        </span>
                        {proof.location && (
                          <span className="text-xs text-muted-foreground">
                            | {proof.location}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No proof points analyzed</p>
          )}
        </CardContent>
      </Card>

      {results.unsubstantiated_claims && results.unsubstantiated_claims.length > 0 && (
        <Card className="shadow-lg border-amber-200 bg-amber-50/80 backdrop-blur-sm">
          <CardHeader className="border-b border-amber-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <CardTitle className="text-base text-amber-800">Unsubstantiated Claims</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <ul className="space-y-2">
              {results.unsubstantiated_claims.map((claim, index) => (
                <li key={index} className="text-sm flex items-start gap-2 text-amber-900">
                  <XCircle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                  {claim}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
