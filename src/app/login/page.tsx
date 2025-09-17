'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        const errorData = await response
          .json()
          .catch(() => ({ error: 'Login failed' }));
        setError(errorData.error || `Login failed (${response.status})`);
        return;
      }

      const data = await response.json();

      if (data.success) {
        router.push('/assets');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 p-4 sm:space-y-8 sm:p-6 lg:p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Assets Login
          </h2>
          <p className="mt-1 text-xs text-[#898989]/90 sm:mt-2 sm:text-sm">
            Sign in to access the assets management system
          </p>
        </div>

        <form className="space-y-4 sm:space-y-6" onSubmit={handleLogin}>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#898989]/90"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#444444] bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder-[#898989]/60 shadow-sm focus:border-[#444444] focus:outline-none focus:ring-2 focus:ring-[#444444] sm:text-base"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#898989]/90"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full rounded-md border border-[#444444] bg-[#1a1a1a] px-3 py-2 text-sm text-white placeholder-[#898989]/60 shadow-sm focus:border-[#444444] focus:outline-none focus:ring-2 focus:ring-[#444444] sm:text-base"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {error && (
            <div className="text-center text-xs text-red-400 sm:text-sm">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-[#444444] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#555555] focus:outline-none focus:ring-2 focus:ring-[#444444] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
