'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ExtractionResults } from '@/types/database'

interface PositioningSynthesisProps {
  results: ExtractionResults
}

export function PositioningSynthesis({ results }: PositioningSynthesisProps) {
  return (
    <div className="space-y-4 mt-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Positioning Statement</CardTitle>
        </CardHeader>
        <CardContent>
          {results.positioning_statement ? (
            <p className="text-lg">{results.positioning_statement}</p>
          ) : (
            <p className="text-muted-foreground italic">No positioning statement extracted</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Category Claimed</CardTitle>
        </CardHeader>
        <CardContent>
          {results.category_claimed ? (
            <Badge variant="secondary" className="text-base px-3 py-1">
              {results.category_claimed}
            </Badge>
          ) : (
            <p className="text-muted-foreground italic">No category identified</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Value Hierarchy</CardTitle>
        </CardHeader>
        <CardContent>
          {results.value_hierarchy && results.value_hierarchy.length > 0 ? (
            <div className="space-y-3">
              {results.value_hierarchy.map((item, index) => (
                <div key={index}>
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium">
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
                    </div>
                  </div>
                  {index < results.value_hierarchy!.length - 1 && (
                    <Separator className="my-3" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground italic">No value hierarchy extracted</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
