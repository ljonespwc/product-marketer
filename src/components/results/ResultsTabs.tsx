'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FullExtractionData } from '@/types/database'
import { PositioningSynthesis } from './tabs/PositioningSynthesis'
import { IcpExtraction } from './tabs/IcpExtraction'
import { ProofAudit } from './tabs/ProofAudit'
import { ConsistencyCheck } from './tabs/ConsistencyCheck'
import { UncomfortableObservations } from './tabs/UncomfortableObservations'

interface ResultsTabsProps {
  data: FullExtractionData
}

export function ResultsTabs({ data }: ResultsTabsProps) {
  const results = data.extraction_results

  if (!results) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">No results available</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="positioning" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="positioning" className="text-xs">Positioning</TabsTrigger>
        <TabsTrigger value="icp" className="text-xs">ICP</TabsTrigger>
        <TabsTrigger value="proof" className="text-xs">Proof</TabsTrigger>
        <TabsTrigger value="consistency" className="text-xs">Consistency</TabsTrigger>
        <TabsTrigger value="observations" className="text-xs">Observations</TabsTrigger>
      </TabsList>
      <TabsContent value="positioning">
        <PositioningSynthesis results={results} />
      </TabsContent>
      <TabsContent value="icp">
        <IcpExtraction results={results} />
      </TabsContent>
      <TabsContent value="proof">
        <ProofAudit results={results} />
      </TabsContent>
      <TabsContent value="consistency">
        <ConsistencyCheck results={results} />
      </TabsContent>
      <TabsContent value="observations">
        <UncomfortableObservations results={results} />
      </TabsContent>
    </Tabs>
  )
}
