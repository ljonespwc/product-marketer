'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ShareModal } from '@/components/share/ShareModal'
import { ArrowLeft, Share2 } from 'lucide-react'
import Link from 'next/link'

interface ResultsHeaderProps {
  sessionId: string
  companyName: string
  urlCount: number
}

export function ResultsHeader({ sessionId, companyName, urlCount }: ResultsHeaderProps) {
  const [showShareModal, setShowShareModal] = useState(false)

  return (
    <>
      <div className="flex items-start justify-between mb-6">
        <div>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-orange-600 mb-2 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
            {companyName}
          </h1>
          <p className="text-muted-foreground">
            Positioning analysis from {urlCount} pages
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowShareModal(true)}
          className="flex items-center gap-2"
        >
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </div>

      <ShareModal
        sessionId={sessionId}
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
      />
    </>
  )
}
