import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { CreateExtractionRequest } from '@/types/database'

// GET /api/extractions - List user's sessions
export async function GET() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: sessions, error } = await supabase
    .from('extraction_sessions')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(sessions)
}

// POST /api/extractions - Create session + URLs
export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body: CreateExtractionRequest = await request.json()

  if (!body.company_name || !body.urls || body.urls.length < 3) {
    return NextResponse.json(
      { error: 'Company name and at least 3 URLs required' },
      { status: 400 }
    )
  }

  // Create session
  const { data: session, error: sessionError } = await supabase
    .from('extraction_sessions')
    .insert({
      user_id: user.id,
      name: body.name, // Optional session name (PRD Step 2, Line 85)
      company_name: body.company_name,
      status: 'pending',
    })
    .select()
    .single()

  if (sessionError) {
    return NextResponse.json({ error: sessionError.message }, { status: 500 })
  }

  // Create URLs
  const urlInserts = body.urls.map(url => ({
    session_id: session.id,
    url,
    scrape_status: 'pending',
  }))

  const { error: urlError } = await supabase
    .from('extraction_urls')
    .insert(urlInserts)

  if (urlError) {
    // Rollback session
    await supabase.from('extraction_sessions').delete().eq('id', session.id)
    return NextResponse.json({ error: urlError.message }, { status: 500 })
  }

  return NextResponse.json({ id: session.id })
}
