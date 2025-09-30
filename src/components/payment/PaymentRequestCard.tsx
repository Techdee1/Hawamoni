'use client'

import React, { useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { useWallet } from '@solana/wallet-adapter-react'
import { solanaPayService } from '@/services/solanaPayService'
import { SolanaPayURL, PaymentRequestData } from '@/types/solana'
import { 
  ClipboardDocumentIcon, 
  ShareIcon,
  QrCodeIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

interface PaymentRequestProps {
  request: PaymentRequestData
  onPaymentComplete?: (signature: string) => void
  onPaymentError?: (error: string) => void
}

export function PaymentRequestCard({ 
  request, 
  onPaymentComplete, 
  onPaymentError 
}: PaymentRequestProps) {
  const { connected } = useWallet()
  const [paymentData, setPaymentData] = useState<SolanaPayURL | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [timeLeft, setTimeLeft] = useState<string>('')

  // Generate payment request on mount
  useEffect(() => {
    const generatePayment = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const solanaPayRequest = {
          recipient: request.recipientWallet,
          amount: new (await import('bignumber.js')).default(request.amount),
          label: 'Hawamoni - Campus Payment',
          message: request.memo || `Payment request from Hawamoni`,
          memo: request.memo
        }

        const paymentUrl = await solanaPayService.generatePaymentRequest(solanaPayRequest)
        setPaymentData(paymentUrl)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to generate payment request'
        setError(errorMessage)
        onPaymentError?.(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }

    if (request.recipientWallet && request.amount > 0) {
      generatePayment()
    }
  }, [request, onPaymentError])

  // Update countdown timer
  useEffect(() => {
    if (!request.expiresAt) return

    const updateTimer = () => {
      const now = new Date()
      const expiry = new Date(request.expiresAt!)
      const diff = expiry.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeLeft('Expired')
        return
      }

      const minutes = Math.floor(diff / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [request.expiresAt])

  // Copy payment URL to clipboard
  const copyToClipboard = async () => {
    if (!paymentData?.url) return

    try {
      await navigator.clipboard.writeText(paymentData.url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Share payment request
  const sharePayment = async () => {
    if (!paymentData?.url) return

    const shareData = {
      title: 'Solana Payment Request',
      text: `Payment request: ${request.amount} SOL${request.memo ? ` - ${request.memo}` : ''}`,
      url: paymentData.url
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback to clipboard
        await copyToClipboard()
      }
    } catch (err) {
      console.error('Failed to share:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-slate/40 backdrop-blur-sm rounded-2xl border border-slate/30 p-6">
        <div className="flex items-center justify-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-solana-teal"></div>
          <span className="text-white">Generating payment request...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
        <div className="flex items-center space-x-3">
          <XCircleIcon className="h-6 w-6 text-red-400" />
          <div>
            <h3 className="text-red-400 font-medium">Payment Request Failed</h3>
            <p className="text-red-300 text-sm mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!paymentData) {
    return null
  }

  const isExpired = request.expiresAt && new Date() > new Date(request.expiresAt)

  return (
    <div className="bg-slate/40 backdrop-blur-sm rounded-2xl border border-slate/30 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-solana-teal/20 rounded-lg">
            <CurrencyDollarIcon className="h-6 w-6 text-solana-teal" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Payment Request</h3>
            <p className="text-muted text-sm">
              {request.amount} {request.currency || 'SOL'}
            </p>
          </div>
        </div>

        {/* Timer */}
        {request.expiresAt && (
          <div className={`flex items-center space-x-1 text-sm px-3 py-1 rounded-full ${
            isExpired 
              ? 'bg-red-500/20 text-red-400' 
              : timeLeft.startsWith('0:') && parseInt(timeLeft.split(':')[1]) < 30
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-slate/20 text-muted'
          }`}>
            <ClockIcon className="h-4 w-4" />
            <span>{timeLeft}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {request.memo && (
        <div className="bg-slate/20 rounded-lg p-3">
          <p className="text-white text-sm">{request.memo}</p>
        </div>
      )}

      {/* QR Code */}
      <div className="flex justify-center">
        <div className="bg-white p-4 rounded-xl">
          <QRCodeSVG
            value={paymentData.url}
            size={200}
            level="M"
            includeMargin
          />
        </div>
      </div>

      {/* Recipient Info */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted">Recipient:</span>
          <span className="text-white font-mono">
            {request.recipientWallet.slice(0, 8)}...{request.recipientWallet.slice(-8)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted">Amount:</span>
          <span className="text-white font-semibold">
            {request.amount} {request.currency || 'SOL'}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <button
          onClick={copyToClipboard}
          className="flex-1 flex items-center justify-center space-x-2 bg-slate/20 hover:bg-slate/30 text-white px-4 py-3 rounded-lg transition-colors"
        >
          {copied ? (
            <>
              <CheckCircleIcon className="h-4 w-4 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="h-4 w-4" />
              <span>Copy URL</span>
            </>
          )}
        </button>

        <button
          onClick={sharePayment}
          className="flex-1 flex items-center justify-center space-x-2 bg-solana-teal/20 hover:bg-solana-teal/30 text-solana-teal px-4 py-3 rounded-lg transition-colors"
        >
          <ShareIcon className="h-4 w-4" />
          <span>Share</span>
        </button>
      </div>

      {/* Mobile Payment Instructions */}
      <div className="bg-solana-blue/10 border border-solana-blue/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <QrCodeIcon className="h-5 w-5 text-solana-blue mt-0.5" />
          <div className="text-sm">
            <p className="text-solana-blue font-medium mb-1">How to pay:</p>
            <ol className="text-muted space-y-1 list-decimal list-inside">
              <li>Open your Solana wallet app (Phantom, Solflare, etc.)</li>
              <li>Scan this QR code or paste the payment URL</li>
              <li>Confirm the payment in your wallet</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Status indicator if expired */}
      {isExpired && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <XCircleIcon className="h-5 w-5 text-red-400" />
            <span className="text-red-400 font-medium">This payment request has expired</span>
          </div>
        </div>
      )}
    </div>
  )
}