import { TerminalState, TerminalTheme, TerminalShell, CommandOutput, FileSystemItem } from './terminal-context'

export interface CommandArgs {
  terminal: TerminalState
  addOutput: (output: CommandOutput) => void
  clearTerminal: () => void
  changeTheme: (theme: TerminalTheme) => void
  changeShell: (shell: TerminalShell) => void
  changeFontSize: (size: number) => void
  changeOpacity: (opacity: number) => void
  navigateFileSystem: (path: string) => void
  createTerminal: (title?: string) => string
  switchTerminal: (id: string) => void
  closeTerminal: (id: string) => void
  updateGameState: (game: string | null, data?: Record<string, unknown>) => void
  readFile: (path: string) => string | null
  findCurrentDirectory: () => FileSystemItem | null
  findFile: (path: string) => FileSystemItem | null
}
