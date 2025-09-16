'use client';

import React, { useEffect, useRef } from 'react';
import { useTerminal } from '@/lib/terminal-context';

export function TerminalOutput() {
  const { terminal } = useTerminal();
  const outputRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when outputs change
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [terminal.outputs]);

  // Apply theme styling
  const getThemeStyles = () => {
    switch (terminal.theme) {
      case 'monokai':
        return {
          bg: 'bg-gray-900',
          text: 'text-gray-200',
          accent: 'text-yellow-400',
          border: 'border-yellow-800',
        };
      case 'dracula':
        return {
          bg: 'bg-gray-900',
          text: 'text-purple-100',
          accent: 'text-purple-400',
          border: 'border-purple-900',
        };
      case 'solarized':
        return {
          bg: 'bg-blue-900/90',
          text: 'text-blue-100',
          accent: 'text-cyan-600',
          border: 'border-blue-800',
        };
      case 'nord':
        return {
          bg: 'bg-gray-800',
          text: 'text-gray-200',
          accent: 'text-blue-300',
          border: 'border-blue-900',
        };
      default:
        return {
          bg: 'bg-[#121212]',
          text: 'text-[#898989]/90',
          accent: 'text-green-500',
          border: 'border-[#444444]/30',
        };
    }
  };

  const { text } = getThemeStyles();

  // Function to render output
  const renderOutput = (
    output: { content: React.ReactNode; isError?: boolean; isHTML?: boolean },
    index: number
  ) => {
    if (output.isHTML) {
      return (
        <div
          key={index}
          className={`my-1 ${output.isError ? 'text-red-400' : text}`}
        >
          {output.content}
        </div>
      );
    }

    return (
      <div
        key={index}
        className={`my-1 ${output.isError ? 'text-red-400' : text} break-words`}
      >
        {String(output.content)}
      </div>
    );
  };

  return (
    <div
      ref={outputRef}
      className={`terminal-output overflow-y-auto p-2 font-mono text-xs leading-relaxed md:p-4 md:text-sm`}
      style={{
        maxHeight: 'calc(100% - 50px)',
        fontSize: `${terminal.fontSize}px`,
        opacity: terminal.opacity,
      }}
    >
      {terminal.outputs.map((output, index) => renderOutput(output, index))}
    </div>
  );
}
