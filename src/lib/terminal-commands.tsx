'use client'

import React from 'react'
import { CommandOutput, TerminalTheme, TerminalShell, FileSystemItem } from './terminal-context'
import * as asciiArt from './ascii-art'

// Command handler type
export type CommandHandler = (args: string[], terminalState: any) => CommandOutput | Promise<CommandOutput>

// Helper function to display directory contents
const formatDirectoryListing = (items: FileSystemItem[] | undefined): React.ReactNode => {
  if (!items || items.length === 0) {
    return <div>No files found.</div>
  }

  return (
    <div className='directory-listing grid grid-cols-1 md:grid-cols-2 gap-x-4'>
      {items.map((item, idx) => (
        <div key={idx} className='flex'>
          <span className={`mr-2 ${item.type === 'directory' ? 'text-blue-400' : item.type === 'link' ? 'text-cyan-400' : 'text-gray-300'}`}>
            {item.type === 'directory' ? 'dir' : item.type === 'link' ? 'lnk' : 'file'}
          </span>
          <span className={`${item.type === 'directory' ? 'text-blue-400' : item.type === 'link' ? 'text-cyan-400' : 'text-gray-300'}`}>{item.name}</span>
        </div>
      ))}
    </div>
  )
}

// Command definitions
const commands: Record<string, CommandHandler> = {
  // Navigation and file system commands
  ls: (args, { findCurrentDirectory }) => {
    const dir = findCurrentDirectory()
    if (!dir) {
      return { content: 'Error: Directory not found', isError: true }
    }

    let path = args[0]
    let targetDir = dir

    if (path) {
      const target = findCurrentDirectory().children?.find((item: FileSystemItem) => item.name === path && item.type === 'directory')

      if (!target) {
        return { content: `ls: cannot access '${path}': No such directory`, isError: true }
      }

      targetDir = target
    }

    return {
      content: formatDirectoryListing(targetDir.children),
      isHTML: true
    }
  },

  cd: (args, { navigateFileSystem }) => {
    const path = args[0] || ''
    navigateFileSystem(path)
    return { content: null }
  },

  pwd: (args, { terminal }) => {
    return { content: `/${terminal.currentDirectory.join('/')}` }
  },

  cat: (args, { readFile, findCurrentDirectory }) => {
    if (!args[0]) {
      return { content: 'cat: missing file operand', isError: true }
    }

    const content = readFile(args[0])
    if (content === null) {
      return { content: `cat: ${args[0]}: No such file or directory`, isError: true }
    }

    // Format based on file extension
    if (args[0].endsWith('.md')) {
      return {
        content: <div className='markdown-content whitespace-pre-wrap'>{content}</div>,
        isHTML: true
      }
    }

    return { content }
  },

  // Terminal customization commands
  theme: (args, { changeTheme }) => {
    const availableThemes: TerminalTheme[] = ['default', 'monokai', 'dracula', 'solarized', 'nord']
    const theme = args[0]?.toLowerCase() as TerminalTheme

    if (!theme) {
      return {
        content: `Available themes: ${availableThemes.join(', ')}`
      }
    }

    if (!availableThemes.includes(theme)) {
      return {
        content: `Theme '${theme}' not found. Available themes: ${availableThemes.join(', ')}`,
        isError: true
      }
    }

    changeTheme(theme)
    return { content: `Theme changed to '${theme}'` }
  },

  shell: (args, { changeShell }) => {
    const availableShells: TerminalShell[] = ['bash', 'zsh', 'fish', 'powershell']
    const shell = args[0]?.toLowerCase() as TerminalShell

    if (!shell) {
      return {
        content: `Available shells: ${availableShells.join(', ')}`
      }
    }

    if (!availableShells.includes(shell)) {
      return {
        content: `Shell '${shell}' not found. Available shells: ${availableShells.join(', ')}`,
        isError: true
      }
    }

    changeShell(shell)
    return { content: `Shell changed to '${shell}'` }
  },

  fontsize: (args, { changeFontSize }) => {
    const size = parseInt(args[0])

    if (isNaN(size) || size < 10 || size > 24) {
      return {
        content: 'Please provide a font size between 10 and 24',
        isError: true
      }
    }

    changeFontSize(size)
    return { content: `Font size changed to ${size}px` }
  },

  opacity: (args, { changeOpacity }) => {
    const opacity = parseFloat(args[0])

    if (isNaN(opacity) || opacity < 0.1 || opacity > 1) {
      return {
        content: 'Please provide an opacity value between 0.1 and 1.0',
        isError: true
      }
    }

    changeOpacity(opacity)
    return { content: `Opacity changed to ${opacity}` }
  },

  // System commands
  clear: (args, { clearTerminal }) => {
    clearTerminal()
    return { content: '' }
  },

  history: (args, { terminal }) => {
    if (terminal.history.length === 0) {
      return { content: 'No commands in history.' }
    }

    return {
      content: (
        <div className='history-list'>
          {terminal.history.map((cmd: string, idx: number) => (
            <div key={idx}>
              <span className='text-gray-500 mr-2'>{idx + 1}</span>
              <span>{cmd}</span>
            </div>
          ))}
        </div>
      ),
      isHTML: true
    }
  },

  uptime: (args, { terminal }) => {
    const uptime = terminal.uptime
    const hours = Math.floor(uptime / 3600)
    const minutes = Math.floor((uptime % 3600) / 60)
    const seconds = uptime % 60

    const uptimeString = [hours ? `${hours}h` : '', minutes ? `${minutes}m` : '', `${seconds}s`].filter(Boolean).join(' ')

    return { content: `Uptime: ${uptimeString}` }
  },

  sys: (args, { terminal }) => {
    const { systemStats } = terminal

    return {
      content: (
        <div className='system-stats space-y-2'>
          <div className='text-green-400 font-bold'>System Statistics:</div>
          <div className='flex items-center'>
            <span className='w-24'>CPU Usage:</span>
            <div className='w-48 h-3 bg-gray-800 rounded-full overflow-hidden'>
              <div className='h-full bg-green-500 rounded-full' style={{ width: `${systemStats.cpu}%` }}></div>
            </div>
            <span className='ml-2'>{Math.round(systemStats.cpu)}%</span>
          </div>
          <div className='flex items-center'>
            <span className='w-24'>Memory:</span>
            <div className='w-48 h-3 bg-gray-800 rounded-full overflow-hidden'>
              <div className='h-full bg-blue-500 rounded-full' style={{ width: `${systemStats.memory}%` }}></div>
            </div>
            <span className='ml-2'>{Math.round(systemStats.memory)}%</span>
          </div>
          <div className='flex items-center'>
            <span className='w-24'>Network:</span>
            <div className='w-48 h-3 bg-gray-800 rounded-full overflow-hidden'>
              <div className='h-full bg-purple-500 rounded-full' style={{ width: `${systemStats.network}%` }}></div>
            </div>
            <span className='ml-2'>{Math.round(systemStats.network)} KB/s</span>
          </div>
          <div className='text-xs text-gray-400 mt-2'>
            Terminal running for {Math.floor(terminal.uptime / 60)}m {terminal.uptime % 60}s
          </div>
        </div>
      ),
      isHTML: true
    }
  },

  // Terminal management
  'new-term': (args, { createTerminal }) => {
    const id = createTerminal(args[0] || `term-${Date.now().toString(36).slice(-4)}`)
    return { content: `New terminal created with ID: ${id}` }
  },

  // Game commands
  games: (args, {}) => {
    return {
      content: (
        <div className='games-list space-y-2'>
          <div className='text-green-400 font-bold'>Available Games:</div>
          <div>
            <span className='text-yellow-300'>hangman</span> - Guess the word letter by letter
          </div>
          <div>
            <span className='text-yellow-300'>tictactoe</span> - Play Tic-tac-toe against the computer
          </div>
          <div>
            <span className='text-yellow-300'>matrix</span> - Display Matrix code rain effect
          </div>
          <div className='text-gray-400 mt-2'>Type the game name to start playing!</div>
        </div>
      ),
      isHTML: true
    }
  },

  // Weather command
  weather: async (args, {}) => {
    if (!args[0]) {
      return {
        content: 'Usage: weather [location] - Please specify a location (e.g., weather London)',
        isError: true
      }
    }

    const location = args.join(' ')

    try {
      // Call our weather API endpoint
      const response = await fetch(`/api/weather?location=${encodeURIComponent(location)}`)
      const data = await response.json()

      if (data.error && !data.weather) {
        return {
          content: `Error: ${data.error}`,
          isError: true
        }
      }

      const { weather } = data

      // Weather display with icon (if available)
      const getWeatherEmoji = (condition: string) => {
        const conditionMap: Record<string, string> = {
          Clear: '☀️',
          Clouds: '☁️',
          Rain: '🌧️',
          Drizzle: '🌦️',
          Thunderstorm: '⛈️',
          Snow: '❄️',
          Mist: '🌫️',
          Fog: '🌫️',
          Haze: '🌫️',
          Smoke: '🌫️',
          Dust: '🌫️',
          Sand: '🌫️',
          Ash: '🌫️',
          Squall: '💨',
          Tornado: '🌪️'
        }

        return conditionMap[condition] || '🌡️'
      }

      return {
        content: (
          <div className='weather-display space-y-2'>
            <div className='text-green-400 font-bold'>
              Weather for {weather.location}
              {weather.country ? `, ${weather.country}` : ''}
            </div>

            <div className='flex items-center gap-2'>
              <span className='text-2xl'>{getWeatherEmoji(weather.condition)}</span>
              <span className='text-xl'>{weather.temperature}°C</span>
              <span className='text-gray-300'>({weather.description})</span>
            </div>

            <div className='grid grid-cols-2 gap-x-4'>
              <div>
                <span className='text-gray-400'>Humidity: </span>
                <span>{weather.humidity}%</span>
              </div>
              <div>
                <span className='text-gray-400'>Wind: </span>
                <span>{weather.wind} m/s</span>
              </div>
            </div>

            <div className='text-xs text-gray-400 mt-2'>Weather data powered by OpenWeatherMap</div>
          </div>
        ),
        isHTML: true
      }
    } catch (error) {
      console.error('Weather fetch error:', error)
      return {
        content: 'Failed to fetch weather data. Please try again later.',
        isError: true
      }
    }
  },

  hangman: (args, { updateGameState }) => {
    updateGameState('hangman')
    return { content: 'Starting Hangman game...' }
  },

  tictactoe: (args, { updateGameState }) => {
    updateGameState('tictactoe')
    return { content: 'Starting Tic-tac-toe game...' }
  },

  matrix: (args, { updateGameState }) => {
    updateGameState('matrix')
    return { content: 'Entering the Matrix...' }
  },

  // Help command
  help: (args, {}) => {
    return {
      content: (
        <div className='space-y-1'>
          <div className='font-bold text-green-400'>Available Commands:</div>
          <div>
            <span className='text-yellow-300'>help</span> - Show this help message
          </div>
          <div>
            <span className='text-yellow-300'>clear</span> - Clear the terminal
          </div>
          <div>
            <span className='text-yellow-300'>ls</span> - List directory contents
          </div>
          <div>
            <span className='text-yellow-300'>cd [directory]</span> - Change directory
          </div>
          <div>
            <span className='text-yellow-300'>cat [file]</span> - Display file contents
          </div>
          <div>
            <span className='text-yellow-300'>pwd</span> - Print current directory
          </div>
          <div>
            <span className='text-yellow-300'>theme [name]</span> - Change terminal theme (default, monokai, dracula, solarized, nord)
          </div>
          <div>
            <span className='text-yellow-300'>shell [type]</span> - Change shell style (bash, zsh, fish, powershell)
          </div>
          <div>
            <span className='text-yellow-300'>fontsize [size]</span> - Change font size (10-24)
          </div>
          <div>
            <span className='text-yellow-300'>opacity [value]</span> - Change terminal opacity (0.1-1.0)
          </div>
          <div>
            <span className='text-yellow-300'>about</span> - Display information about me
          </div>
          <div>
            <span className='text-yellow-300'>projects</span> - View list of my projects
          </div>
          <div>
            <span className='text-yellow-300'>project [name]</span> - View details for a specific project
          </div>
          <div>
            <span className='text-yellow-300'>skills</span> - View my skills
          </div>
          <div>
            <span className='text-yellow-300'>contact</span> - View contact information
          </div>
          <div>
            <span className='text-yellow-300'>resume</span> - View my resume
          </div>
          <div>
            <span className='text-yellow-300'>neofetch</span> - Display system information
          </div>
          <div>
            <span className='text-yellow-300'>cowsay [message]</span> - Have a cow say your message
          </div>
          <div>
            <span className='text-yellow-300'>matrix</span> - Display Matrix-like animation
          </div>
          <div>
            <span className='text-yellow-300'>sys</span> - Show system statistics
          </div>
          <div>
            <span className='text-yellow-300'>uptime</span> - Show system uptime
          </div>
          <div>
            <span className='text-yellow-300'>history</span> - Show command history
          </div>
          <div>
            <span className='text-yellow-300'>games</span> - List available games
          </div>
          <div>
            <span className='text-yellow-300'>weather [location]</span> - Show weather for location
          </div>
          <div>
            <span className='text-yellow-300'>new-term</span> - Open a new terminal
          </div>
          <div className='mt-2 text-blue-300'>
            Press <span className='font-bold'>Tab</span> for auto-completion, <span className='font-bold'>Ctrl+L</span> to clear screen, use <span className='font-bold'>↑/↓</span>{' '}
            keys for history.
          </div>
        </div>
      ),
      isHTML: true
    }
  },

  // Add project command to show specific project
  project: (args, {}) => {
    if (!args[0]) {
      return {
        content: 'Usage: project [name] - Please specify a project name (e.g., project personal-website)',
        isError: true
      }
    }

    const projectName = args[0].toLowerCase()
    const projectMap: Record<string, { title: string; description: string; technologies: string[]; link: string }> = {
      'personal-website': {
        title: 'Personal Website',
        description: 'Portfolio website built with Next.js, React and Tailwind CSS. Features modern design, interactive elements, and showcases my work and skills.',
        technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
        link: 'https://beny.one'
      },
      'cv-website': {
        title: 'CV Website',
        description: 'Interactive CV website with a unique and modern design. Built with React and styled with Tailwind CSS.',
        technologies: ['React', 'Tailwind CSS', 'JavaScript'],
        link: 'https://cv.beny.one'
      },
      'g-album': {
        title: 'G-Album',
        description: 'Digital photo album application allowing users to organize and share their memories with friends and family.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Express'],
        link: 'https://g-album.com'
      },
      'maxsoft-ag': {
        title: 'MaxSoft AG',
        description: 'Company website for MaxSoft AG featuring their products, services, and team information. Built with modern web technologies.',
        technologies: ['Next.js', 'Tailwind CSS', 'TypeScript'],
        link: 'https://maxsoft.com'
      },
      'cgpa-calculator': {
        title: 'CGPA Calculator',
        description: 'Tool for calculating Cumulative Grade Point Average. Helps students track academic performance and plan their courses.',
        technologies: ['JavaScript', 'HTML', 'CSS'],
        link: 'https://cgpa-calculator.beny.one'
      },
      rapidresume: {
        title: 'RapidResume',
        description: 'Resume builder application that allows users to create professional resumes quickly with customizable templates and export options.',
        technologies: ['React', 'MongoDB', 'Express', 'Node.js'],
        link: 'https://rapidresume.beny.one'
      }
    }

    const project = projectMap[projectName]

    if (!project) {
      return {
        content: `Project "${projectName}" not found. Available projects: ${Object.keys(projectMap).join(', ')}`,
        isError: true
      }
    }

    return {
      content: (
        <div className='project-detail space-y-4'>
          <div className='flex items-center'>
            <div className='text-green-400 font-bold text-lg mr-2'>{project.title}</div>
            <a href={project.link} target='_blank' rel='noopener noreferrer' className='text-blue-400 hover:underline text-sm'>
              [{project.link}]
            </a>
          </div>

          <div className='bg-gray-800/50 p-4 rounded-md'>
            <p className='text-gray-300'>{project.description}</p>
          </div>

          <div>
            <div className='font-bold text-blue-400 mb-2'>Technologies:</div>
            <div className='flex flex-wrap gap-2'>
              {project.technologies.map((tech, idx) => (
                <div key={idx} className='px-2 py-1 bg-blue-900/30 text-blue-300 rounded-md text-sm'>
                  {tech}
                </div>
              ))}
            </div>
          </div>

          <div className='text-gray-400 mt-2 text-sm'>
            For more details, type: <span className='text-yellow-300'>cat projects/{projectName}.md</span>
          </div>
        </div>
      ),
      isHTML: true
    }
  }
}

