'use client';

import React, { KeyboardEvent, useEffect, useState } from 'react';
import { useTerminal } from '@/lib/terminal-context';

// Autocomplete suggestion type
interface AutocompleteSuggestion {
  command: string;
  description: string;
}

export function TerminalInput() {
  const {
    input,
    setInput,
    executeCommand,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    terminal,
    clearTerminal,
    inputRef,
    focusInput,
  } = useTerminal();

  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Focus input on mount and check mobile
  useEffect(() => {
    focusInput();

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initialize
    checkMobile();

    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [focusInput]);

  // Basic commands for autocomplete
  const basicCommands: AutocompleteSuggestion[] = [
    { command: 'help', description: 'Show available commands' },
    { command: 'clear', description: 'Clear the terminal screen' },
    { command: 'ls', description: 'List directory contents' },
    { command: 'cd', description: 'Change directory' },
    { command: 'cat', description: 'View file contents' },
    { command: 'pwd', description: 'Print working directory' },
    { command: 'theme', description: 'Change terminal theme' },
    { command: 'shell', description: 'Change shell type' },
    { command: 'fontsize', description: 'Change font size' },
    { command: 'opacity', description: 'Change terminal opacity' },
    { command: 'about', description: 'About me' },
    { command: 'skills', description: 'View my skills' },
    { command: 'contact', description: 'View contact information' },
    { command: 'neofetch', description: 'Display system information' },
    { command: 'cowsay', description: 'Have a cow say something' },
    { command: 'matrix', description: 'Display Matrix animation' },
    { command: 'sys', description: 'Show system stats' },
    { command: 'uptime', description: 'Show system uptime' },
    { command: 'games', description: 'List available games' },
    { command: 'hangman', description: 'Play Hangman game' },
    { command: 'tictactoe', description: 'Play Tic-tac-toe game' },
    { command: 'weather', description: 'Show weather information' },
    { command: 'new-term', description: 'Open a new terminal' },
    { command: 'history', description: 'Show command history' },
  ];

  // Handle key events for command execution and history navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (showSuggestions) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSuggestion((prev) => (prev + 1) % suggestions.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSuggestion(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length
        );
      } else if (e.key === 'Tab' || e.key === 'Enter') {
        e.preventDefault();
        if (suggestions.length > 0) {
          setInput(suggestions[selectedSuggestion].command);
          setShowSuggestions(false);
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
      return;
    }

    if (e.key === 'Enter') {
      if (input.trim()) {
        executeCommand(input.trim());
        setInput('');
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex + 1;
        if (newIndex <= commandHistory.length) {
          setHistoryIndex(newIndex);
          setInput(commandHistory[commandHistory.length - newIndex]);
        }
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(
          newIndex === 0 ? '' : commandHistory[commandHistory.length - newIndex]
        );
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      handleTabCompletion();
    } else if (e.key === 'c' && e.ctrlKey) {
      setInput('');
      executeCommand('^C');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      clearTerminal();
    }
  };

  // Handle tab completion
  const handleTabCompletion = () => {
    if (!input) return;

    // Get typing command
    const parts = input.split(' ');
    const cmd = parts[0];

    // Filter suggestions based on input
    const filtered = basicCommands.filter((c) =>
      c.command.startsWith(cmd.toLowerCase())
    );

    if (filtered.length === 1 && parts.length === 1) {
      // Single match for command
      setInput(filtered[0].command + ' ');
    } else if (filtered.length > 0) {
      // Multiple matches - show suggestions
      setSuggestions(filtered);
      setShowSuggestions(true);
      setSelectedSuggestion(0);
    }
  };

  const getPromptStyle = () => {
    const { theme } = terminal;
    switch (theme) {
      case 'monokai':
        return 'text-yellow-400';
      case 'dracula':
        return 'text-purple-400';
      case 'solarized':
        return 'text-cyan-600';
      case 'nord':
        return 'text-blue-300';
      default:
        return 'text-green-500';
    }
  };

  const getPromptText = () => {
    const dir = terminal.currentDirectory.join('/');

    // Simplified prompt for mobile
    if (isMobile) {
      return `~/${dir}$ `;
    }

    // Regular prompts for desktop
    switch (terminal.shell) {
      case 'zsh':
        return `beny@portfolio ~/${dir} % `;
      case 'fish':
        return `~/beny-portfolio ${dir}> `;
      case 'powershell':
        return `PS ~/beny-portfolio/${dir}> `;
      default: // bash
        return `beny@portfolio:~/${dir}$ `;
    }
  };

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setShowSuggestions(false);
  };

  // Handle terminal container click to focus input
  const handleContainerClick = () => {
    focusInput();
  };

  return (
    <div onClick={handleContainerClick} className="terminal-input relative">
      <div className="flex items-center">
        <span
          className={`${getPromptStyle()} mr-2 shrink-0 text-xs md:text-sm`}
        >
          {getPromptText()}
        </span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="flex-1 border-none bg-transparent text-xs text-white outline-none md:text-sm"
          spellCheck="false"
          autoComplete="off"
          aria-label="Terminal input"
        />
        <span className="h-4 w-2 animate-blink bg-gray-400"></span>
      </div>

      {/* Autocomplete suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute bottom-full left-0 z-10 max-h-48 w-full overflow-y-auto rounded-md border border-gray-700 bg-gray-900 shadow-lg">
          {suggestions.map((suggestion, idx) => (
            <div
              key={suggestion.command}
              className={`flex justify-between px-3 py-1 ${idx === selectedSuggestion ? 'bg-gray-700' : ''}`}
              onClick={() => {
                setInput(suggestion.command + ' ');
                setShowSuggestions(false);
                focusInput();
              }}
            >
              <span className="text-white">{suggestion.command}</span>
              <span className="hidden text-xs text-gray-400 sm:inline">
                {suggestion.description}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
