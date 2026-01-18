import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { FullExtractionData } from '@/types/database'
import { ResultsTabs } from '@/components/results/ResultsTabs'
import { ConfirmationPanel } from '@/components/results/ConfirmationPanel'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h1 className="text-2xl font-bold">{fullData.company_name}</h1>
          <p className="text-muted-foreground">
            Positioning analysis from {fullData.extraction_urls.length} pages
          </p>
        </div>

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
