import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/extractions/[id]/confirm - Save confirmed positioning
export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify session ownership
  const { data: session } = await supabase
    .from('extraction_sessions')
    .select('id')
    .eq('id', id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  const body = await request.json()

  // Upsert confirmed positioning
  const { error } = await supabase
    .from('confirmed_positioning')
    .upsert({
      session_id: id,
      positioning_statement: body.positioning_statement,
      category: body.category,
      primary_value_prop: body.primary_value_prop,
      target_persona: body.target_persona,
      key_differentiator: body.key_differentiator,
      proof_points: body.proof_points,
      confirmed_at: new Date().toISOString(),
    }, {
      onConflict: 'session_id',
    })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
