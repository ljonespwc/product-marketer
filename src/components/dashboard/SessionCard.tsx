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
    variant: 'secondary' as const,
    icon: Clock,
  },
  processing: {
    label: 'Processing',
    variant: 'default' as const,
    icon: Loader2,
  },
  complete: {
    label: 'Complete',
    variant: 'default' as const,
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    variant: 'destructive' as const,
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
      <Card className="hover:border-primary/50 transition-colors cursor-pointer">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{session.company_name}</CardTitle>
            <Badge variant={config.variant} className="flex items-center gap-1">
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
            <ArrowRight className="h-4 w-4" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
