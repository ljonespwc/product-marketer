import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { isValidShareToken } from '@/lib/utils/share-token'
import { SharedResultsView } from '@/components/share/SharedResultsView'

interface PageProps {
  params: Promise<{ token: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { token } = await params

  if (!isValidShareToken(token)) {
    return { title: 'Invalid Link' }
  }

  return {
    title: 'Shared Positioning Analysis | Mirror Your Positioning',
    description: 'View this shared positioning analysis',
  }
}

export default async function SharePage({ params }: PageProps) {
  const { token } = await params

  if (!isValidShareToken(token)) {
    notFound()
  }

  return <SharedResultsView token={token} />
}
