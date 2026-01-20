import { createServiceClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { isValidShareToken } from '@/lib/utils/share-token'

interface RouteParams {
  params: Promise<{ token: string }>
}

// GET /api/share/[token] - Public endpoint to fetch shared session
export async function GET(request: Request, { params }: RouteParams) {
  const { token } = await params

  // Validate token format
  if (!isValidShareToken(token)) {
    return NextResponse.json({ error: 'Invalid share link' }, { status: 400 })
  }

  // Use service client to bypass RLS for public access
  const supabase = await createServiceClient()

  // Fetch shared session
  const { data: session, error: sessionError } = await supabase
    .from('extraction_sessions')
    .select('id, name, company_name, status, created_at')
    .eq('share_token', token)
    .eq('is_shared', true)
    .single()

  if (sessionError || !session) {
    return NextResponse.json({ error: 'Shared session not found' }, { status: 404 })
  }

  // Fetch URLs
  const { data: urls } = await supabase
    .from('extraction_urls')
    .select('url, page_type, scrape_status')
    .eq('session_id', session.id)

  // Fetch results
  const { data: results } = await supabase
    .from('extraction_results')
    .select('*')
    .eq('session_id', session.id)
    .single()

  return NextResponse.json({
    session: {
      ...session,
      extraction_urls: urls || [],
    },
    results,
  })
}
