import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { generateShareToken } from '@/lib/utils/share-token'

interface RouteParams {
  params: Promise<{ id: string }>
}

// POST /api/extractions/[id]/share - Enable sharing
export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const { data: session } = await supabase
    .from('extraction_sessions')
    .select('id, share_token, is_shared')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Generate token if not exists, or reuse existing
  const shareToken = session.share_token || generateShareToken()

  const { error } = await supabase
    .from('extraction_sessions')
    .update({
      share_token: shareToken,
      is_shared: true,
      shared_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ share_token: shareToken, is_shared: true })
}

// DELETE /api/extractions/[id]/share - Disable sharing
export async function DELETE(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Verify ownership
  const { data: session } = await supabase
    .from('extraction_sessions')
    .select('id')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  // Disable sharing (preserve token for potential re-enable)
  const { error } = await supabase
    .from('extraction_sessions')
    .update({ is_shared: false })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ is_shared: false })
}

// GET /api/extractions/[id]/share - Get share status
export async function GET(request: Request, { params }: RouteParams) {
  const { id } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: session } = await supabase
    .from('extraction_sessions')
    .select('share_token, is_shared')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (!session) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({
    share_token: session.is_shared ? session.share_token : null,
    is_shared: session.is_shared,
  })
}
