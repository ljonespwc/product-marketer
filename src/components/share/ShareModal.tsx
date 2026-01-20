'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { X, Link2, Copy, Check, ExternalLink, Loader2 } from 'lucide-react'

interface ShareModalProps {
  sessionId: string
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ sessionId, isOpen, onClose }: ShareModalProps) {
  const [isShared, setIsShared] = useState(false)
  const [shareToken, setShareToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isToggling, setIsToggling] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = shareToken ? `${window.location.origin}/share/${shareToken}` : ''

  useEffect(() => {
    if (isOpen) {
      fetchShareStatus()
    }
  }, [isOpen, sessionId])

  const fetchShareStatus = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/extractions/${sessionId}/share`)
      if (response.ok) {
        const data = await response.json()
        setIsShared(data.is_shared)
        setShareToken(data.share_token)
      }
    } catch (error) {
      console.error('Failed to fetch share status:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSharing = async () => {
    setIsToggling(true)
    try {
      const response = await fetch(`/api/extractions/${sessionId}/share`, {
        method: isShared ? 'DELETE' : 'POST',
      })
      if (response.ok) {
        const data = await response.json()
        setIsShared(data.is_shared)
        if (data.share_token) {
          setShareToken(data.share_token)
        }
      }
    } catch (error) {
      console.error('Failed to toggle sharing:', error)
    } finally {
      setIsToggling(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-md mx-4 shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-orange-500" />
              <CardTitle className="text-lg">Share Results</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardDescription>
            Create a public link to share your positioning analysis
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            </div>
          ) : (
            <>
              {/* Toggle */}
              <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                <div>
                  <p className="font-medium text-sm">Public sharing</p>
                  <p className="text-xs text-muted-foreground">
                    {isShared ? 'Anyone with the link can view' : 'Only you can see this'}
                  </p>
                </div>
                <Button
                  variant={isShared ? 'default' : 'outline'}
                  size="sm"
                  onClick={toggleSharing}
                  disabled={isToggling}
                  className={isShared ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  {isToggling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : isShared ? (
                    'Enabled'
                  ) : (
                    'Enable'
                  )}
                </Button>
              </div>

              {/* Share URL */}
              {isShared && shareToken && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <Input
                      value={shareUrl}
                      readOnly
                      className="text-sm bg-white"
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      className="flex-shrink-0"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => window.open(shareUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new tab
                  </Button>
                </div>
              )}

              {/* Warning */}
              {isShared && (
                <p className="text-xs text-muted-foreground text-center">
                  Shared links are read-only. Viewers cannot edit your analysis.
                </p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
