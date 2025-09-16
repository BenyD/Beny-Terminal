'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      })

      const data = await response.json()

      if (data.success) {
        router.push('/assets')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-md space-y-6 sm:space-y-8 p-4 sm:p-6 lg:p-8'>
        <div className='text-center'>
          <h2 className='text-2xl sm:text-3xl font-bold text-white'>Assets Login</h2>
          <p className='mt-1 sm:mt-2 text-xs sm:text-sm text-[#898989]/90'>Sign in to access the assets management system</p>
        </div>

        <form className='space-y-4 sm:space-y-6' onSubmit={handleLogin}>
          <div className='space-y-3 sm:space-y-4'>
            <div>
              <label htmlFor='username' className='block text-sm font-medium text-[#898989]/90'>
                Username
              </label>
              <input
                id='username'
                name='username'
                type='text'
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className='mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-[#444444] rounded-md shadow-sm bg-[#1a1a1a] text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444] focus:border-[#444444]'
                placeholder='Enter your username'
              />
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-[#898989]/90'>
                Password
              </label>
              <input
                id='password'
                name='password'
                type='password'
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='mt-1 block w-full px-3 py-2 text-sm sm:text-base border border-[#444444] rounded-md shadow-sm bg-[#1a1a1a] text-white placeholder-[#898989]/60 focus:outline-none focus:ring-2 focus:ring-[#444444] focus:border-[#444444]'
                placeholder='Enter your password'
              />
            </div>
          </div>

          {error && <div className='text-red-400 text-xs sm:text-sm text-center'>{error}</div>}

          <div>
            <button
              type='submit'
              disabled={loading}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm sm:text-base font-medium rounded-md text-white bg-[#444444] hover:bg-[#555555] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#444444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
