'use client'

import { CommandArgs } from './types'
import commands from './terminal-commands'
import { CommandOutput } from './terminal-context'

// Process a command string and return output
export async function processCommand(commandString: string, terminalState: CommandArgs): Promise<CommandOutput> {
  if (!commandString.trim()) {
    return { content: '' }
  }

  // Parse command and arguments
  const args = commandString.trim().split(/\s+/)
  const cmd = args[0].toLowerCase()
  const params = args.slice(1)

  try {
    // Check if command exists
    if (cmd in commands) {
      return await commands[cmd as keyof typeof commands](params, terminalState)
    }

    // Handle command not found
    return {
      content: `Command not found: ${cmd}. Type 'help' for a list of commands.`,
      isError: true
    }
  } catch (error) {
    console.error('Error executing command:', error)
    return {
      content: `Error executing command: ${error}`,
      isError: true
    }
  }
}
