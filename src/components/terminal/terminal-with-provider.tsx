'use client'

import React from 'react'
import { TerminalProvider } from '@/lib/terminal-context'
import { Terminal } from './terminal'

export default function TerminalWithProvider() {
  return (
    <TerminalProvider>
      <Terminal />
    </TerminalProvider>
  )
}
