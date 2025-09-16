'use client';

import React, { useState, useRef } from 'react';
import { debounce } from '@/lib/utils';
import { Header } from './header';

export const Container = ({ children }: { children: React.ReactNode }) => {
  const draggingRef = useRef(false);
  const offsetRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLElement>(null);

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isMobile) return;
    draggingRef.current = true;
    offsetRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
      setPosition({ x: 0, y: 0 });
    }
    setIsFullscreen((prev) => !prev);
  };

  React.useLayoutEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 768px)').matches);

    const { signal, abort } = new AbortController();

    const handleMouseUp = () => (draggingRef.current = false);

    const handleResize = debounce(() => {
      const mobile = window.matchMedia('(max-width: 768px)').matches;
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        if (mobile) setPosition({ x: 0, y: 0 }); // Reset position on mobile
      }
    }, 200);

    const handleMouseMove = (e: MouseEvent) => {
      if (draggingRef.current) {
        const newX = e.clientX - offsetRef.current.x;
        const newY = e.clientY - offsetRef.current.y;
        setPosition({ x: newX, y: newY });
      }
    };

    window.addEventListener('resize', handleResize, { signal });
    window.addEventListener('mouseup', handleMouseUp, { signal });
    window.addEventListener('mousemove', handleMouseMove, { signal });

    // Fullscreen change listener
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange, {
      signal,
    });

    return () => abort();
  }, []);

  return (
    <main
      ref={containerRef}
      className={`z-30 flex h-dvh w-dvw animate-wave-shadow flex-col overflow-hidden text-[#898989]/90 lg:h-[75dvh] lg:w-[70dvw] ${
        isFullscreen
          ? 'rounded-none bg-[#121212]'
          : 'bg-[#121212] lg:rounded-xl'
      }`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: draggingRef.current ? 'none' : 'transform 0.2s ease-out',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Header
        onMouseDown={handleMouseDown}
        isFullscreen={isFullscreen}
        onDoubleClick={toggleFullscreen}
        toggleFullscreen={toggleFullscreen}
      />
      <div className="flex flex-grow flex-col overflow-hidden">{children}</div>
    </main>
  );
};
