import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { NewExtractionForm } from '@/components/extract/NewExtractionForm'

export default async function NewExtractionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return <NewExtractionForm />
}
