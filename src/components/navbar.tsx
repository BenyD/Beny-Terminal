'use client'
import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import { useState, useEffect } from 'react'

export const Navbar = () => {
  const segment = useSelectedLayoutSegment()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  return (
    <nav className={`select-none overflow-x-auto text-sm md:text-base lg:px-4 lg:py-3 border-t border-[#444444]/30 bg-[#121212]`}>
      <div className='items-center justify-between gap-2 px-2 lg:px-0 hidden lg:flex'>
        <div className='flex items-center gap-2'>
          <div className='h-4 w-1.5 bg-[#969696]' />
          <a className='flex items-center' href='https://github.com/BenyD' target='_blank' rel='norreferrer'>
            <svg
              className='mr-1 h-3 w-3'
              xmlns='http://www.w3.org/2000/svg'
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <line x1='6' x2='6' y1='3' y2='15' />
              <circle cx='18' cy='6' r='3' />
              <circle cx='6' cy='18' r='3' />
              <path d='M18 9a9 9 0 0 1-9 9' />
            </svg>
            main
          </a>
        </div>
        <div className='flex items-center gap-x-2 not-sr-only'>
          <p>-- VIEW --</p>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className='hidden md:flex items-center justify-between gap-20 overflow-x-auto px-2 py-3 leading-none lg:px-0 lg:py-0'>
        <ul className='flex items-center'>
          <li className='mr-1 bg-[#969696] px-2 py-0.5 leading-none text-black not-sr-only'>tmux</li>
          {menu.map(item => {
            const isActived = segment === item.href.split('/')[1] || (segment === null && item.href === '/')
            return (
              <li key={item.title} className='shrink-0'>
                {item.href.startsWith('http') ? (
                  <a
                    href={item.href}
                    target='_blank'
                    rel='noreferrer'
                    className={`flex items-center gap-1.5 px-2 py-0.5 leading-none transition-all ${isActived && 'bg-[#969696] text-black'}`}
                  >
                    {item.title}
                  </a>
                ) : (
                  <Link href={item.href} className={`flex items-center gap-1.5 px-2 py-0.5 leading-none transition-all ${isActived && 'bg-[#969696] text-black'}`}>
                    {item.title}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
        <div className='lg:flex hidden items-center gap-2 not-sr-only'>
          <p className='shrink-0 bg-[#969696] px-2 py-0.5 leading-none text-black'>Macbook-Pro-M4</p>
        </div>
      </div>

      {/* Mobile Menu Toggle Button */}
      <div className='md:hidden flex items-center justify-between px-4 py-3'>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className='flex items-center gap-2' aria-label='Toggle mobile menu'>
          <div className={`w-5 h-0.5 bg-[#969696] transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}></div>
          <div className={`w-5 h-0.5 bg-[#969696] transition-all ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></div>
          <div className={`w-5 h-0.5 bg-[#969696] transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}></div>
          <span className='text-[#969696] ml-2'>menu</span>
        </button>
        <div className='flex items-center'>
          <p className='text-[#969696]'>~ beny.one</p>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden px-2 py-3 rounded-md mx-2 mb-3 shadow-lg border border-[#444444]/30 animate-fadeIn bg-[#121212]`}>
          <ul className='flex flex-col space-y-2'>
            {menu.map(item => {
              const isActived = segment === item.href.split('/')[1] || (segment === null && item.href === '/')
              return (
                <li key={item.title} className='w-full'>
                  {item.href.startsWith('http') ? (
                    <a
                      href={item.href}
                      target='_blank'
                      rel='noreferrer'
                      className={`block w-full px-4 py-2.5 rounded-md transition-all ${
                        isActived ? 'bg-[#969696] text-black' : 'hover:bg-[#1a1a1a]/50 active:bg-[#242424]/70'
                      } flex items-center`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className='w-1.5 h-1.5 rounded-full mr-2 bg-[#969696] opacity-70'></span>
                      {item.title}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block w-full px-4 py-2.5 rounded-md transition-all ${
                        isActived ? 'bg-[#969696] text-black' : 'hover:bg-[#1a1a1a]/50 active:bg-[#242424]/70'
                      } flex items-center`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <span className='w-1.5 h-1.5 rounded-full mr-2 bg-[#969696] opacity-70'></span>
                      {item.title}
                    </Link>
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </nav>
  )
}

const menu = [
  {
    title: 'home',
    href: '/'
  },
  {
    title: 'abouts',
    href: '/abouts/personal'
  },
  {
    title: 'projects',
    href: '/projects'
  },
  {
    title: 'stats',
    href: '/stats'
  },
  {
    title: 'resume',
    href: 'https://cv.beny.one'
  },
  {
    title: 'photos',
    href: 'https://photos.beny.one'
  },
  {
    title: 'articles',
    href: '/articles'
  }
]
