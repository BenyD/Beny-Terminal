import { Metadata } from 'next'
import ComingSoonClient from './coming-soon-client'

export const metadata: Metadata = {
  title: 'Coming Soon'
}

export default function ComingSoonPage() {
  return <ComingSoonClient />
}