// Add fantasy commands
commands.neofetch = (args, { terminal }) => {
  const os = 'BenyOS'
  const kernel = 'BKernel 6.4.0'
  const uptime = `${Math.floor(terminal.uptime / 60)}m ${terminal.uptime % 60}s`
  const shell = terminal.shell
  const resolution = '1920x1080'
  const wm = 'TermWM'
  const theme = terminal.theme

  return {
    content: (
      <div className='neofetch flex gap-4'>
        <pre className='text-blue-400'>{asciiArt.logo}</pre>
        <div className='neofetch-info'>
          <div>
            <span className='text-blue-400 font-bold'>OS:</span> {os}
          </div>
          <div>
            <span className='text-blue-400 font-bold'>Kernel:</span> {kernel}
          </div>
          <div>
            <span className='text-blue-400 font-bold'>Uptime:</span> {uptime}
          </div>
          <div>
            <span className='text-blue-400 font-bold'>Shell:</span> {shell}
          </div>
          <div>
            <span className='text-blue-400 font-bold'>Resolution:</span> {resolution}
          </div>
          <div>
            <span className='text-blue-400 font-bold'>WM:</span> {wm}
          </div>
          <div>
            <span className='text-blue-400 font-bold'>Theme:</span> {theme}
          </div>
          <div>
            <span className='text-blue-400 font-bold'>Terminal:</span> Beny Terminal 1.0
          </div>
        </div>
      </div>
    ),
    isHTML: true
  }
}

