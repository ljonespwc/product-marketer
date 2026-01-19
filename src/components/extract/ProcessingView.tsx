'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { ExtractionSessionWithUrls, ExtractionUrl } from '@/types/database'

interface ProcessingViewProps {
  sessionId: string
}

export function ProcessingView({ sessionId }: ProcessingViewProps) {
  const router = useRouter()

  const [session, setSession] = useState<ExtractionSessionWithUrls | null>(null)
  const [error, setError] = useState('')
  const [hasStarted, setHasStarted] = useState(false)

  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch(`/api/extractions/${sessionId}`)
      if (!response.ok) throw new Error('Failed to fetch session')
      const data = await response.json()
      setSession(data)

      if (data.status === 'complete') {
        router.push(`/extract/${sessionId}/results`)
      } else if (data.status === 'failed') {
        setError('Extraction failed. Please try again.')
      }
    } catch {
      setError('Failed to load extraction status')
    }
  }, [sessionId, router])

  const startExtraction = useCallback(async () => {
    try {
      const response = await fetch(`/api/extractions/${sessionId}/run`, {
        method: 'POST',
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to start extraction')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start extraction')
    }
  }, [sessionId])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  useEffect(() => {
    if (session && session.status === 'pending' && !hasStarted) {
      setHasStarted(true)
      startExtraction()
    }
  }, [session, hasStarted, startExtraction])

  useEffect(() => {
    if (session && (session.status === 'pending' || session.status === 'processing')) {
      const interval = setInterval(fetchSession, 2000)
      return () => clearInterval(interval)
    }
  }, [session, fetchSession])

  const getUrlStatusIcon = (status: ExtractionUrl['scrape_status']) => {
    switch (status) {
      case 'complete':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-destructive" />
      case 'scraping':
      case 'extracting':
        return <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-muted" />
    }
  }

  const getUrlStatusLabel = (status: ExtractionUrl['scrape_status']) => {
    switch (status) {
      case 'pending': return 'Waiting'
      case 'scraping': return 'Scraping'
      case 'extracting': return 'Analyzing'
      case 'complete': return 'Done'
      case 'failed': return 'Failed'
    }
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-orange-600 mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <Card className="shadow-xl">
            <CardContent className="py-8 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive">{error}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-orange-600 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Link>

        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                {session?.company_name || 'Loading...'}
              </CardTitle>
              {session && (
                <Badge
                  variant="outline"
                  className={session.status === 'processing'
                    ? 'bg-blue-100 text-blue-700 border-blue-200'
                    : 'bg-amber-100 text-amber-700 border-amber-200'
                  }
                >
                  {session.status === 'processing' ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Processing
                    </>
                  ) : (
                    session.status
                  )}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Analyzing your website pages...
            </p>

            {session?.extraction_urls.map((url) => (
              <div
                key={url.id}
                className="flex items-center justify-between p-3 border rounded-xl bg-white/50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {getUrlStatusIcon(url.scrape_status)}
                  <span className="text-sm truncate">{url.url}</span>
                </div>
                <span className="text-xs text-muted-foreground ml-2">
                  {getUrlStatusLabel(url.scrape_status)}
                </span>
              </div>
            ))}

            {session?.status === 'processing' && (
              <div className="flex items-center justify-center gap-2 pt-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                <span>AI synthesis in progress...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
