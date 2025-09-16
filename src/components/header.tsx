'use client';

import { HTMLAttributes } from 'react';
import { LennyFace } from './lenny-face';
import { SpotifyNowPlaying } from './spotify-now-playing';

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
}

export const Header = ({
  isFullscreen,
  toggleFullscreen,
  ...props
}: HeaderProps) => {
  return (
    <header
      className={`relative flex cursor-default items-center justify-between overflow-hidden px-4 py-3 ${isFullscreen ? 'lg:cursor-pointer' : 'lg:cursor-grab lg:active:cursor-grabbing'}`}
      {...props}
    >
      <div className="group absolute top-1/2 hidden -translate-y-1/2 items-center lg:flex">
        <button
          className="grid h-6 w-6 place-items-center rounded-full"
          onClick={() => window.close()}
          aria-label="Close"
        >
          <div className="h-3 w-3 rounded-full bg-[#898989] transition-colors group-hover:bg-[#FF6057]" />
        </button>
        <button
          className="grid h-6 w-6 place-items-center rounded-full"
          aria-label="Minimize"
        >
          <div className="h-3 w-3 rounded-full bg-[#898989] transition-colors group-hover:bg-[#FEBC2D]" />
        </button>
        <button
          className="grid h-6 w-6 place-items-center rounded-full"
          onClick={toggleFullscreen}
          aria-label="Maximize"
        >
          <div className="h-3 w-3 rounded-full bg-[#898989] transition-colors group-hover:bg-[#2BC840]" />
        </button>
      </div>
      <p className="not-sr-only mx-auto hidden select-none font-semibold lg:block">
        Terminal
      </p>

      {/* Mobile header content */}
      <div className="flex w-full items-center justify-center lg:hidden">
        <div className="flex flex-col items-center gap-1">
          <div className="flex flex-row items-center gap-2">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#2BC840]"></div>
            <p className="select-none text-base font-semibold">Beny Dishon K</p>
          </div>
          <SpotifyNowPlaying />
        </div>
      </div>

      <LennyFace />
    </header>
  );
};
