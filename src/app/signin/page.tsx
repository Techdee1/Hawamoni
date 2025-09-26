'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

export default function SignInPage() {
  const { login, isLoading, error, clearError } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) clearError()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await login(formData)
      router.push('/dashboard')
    } catch (err) {
      // Error is handled by useAuth hook
      console.error('Login failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-midnight text-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-solana-teal/5 via-midnight to-solana-magenta/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-solana-teal/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-solana-blue/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center space-x-3 mb-8">
            <Image 
              src="/logo.png" 
              alt="Hawamoni Logo" 
              width={40} 
              height={40}
              className="glow-teal"
            />
            <span className="text-2xl font-bold gradient-text">Hawamoni</span>
          </Link>
          
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="mt-2 text-muted">
            Sign in to your account to manage your group treasury
          </p>
        </div>

        {/* Sign In Form */}
        <div className="bg-slate/40 backdrop-blur-sm rounded-2xl border border-slate/30 p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-slate/60 border border-slate/30 rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-transparent transition-all duration-200"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="w-full px-4 py-3 bg-slate/60 border border-slate/30 rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-solana-teal to-solana-blue hover:from-solana-teal/80 hover:to-solana-blue/80 disabled:from-slate/60 disabled:to-slate/60 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none disabled:cursor-not-allowed glow-teal-sm"
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate/30" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate/40 text-muted">Or continue with</span>
            </div>
          </div>

          {/* Google Sign In */}
          <button
            type="button"
            onClick={() => window.location.href = 'https://hawamoni.onrender.com/oauth2/authorization/google'}
            className="w-full flex items-center justify-center px-4 py-3 border border-slate/30 rounded-lg bg-slate/20 hover:bg-slate/30 text-white font-medium transition-colors"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-muted text-sm">
              Don't have an account?{' '}
              <Link 
                href="/signup" 
                className="text-solana-teal hover:text-solana-blue transition-colors font-medium"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Test Credentials */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
          <p className="text-yellow-400 text-sm">
            <strong>Test Credentials:</strong><br />
            Email: test@hawamoni.com<br />
            Password: TestPassword123
          </p>
        </div>
      </div>
    </div>
  )
}