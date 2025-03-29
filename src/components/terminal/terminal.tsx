'use client'

import React, { useEffect, useState } from 'react'
import { useTerminal } from '@/lib/terminal-context'
import { TerminalInput } from './terminal-input'
import { TerminalOutput } from './terminal-output'
import { MatrixEffect } from './effects/matrix-effect'
import { GameDisplay } from './games/game-display'

export function Terminal() {
  const { terminal, focusInput } = useTerminal()
  const [activeTab, setActiveTab] = useState('main')
  const [showEffects] = useState(false)
  const [matrixActive, setMatrixActive] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  // Handle terminal tab switching
  const handleTabSwitch = (id: string) => {
    setActiveTab(id)
  }

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initialize
    checkMobile()

    // Add resize listener
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Apply theme styling
  const getThemeStyles = () => {
    switch (terminal.theme) {
      case 'monokai':
        return {
          bg: 'bg-gray-900',
          text: 'text-gray-200',
          accent: 'text-yellow-400',
          border: 'border-yellow-800'
        }
      case 'dracula':
        return {
          bg: 'bg-gray-900',
          text: 'text-purple-100',
          accent: 'text-purple-400',
          border: 'border-purple-900'
        }
      case 'solarized':
        return {
          bg: 'bg-blue-900/90',
          text: 'text-blue-100',
          accent: 'text-cyan-600',
          border: 'border-blue-800'
        }
      case 'nord':
        return {
          bg: 'bg-gray-800',
          text: 'text-gray-200',
          accent: 'text-blue-300',
          border: 'border-blue-900'
        }
      default:
        return {
          bg: 'bg-[#121212]',
          text: 'text-[#898989]/90',
          accent: 'text-green-500',
          border: 'border-[#444444]/30'
        }
    }
  }

  const { bg, text, accent, border } = getThemeStyles()

  // Watch for the matrix command
  useEffect(() => {
    if (terminal.gameState.activeGame === 'matrix') {
      setMatrixActive(true)
    } else {
      setMatrixActive(false)
    }
  }, [terminal.gameState])

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString())
    }

    // Update immediately
    updateTime()

    // Then update every second
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`terminal-container w-full h-full flex flex-col relative ${bg} ${text} overflow-hidden ${border} rounded-md shadow-md`}
      style={{ opacity: terminal.opacity }}
      onClick={focusInput}
    >
      {/* Terminal header with tabs and controls */}
      <div className={`terminal-header flex items-center justify-between border-b ${border} p-2`}>
        {/* Desktop title, hidden on mobile */}
        <div className='hidden md:flex items-center'>
          <span className={`${accent} font-semibold text-xs`}>Beny Terminal v1.0</span>
        </div>

        {/* Terminal tabs */}
        <div className='terminal-tabs flex gap-1 overflow-x-auto max-w-[60%] md:max-w-[50%] mx-auto'>
          {terminal.activeTerminals.map(term => (
            <div
              key={term.id}
              onClick={() => handleTabSwitch(term.id)}
              className={`px-2 md:px-3 py-1 rounded-t-md cursor-pointer text-xs truncate ${activeTab === term.id ? `${accent} bg-black/20` : 'hover:bg-black/10'}`}
            >
              {term.title}
            </div>
          ))}
        </div>

        <div className={`flex items-center gap-2 text-xs`}>
          <div className='px-2 rounded-md border border-gray-700 truncate max-w-[100px] md:max-w-none hidden sm:block'>{terminal.currentDirectory.join('/')}</div>
          <div className='h-3 w-3 rounded-full bg-green-500 md:hidden'></div>
        </div>
      </div>

      {/* Matrix effect overlay */}
      {matrixActive && <MatrixEffect />}

      {/* Games display */}
      {terminal.gameState.activeGame && terminal.gameState.activeGame !== 'matrix' && <GameDisplay />}

      {/* Main terminal content */}
      <div className='terminal-content flex-1 flex flex-col overflow-hidden relative'>
        {/* Scanlines effect - subtle CRT look */}
        <div
          className='scanlines absolute inset-0 pointer-events-none'
          style={{
            backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '100% 2px',
            opacity: 0.2,
            display: showEffects ? 'block' : 'none'
          }}
        ></div>

        {/* Terminal output area */}
        <div className='flex-1 overflow-y-auto'>
          <TerminalOutput />
        </div>

        {/* Terminal input area */}
        <div className='terminal-input-area p-2 md:p-4 pt-0 border-t border-gray-800'>
          <TerminalInput />
        </div>
      </div>

      {/* Status bar */}
      <div className={`terminal-status-bar text-[10px] md:text-xs p-1 border-t ${border} flex justify-between`}>
        <div className='flex items-center gap-1 md:gap-3'>
          <span>{`CPU: ${Math.round(terminal.systemStats.cpu)}%`}</span>
          <span>{`MEM: ${Math.round(terminal.systemStats.memory)}%`}</span>
          <span className='hidden sm:inline'>{`NET: ${Math.round(terminal.systemStats.network)} KB/s`}</span>
        </div>
        <div className='flex items-center gap-1 md:gap-3'>
          <span>{currentTime}</span>
          <span className='hidden sm:inline'>{`Uptime: ${Math.floor(terminal.uptime / 60)}m ${terminal.uptime % 60}s`}</span>
          <span className='text-[10px] md:text-xs px-2 rounded bg-gray-800'>
            {terminal.shell} | {terminal.theme}
          </span>
        </div>
      </div>
    </div>
  )
}
