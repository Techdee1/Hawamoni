import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Utility function to merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format SOL amounts for display
 */
export function formatSOL(lamports: number, decimals: number = 2): string {
  const sol = lamports / 1_000_000_000
  return sol.toFixed(decimals)
}

/**
 * Truncate wallet addresses for display
 */
export function truncateAddress(address: string, chars: number = 4): string {
  if (address.length <= chars * 2) return address
  return `${address.slice(0, chars)}...${address.slice(-chars)}`
}

/**
 * Format dates for display
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  
  return dateObj.toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

/**
 * Relative time formatting (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000)

  if (diffInSeconds < 60) return 'Just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`
  
  return formatDate(dateObj, { month: 'short', day: 'numeric' })
}

/**
 * Generate a random reference key for Solana Pay
 */
export function generateReference(): string {
  return Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
  ).join('')
}

/**
 * Validate Solana public key format
 */
export function isValidPublicKey(pubkey: string): boolean {
  try {
    // Basic validation for Solana public key format
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(pubkey)
  } catch {
    return false
  }
}

/**
 * Sleep utility for delays
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Debounce utility for search inputs
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout

  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * Calculate approval percentage
 */
export function calculateApprovalPercentage(approvals: number, total: number): number {
  if (total === 0) return 0
  return Math.round((approvals / total) * 100)
}

/**
 * Check if request can be executed (has enough approvals)
 */
export function canExecuteRequest(approvalsCount: number, approvalsRequired: number): boolean {
  return approvalsCount >= approvalsRequired
}

/**
 * Environment variable helpers
 */
export const env = {
  NODE_ENV: process.env.NODE_ENV,
  SOLANA_NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  SOLANA_RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  DEBUG_MODE: process.env.NEXT_PUBLIC_DEBUG_MODE === 'true',
  ENABLE_PUSH_NOTIFICATIONS: process.env.NEXT_PUBLIC_ENABLE_PUSH_NOTIFICATIONS === 'true',
  ENABLE_CAMERA_QR: process.env.NEXT_PUBLIC_ENABLE_CAMERA_QR === 'true',
} as const

/**
 * Local storage helpers with error handling
 */
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null
    
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },

  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Fail silently
    }
  },

  remove: (key: string): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.removeItem(key)
    } catch {
      // Fail silently
    }
  },

  clear: (): void => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.clear()
    } catch {
      // Fail silently
    }
  }
}