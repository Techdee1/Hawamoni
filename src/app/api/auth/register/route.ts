import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://hawamoni.onrender.com'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    console.log('🔄 Proxying registration request to backend...')
    
    const response = await fetch(`${API_BASE_URL}/moni/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('❌ Backend registration failed:', data)
      return NextResponse.json(data, { status: response.status })
    }

    console.log('✅ Backend registration successful')
    return NextResponse.json(data, { status: 200 })

  } catch (error) {
    console.error('🚨 Registration proxy error:', error)
    return NextResponse.json(
      { message: 'Registration request failed - service may be temporarily unavailable', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}