'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { FullExtractionData } from '@/types/database'
import { PositioningSynthesis } from './tabs/PositioningSynthesis'
import { IcpExtraction } from './tabs/IcpExtraction'
import { ProofAudit } from './tabs/ProofAudit'
import { ConsistencyCheck } from './tabs/ConsistencyCheck'
import { UncomfortableObservations } from './tabs/UncomfortableObservations'
import { VisualRealityCheck } from './tabs/VisualRealityCheck'
import { CustomerVoiceAnalysis } from './tabs/CustomerVoiceAnalysis'

interface ResultsTabsProps {
  data: FullExtractionData
}

export function ResultsTabs({ data }: ResultsTabsProps) {
  const results = data.extraction_results

  if (!results) {
    return (
      <div className="text-center py-12 border rounded-2xl bg-white/50 shadow-lg">
        <p className="text-muted-foreground">No results available</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="positioning" className="w-full">
      {/* PRD specifies 7 tabs - 5 core + 2 optional enrichment (Visual, Customer Voice) */}
      <TabsList className="grid w-full grid-cols-7 bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-lg">
        <TabsTrigger value="positioning" className="text-xs px-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:via-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Positioning</TabsTrigger>
        <TabsTrigger value="icp" className="text-xs px-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:via-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">ICP</TabsTrigger>
        <TabsTrigger value="proof" className="text-xs px-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:via-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Proof</TabsTrigger>
        <TabsTrigger value="consistency" className="text-xs px-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:via-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Consistency</TabsTrigger>
        <TabsTrigger value="observations" className="text-xs px-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:via-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Observations</TabsTrigger>
        <TabsTrigger value="visual" className="text-xs px-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:via-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Visual</TabsTrigger>
        <TabsTrigger value="voice" className="text-xs px-1 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:via-orange-500 data-[state=active]:to-amber-500 data-[state=active]:text-white">Voice</TabsTrigger>
      </TabsList>

      {/* Tab 1: Positioning Synthesis - PRD Lines 158-212 */}
      <TabsContent value="positioning">
        <PositioningSynthesis results={results} />
      </TabsContent>

      {/* Tab 2: ICP Extraction - PRD Lines 215-298 */}
      <TabsContent value="icp">
        <IcpExtraction results={results} />
      </TabsContent>

      {/* Tab 3: Proof & Credibility Audit - PRD Lines 300-334 */}
      <TabsContent value="proof">
        <ProofAudit results={results} />
      </TabsContent>

      {/* Tab 4: Messaging Consistency Check - PRD Lines 336-353 */}
      <TabsContent value="consistency">
        <ConsistencyCheck results={results} />
      </TabsContent>

      {/* Tab 5: Uncomfortable Observations - PRD Lines 355-410 */}
      <TabsContent value="observations">
        <UncomfortableObservations results={results} />
      </TabsContent>

      {/* Tab 6: Visual Reality Check (Screenshot Analysis) - PRD Lines 412-450 */}
      {/* PHASE 2: Requires Puppeteer/Playwright + Gemini Vision integration */}
      <TabsContent value="visual">
        <VisualRealityCheck results={results} />
      </TabsContent>

      {/* Tab 7: Customer Voice Analysis (G2/Capterra) - PRD Lines 452-511 */}
      {/* PHASE 2: Requires G2/Capterra scraping + review analysis */}
      <TabsContent value="voice">
        <CustomerVoiceAnalysis results={results} />
      </TabsContent>
    </Tabs>
  )
}
