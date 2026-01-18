import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// GET /api/extractions/[id] - Get session with URLs
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: session, error: sessionError } = await supabase
    .from('extraction_sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const { data: urls } = await supabase
    .from('extraction_urls')
    .select('*')
    .eq('session_id', id)
    .order('created_at', { ascending: true })

  return NextResponse.json({
    ...session,
    extraction_urls: urls || [],
  })
}
