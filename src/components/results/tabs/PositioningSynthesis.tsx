'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExtractionResults } from '@/types/database'
import { CitationList, SeverityBadge } from '../CitationTooltip'
import { AlertTriangle, Target, TrendingUp, TrendingDown, Sparkles, ArrowRight } from 'lucide-react'

interface PositioningSynthesisProps {
  results: ExtractionResults
}

// Confidence badge colors
function getConfidenceColors(confidence?: string) {
  switch (confidence) {
    case 'high': return 'bg-emerald-100 text-emerald-700 border-emerald-200'
    case 'medium': return 'bg-amber-100 text-amber-700 border-amber-200'
    case 'low': return 'bg-red-100 text-red-700 border-red-200'
    default: return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

export function PositioningSynthesis({ results }: PositioningSynthesisProps) {
  const hasExecutiveSummary = results.executive_summary &&
    (results.executive_summary.ten_second_takeaway ||
     results.executive_summary.three_key_strengths?.length ||
     results.executive_summary.three_key_weaknesses?.length)

  const hasStructuralMisalignments = results.structural_misalignments && results.structural_misalignments.length > 0

  // Fallback to legacy structural gaps if no new data
  const legacyStructuralGaps: string[] = []
  if (!hasStructuralMisalignments && results.critical_observations && Array.isArray(results.critical_observations)) {
    for (const obs of results.critical_observations) {
      if (typeof obs === 'object' && 'observation' in obs) {
        const text = obs.observation
        if (text.toLowerCase().includes('buried') ||
            text.toLowerCase().includes('h1') ||
            text.toLowerCase().includes('structural')) {
          legacyStructuralGaps.push(text)
        }
      }
    }
  }

  return (
    <div className="space-y-4 mt-4">
      {/* Executive Summary - New */}
      {hasExecutiveSummary && (
        <Card className="shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <CardHeader className="border-b border-orange-200">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-base">Executive Summary</CardTitle>
            </div>
            {results.executive_summary?.ten_second_takeaway && (
              <p className="text-sm font-medium text-orange-800 mt-2">
                {results.executive_summary.ten_second_takeaway}
              </p>
            )}
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Key Strengths */}
              {results.executive_summary?.three_key_strengths && results.executive_summary.three_key_strengths.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                    <TrendingUp className="h-4 w-4" />
                    Key Strengths
                  </div>
                  {results.executive_summary.three_key_strengths.map((item, index) => (
                    <div key={index} className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-sm text-emerald-900">{item.strength}</p>
                      {item.evidence && item.evidence.length > 0 && (
                        <CitationList
                          evidenceIds={item.evidence}
                          evidenceBank={results.evidence_bank}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Key Weaknesses */}
              {results.executive_summary?.three_key_weaknesses && results.executive_summary.three_key_weaknesses.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm font-medium text-red-700">
                    <TrendingDown className="h-4 w-4" />
                    Key Weaknesses
                  </div>
                  {results.executive_summary.three_key_weaknesses.map((item, index) => (
                    <div key={index} className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-red-900">{item.weakness}</p>
                        {item.severity && <SeverityBadge severity={item.severity} />}
                      </div>
                      {item.evidence && item.evidence.length > 0 && (
                        <CitationList
                          evidenceIds={item.evidence}
                          evidenceBank={results.evidence_bank}
                          className="mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="shadow-lg bg-white/90 backdrop-blur-sm">
        <CardHeader className="border-b border-orange-100">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-orange-500" />
            <CardTitle className="text-base">Positioning Statement</CardTitle>
            {results.positioning_confidence && (
              <Badge variant="outline" className={`ml-auto ${getConfidenceColors(results.positioning_confidence)}`}>
                {results.positioning_confidence} confidence
              </Badge>
            )}
          </div>
          <CardDescription>
            This is what your site communicates. Edit in the confirmation panel if it&apos;s not what you intended.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {results.positioning_statement ? (
            <div>
              <p className="text-lg">{results.positioning_statement}</p>
              {results.positioning_evidence && results.positioning_evidence.length > 0 && (
                <CitationList
                  evidenceIds={results.positioning_evidence}
                  evidenceBank={results.evidence_bank}
                  className="mt-2"
                />
              )}
            </div>
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
                      {item.evidence_ids && item.evidence_ids.length > 0 && (
                        <CitationList
                          evidenceIds={item.evidence_ids}
                          evidenceBank={results.evidence_bank}
                          className="mt-1"
                        />
                      )}
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

      {/* Structural Misalignments - Enhanced */}
      <Card className="shadow-lg border-amber-200 bg-amber-50/80 backdrop-blur-sm">
        <CardHeader className="border-b border-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <CardTitle className="text-base text-amber-800">Structural Misalignments</CardTitle>
          </div>
          <CardDescription className="text-amber-700">
            Where your best content is buried while generic claims are prominent. Your H1 real estate is valuable—is it working for you?
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          {hasStructuralMisalignments ? (
            <div className="space-y-3">
              {results.structural_misalignments!.map((misalignment, index) => (
                <div key={index} className="p-3 bg-white border border-amber-200 rounded-xl">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="text-sm font-medium text-amber-900">{misalignment.issue}</p>
                    <SeverityBadge severity={misalignment.severity} />
                  </div>
                  <div className="grid md:grid-cols-2 gap-3 mt-2">
                    <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-xs font-medium text-red-700 mb-1">What&apos;s in H1:</p>
                      <p className="text-sm text-red-900">&quot;{misalignment.whats_in_h1.text}&quot;</p>
                      {misalignment.whats_in_h1.evidence_id && (
                        <CitationList
                          evidenceIds={[misalignment.whats_in_h1.evidence_id]}
                          evidenceBank={results.evidence_bank}
                          className="mt-1"
                        />
                      )}
                    </div>
                    <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                      <p className="text-xs font-medium text-emerald-700 mb-1">
                        What&apos;s buried ({misalignment.whats_buried.location}):
                      </p>
                      <p className="text-sm text-emerald-900">&quot;{misalignment.whats_buried.text}&quot;</p>
                      {misalignment.whats_buried.evidence_id && (
                        <CitationList
                          evidenceIds={[misalignment.whats_buried.evidence_id]}
                          evidenceBank={results.evidence_bank}
                          className="mt-1"
                        />
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2 text-xs text-amber-700">
                    <ArrowRight className="h-3 w-3" />
                    Consider swapping these positions
                  </div>
                </div>
              ))}
            </div>
          ) : legacyStructuralGaps.length > 0 ? (
            <div className="space-y-3">
              {legacyStructuralGaps.map((gap, index) => (
                <div key={index} className="p-3 bg-white border border-amber-200 rounded-xl">
                  <p className="text-sm text-amber-900">{gap}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-amber-700 italic text-sm">
              No obvious structural misalignments detected. Your content hierarchy appears consistent with your positioning priorities.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
