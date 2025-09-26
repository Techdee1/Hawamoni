const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api/proxy' 
  : process.env.NEXT_PUBLIC_API_URL || 'https://hawamoni.onrender.com'

console.log('🔧 API Configuration:', {
  NODE_ENV: process.env.NODE_ENV,
  API_BASE_URL
})

// API Response Types
export interface UserResponse {
  id: number
  email: string
  message: string
}

export interface JwtToken {
  refresh_token: string
  refresh_expiry_time: string
  access_token: string
  access_expiry_time: string
}

export interface GroupResponse {
  groupId: number
  creator: number
  groupName: string
}

export interface ApiError {
  message: string
  status?: number
}

// Create ApiError class
class ApiErrorClass extends Error {
  status?: number
  
  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

// API Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface UserRegistration {
  first_name: string
  last_name: string
  email: string
  password: string
  role?: 'USER' | 'ADMIN'
}

export interface RefreshTokenRequest {
  email: string
  refresh_token: string
}

// API Service Class
class ApiService {
  private getHeaders(includeAuth = false): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }
    
    if (includeAuth) {
      const token = localStorage.getItem('hawamoni_access_token')
      if (token) {
        headers.Authorization = `Bearer ${token}`
      }
    }
    
    return headers
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorText = await response.text()
      
      // Provide specific error messages for common issues
      let errorMessage = errorText
      if (response.status === 403 && !errorText) {
        errorMessage = 'Access forbidden. The login endpoint may be temporarily unavailable or require account verification.'
      } else if (response.status === 401) {
        errorMessage = errorText || 'Invalid credentials. Please check your email and password.'
      }
      
      throw new ApiErrorClass(
        errorMessage || `HTTP error! status: ${response.status}`,
        response.status
      )
    }
    
    const contentType = response.headers.get('content-type')
    if (contentType && contentType.includes('application/json')) {
      return response.json()
    }
    
    return response.text() as T
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<JwtToken> {
    console.log('🔑 Attempting login for:', credentials.email)

    try {
      const response = await fetch(`${API_BASE_URL}/moni/auth/login`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(credentials),
      })
      
      console.log('🔑 Login response status:', response.status)
      
      // Handle the case where login returns 403 (API issue)
      if (response.status === 403) {
        throw new ApiErrorClass(
          'Login is currently unavailable due to backend authentication issues. Both email/password login and Google OAuth are returning errors. Registration works correctly, but authentication endpoints need backend fixes. In development, you can use demo access above.',
          403
        )
      }
      
      const result = await this.handleResponse<JwtToken>(response)
      
      // Store tokens in localStorage
      if (result.access_token) {
        console.log('💾 Storing tokens in localStorage')
        localStorage.setItem('hawamoni_access_token', result.access_token)
        localStorage.setItem('hawamoni_refresh_token', result.refresh_token)
        localStorage.setItem('hawamoni_user_email', credentials.email)
        
        // Verify tokens were stored
        const storedAccessToken = localStorage.getItem('hawamoni_access_token')
        const storedEmail = localStorage.getItem('hawamoni_user_email')
        console.log('💾 Verification - Access token stored:', !!storedAccessToken)
        console.log('💾 Verification - Email stored:', storedEmail)
        console.log('💾 Access token length:', storedAccessToken?.length || 0)
      }
      
      console.log('✅ Login successful, tokens stored')
      return result
    } catch (error) {
      console.error('🚨 Login Error:', error)
      throw error
    }
  }

  async loginWithGoogle(): Promise<void> {
    // For OAuth flows, redirect directly to the production API, not through proxy
    const oauthUrl = process.env.NEXT_PUBLIC_API_URL || 'https://hawamoni.onrender.com'
    window.location.href = `${oauthUrl}/moni/auth/google`
  }

  async register(userData: UserRegistration): Promise<UserResponse> {
    console.log('📝 Attempting registration for:', userData.email)

    try {
      const response = await fetch(`${API_BASE_URL}/moni/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      })
      
      console.log('📝 Registration response status:', response.status)
      
      return await this.handleResponse<UserResponse>(response)
    } catch (error) {
      console.error('🚨 Registration Error:', error)
      throw error
    }
  }

  async refreshToken(): Promise<JwtToken> {
    const email = localStorage.getItem('hawamoni_user_email')
    const refreshToken = localStorage.getItem('hawamoni_refresh_token')
    
    if (!email || !refreshToken) {
      throw new Error('No refresh token available')
    }

    const response = await fetch(`${API_BASE_URL}/moni/token/refresh`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        email,
        refresh_token: refreshToken
      }),
    })
    
    const result = await this.handleResponse<JwtToken>(response)
    
    // Update stored tokens
    if (result.access_token) {
      localStorage.setItem('hawamoni_access_token', result.access_token)
      localStorage.setItem('hawamoni_refresh_token', result.refresh_token)
    }
    
    return result
  }

  // Google OAuth
  getGoogleAuthUrl(): string {
    return `${API_BASE_URL}/moni/auth/google`
  }

  // Logout
  logout(): void {
    localStorage.removeItem('hawamoni_access_token')
    localStorage.removeItem('hawamoni_refresh_token')
    localStorage.removeItem('hawamoni_user_email')
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    const token = localStorage.getItem('hawamoni_access_token')
    console.log('🔍 Checking authentication - token exists:', !!token)
    return !!token
  }

  // Get current user email
  getCurrentUserEmail(): string | null {
    const email = localStorage.getItem('hawamoni_user_email')
    console.log('🔍 Getting user email:', email)
    return email
  }

  // Development helper for demo access
  enableDemoAccess(email: string = 'demo@hawamoni.com'): void {
    if (process.env.NODE_ENV === 'development') {
      localStorage.setItem('hawamoni_access_token', 'dev_demo_token')
      localStorage.setItem('hawamoni_user_email', email)
      console.log('🚧 Demo access enabled for development')
    }
  }
}

// Export singleton instance
export const apiService = new ApiService()

// Export classes
export { ApiService, ApiErrorClass }