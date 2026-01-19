'use client'

import { useState } from 'react'
import { EvidenceBank, EvidenceQuote, StatisticalClaim, CustomerVoice } from '@/types/database'
import { Quote, BarChart3, MessageCircle, ExternalLink } from 'lucide-react'

interface CitationTooltipProps {
  evidenceId: string
  evidenceBank?: EvidenceBank
  children?: React.ReactNode
}

function findEvidence(
  evidenceBank: EvidenceBank,
  evidenceId: string
): EvidenceQuote | StatisticalClaim | CustomerVoice | null {
  if (evidenceId.startsWith('Q')) {
    return evidenceBank.quotes.find(q => q.id === evidenceId) || null
  }
  if (evidenceId.startsWith('S')) {
    return evidenceBank.statistical_claims.find(s => s.id === evidenceId) || null
  }
  if (evidenceId.startsWith('CV')) {
    return evidenceBank.customer_voice.find(cv => cv.id === evidenceId) || null
  }
  return null
}

function getEvidenceIcon(evidenceId: string) {
  if (evidenceId.startsWith('Q')) return <Quote className="h-3 w-3" />
  if (evidenceId.startsWith('S')) return <BarChart3 className="h-3 w-3" />
  if (evidenceId.startsWith('CV')) return <MessageCircle className="h-3 w-3" />
  return null
}

function formatUrl(url: string): string {
  try {
    const parsed = new URL(url)
    return parsed.pathname === '/' ? parsed.hostname : `${parsed.hostname}${parsed.pathname}`
  } catch {
    return url
  }
}

export function CitationTooltip({ evidenceId, evidenceBank, children }: CitationTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!evidenceBank) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-mono">
        {getEvidenceIcon(evidenceId)}
        {evidenceId}
      </span>
    )
  }

  const evidence = findEvidence(evidenceBank, evidenceId)

  if (!evidence) {
    return (
      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-xs font-mono">
        {evidenceId}
      </span>
    )
  }

  // Determine content based on evidence type
  let content: string = ''
  let source: string = ''
  let meta: string = ''

  if ('text' in evidence) {
    // EvidenceQuote
    const quote = evidence as EvidenceQuote
    content = quote.text
    source = formatUrl(quote.page_url)
    meta = `${quote.structural_context} | ${quote.category}`
  } else if ('claim' in evidence) {
    // StatisticalClaim
    const stat = evidence as StatisticalClaim
    content = stat.claim
    source = formatUrl(stat.page_url)
    meta = `${stat.specificity} | ${stat.context.slice(0, 50)}...`
  } else if ('quote' in evidence) {
    // CustomerVoice
    const voice = evidence as CustomerVoice
    content = voice.quote
    source = formatUrl(voice.page_url)
    meta = voice.attribution || 'Anonymous'
  }

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded text-xs font-mono cursor-help transition-colors"
      >
        {getEvidenceIcon(evidenceId)}
        {evidenceId}
      </button>
      {isOpen && (
        <div className="absolute z-50 bottom-full left-0 mb-2 w-72 p-3 bg-white rounded-lg shadow-lg border border-orange-200 text-left">
          <div className="text-sm text-gray-900 mb-2">
            &quot;{content}&quot;
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <ExternalLink className="h-3 w-3" />
              {source}
            </span>
            <span className="text-orange-600">{meta}</span>
          </div>
          {children}
        </div>
      )}
    </span>
  )
}

// Component to render a list of citations
interface CitationListProps {
  evidenceIds: string[]
  evidenceBank?: EvidenceBank
  className?: string
}

export function CitationList({ evidenceIds, evidenceBank, className = '' }: CitationListProps) {
  if (!evidenceIds || evidenceIds.length === 0) return null

  return (
    <div className={`flex flex-wrap gap-1 ${className}`}>
      {evidenceIds.map((id) => (
        <CitationTooltip key={id} evidenceId={id} evidenceBank={evidenceBank} />
      ))}
    </div>
  )
}

// Severity badge component
interface SeverityBadgeProps {
  severity: 'critical' | 'high' | 'medium' | 'low'
  className?: string
}

export function SeverityBadge({ severity, className = '' }: SeverityBadgeProps) {
  const colors = {
    critical: 'bg-red-100 text-red-700 border-red-200',
    high: 'bg-orange-100 text-orange-700 border-orange-200',
    medium: 'bg-amber-100 text-amber-700 border-amber-200',
    low: 'bg-gray-100 text-gray-600 border-gray-200',
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${colors[severity]} ${className}`}>
      {severity}
    </span>
  )
}

// Effort/Impact badge component
interface EffortImpactBadgeProps {
  effort: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  className?: string
}

export function EffortImpactBadge({ effort, impact, className = '' }: EffortImpactBadgeProps) {
  const effortColors = {
    low: 'text-emerald-600',
    medium: 'text-amber-600',
    high: 'text-red-600',
  }

  const impactColors = {
    low: 'text-gray-500',
    medium: 'text-amber-600',
    high: 'text-emerald-600',
  }

  return (
    <span className={`inline-flex items-center gap-2 text-xs ${className}`}>
      <span className={effortColors[effort]}>Effort: {effort}</span>
      <span className="text-gray-300">|</span>
      <span className={impactColors[impact]}>Impact: {impact}</span>
    </span>
  )
}
