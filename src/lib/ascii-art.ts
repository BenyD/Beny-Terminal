/**
 * Collection of ASCII art for the terminal
 */

// Beny logo
export const logo = `
 ______   ________  ____  _____  ____  ____
|_   _ \\ |_   __  ||_   \\|_   _||_  _||_  _|
  | |_) |  | |_ \\_|  |   \\ | |    \\ \\  / /
  |  __'.  |  _| _   | |\\ \\| |     \\ \\/ /
 _| |__) |_| |__/ | _| |_\\   |_    _|  |_
|_______/|________||_____|\\_____||______|
`

// Terminal welcome message
export const welcome = `
╭────────────────────────────────────────────────────╮
│                                                    │
│   Welcome to Beny's Terminal Portfolio             │
│                                                    │
│   Type 'help' to see available commands            │
│   Type 'about' to learn more about me              │
│   Type 'projects' to see my work                   │
│                                                    │
╰────────────────────────────────────────────────────╯
`

// Skills visualization
export const skillsArt = `
  JavaScript [█████████░] 90%
  React      [████████░░] 80%
  Node.js    [███████░░░] 70%
  TypeScript [████████░░] 80%
  HTML/CSS   [████████░░] 80%
  Next.js    [████████░░] 80%
`

// Cowsay template
export const cowTemplate = (message: string) => {
  const length = message.length
  const top = '┌' + '─'.repeat(length + 2) + '┐'
  const bottom = '└' + '─'.repeat(length + 2) + '┘'

  return `
${top}
│ ${message} │
${bottom}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
`
}

// "404 Not Found" art
export const notFound = `
  _  _    ___  _  _   
 | || |  / _ \\| || |  
 | || |_| | | | || |_ 
 |__   _| | | |__   _|
    | | | |_| |  | |  
    |_|  \\___/   |_|  
                      
    Not Found
`

// Terminal animation frames (for loading)
export const loadingFrames = ['[    ]', '[=   ]', '[==  ]', '[=== ]', '[====]', '[ ===]', '[  ==]', '[   =]']

// Matrix-like symbols for Matrix effect
export const matrixSymbols = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
