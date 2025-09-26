'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiService } from '@/lib/api'

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<any>({})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkApiStatus = async () => {
      const results: any = {
        timestamp: new Date().toISOString(),
        endpoints: {}
      }

      // Test registration endpoint
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://hawamoni.onrender.com'}/moni/create`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            first_name: 'Test',
            last_name: 'User',
            email: 'test@example.com',
            password: 'test123'
          })
        })
        results.endpoints.registration = {
          status: response.status,
          statusText: response.statusText,
          working: response.status === 200
        }
      } catch (error) {
        results.endpoints.registration = { error: String(error), working: false }
      }

      // Test login endpoint
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://hawamoni.onrender.com'}/moni/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'test@example.com',
            password: 'test123'
          })
        })
        results.endpoints.login = {
          status: response.status,
          statusText: response.statusText,
          working: response.status === 200
        }
      } catch (error) {
        results.endpoints.login = { error: String(error), working: false }
      }

      // Test Google OAuth endpoint
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://hawamoni.onrender.com'}/moni/auth/google`)
        results.endpoints.googleOauth = {
          status: response.status,
          statusText: response.statusText,
          working: response.status === 302 || response.headers.get('location')
        }
      } catch (error) {
        results.endpoints.googleOauth = { error: String(error), working: false }
      }

      setApiStatus(results)
      setIsLoading(false)
    }

    checkApiStatus()
  }, [])

  const enableDemoAccess = () => {
    apiService.enableDemoAccess()
    window.location.href = '/dashboard'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solana-teal mx-auto mb-4"></div>
          <p>Testing API endpoints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-midnight text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">API Debug Dashboard</h1>
          <Link href="/" className="text-solana-teal hover:text-solana-blue">← Back to Home</Link>
        </div>

        <div className="grid gap-6">
          {/* API Status Overview */}
          <div className="bg-slate/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">API Status Overview</h2>
            <p className="text-gray-300 mb-4">Last checked: {apiStatus.timestamp}</p>
            
            <div className="grid gap-4">
              {Object.entries(apiStatus.endpoints).map(([endpoint, status]: [string, any]) => (
                <div key={endpoint} className="border border-slate/30 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium capitalize">{endpoint.replace(/([A-Z])/g, ' $1')}</h3>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      status.working 
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                      {status.working ? 'Working' : 'Issues'}
                    </span>
                  </div>
                  
                  {status.status && (
                    <p className="text-sm text-gray-400">
                      Status: {status.status} {status.statusText}
                    </p>
                  )}
                  
                  {status.error && (
                    <p className="text-sm text-red-400">Error: {status.error}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Development Tools */}
          {process.env.NODE_ENV === 'development' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Development Tools</h2>
              <p className="text-gray-300 mb-4">
                Since authentication is currently experiencing issues, you can use demo access to explore the dashboard.
              </p>
              
              <button
                onClick={enableDemoAccess}
                className="btn-primary px-6 py-3 rounded-lg font-medium"
              >
                Enable Demo Access & Go to Dashboard
              </button>
            </div>
          )}

          {/* Current Issues */}
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Known Issues</h2>
            <ul className="space-y-2 text-gray-300">
              <li>• Login endpoint returns 403 Forbidden instead of JWT tokens</li>
              <li>• Google OAuth endpoint returns empty response (200 but no content)</li>
              <li>• Registration endpoint works correctly</li>
              <li>• All authenticated endpoints return 403 errors</li>
            </ul>
            
            <div className="mt-4 p-4 bg-slate/20 rounded-lg">
              <h3 className="font-medium mb-2">Recommendations:</h3>
              <ul className="space-y-1 text-sm text-gray-400">
                <li>1. Check backend authentication configuration</li>
                <li>2. Verify Google OAuth client credentials</li>
                <li>3. Review CORS and security settings</li>
                <li>4. Test endpoints directly on the server</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}