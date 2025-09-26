import { useState, useEffect } from 'react'

interface User {
  email: string
  id: number
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  error: string | null
}

interface LoginRequest {
  email: string
  password: string
}

interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
}

interface JwtToken {
  access_token: string
  refresh_token: string
  access_expiry_time: string
  refresh_expiry_time: string
}

const API_BASE_URL = '/api/auth'

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
    error: null
  })

  // Check authentication status on mount
  useEffect(() => {
    const token = localStorage.getItem('hawamoni_token')
    const userEmail = localStorage.getItem('hawamoni_user_email')
    const userId = localStorage.getItem('hawamoni_user_id')

    if (token && userEmail && userId) {
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: { email: userEmail, id: parseInt(userId) },
        error: null
      })
    } else {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
        error: null
      })
    }
  }, [])

  const login = async (credentials: LoginRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      if (!response.ok) {
        throw new Error(`Login failed: ${response.status}`)
      }

      const data: JwtToken = await response.json()

      // Store authentication data
      localStorage.setItem('hawamoni_token', data.access_token)
      localStorage.setItem('hawamoni_refresh_token', data.refresh_token)
      localStorage.setItem('hawamoni_user_email', credentials.email)
      
      // For now, we'll set a default user ID since the API doesn't return user info
      localStorage.setItem('hawamoni_user_id', '1')

      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user: { email: credentials.email, id: 1 },
        error: null
      })

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Login failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('hawamoni_token')
    localStorage.removeItem('hawamoni_refresh_token')
    localStorage.removeItem('hawamoni_user_email')
    localStorage.removeItem('hawamoni_user_id')

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
      error: null
    })
  }

  const register = async (credentials: RegisterRequest) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      // Add default role to registration data
      const registrationData = {
        ...credentials,
        role: 'USER' as const
      }

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `Registration failed: ${response.status}`)
      }

      const data = await response.json()

      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: null
      }))

      return data

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Registration failed'
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }))
      throw error
    }
  }

  const clearError = () => {
    setAuthState(prev => ({ ...prev, error: null }))
  }

  return {
    ...authState,
    login,
    register,
    logout,
    clearError
  }
}