import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FullExtractionData } from '@/types/database'
import { ResultsTabs } from '@/components/results/ResultsTabs'
import { ConfirmationPanel } from '@/components/results/ConfirmationPanel'
import { ResultsHeader } from '@/components/results/ResultsHeader'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ResultsPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Fetch session with related data
  const { data: session } = await supabase
    .from('extraction_sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!session) {
    redirect('/dashboard')
  }

  if (session.status !== 'complete') {
    redirect(`/extract/${id}`)
  }

  const [{ data: urls }, { data: results }, { data: confirmed }] = await Promise.all([
    supabase.from('extraction_urls').select('*').eq('session_id', id),
    supabase.from('extraction_results').select('*').eq('session_id', id).single(),
    supabase.from('confirmed_positioning').select('*').eq('session_id', id).single(),
  ])

  const fullData: FullExtractionData = {
    ...session,
    extraction_urls: urls || [],
    extraction_results: results || undefined,
    confirmed_positioning: confirmed || undefined,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <ResultsHeader
          sessionId={id}
          companyName={fullData.company_name}
          urlCount={fullData.extraction_urls.length}
        />

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ResultsTabs data={fullData} />
          </div>
          <div className="lg:col-span-1">
            <ConfirmationPanel
              sessionId={id}
              results={fullData.extraction_results}
              confirmed={fullData.confirmed_positioning}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
