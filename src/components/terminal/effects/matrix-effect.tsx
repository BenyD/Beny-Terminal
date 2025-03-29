'use client'

import React, { useEffect, useRef } from 'react'

export function MatrixEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions to match parent container
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    // Initialize canvas size
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Define characters to use (mix of letters, Japanese-like characters, and numbers)
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'

    // Set up the drops
    const fontSize = 14
    const columns = Math.floor(canvas.width / fontSize)

    // Array to store the Y position of each drop
    const drops: number[] = []

    // Initialize all drops at random positions above the canvas
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.floor(Math.random() * -canvas.height)
    }

    // Array to store the max length of each column
    const columnMaxLength: number[] = []
    for (let i = 0; i < columns; i++) {
      columnMaxLength[i] = Math.floor(Math.random() * 20) + 5
    }

    // Draw function
    const draw = () => {
      // Create a semi-transparent black layer for the trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Set the text color and font
      ctx.font = `${fontSize}px monospace`

      // Loop through each drop
      for (let i = 0; i < drops.length; i++) {
        // Choose a random character
        const text = chars[Math.floor(Math.random() * chars.length)]

        // For the first character in the column, make it brighter
        const yPos = drops[i] * fontSize

        // Determine color based on position in the column
        if (yPos > 0) {
          // Calculate position relative to the column length
          const maxLen = columnMaxLength[i] * fontSize
          const currentPos = yPos % (maxLen * 2)
          const relativePos = currentPos < maxLen ? currentPos / maxLen : 2 - currentPos / maxLen

          // Create a gradient from bright to dim green
          const brightness = Math.floor(relativePos * 200) + 55
          ctx.fillStyle = `rgba(0, ${brightness}, 70, 0.8)`

          // Leading character is brightest
          if (Math.floor(yPos / fontSize) === Math.floor(drops[i])) {
            ctx.fillStyle = 'rgba(180, 255, 180, 1)'
          }

          // Draw the character
          ctx.fillText(text, i * fontSize, yPos)
        }

        // Move the drop down
        drops[i]++

        // Reset drop if it's reached the bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = -columnMaxLength[i]
        }
      }
    }

    // Run the animation
    const interval = setInterval(draw, 40)

    // Cleanup
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  return <canvas ref={canvasRef} className='absolute inset-0 z-20 pointer-events-none' style={{ opacity: 0.8 }} />
}
