'use client'

import { HTMLAttributes } from 'react'
import { LennyFace } from './lenny-face'

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  isFullscreen: boolean
  toggleFullscreen: () => void
}

export const Header = ({ isFullscreen, toggleFullscreen, ...props }: HeaderProps) => {
  return (
    <header
      className={`relative flex items-center justify-between px-4 py-3 cursor-default overflow-hidden ${isFullscreen ? 'lg:cursor-pointer' : 'lg:cursor-grab lg:active:cursor-grabbing'}`}
      {...props}
    >
      <div className='absolute lg:flex items-center top-1/2 -translate-y-1/2 group hidden'>
        <button className='h-6 w-6 rounded-full grid place-items-center' onClick={() => window.close()} aria-label='Close'>
          <div className='h-3 w-3 rounded-full bg-[#898989] group-hover:bg-[#FF6057] transition-colors' />
        </button>
        <button className='h-6 w-6 rounded-full grid place-items-center' aria-label='Minimize'>
          <div className='h-3 w-3 rounded-full bg-[#898989] group-hover:bg-[#FEBC2D] transition-colors' />
        </button>
        <button className='h-6 w-6 rounded-full grid place-items-center' onClick={toggleFullscreen} aria-label='Maximize'>
          <div className='h-3 w-3 rounded-full bg-[#898989] group-hover:bg-[#2BC840] transition-colors' />
        </button>
      </div>
      <p className='mx-auto select-none font-semibold not-sr-only hidden lg:block'>Terminal</p>

      {/* Mobile header content */}
      <div className='flex items-center justify-center w-full lg:hidden'>
        <div className='flex flex-row items-center gap-2'>
          <div className='h-2.5 w-2.5 rounded-full bg-[#2BC840] animate-pulse'></div>
          <p className='select-none font-semibold text-base'>Beny Dishon K</p>
        </div>
      </div>

      <LennyFace />
    </header>
  )
}
