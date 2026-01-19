import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProcessingView } from '@/components/extract/ProcessingView'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProcessingPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <ProcessingView sessionId={id} />
}
