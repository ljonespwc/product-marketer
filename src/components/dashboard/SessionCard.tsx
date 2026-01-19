'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExtractionSession } from '@/types/database'
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'
import { ArrowRight, Clock, CheckCircle, Loader2, AlertCircle } from 'lucide-react'

interface SessionCardProps {
  session: ExtractionSession
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Clock,
  },
  processing: {
    label: 'Processing',
    className: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Loader2,
  },
  complete: {
    label: 'Complete',
    className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-100 text-red-700 border-red-200',
    icon: AlertCircle,
  },
}

export function SessionCard({ session }: SessionCardProps) {
  const config = statusConfig[session.status]
  const Icon = config.icon
  const href = session.status === 'complete'
    ? `/extract/${session.id}/results`
    : `/extract/${session.id}`

  return (
    <Link href={href}>
      <Card className="hover:border-orange-300 hover:shadow-xl transition-all cursor-pointer bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              {/* Show session name if exists, otherwise company name */}
              <CardTitle className="text-lg">
                {session.name || session.company_name}
              </CardTitle>
              {/* Show company name as subtitle if session has custom name */}
              {session.name && (
                <p className="text-sm text-muted-foreground">{session.company_name}</p>
              )}
            </div>
            <Badge variant="outline" className={`flex items-center gap-1 ${config.className}`}>
              <Icon className={`h-3 w-3 ${session.status === 'processing' ? 'animate-spin' : ''}`} />
              {config.label}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Created {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
            </span>
            <ArrowRight className="h-4 w-4 text-orange-500" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
