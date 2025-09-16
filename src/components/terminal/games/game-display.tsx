'use client';

import React, { useCallback } from 'react';
import { useTerminal } from '@/lib/terminal-context';
import { Hangman } from './hangman';
import { TicTacToe } from './tic-tac-toe';

export function GameDisplay() {
  const { terminal, updateGameState } = useTerminal();
  const { activeGame, data } = terminal.gameState;

  const handleGameUpdate = useCallback(
    (gameData: Record<string, unknown>) => {
      updateGameState(activeGame, gameData);
    },
    [activeGame, updateGameState]
  );

  const exitGame = useCallback(() => {
    updateGameState(null);
  }, [updateGameState]);

  return (
    <div className="game-overlay absolute inset-0 z-20 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="game-container w-full max-w-[600px] rounded-md border border-gray-700 bg-gray-900 p-4 shadow-lg">
        <div className="game-header mb-3 flex items-center justify-between border-b border-gray-700 pb-2">
          <h3 className="font-mono text-xl text-green-400">
            {activeGame?.toUpperCase()}
          </h3>
          <button
            onClick={exitGame}
            className="rounded bg-red-900 px-2 py-1 text-xs text-white hover:bg-red-800"
            aria-label="Exit game"
          >
            Exit
          </button>
        </div>

        <div className="game-content">
          {activeGame === 'hangman' && (
            <Hangman data={data || {}} onGameUpdate={handleGameUpdate} />
          )}
          {activeGame === 'tictactoe' && (
            <TicTacToe data={data || {}} onGameUpdate={handleGameUpdate} />
          )}
        </div>
      </div>
    </div>
  );
}
