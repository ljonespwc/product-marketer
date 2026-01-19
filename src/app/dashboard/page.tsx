import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { SessionCard } from '@/components/dashboard/SessionCard'
import { ExtractionSession } from '@/types/database'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: sessions } = await supabase
    .from('extraction_sessions')
    .select('*')
    .order('created_at', { ascending: false })

  const typedSessions = (sessions || []) as ExtractionSession[]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">Your Extractions</h1>
            <p className="text-muted-foreground">
              Analyze and mirror your website positioning
            </p>
          </div>
          <Link href="/extract/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Extraction
            </Button>
          </Link>
        </div>

        {typedSessions.length === 0 ? (
          <div className="text-center py-12 border rounded-2xl bg-white/50 shadow-lg">
            <h3 className="text-lg font-medium mb-2">No extractions yet</h3>
            <p className="text-muted-foreground mb-4">
              Get started by analyzing your first website
            </p>
            <Link href="/extract/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Extraction
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {typedSessions.map((session) => (
              <SessionCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
