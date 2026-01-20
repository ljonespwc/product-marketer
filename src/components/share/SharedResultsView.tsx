'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ResultsTabs } from '@/components/results/ResultsTabs'
import { FullExtractionData, ExtractionResults } from '@/types/database'
import { Eye, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import Link from 'next/link'

interface SharedResultsViewProps {
  token: string
}

interface SharedData {
  session: {
    id: string
    name?: string
    company_name: string
    status: string
    created_at: string
    extraction_urls: { url: string; page_type?: string; scrape_status: string }[]
  }
  results: ExtractionResults
}

export function SharedResultsView({ token }: SharedResultsViewProps) {
  const [data, setData] = useState<SharedData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/share/${token}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('This shared link is no longer available')
          } else {
            setError('Failed to load shared results')
          }
          return
        }
        const result = await response.json()
        setData(result)
      } catch {
        setError('Failed to load shared results')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-muted-foreground">Loading shared results...</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 flex items-center justify-center">
        <Card className="max-w-md mx-4 shadow-xl">
          <CardContent className="py-8 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-4">{error || 'Something went wrong'}</p>
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Convert to FullExtractionData format for ResultsTabs
  const fullData: FullExtractionData = {
    id: data.session.id,
    user_id: '', // Not needed for display
    company_name: data.session.company_name,
    name: data.session.name,
    status: data.session.status as 'complete',
    created_at: data.session.created_at,
    updated_at: data.session.created_at,
    extraction_urls: data.session.extraction_urls.map((u, i) => ({
      id: `url-${i}`,
      session_id: data.session.id,
      url: u.url,
      page_type: u.page_type,
      scrape_status: u.scrape_status as 'complete',
      created_at: data.session.created_at,
      updated_at: data.session.created_at,
    })),
    extraction_results: data.results,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                {data.session.company_name}
              </h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Eye className="h-3 w-3 mr-1" />
                Read-Only
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Positioning analysis from {data.session.extraction_urls.length} pages
            </p>
          </div>
        </div>

        {/* Results */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ResultsTabs data={fullData} />
          </div>
          <div className="lg:col-span-1">
            {/* CTA Card instead of ConfirmationPanel */}
            <Card className="shadow-lg sticky top-4">
              <CardContent className="py-6 text-center space-y-4">
                <Sparkles className="h-10 w-10 text-orange-500 mx-auto" />
                <div>
                  <h3 className="font-semibold text-lg mb-1">See what your site actually says</h3>
                  <p className="text-sm text-muted-foreground">
                    Get your own positioning analysis in under 2 minutes
                  </p>
                </div>
                <Link href="/login" className="block">
                  <Button className="w-full bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 hover:from-rose-600 hover:via-orange-600 hover:to-amber-600">
                    Try It Free
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground">
                  No credit card required
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Powered by{' '}
            <Link href="/" className="text-orange-600 hover:underline">
              Mirror Your Positioning
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
