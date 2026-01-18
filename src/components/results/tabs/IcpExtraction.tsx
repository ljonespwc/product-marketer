'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExtractionResults } from '@/types/database'
import { User, Users, AlertCircle } from 'lucide-react'

interface IcpExtractionProps {
  results: ExtractionResults
}

export function IcpExtraction({ results }: IcpExtractionProps) {
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle className="text-base">Primary Persona</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {results.primary_persona ? (
            <div className="space-y-3">
              <div>
                <Badge variant="default" className="text-base px-3 py-1">
                  {results.primary_persona.title}
                </Badge>
                {results.primary_persona.seniority && (
                  <Badge variant="outline" className="ml-2">
                    {results.primary_persona.seniority}
                  </Badge>
                )}
                {results.primary_persona.industry && (
                  <Badge variant="outline" className="ml-2">
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
                        <span className="text-destructive mt-0.5">-</span>
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
                        <span className="text-green-500 mt-0.5">+</span>
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
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle className="text-base">Secondary Personas</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.secondary_personas.map((persona, index) => (
                <div key={index}>
                  <div className="space-y-2">
                    <Badge variant="secondary">{persona.title}</Badge>
                    {persona.pain_points.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Pain points: {persona.pain_points.join(', ')}
                      </p>
                    )}
                  </div>
                  {index < results.secondary_personas!.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <CardTitle className="text-base">Pain Points (Aggregated)</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {results.pain_points && results.pain_points.length > 0 ? (
            <div className="space-y-2">
              {results.pain_points.map((point, index) => (
                <div key={index} className="flex items-start justify-between gap-4 p-2 border rounded">
                  <span className="text-sm">{point.pain}</span>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Badge variant="outline" className="text-xs">
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
    </div>
  )
}
