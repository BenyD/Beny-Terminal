'use client'

import React, { createContext, useState, useContext, useEffect, useRef } from 'react'
import * as asciiArt from './ascii-art'
import { processCommand } from './command-processor'

// Terminal theme types
export type TerminalTheme = 'default' | 'monokai' | 'dracula' | 'solarized' | 'nord'
export type TerminalShell = 'bash' | 'zsh' | 'fish' | 'powershell'

// File system types
export type FileType = 'directory' | 'file' | 'link'

export interface FileSystemItem {
  name: string
  type: FileType
  content?: string
  children?: FileSystemItem[]
  metadata?: {
    created: string
    modified: string
    size?: number
    permissions?: string
  }
}

// Command output type
export interface CommandOutput {
  content: React.ReactNode
  isError?: boolean
  isHTML?: boolean
}

// Terminal game state
export interface GameState {
  activeGame: string | null
  data: Record<string, unknown> | null
}

// Terminal state interface
interface TerminalState {
  history: string[]
  outputs: CommandOutput[]
  currentDirectory: string[]
  theme: TerminalTheme
  shell: TerminalShell
  fontSize: number
  opacity: number
  showHelp: boolean
  uptime: number
  systemStats: {
    cpu: number
    memory: number
    network: number
  }
  notifications: string[]
  activeTerminals: { id: string; title: string }[]
  activeTerminalId: string
  fileSystem: FileSystemItem[]
  gameState: GameState
}

// Terminal context interface
interface TerminalContextType {
  terminal: TerminalState
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  historyIndex: number
  setHistoryIndex: React.Dispatch<React.SetStateAction<number>>
  commandHistory: string[]
  addToHistory: (command: string) => void
  clearTerminal: () => void
  executeCommand: (command: string) => void
  addOutput: (output: CommandOutput) => void
  changeTheme: (theme: TerminalTheme) => void
  changeShell: (shell: TerminalShell) => void
  changeFontSize: (size: number) => void
  changeOpacity: (opacity: number) => void
  navigateFileSystem: (path: string) => void
  createTerminal: (title?: string) => string
  switchTerminal: (id: string) => void
  closeTerminal: (id: string) => void
  updateGameState: (game: string | null, data?: Record<string, unknown> | null) => void
  readFile: (path: string) => string | null
  inputRef: React.RefObject<HTMLInputElement>
  focusInput: () => void
}

const defaultFileSystem: FileSystemItem[] = [
  {
    name: 'home',
    type: 'directory',
    children: [
      {
        name: 'about',
        type: 'directory',
        children: [
          { name: 'bio.txt', type: 'file', content: "Self taught software engineer\nlove to learn new things and I'm always looking for new challenges to solve :)" },
          { name: 'skills.txt', type: 'file', content: 'JavaScript, TypeScript, React, Next.js, Node.js, HTML, CSS, Tailwind' }
        ]
      },
      {
        name: 'contact',
        type: 'directory',
        children: [
          { name: 'email.txt', type: 'file', content: 'hello@beny.one' },
          { name: 'social.txt', type: 'file', content: 'GitHub: https://github.com/BenyD\nTwitter: @beny_d' }
        ]
      },
      { name: '.bashrc', type: 'file', content: '# Terminal configuration' },
      { name: '.gitconfig', type: 'file', content: '[user]\n  name = Beny\n  email = hello@beny.one' }
    ]
  }
]

// Create the context
const TerminalContext = createContext<TerminalContextType | undefined>(undefined)

