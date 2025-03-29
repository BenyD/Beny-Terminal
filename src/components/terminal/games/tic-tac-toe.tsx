'use client'

import React, { useState, useEffect } from 'react'

// Define the component props interface
interface TicTacToeProps {
  data?: {
    board?: Array<string | null>
    xIsNext?: boolean
    winner?: string | null
  }
  onGameUpdate: (data: Record<string, unknown>) => void
}

export function TicTacToe({ data, onGameUpdate }: TicTacToeProps) {
  // Initialize game state
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [winner, setWinner] = useState<string | null>(null)

  // Initialize from saved data if available
  useEffect(() => {
    if (data) {
      if (data.board) setBoard(data.board)
      if (data.xIsNext !== undefined) setXIsNext(data.xIsNext)
      if (data.winner !== undefined) setWinner(data.winner)
    }
  }, [data])

  // Save game state when it changes
  useEffect(() => {
    onGameUpdate({
      board,
      xIsNext,
      winner
    })
  }, [board, xIsNext, winner, onGameUpdate])

  // Check for winner
  const calculateWinner = (squares: Array<string | null>): string | null => {
    const lines = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal top-left to bottom-right
      [2, 4, 6] // diagonal top-right to bottom-left
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }

    return null
  }

  // Check if the board is full (draw)
  const isBoardFull = (squares: Array<string | null>): boolean => {
    return squares.every(square => square !== null)
  }

  // Handle square click
  const handleClick = (index: number) => {
    // Don't do anything if there's a winner or square is filled
    if (winner || board[index]) return

    const newBoard = [...board]
    newBoard[index] = xIsNext ? 'X' : 'O'
    setBoard(newBoard)

    const gameWinner = calculateWinner(newBoard)
    if (gameWinner) {
      setWinner(gameWinner)
    } else if (isBoardFull(newBoard)) {
      setWinner('Draw')
    } else {
      setXIsNext(!xIsNext)

      // If player is X, make computer move as O
      if (xIsNext) {
        setTimeout(() => {
          makeComputerMove(newBoard)
        }, 500)
      }
    }
  }

  // Computer move (simple AI)
  const makeComputerMove = (currentBoard: Array<string | null>) => {
    // Don't make a move if the game is over
    if (winner || isBoardFull(currentBoard)) return

    // First, check if computer can win in the next move
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const boardCopy = [...currentBoard]
        boardCopy[i] = 'O'
        if (calculateWinner(boardCopy) === 'O') {
          // Make winning move
          setBoard(boardCopy)
          setWinner('O')
          return
        }
      }
    }

    // Next, check if player can win in the next move and block
    for (let i = 0; i < 9; i++) {
      if (!currentBoard[i]) {
        const boardCopy = [...currentBoard]
        boardCopy[i] = 'X'
        if (calculateWinner(boardCopy) === 'X') {
          // Block player's winning move
          const actualBoard = [...currentBoard]
          actualBoard[i] = 'O'
          setBoard(actualBoard)
          setXIsNext(true)
          return
        }
      }
    }

    // If center is free, take it
    if (!currentBoard[4]) {
      const newBoard = [...currentBoard]
      newBoard[4] = 'O'
      setBoard(newBoard)
      setXIsNext(true)
      return
    }

    // Take a random available corner
    const corners = [0, 2, 6, 8]
    const availableCorners = corners.filter(corner => !currentBoard[corner])
    if (availableCorners.length > 0) {
      const randomCorner = availableCorners[Math.floor(Math.random() * availableCorners.length)]
      const newBoard = [...currentBoard]
      newBoard[randomCorner] = 'O'
      setBoard(newBoard)
      setXIsNext(true)
      return
    }

    // Take any available edge
    const edges = [1, 3, 5, 7]
    const availableEdges = edges.filter(edge => !currentBoard[edge])
    if (availableEdges.length > 0) {
      const randomEdge = availableEdges[Math.floor(Math.random() * availableEdges.length)]
      const newBoard = [...currentBoard]
      newBoard[randomEdge] = 'O'
      setBoard(newBoard)
      setXIsNext(true)
      return
    }
  }

  // Reset the game
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setXIsNext(true)
    setWinner(null)
  }

  // Render a square
  const renderSquare = (index: number) => {
    return (
      <button
        key={index}
        className={`ttt-square w-16 h-16 flex items-center justify-center text-2xl font-bold border border-gray-600 ${
          board[index] === 'X' ? 'text-blue-400' : board[index] === 'O' ? 'text-red-400' : 'hover:bg-gray-800'
        }`}
        onClick={() => handleClick(index)}
        disabled={Boolean(board[index]) || Boolean(winner) || !xIsNext}
      >
        {board[index]}
      </button>
    )
  }

  return (
    <div className='tic-tac-toe-game flex flex-col items-center'>
      <div className='status mb-4 text-center'>
        <div className={`text-center py-2 ${winner ? (winner === 'X' ? 'text-blue-400' : winner === 'O' ? 'text-red-400' : 'text-yellow-400') : 'text-green-400'}`}>
          {winner ? (winner === 'Draw' ? 'Game ended in a draw!' : `Winner: ${winner}`) : 'Your turn! X goes first.'}
        </div>

        <div className='player-indicators flex justify-center gap-4 mb-2'>
          <div className={`px-3 py-1 rounded ${xIsNext && !winner ? 'bg-blue-900 text-blue-300' : 'bg-gray-800 text-gray-400'}`}>You: X</div>
          <div className={`px-3 py-1 rounded ${!xIsNext && !winner ? 'bg-red-900 text-red-300' : 'bg-gray-800 text-gray-400'}`}>Computer: O</div>
        </div>
      </div>

      <div className='board grid grid-cols-3 gap-1 bg-gray-700'>{[0, 1, 2, 3, 4, 5, 6, 7, 8].map(index => renderSquare(index))}</div>

      {winner && (
        <button onClick={resetGame} className='mt-4 px-4 py-2 bg-green-700 hover:bg-green-600 text-white rounded'>
          Play Again
        </button>
      )}
    </div>
  )
}
