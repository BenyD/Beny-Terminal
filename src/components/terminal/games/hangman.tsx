'use client'

import React, { useState, useEffect, useCallback } from 'react'

// Define the component props interface
interface HangmanProps {
  data: {
    difficulty?: string
    word?: string
    guessedLetters?: string[]
    wrongGuesses?: number
    gameOver?: boolean
    gameWon?: boolean
    message?: string
  }
  onGameUpdate: (data: Record<string, unknown>) => void
}

export function Hangman({ data, onGameUpdate }: HangmanProps) {
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongGuesses, setWrongGuesses] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [gameWon, setGameWon] = useState(false)
  const [message, setMessage] = useState('')

  // Word lists by difficulty
  const words = {
    easy: ['cat', 'dog', 'hat', 'bat', 'sun', 'moon', 'tree', 'book', 'desk', 'lamp'],
    medium: ['computer', 'keyboard', 'monitor', 'javascript', 'coding', 'terminal', 'function', 'variable', 'method'],
    hard: ['algorithm', 'asynchronous', 'deployment', 'architecture', 'infrastructure', 'optimization', 'refactoring']
  }

  // Memoize the game state update function
  const updateGameState = useCallback(() => {
    onGameUpdate({
      word,
      guessedLetters,
      wrongGuesses,
      gameOver,
      gameWon,
      message
    })
  }, [word, guessedLetters, wrongGuesses, gameOver, gameWon, message, onGameUpdate])

  // Initialize game from saved data or create new game
  useEffect(() => {
    // If we have saved game data, restore it
    if (data && Object.keys(data).length > 0) {
      if (data.word) setWord(data.word)
      if (data.guessedLetters) setGuessedLetters(data.guessedLetters)
      if (data.wrongGuesses !== undefined) setWrongGuesses(data.wrongGuesses)
      if (data.gameOver !== undefined) setGameOver(data.gameOver)
      if (data.gameWon !== undefined) setGameWon(data.gameWon)
      if (data.message) setMessage(data.message)
    } else {
      // Start a new game
      const difficulty = 'medium' // Default difficulty
      const wordList = words[difficulty]
      const randomWord = wordList[Math.floor(Math.random() * wordList.length)]
      setWord(randomWord)
      setGuessedLetters([])
      setWrongGuesses(0)
      setGameOver(false)
      setGameWon(false)
      setMessage('Guess the word!')
    }
  }, [data])

  // Save game state when it changes
  useEffect(() => {
    // Skip the initial render to avoid causing a loop with data
    if (word && (guessedLetters.length > 0 || gameOver || gameWon)) {
      updateGameState()
    }
  }, [updateGameState])

  // Check if the game is won
  useEffect(() => {
    if (!word) return

    const isWon = [...word].every(letter => guessedLetters.includes(letter))
    if (isWon && !gameWon) {
      setGameWon(true)
      setGameOver(true)
      setMessage('Congratulations! You won!')
    }
  }, [word, guessedLetters, gameWon])

  // Handle letter guess
  const handleGuess = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter)) return

    const newGuessedLetters = [...guessedLetters, letter]
    setGuessedLetters(newGuessedLetters)

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1
      setWrongGuesses(newWrongGuesses)

      if (newWrongGuesses >= 6) {
        setGameOver(true)
        setMessage(`Game over! The word was "${word}".`)
      }
    }
  }

  // Start a new game
  const resetGame = () => {
    const difficulty = 'medium' // Default difficulty
    const wordList = words[difficulty]
    const randomWord = wordList[Math.floor(Math.random() * wordList.length)]
    setWord(randomWord)
    setGuessedLetters([])
    setWrongGuesses(0)
    setGameOver(false)
    setGameWon(false)
    setMessage('Guess the word!')
  }

  // Display the word with guessed letters visible
  const displayWord = () => {
    return word
      .split('')
      .map(letter => (guessedLetters.includes(letter) ? letter : '_'))
      .join(' ')
  }

  // Draw the hangman based on wrong guesses
  const drawHangman = () => {
    const hangmanParts = [
      '  +---+',
      '  |   |',
      `  ${wrongGuesses > 0 ? 'O' : ' '}   |`,
      ` ${wrongGuesses > 2 ? '/' : ' '}${wrongGuesses > 1 ? '|' : ' '}${wrongGuesses > 3 ? '\\' : ' '}  |`,
      ` ${wrongGuesses > 4 ? '/' : ' '} ${wrongGuesses > 5 ? '\\' : ' '}  |`,
      '      |',
      '==========='
    ]

    return (
      <pre className='font-mono text-gray-300 text-sm'>
        {hangmanParts.map((line, i) => (
          <div key={i}>{line}</div>
        ))}
      </pre>
    )
  }

  // Render the keyboard
  const renderKeyboard = () => {
    const keyboard = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['z', 'x', 'c', 'v', 'b', 'n', 'm']
    ]

    return (
      <div className='keyboard flex flex-col gap-1 items-center mt-4'>
        {keyboard.map((row, i) => (
          <div key={i} className='flex gap-1'>
            {row.map(key => (
              <button
                key={key}
                onClick={() => handleGuess(key)}
                disabled={gameOver || guessedLetters.includes(key)}
                className={`w-8 h-8 rounded ${
                  guessedLetters.includes(key) ? (word.includes(key) ? 'bg-green-600 text-white' : 'bg-red-600 text-white') : 'bg-gray-700 hover:bg-gray-600 text-white'
                } ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {key}
              </button>
            ))}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className='hangman-game flex flex-col items-center'>
      <div className='game-status mb-4'>
        <p className={`text-center text-lg ${gameWon ? 'text-green-400' : gameOver ? 'text-red-400' : 'text-blue-400'}`}>{message}</p>
      </div>

      <div className='flex justify-center gap-12 items-center w-full'>
        <div className='hangman-drawing'>{drawHangman()}</div>

        <div className='word-display flex flex-col items-center gap-4'>
          <div className='text-2xl font-mono tracking-wider text-white'>{displayWord()}</div>
          <div className='text-sm text-gray-400'>Wrong guesses: {wrongGuesses}/6</div>
        </div>
      </div>

      {renderKeyboard()}

      {gameOver && (
        <button onClick={resetGame} className='mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium'>
          Play Again
        </button>
      )}
    </div>
  )
}
