'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NewExtractionPage() {
  const router = useRouter()
  const [sessionName, setSessionName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [urls, setUrls] = useState(['', '', ''])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const addUrl = () => {
    if (urls.length < 10) {
      setUrls([...urls, ''])
    }
  }

  const removeUrl = (index: number) => {
    if (urls.length > 3) {
      setUrls(urls.filter((_, i) => i !== index))
    }
  }

  const updateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const validateUrls = () => {
    const filledUrls = urls.filter(u => u.trim())
    if (filledUrls.length < 3) {
      return 'Please provide at least 3 URLs'
    }

    // Check same domain
    try {
      const domains = filledUrls.map(u => {
        const url = new URL(u.startsWith('http') ? u : `https://${u}`)
        return url.hostname.replace('www.', '')
      })
      const uniqueDomains = new Set(domains)
      if (uniqueDomains.size > 1) {
        return 'All URLs must be from the same domain'
      }
    } catch {
      return 'One or more URLs are invalid'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!companyName.trim()) {
      setError('Please enter a company name')
      return
    }

    const validationError = validateUrls()
    if (validationError) {
      setError(validationError)
      return
    }

    setIsSubmitting(true)

    try {
      // Auto-generate session name if blank (PRD Step 2, Line 85)
      const generatedName = sessionName.trim() ||
        `${companyName} - ${new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`

      const response = await fetch('/api/extractions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: generatedName,
          company_name: companyName,
          urls: urls.filter(u => u.trim()).map(u =>
            u.startsWith('http') ? u : `https://${u}`
          ),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to create extraction')
      }

      const { id } = await response.json()
      router.push(`/extract/${id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsSubmitting(false)
    }
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
            <CardTitle className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">New Extraction</CardTitle>
            <CardDescription>
              Enter your company name and 3-10 pages from your website to analyze
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Session Name - PRD Step 2, Line 85 */}
              <div className="space-y-2">
                <Label htmlFor="sessionName">Session Name (optional)</Label>
                <Input
                  id="sessionName"
                  placeholder="e.g., Q1 2026 Positioning Audit"
                  value={sessionName}
                  onChange={(e) => setSessionName(e.target.value)}
                  className="rounded-xl"
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to auto-generate (e.g., &quot;Acme Inc - Jan 2026&quot;)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company Name</Label>
                <Input
                  id="company"
                  placeholder="Acme Inc"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="rounded-xl"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Website URLs (3-10 pages from the same domain)</Label>
                  {/* Suggested URL types - PRD Step 2, Lines 98-103 */}
                  <p className="text-xs text-muted-foreground mt-1">
                    Suggested pages: Homepage, Features/Product, Pricing, About/Company, Case Study, Landing Pages
                  </p>
                </div>
                {urls.map((url, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder={
                        index === 0 ? 'https://example.com (homepage)' :
                        index === 1 ? 'https://example.com/pricing' :
                        index === 2 ? 'https://example.com/features' :
                        'https://example.com/...'
                      }
                      value={url}
                      onChange={(e) => updateUrl(index, e.target.value)}
                      className="rounded-xl"
                    />
                    {urls.length > 3 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeUrl(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {urls.length < 10 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addUrl}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add URL
                  </Button>
                )}
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Start Extraction'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
