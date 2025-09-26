'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { EyeIcon, EyeSlashIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useAuth } from '@/hooks/useAuth'

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [passwordValidation, setPasswordValidation] = useState({
    minLength: false,
    hasNumber: false,
    hasSymbol: false
  })
  
  const { register, error, clearError } = useAuth()
  const router = useRouter()

  const validatePassword = (password: string) => {
    setPasswordValidation({
      minLength: password.length >= 8,
      hasNumber: /\d/.test(password),
      hasSymbol: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (name === 'password') {
      validatePassword(value)
    }
    
    if (error) clearError()
  }

  const isFormValid = () => {
    const { first_name, last_name, email, password, confirmPassword } = formData
    return (
      first_name.trim() &&
      last_name.trim() &&
      email.trim() &&
      password &&
      confirmPassword &&
      password === confirmPassword &&
      passwordValidation.minLength &&
      passwordValidation.hasNumber &&
      passwordValidation.hasSymbol
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isFormValid()) {
      return
    }

    setIsSubmitting(true)

    try {
      const { confirmPassword, ...registerData } = formData
      const result = await register(registerData)
      
      // Show success message and redirect to sign in
      router.push('/signin?message=Registration successful! Please check your email to verify your account before signing in.')
    } catch (err) {
      // Error is handled by useAuth hook
      console.error('Registration failed:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleAuth = () => {
    // Redirect to the correct Google OAuth endpoint
    window.location.href = 'https://hawamoni.onrender.com/oauth2/authorization/google'
  }

  return (
    <div className="min-h-screen bg-midnight text-white flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
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
            Create your account
          </h2>
          <p className="mt-2 text-muted">
            Join thousands managing group funds transparently
          </p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-slate/40 backdrop-blur-sm rounded-2xl border border-slate/30 p-8 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="first_name" className="block text-sm font-medium text-white mb-2">
                  First name
                </label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate/20 border border-slate/30 rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-transparent transition-colors"
                  placeholder="John"
                />
              </div>
              
              <div>
                <label htmlFor="last_name" className="block text-sm font-medium text-white mb-2">
                  Last name
                </label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate/20 border border-slate/30 rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-transparent transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate/20 border border-slate/30 rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-transparent transition-colors"
                placeholder="john.doe@example.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate/20 border border-slate/30 rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-transparent transition-colors pr-12"
                  placeholder="Create a strong password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-3 space-y-2">
                  <div className={`flex items-center text-xs ${passwordValidation.minLength ? 'text-green-400' : 'text-muted'}`}>
                    <CheckIcon className={`h-3 w-3 mr-2 ${passwordValidation.minLength ? 'text-green-400' : 'text-muted'}`} />
                    At least 8 characters
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasNumber ? 'text-green-400' : 'text-muted'}`}>
                    <CheckIcon className={`h-3 w-3 mr-2 ${passwordValidation.hasNumber ? 'text-green-400' : 'text-muted'}`} />
                    Contains a number
                  </div>
                  <div className={`flex items-center text-xs ${passwordValidation.hasSymbol ? 'text-green-400' : 'text-muted'}`}>
                    <CheckIcon className={`h-3 w-3 mr-2 ${passwordValidation.hasSymbol ? 'text-green-400' : 'text-muted'}`} />
                    Contains a special character
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                Confirm password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-slate/20 border border-slate/30 rounded-lg text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-transparent transition-colors pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-muted hover:text-white transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>
              
              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className={`mt-2 text-xs ${
                  formData.password === formData.confirmPassword ? 'text-green-400' : 'text-red-400'
                }`}>
                  {formData.password === formData.confirmPassword ? (
                    <span className="flex items-center">
                      <CheckIcon className="h-3 w-3 mr-1" />
                      Passwords match
                    </span>
                  ) : (
                    'Passwords do not match'
                  )}
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 mt-1 rounded border-slate/30 bg-slate/20 text-solana-teal focus:ring-solana-teal focus:ring-offset-0"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-muted">
                I agree to the{' '}
                <Link href="/terms" className="text-solana-teal hover:text-solana-blue transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-solana-teal hover:text-solana-blue transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className={`w-full btn-primary py-3 text-lg font-medium transition-all duration-300 ${
                isSubmitting || !isFormValid()
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-[1.02] glow-teal'
              }`}
            >
              {isSubmitting ? 'Creating account...' : 'Create account'}
            </button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate/30" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-slate/40 text-muted">Or continue with</span>
              </div>
            </div>

            {/* Google Sign Up */}
            <button
              type="button"
              onClick={handleGoogleAuth}
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
          </form>
        </div>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-muted">
            Already have an account?{' '}
            <Link 
              href="/signin" 
              className="font-medium text-solana-teal hover:text-solana-blue transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}