// Create a provider component
export function TerminalProvider({ children }: { children: React.ReactNode }) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [commandHistory, setCommandHistory] = useState<string[]>([])

  // Initialize terminal state with defaults
  const [terminal, setTerminal] = useState<TerminalState>({
    history: [],
    outputs: [
      {
        content: (
          <div className='welcome-message'>
            <pre className='text-blue-400 font-mono'>{asciiArt.welcome}</pre>
            <p className='text-gray-400 mt-2'>
              Welcome to beny.one terminal! Type <span className='text-green-400'>help</span> to see available commands.
            </p>
          </div>
        ),
        isHTML: true
      }
    ],
    currentDirectory: ['home'],
    theme: 'default',
    shell: 'bash',
    fontSize: 14,
    opacity: 0.9,
    showHelp: false,
    uptime: 0,
    systemStats: {
      cpu: 25,
      memory: 30,
      network: 10
    },
    notifications: [],
    activeTerminals: [{ id: 'main', title: 'main' }],
    activeTerminalId: 'main',
    fileSystem: defaultFileSystem,
    gameState: {
      activeGame: null,
      data: null
    }
  })

  // Update system uptime and random stats
  useEffect(() => {
    const interval = setInterval(() => {
      setTerminal(prev => ({
        ...prev,
        uptime: prev.uptime + 1,
        systemStats: {
          cpu: Math.min(100, Math.max(5, prev.systemStats.cpu + (Math.random() * 10 - 5))),
          memory: Math.min(100, Math.max(10, prev.systemStats.memory + (Math.random() * 6 - 3))),
          network: Math.min(100, Math.max(1, prev.systemStats.network + (Math.random() * 8 - 4)))
        }
      }))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Function to find current directory object in file system
  const findCurrentDirectory = (): FileSystemItem | null => {
    let current = terminal.fileSystem[0] // Start at root

    for (const segment of terminal.currentDirectory) {
      if (segment === 'home') continue // Skip root

      const child = current.children?.find(item => item.name === segment && item.type === 'directory')
      if (!child) return null
      current = child
    }

    return current
  }

  // Find file by path
  const findFile = (path: string): FileSystemItem | null => {
    // Handle absolute path
    const isAbsolute = path.startsWith('/')
    let pathSegments = path.split('/').filter(Boolean)

    if (isAbsolute) {
      // Start from root
      let current = terminal.fileSystem[0]

      for (const segment of pathSegments) {
        const child = current.children?.find(item => item.name === segment)
        if (!child) return null
        current = child
      }

      return current
    } else {
      // Start from current directory
      let current = findCurrentDirectory()
      if (!current) return null

      for (const segment of pathSegments) {
        if (segment === '..') {
          // Move up one directory
          if (terminal.currentDirectory.length > 1) {
            return findFile('/' + terminal.currentDirectory.slice(0, -1).join('/'))
          }
          continue
        }

        const child = current.children?.find(item => item.name === segment)
        if (!child) return null
        current = child
      }

      return current
    }
  }

  // Read file content
  const readFile = (path: string): string | null => {
    const file = findFile(path)
    if (!file || file.type !== 'file') return null
    return file.content || null
  }

  // Navigate file system
  const navigateFileSystem = (path: string) => {
    if (path === '/' || path === '') {
      setTerminal(prev => ({ ...prev, currentDirectory: ['home'] }))
      return
    }

    // Handle absolute path
    const isAbsolute = path.startsWith('/')
    let targetPath = [...terminal.currentDirectory]

    if (isAbsolute) {
      targetPath = ['home']
      path = path.substring(1) // Remove leading slash
    }

    const segments = path.split('/').filter(Boolean)

    for (const segment of segments) {
      if (segment === '..') {
        // Move up one directory
        if (targetPath.length > 1) {
          targetPath.pop()
        }
      } else if (segment !== '.') {
        // Verify directory exists
        let current = terminal.fileSystem[0]
        let valid = true

        for (const dir of [...targetPath.slice(1), segment]) {
          const child = current.children?.find(item => item.name === dir && item.type === 'directory')
          if (!child) {
            valid = false
            break
          }
          current = child
        }

        if (valid) {
          targetPath.push(segment)
        } else {
          addOutput({ content: `cd: ${segment}: No such directory`, isError: true })
          return
        }
      }
    }

    setTerminal(prev => ({ ...prev, currentDirectory: targetPath }))
  }

  // Add a command to history
  const addToHistory = (command: string) => {
    if (command.trim()) {
      setCommandHistory(prev => [...prev, command])
      setTerminal(prev => ({ ...prev, history: [...prev.history, command] }))
    }
  }

  // Add output to terminal
  const addOutput = (output: CommandOutput) => {
    setTerminal(prev => ({
      ...prev,
      outputs: [...prev.outputs, output]
    }))
  }

  // Clear terminal
  const clearTerminal = () => {
    setTerminal(prev => ({ ...prev, outputs: [] }))
  }

  // Change terminal theme
  const changeTheme = (theme: TerminalTheme) => {
    setTerminal(prev => ({ ...prev, theme }))
  }

  // Change shell
  const changeShell = (shell: TerminalShell) => {
    setTerminal(prev => ({ ...prev, shell }))
  }

  // Change font size
  const changeFontSize = (size: number) => {
    setTerminal(prev => ({ ...prev, fontSize: size }))
  }

  // Change opacity
  const changeOpacity = (opacity: number) => {
    setTerminal(prev => ({ ...prev, opacity }))
  }

  // Create a new terminal
  const createTerminal = (title: string = `terminal-${Date.now().toString(36)}`) => {
    const id = Date.now().toString(36)
    setTerminal(prev => ({
      ...prev,
      activeTerminals: [...prev.activeTerminals, { id, title }],
      activeTerminalId: id
    }))
    return id
  }

  // Switch active terminal
  const switchTerminal = (id: string) => {
    setTerminal(prev => ({ ...prev, activeTerminalId: id }))
  }

  // Close terminal
  const closeTerminal = (id: string) => {
    setTerminal(prev => {
      const filtered = prev.activeTerminals.filter(t => t.id !== id)
      return {
        ...prev,
        activeTerminals: filtered,
        activeTerminalId: filtered.length > 0 ? filtered[0].id : 'main'
      }
    })
  }

  // Update game state
  const updateGameState = (game: string | null, data: Record<string, unknown> | null = null) => {
    setTerminal(prev => {
      // Skip update if game state is the same
      if (prev.gameState.activeGame === game && JSON.stringify(prev.gameState.data) === JSON.stringify(data)) {
        return prev
      }

      return {
        ...prev,
        gameState: { activeGame: game, data }
      }
    })
  }

  // Focus the input field
  const focusInput = () => {
    inputRef.current?.focus()
  }

  // Execute a command
  const executeCommand = async (command: string) => {
    // Add to history
    addToHistory(command)
    setHistoryIndex(-1)

    // Add command to output
    addOutput({ content: `${getPrompt()} ${command}` })

    // Special handling for clear command (for immediate response)
    if (command.trim().toLowerCase() === 'clear') {
      clearTerminal()
      return
    }

    // Process the command using our command processor
    const result = await processCommand(command, {
      terminal,
      addOutput,
      clearTerminal,
      changeTheme,
      changeShell,
      changeFontSize,
      changeOpacity,
      navigateFileSystem,
      createTerminal,
      switchTerminal,
      closeTerminal,
      updateGameState,
      readFile,
      findCurrentDirectory,
      findFile
    })

    // Add the result to the terminal output
    if (result.content) {
      addOutput(result)
    }
  }

  // Get command prompt based on shell type
  const getPrompt = () => {
    const dir = terminal.currentDirectory.join('/')
    switch (terminal.shell) {
      case 'bash':
        return `beny@portfolio:~/${dir}$`
      case 'zsh':
        return `%`
      case 'fish':
        return `~/beny-portfolio ${dir}>`
      case 'powershell':
        return `PS ~/beny-portfolio/${dir}>`
      default:
        return '$'
    }
  }

  return (
    <TerminalContext.Provider
      value={{
        terminal,
        input,
        setInput,
        historyIndex,
        setHistoryIndex,
        commandHistory,
        addToHistory,
        clearTerminal,
        executeCommand,
        addOutput,
        changeTheme,
        changeShell,
        changeFontSize,
        changeOpacity,
        navigateFileSystem,
        createTerminal,
        switchTerminal,
        closeTerminal,
        updateGameState,
        readFile,
        inputRef,
        focusInput
      }}
    >
      {children}
    </TerminalContext.Provider>
  )
}

// Hook to use the terminal context
export function useTerminal() {
  const context = useContext(TerminalContext)
  if (context === undefined) {
    throw new Error('useTerminal must be used within a TerminalProvider')
  }
  return context
}
