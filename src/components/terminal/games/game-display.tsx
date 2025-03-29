'use client'

import React from 'react'
import { useTerminal } from '@/lib/terminal-context'
import { Hangman } from './hangman'
import { TicTacToe } from './tic-tac-toe'

export function GameDisplay() {
  const { terminal, updateGameState } = useTerminal()
  const { activeGame, data } = terminal.gameState

  const handleGameUpdate = (gameData: Record<string, unknown>) => {
    updateGameState(activeGame, gameData)
  }

  const exitGame = () => {
    updateGameState(null)
  }

  return (
    <div className='game-overlay absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-20 p-4'>
      <div className='game-container bg-gray-900 border border-gray-700 rounded-md shadow-lg p-4 max-w-[600px] w-full'>
        <div className='game-header flex justify-between items-center mb-3 pb-2 border-b border-gray-700'>
          <h3 className='text-xl font-mono text-green-400'>{activeGame?.toUpperCase()}</h3>
          <button onClick={exitGame} className='px-2 py-1 bg-red-900 hover:bg-red-800 text-white text-xs rounded' aria-label='Exit game'>
            Exit
          </button>
        </div>

        <div className='game-content'>
          {activeGame === 'hangman' && <Hangman data={data || {}} onGameUpdate={handleGameUpdate} />}
          {activeGame === 'tictactoe' && <TicTacToe data={data || {}} onGameUpdate={handleGameUpdate} />}
        </div>
      </div>
    </div>
  )
}