commands.cowsay = (args, {}) => {
  const message = args.join(' ') || 'Moo!'
  const cowOutput = asciiArt.cowTemplate(message)

  return { content: cowOutput }
}

// Portfolio-specific commands
commands.about = (args, {}) => {
  return {
    content: (
      <div className='about space-y-4'>
        <div className='text-green-400 font-bold text-lg'>About Beny</div>
        <div className='space-y-2'>
          <p>Self taught software engineer based in Chennai, India.</p>
          <p>Love to learn new things and I'm always looking for new challenges to solve.</p>
        </div>
        <div className='text-gray-400 text-sm mt-4'>Type 'skills' to see my technical skills or 'projects' for my portfolio.</div>
      </div>
    ),
    isHTML: true
  }
}

commands.skills = (args, {}) => {
  const skills = {
    frontend: ['JavaScript', 'TypeScript', 'React', 'Next.js', 'Tailwind CSS', 'HTML/CSS'],
    backend: ['Node.js', 'Express', 'RESTful APIs', 'Databases'],
    tools: ['Git', 'VS Code', 'Terminal', 'Figma']
  }

  return {
    content: (
      <div className='skills space-y-4'>
        <div className='text-green-400 font-bold text-lg'>Technical Skills</div>

        <pre className='skills-ascii text-blue-300 font-mono text-sm'>{asciiArt.skillsArt}</pre>

        <div className='skill-category'>
          <div className='text-blue-400 font-bold'>Frontend</div>
          <div className='flex flex-wrap gap-2 mt-1'>
            {skills.frontend.map((skill, idx) => (
              <div key={idx} className='px-2 py-1 bg-blue-900/30 text-blue-300 rounded-md text-sm'>
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className='skill-category mt-3'>
          <div className='text-purple-400 font-bold'>Backend</div>
          <div className='flex flex-wrap gap-2 mt-1'>
            {skills.backend.map((skill, idx) => (
              <div key={idx} className='px-2 py-1 bg-purple-900/30 text-purple-300 rounded-md text-sm'>
                {skill}
              </div>
            ))}
          </div>
        </div>

        <div className='skill-category mt-3'>
          <div className='text-yellow-400 font-bold'>Tools</div>
          <div className='flex flex-wrap gap-2 mt-1'>
            {skills.tools.map((skill, idx) => (
              <div key={idx} className='px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded-md text-sm'>
                {skill}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    isHTML: true
  }
}

commands.projects = (args, {}) => {
  const projects = [
    {
      name: 'Personal Website',
      description: 'Portfolio website built with Next.js, React and Tailwind CSS',
      technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS'],
      link: 'https://beny.one'
    },
    {
      name: 'CV Website',
      description: 'Interactive CV website with a unique and modern design',
      technologies: ['React', 'Tailwind CSS'],
      link: 'https://cv.beny.one'
    },
    {
      name: 'G-Album',
      description: 'Digital photo album application for organizing and sharing memories',
      technologies: ['React', 'Node.js', 'MongoDB'],
      link: 'https://g-album.com'
    },
    {
      name: 'MaxSoft AG',
      description: 'Company website for MaxSoft AG featuring their products and services',
      technologies: ['Next.js', 'Tailwind CSS', 'TypeScript'],
      link: 'https://maxsoft.com'
    },
    {
      name: 'CGPA Calculator',
      description: 'Tool for calculating and tracking academic performance',
      technologies: ['JavaScript', 'HTML/CSS'],
      link: 'https://cgpa-calculator.beny.one'
    },
    {
      name: 'RapidResume',
      description: 'Resume builder application with customizable templates',
      technologies: ['React', 'MongoDB', 'Express'],
      link: 'https://rapidresume.beny.one'
    }
  ]

  return {
    content: (
      <div className='projects space-y-4'>
        <div className='text-green-400 font-bold text-lg'>My Projects</div>

        {projects.map((project, idx) => (
          <div key={idx} className='project p-3 border border-gray-700 rounded-md'>
            <div className='font-bold text-blue-400'>{project.name}</div>
            <div className='mt-1 text-gray-300'>{project.description}</div>
            <div className='flex flex-wrap gap-2 mt-2'>
              {project.technologies.map((tech, techIdx) => (
                <div key={techIdx} className='px-1.5 py-0.5 bg-gray-800 text-gray-300 rounded text-xs'>
                  {tech}
                </div>
              ))}
            </div>
            <div className='mt-2'>
              <a href={project.link} target='_blank' rel='noopener noreferrer' className='text-green-400 hover:underline text-sm'>
                View Project →
              </a>
            </div>
          </div>
        ))}

        <div className='mt-2 text-gray-400 text-sm'>
          To see more details, navigate to the projects directory: <span className='text-yellow-300'>cd projects</span> and use <span className='text-yellow-300'>ls</span> to list
          files, then <span className='text-yellow-300'>cat [filename]</span> to read.
        </div>
      </div>
    ),
    isHTML: true
  }
}

commands.contact = (args, {}) => {
  return {
    content: (
      <div className='contact space-y-4'>
        <div className='text-green-400 font-bold text-lg'>Contact Information</div>

        <div className='contact-methods space-y-2'>
          <div className='flex items-center'>
            <span className='text-blue-400 font-bold w-20'>Email:</span>
            <a href='mailto:benydishon@gmail.com' className='text-blue-300 hover:underline'>
              benydishon@gmail.com
            </a>
          </div>
          <div className='flex items-center'>
            <span className='text-blue-400 font-bold w-20'>GitHub:</span>
            <a href='https://github.com/BenyD' target='_blank' rel='noopener noreferrer' className='text-blue-300 hover:underline'>
              github.com/BenyD
            </a>
          </div>
          <div className='flex items-center'>
            <span className='text-blue-400 font-bold w-20'>LinkedIn:</span>
            <a href='https://www.linkedin.com/in/benydishon/' target='_blank' rel='noopener noreferrer' className='text-blue-300 hover:underline'>
              linkedin.com/in/benydishon
            </a>
          </div>
        </div>
      </div>
    ),
    isHTML: true
  }
}

commands.resume = (args, {}) => {
  return {
    content: (
      <div className='resume space-y-4'>
        <div className='text-green-400 font-bold text-lg'>My Resume</div>

        <div className='resume-section'>
          <div className='text-blue-400 font-bold'>Education</div>
          <div className='ml-4 mt-1 space-y-2'>
            <div>
              <div className='text-gray-300 font-semibold'>Self-Taught Developer</div>
              <div className='text-gray-400'>Building projects and continuous learning</div>
            </div>
          </div>
        </div>

        <div className='resume-section mt-3'>
          <div className='text-blue-400 font-bold'>Experience</div>
          <div className='ml-4 mt-1 space-y-2'>
            <div>
              <div className='text-gray-300 font-semibold'>Freelance Developer</div>
              <div className='text-gray-400'>2020 - Present</div>
              <div className='text-gray-300 mt-1'>Developing web applications and websites for clients</div>
            </div>
          </div>
        </div>

        <div className='flex justify-center mt-4'>
          <a href='https://cv.beny.one' target='_blank' rel='noopener noreferrer' className='px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-md text-sm'>
            View Full Resume
          </a>
        </div>
      </div>
    ),
    isHTML: true
  }
}

export default commands
