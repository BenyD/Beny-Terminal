'use client';

import { useEffect, useState } from 'react';
import { Terminal, TypingAnimation, AnimatedSpan } from './magicui/terminal';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate progress increase during loading
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(prev + Math.random() * 5, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#121212] p-4 transition-opacity duration-300">
      <div className="w-full max-w-md">
        <Terminal className="max-h-[80vh] min-h-[300px] w-full border-[#444444]/30 bg-[#121212] shadow-lg md:max-h-[450px]">
          <TypingAnimation duration={40}>&gt; beny.one --init</TypingAnimation>

          <AnimatedSpan delay={800} className="text-green-500">
            <span>✓ Loading environment variables</span>
          </AnimatedSpan>

          <AnimatedSpan delay={1200} className="text-green-500">
            <span>✓ Connecting to server</span>
          </AnimatedSpan>

          <AnimatedSpan delay={1600} className="text-green-500">
            <span>✓ Fetching latest content</span>
          </AnimatedSpan>

          <AnimatedSpan delay={2000} className="text-blue-500">
            <span>ℹ Optimizing images and assets</span>
          </AnimatedSpan>

          <AnimatedSpan delay={2400} className="text-green-500">
            <span>✓ Building UI components</span>
          </AnimatedSpan>

          <AnimatedSpan delay={2800} className="text-green-500">
            <span>✓ Applying styles</span>
          </AnimatedSpan>

          <AnimatedSpan delay={3200} className="text-blue-500">
            <span className="flex items-center">
              <span className="mr-2">ℹ Running scripts</span>
              <span className="text-xs text-[#898989]">
                [node, react, next]
              </span>
            </span>
          </AnimatedSpan>

          <AnimatedSpan delay={3600} className="text-green-500">
            <span>✓ Initializing animations</span>
          </AnimatedSpan>

          <TypingAnimation
            delay={4000}
            duration={30}
            className="text-[#898989]"
          >
            Running final checks...
          </TypingAnimation>

          <AnimatedSpan delay={4800} className="text-xs text-[#898989]">
            <span className="flex flex-col space-y-1">
              <span>memory: 512MB allocated</span>
              <span>cpu: optimized</span>
              <span>network: stable</span>
            </span>
          </AnimatedSpan>

          <AnimatedSpan delay={5400} className="font-bold text-green-500">
            <span>✓ Application ready!</span>
          </AnimatedSpan>

          <TypingAnimation
            delay={5800}
            duration={20}
            className="text-[#898989]"
          >
            Welcome to beny.one
          </TypingAnimation>
        </Terminal>
      </div>

      <div className="mt-4 w-full max-w-md">
        <div className="h-1 w-full overflow-hidden rounded-full bg-[#222222]">
          <div
            className="h-full bg-[#969696] transition-all duration-200 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-1 flex justify-between text-xs text-[#898989]">
          <span>Loading</span>
          <span>{Math.floor(progress)}%</span>
        </div>
      </div>
    </div>
  );
}
