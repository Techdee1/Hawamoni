import { NextRequest, NextResponse } from 'next/server'

const API_BASE_URL = 'https://hawamoni.onrender.com'

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'GET')
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'POST')
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'PUT')
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handleRequest(request, params, 'DELETE')
}

async function handleRequest(
  request: NextRequest,
  params: { path: string[] },
  method: string
) {
  try {
    const path = params.path.join('/')
    const url = `${API_BASE_URL}/${path}`
    
    // Get search params from the request
    const searchParams = new URL(request.url).searchParams
    const queryString = searchParams.toString()
    const finalUrl = queryString ? `${url}?${queryString}` : url

    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    }

    // Copy authorization header if present
    const authHeader = request.headers.get('authorization')
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    // Prepare request config with extended timeout for slow backend
    const config: RequestInit = {
      method,
      headers,
    }

    // Add body for POST/PUT requests
    if (method === 'POST' || method === 'PUT') {
      const body = await request.text()
      if (body) {
        config.body = body
      }
    }

    console.log(`🔄 Proxying ${method} request:`)
    console.log(`  From: ${request.url}`)
    console.log(`  To: ${finalUrl}`)
    console.log(`  Headers:`, headers)
    if (config.body) {
      console.log(`  Body:`, config.body)
    }

    // Make the request with manual timeout handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 300000) // 5 minutes timeout
    
    try {
      const response = await fetch(finalUrl, {
        ...config,
        signal: controller.signal,
      })
      
      clearTimeout(timeoutId)
    
      console.log(`📡 Proxy response:`)
      console.log(`  Status: ${response.status}`)
      console.log(`  StatusText: ${response.statusText}`)

      // Get response body
      const responseText = await response.text()
      
      console.log(`  Response:`, responseText)

      // Create response with CORS headers
      const nextResponse = new NextResponse(responseText, {
        status: response.status,
        statusText: response.statusText,
      })

      // Copy content type from original response
      const contentType = response.headers.get('content-type')
      if (contentType) {
        nextResponse.headers.set('Content-Type', contentType)
      }

      // Add CORS headers
      nextResponse.headers.set('Access-Control-Allow-Origin', '*')
      nextResponse.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      nextResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

      return nextResponse
      
    } catch (error) {
      clearTimeout(timeoutId)
      console.error('🚨 Proxy error:', error)
      
      return NextResponse.json(
        { 
          error: 'Proxy request failed', 
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        },
        { 
          status: 500,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          }
        }
      )
    }
  } catch (error) {
    console.error('🚨 General proxy error:', error)
    return NextResponse.json(
      { error: 'Request failed' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        }
      }
    )
  }
}

// Handle preflight requests
export async function OPTIONS(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}