'use client';

import React, { useEffect, useState } from 'react';
import { useTerminal } from '@/lib/terminal-context';
import { TerminalInput } from './terminal-input';
import { TerminalOutput } from './terminal-output';
import { MatrixEffect } from './effects/matrix-effect';
import { GameDisplay } from './games/game-display';

export function Terminal() {
  const { terminal, focusInput } = useTerminal();
  const [activeTab, setActiveTab] = useState('main');
  const [showEffects] = useState(false);
  const [matrixActive, setMatrixActive] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [_isMobile, setIsMobile] = useState(false);

  // Handle terminal tab switching
  const handleTabSwitch = (id: string) => {
    setActiveTab(id);
  };

  // Check for mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initialize
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Apply theme styling
  const getThemeStyles = () => {
    switch (terminal.theme) {
      case 'monokai':
        return {
          bg: 'bg-gray-900',
          text: 'text-gray-200',
          accent: 'text-yellow-400',
          border: 'border-yellow-800',
        };
      case 'dracula':
        return {
          bg: 'bg-gray-900',
          text: 'text-purple-100',
          accent: 'text-purple-400',
          border: 'border-purple-900',
        };
      case 'solarized':
        return {
          bg: 'bg-blue-900/90',
          text: 'text-blue-100',
          accent: 'text-cyan-600',
          border: 'border-blue-800',
        };
      case 'nord':
        return {
          bg: 'bg-gray-800',
          text: 'text-gray-200',
          accent: 'text-blue-300',
          border: 'border-blue-900',
        };
      default:
        return {
          bg: 'bg-[#121212]',
          text: 'text-[#898989]/90',
          accent: 'text-green-500',
          border: 'border-[#444444]/30',
        };
    }
  };

  const { bg, text, accent, border } = getThemeStyles();

  // Watch for the matrix command
  useEffect(() => {
    if (terminal.gameState.activeGame === 'matrix') {
      setMatrixActive(true);
    } else {
      setMatrixActive(false);
    }
  }, [terminal.gameState]);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString());
    };

    // Update immediately
    updateTime();

    // Then update every second
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`terminal-container relative flex h-full w-full flex-col ${bg} ${text} overflow-hidden ${border} rounded-md shadow-md`}
      style={{ opacity: terminal.opacity }}
      onClick={focusInput}
    >
      {/* Terminal header with tabs and controls */}
      <div
        className={`terminal-header flex items-center justify-between border-b ${border} p-2`}
      >
        {/* Desktop title, hidden on mobile */}
        <div className="hidden items-center md:flex">
          <span className={`${accent} text-xs font-semibold`}>
            Beny Terminal v1.0
          </span>
        </div>

        {/* Terminal tabs */}
        <div className="terminal-tabs mx-auto flex max-w-[60%] gap-1 overflow-x-auto md:max-w-[50%]">
          {terminal.activeTerminals.map((term) => (
            <div
              key={term.id}
              onClick={() => handleTabSwitch(term.id)}
              className={`cursor-pointer truncate rounded-t-md px-2 py-1 text-xs md:px-3 ${activeTab === term.id ? `${accent} bg-black/20` : 'hover:bg-black/10'}`}
            >
              {term.title}
            </div>
          ))}
        </div>

        <div className={`flex items-center gap-2 text-xs`}>
          <div className="hidden max-w-[100px] truncate rounded-md border border-gray-700 px-2 sm:block md:max-w-none">
            {terminal.currentDirectory.join('/')}
          </div>
          <div className="h-3 w-3 rounded-full bg-green-500 md:hidden"></div>
        </div>
      </div>

      {/* Matrix effect overlay */}
      {matrixActive && <MatrixEffect />}

      {/* Games display */}
      {terminal.gameState.activeGame &&
        terminal.gameState.activeGame !== 'matrix' && <GameDisplay />}

      {/* Main terminal content */}
      <div className="terminal-content relative flex flex-1 flex-col overflow-hidden">
        {/* Scanlines effect - subtle CRT look */}
        <div
          className="scanlines pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '100% 2px',
            opacity: 0.2,
            display: showEffects ? 'block' : 'none',
          }}
        ></div>

        {/* Terminal output area */}
        <div className="flex-1 overflow-y-auto">
          <TerminalOutput />
        </div>

        {/* Terminal input area */}
        <div className="terminal-input-area border-t border-gray-800 p-2 pt-0 md:p-4">
          <TerminalInput />
        </div>
      </div>

      {/* Status bar */}
      <div
        className={`terminal-status-bar border-t p-1 text-[10px] md:text-xs ${border} flex justify-between`}
      >
        <div className="flex items-center gap-1 md:gap-3">
          <span>{`CPU: ${Math.round(terminal.systemStats.cpu)}%`}</span>
          <span>{`MEM: ${Math.round(terminal.systemStats.memory)}%`}</span>
          <span className="hidden sm:inline">{`NET: ${Math.round(terminal.systemStats.network)} KB/s`}</span>
        </div>
        <div className="flex items-center gap-1 md:gap-3">
          <span>{currentTime}</span>
          <span className="hidden sm:inline">{`Uptime: ${Math.floor(terminal.uptime / 60)}m ${terminal.uptime % 60}s`}</span>
          <span className="rounded bg-gray-800 px-2 text-[10px] md:text-xs">
            {terminal.shell} | {terminal.theme}
          </span>
        </div>
      </div>
    </div>
  );
}
