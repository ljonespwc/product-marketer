'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionResults } from '@/types/database'
import { CheckCircle, AlertTriangle, XCircle, Award } from 'lucide-react'

interface ProofAuditProps {
  results: ExtractionResults
}

export function ProofAudit({ results }: ProofAuditProps) {
  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case 'strong':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'weak':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'missing':
        return <XCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'strong': return 'bg-green-500/10 text-green-700 border-green-200'
      case 'weak': return 'bg-yellow-500/10 text-yellow-700 border-yellow-200'
      case 'missing': return 'bg-red-500/10 text-red-700 border-red-200'
      default: return ''
    }
  }

  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              <CardTitle className="text-base">Proof Score</CardTitle>
            </div>
            {results.proof_score !== undefined && (
              <div className="text-2xl font-bold">
                {results.proof_score}
                <span className="text-sm text-muted-foreground font-normal">/100</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {results.proof_score !== undefined ? (
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all ${
                  results.proof_score >= 70 ? 'bg-green-500' :
                  results.proof_score >= 40 ? 'bg-yellow-500' : 'bg-destructive'
                }`}
                style={{ width: `${results.proof_score}%` }}
              />
            </div>
          ) : (
            <p className="text-muted-foreground italic">No proof score calculated</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Proof Points</CardTitle>
        </CardHeader>
        <CardContent>
          {results.proof_points && results.proof_points.length > 0 ? (
            <div className="space-y-3">
              {results.proof_points.map((proof, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg ${getVerdictColor(proof.verdict)}`}
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <CardTitle className="text-base">Unsubstantiated Claims</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {results.unsubstantiated_claims.map((claim, index) => (
                <li key={index} className="text-sm flex items-start gap-2">
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
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
