import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://hawamoni.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔄 Proxying login request to backend...')
    
    const response = await fetch(`${API_BASE_URL}/moni/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      redirect: 'manual', // Handle redirects manually
    })

    // Handle redirect responses
    if (response.status >= 300 && response.status < 400) {
      const redirectLocation = response.headers.get('location')
      console.error('❌ Backend login returned redirect - status:', response.status)
      console.log('Redirect location:', redirectLocation)
      console.log('Response headers:', Object.fromEntries(response.headers))
      
      // Try to get response body for more info
      let responseText = '';
      try {
        responseText = await response.text()
        console.log('Redirect response body:', responseText)
      } catch (e) {
        console.log('Could not read redirect response body')
      }
      
      return NextResponse.json(
        { message: 'This account requires Google authentication. Please use "Continue with Google" to sign in.' },
        { status: 401 }
      )
    }

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Backend login failed:', data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log('✅ Backend login successful')
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('🚨 Proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}