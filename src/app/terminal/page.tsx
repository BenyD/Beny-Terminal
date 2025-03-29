'use client'

import React, { Suspense } from 'react'
import dynamic from 'next/dynamic'

// Import the Terminal component dynamically with no SSR
const TerminalWithProvider = dynamic(() => import('@/components/terminal/terminal-with-provider'), { ssr: false })

export default function TerminalPage() {
  return (
    <div className='flex h-full w-full flex-col items-center justify-center bg-gray-950'>
      <Suspense fallback={<div className='text-white'>Loading terminal...</div>}>
        <TerminalWithProvider />
      </Suspense>
    </div>
  )
}
