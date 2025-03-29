'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function ComingSoonClient() {
  const [dots, setDots] = useState('.')
  const [text, setText] = useState('')
  const fullText = 'Gallery is being developed. Check back soon.'

  // Animate dots
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots(prev => (prev.length >= 3 ? '.' : prev + '.'))
    }, 500)

    return () => clearInterval(dotsInterval)
  }, [])

  // Typewriter effect
  useEffect(() => {
    if (text.length < fullText.length) {
      const typeTimeout = setTimeout(() => {
        setText(fullText.slice(0, text.length + 1))
      }, 100)

      return () => clearTimeout(typeTimeout)
    }
  }, [text])

  return (
    <div className='flex flex-col items-center justify-center min-h-[60vh] p-6 text-[#898989]'>
      <div className='flex flex-col items-center space-y-4 max-w-md w-full'>
        <div className='w-full bg-[#191919] p-4 rounded-md border border-[#444444]/30 font-mono'>
          <div className='flex items-center gap-2 mb-3'>
            <div className='h-2.5 w-2.5 rounded-full bg-[#FF6057]'></div>
            <div className='h-2.5 w-2.5 rounded-full bg-[#FEBC2D]'></div>
            <div className='h-2.5 w-2.5 rounded-full bg-[#2BC840]'></div>
            <span className='text-xs ml-2 text-[#898989]'>~/photos</span>
          </div>

          <div className='space-y-2'>
            <div className='flex'>
              <span className='text-green-500 mr-2'>$</span>
              <span className='text-[#898989]'>
                loading_gallery<span className='text-green-500'>{dots}</span>
              </span>
            </div>

            <div className='flex'>
              <span className='text-green-500 mr-2'>$</span>
              <span className='text-[#898989]'>{text}</span>
              <span className='animate-blink'>▋</span>
            </div>

            <div className='mt-6 text-center flex flex-col gap-3'>
              <div className='inline-block bg-[#242424] px-4 py-2 rounded-md border border-[#444444]/30 text-[#898989] hover:bg-[#2a2a2a] transition-colors'>
                <span className='text-[#FEBC2D] mr-1'>{'>'}</span> Photography collection coming soon
              </div>

              <Link href='/' className='inline-block bg-[#242424] px-4 py-2 rounded-md border border-[#444444]/30 text-[#898989] hover:bg-[#2a2a2a] transition-colors'>
                <span className='text-[#FF6057] mr-1'>{'<'}</span> Back to home
              </Link>
            </div>
          </div>
        </div>

        <div className='text-sm text-[#898989]/70 text-center mt-4'>
          <p>Capturing moments through my lens...</p>
        </div>
      </div>
    </div>
  )
}
