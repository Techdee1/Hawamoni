'use client'

import React, { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { QRCodeSVG } from 'qrcode.react'
import { 
  UserPlusIcon, 
  QrCodeIcon, 
  ShareIcon, 
  ClipboardIcon,
  PlusIcon,
  TrashIcon,
  DollarSignIcon,
  UsersIcon
} from 'lucide-react'
import { solanaPayService } from '../../services/solanaPayService'
import type { SplitBillRequest, Participant } from '../../types/solana'

interface SplitBillCardProps {
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
  className?: string
}

export const SplitBillCard: React.FC<SplitBillCardProps> = ({
  onSuccess,
  onError,
  className = ''
}) => {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  const [billAmount, setBillAmount] = useState<string>('')
  const [billDescription, setBillDescription] = useState<string>('')
  const [participants, setParticipants] = useState<Participant[]>([])
  const [newParticipantName, setNewParticipantName] = useState<string>('')
  const [newParticipantWallet, setNewParticipantWallet] = useState<string>('')

  const addParticipant = useCallback(() => {
    if (!newParticipantName.trim() || !newParticipantWallet.trim()) return

    try {
      // Validate wallet address
      new PublicKey(newParticipantWallet)
      
      const newParticipant: Participant = {
        name: newParticipantName.trim(),
        walletAddress: newParticipantWallet.trim(),
        amount: 0 // Will be calculated when creating split
      }

      setParticipants([...participants, newParticipant])
      setNewParticipantName('')
      setNewParticipantWallet('')
    } catch (error) {
      onError?.(new Error('Invalid wallet address'))
    }
  }, [newParticipantName, newParticipantWallet, participants, onError])

  const removeParticipant = useCallback((index: number) => {
    setParticipants(participants.filter((_, i) => i !== index))
  }, [participants])

  const createSplitBill = useCallback(async () => {
    if (!connected || !publicKey) {
      onError?.(new Error('Wallet not connected'))
      return
    }

    if (!billAmount || !billDescription.trim() || participants.length === 0) {
      onError?.(new Error('Please fill all fields and add participants'))
      return
    }

    const amount = parseFloat(billAmount)
    if (isNaN(amount) || amount <= 0) {
      onError?.(new Error('Invalid amount'))
      return
    }

    setLoading(true)

    try {
      const splitBillRequest: SplitBillRequest = {
        type: 'split-bill',
        totalAmount: amount,
        description: billDescription.trim(),
        participants: participants.map(p => ({
          ...p,
          amount: amount / participants.length // Equal split for now
        })),
        createdBy: publicKey.toString(),
        metadata: {
          category: 'campus-expense',
          timestamp: Date.now(),
          splitType: 'equal'
        }
      }

      const { url } = await solanaPayService.createSplitBillPayment(splitBillRequest)
      setPaymentUrl(url.toString())
      onSuccess?.(splitBillRequest)
    } catch (error) {
      console.error('Split bill creation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create split bill'
      setError(errorMessage)
      onError?.(error as Error)
    } finally {
      setLoading(false)
    }
  }, [
    connected, 
    publicKey, 
    billAmount, 
    billDescription, 
    participants, 
    onSuccess, 
    onError
  ])

  const copyToClipboard = useCallback(async () => {
    if (!paymentUrl) return
    
    try {
      await navigator.clipboard.writeText(paymentUrl)
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }, [paymentUrl])

  const sharePayment = useCallback(async () => {
    if (!paymentUrl) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: `Split Bill: ${billDescription}`,
          text: `Pay your share of ${billAmount} USDC for ${billDescription}`,
          url: paymentUrl
        })
      } catch (error) {
        console.error('Share failed:', error)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }, [paymentUrl, billDescription, billAmount, copyToClipboard])

  if (paymentUrl) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Split Bill Created!</h3>
          <p className="text-gray-600">Share this QR code with your group</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Total Amount:</span>
            <span className="font-semibold text-gray-900">{billAmount} USDC</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Per Person:</span>
            <span className="font-semibold text-gray-900">
              {(parseFloat(billAmount) / participants.length).toFixed(2)} USDC
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Participants:</span>
            <span className="font-semibold text-gray-900">{participants.length}</span>
          </div>
        </div>

        <div className="flex justify-center mb-6">
          <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
            <QRCodeSVG 
              value={paymentUrl}
              size={200}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={true}
            />
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={sharePayment}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <ShareIcon className="w-4 h-4" />
            Share Payment Link
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <ClipboardIcon className="w-4 h-4" />
            Copy Link
          </button>
        </div>

        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Pro tip:</strong> Each participant scans this QR code to pay their share directly from their mobile wallet!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-green-100 rounded-full">
            <UsersIcon className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Split Campus Bill</h3>
        <p className="text-gray-600">Perfect for group meals, events, or shared expenses</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bill Description *
          </label>
          <input
            type="text"
            value={billDescription}
            onChange={(e) => setBillDescription(e.target.value)}
            placeholder="e.g., Group dinner at cafeteria"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Amount (USDC) *
          </label>
          <div className="relative">
            <DollarSignIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={billAmount}
              onChange={(e) => setBillAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Add Participants
          </label>
          <div className="space-y-2">
            <input
              type="text"
              value={newParticipantName}
              onChange={(e) => setNewParticipantName(e.target.value)}
              placeholder="Participant name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <input
              type="text"
              value={newParticipantWallet}
              onChange={(e) => setNewParticipantWallet(e.target.value)}
              placeholder="Solana wallet address"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              onClick={addParticipant}
              disabled={!newParticipantName.trim() || !newParticipantWallet.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <PlusIcon className="w-4 h-4" />
              Add Participant
            </button>
          </div>
        </div>

        {participants.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Participants ({participants.length})
            </label>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {participants.map((participant, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{participant.name}</p>
                    <p className="text-xs text-gray-500 truncate">{participant.walletAddress}</p>
                  </div>
                  <button
                    onClick={() => removeParticipant(index)}
                    className="ml-2 p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            {billAmount && (
              <div className="mt-2 p-2 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Each person pays: <strong>{(parseFloat(billAmount) / participants.length).toFixed(2)} USDC</strong>
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={createSplitBill}
        disabled={loading || !connected || !billAmount || !billDescription.trim() || participants.length === 0}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Creating Split Bill...
          </>
        ) : (
          <>
            <QrCodeIcon className="w-4 h-4" />
            Create Split Bill QR
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            Error: {error}
          </p>
          <button 
            onClick={() => setError('')}
            className="text-xs text-red-600 hover:text-red-800 underline mt-1"
          >
            Dismiss
          </button>
        </div>
      )}

      {!connected && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Connect your Solana wallet to create split bills
          </p>
        </div>
      )}
    </div>
  )
}