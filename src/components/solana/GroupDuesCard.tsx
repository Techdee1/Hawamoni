'use client'

import React, { useState, useCallback } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { QRCodeSVG } from 'qrcode.react'
import { 
  QrCodeIcon, 
  ShareIcon, 
  ClipboardIcon,
  CalendarIcon,
  CreditCardIcon,
  GraduationCapIcon,
  UsersIcon,
  DollarSignIcon
} from 'lucide-react'
import { solanaPayService } from '../../services/solanaPayService'
import type { GroupDuesRequest } from '../../types/solana'

interface GroupDuesCardProps {
  onSuccess?: (result: any) => void
  onError?: (error: Error) => void
  className?: string
}

export const GroupDuesCard: React.FC<GroupDuesCardProps> = ({
  onSuccess,
  onError,
  className = ''
}) => {
  const { publicKey, connected } = useWallet()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [paymentUrl, setPaymentUrl] = useState<string>('')
  
  // Form state
  const [groupName, setGroupName] = useState<string>('')
  const [duesAmount, setDuesAmount] = useState<string>('')
  const [duesDescription, setDuesDescription] = useState<string>('')
  const [dueDate, setDueDate] = useState<string>('')
  const [category, setCategory] = useState<string>('membership')

  const categories = [
    { value: 'membership', label: 'Club Membership', icon: UsersIcon },
    { value: 'event', label: 'Event Fee', icon: CalendarIcon },
    { value: 'academic', label: 'Academic Materials', icon: GraduationCapIcon },
    { value: 'other', label: 'Other', icon: CreditCardIcon }
  ]

  const createGroupDues = useCallback(async () => {
    if (!connected || !publicKey) {
      onError?.(new Error('Wallet not connected'))
      return
    }

    if (!groupName.trim() || !duesAmount || !duesDescription.trim()) {
      onError?.(new Error('Please fill all required fields'))
      return
    }

    const amount = parseFloat(duesAmount)
    if (isNaN(amount) || amount <= 0) {
      onError?.(new Error('Invalid amount'))
      return
    }

    setLoading(true)

    try {
      const groupDuesRequest: GroupDuesRequest = {
        type: 'group-dues',
        groupName: groupName.trim(),
        amount,
        description: duesDescription.trim(),
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        category,
        collectedBy: publicKey.toString(),
        metadata: {
          timestamp: Date.now(),
          campus: true,
          recurring: false
        }
      }

      const { url } = await solanaPayService.createGroupDuesPayment(groupDuesRequest)
      setPaymentUrl(url.toString())
      onSuccess?.(groupDuesRequest)
    } catch (error) {
      console.error('Group dues creation error:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to create group dues'
      setError(errorMessage)
      onError?.(error as Error)
    } finally {
      setLoading(false)
    }
  }, [
    connected, 
    publicKey, 
    groupName,
    duesAmount, 
    duesDescription, 
    dueDate,
    category,
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
          title: `${groupName} - Dues Payment`,
          text: `Pay ${duesAmount} USDC for ${duesDescription}`,
          url: paymentUrl
        })
      } catch (error) {
        console.error('Share failed:', error)
        copyToClipboard()
      }
    } else {
      copyToClipboard()
    }
  }, [paymentUrl, groupName, duesAmount, duesDescription, copyToClipboard])

  if (paymentUrl) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-purple-100 rounded-full">
              <GraduationCapIcon className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Dues Collection Ready!</h3>
          <p className="text-gray-600">Share this QR code with {groupName} members</p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Group:</span>
            <span className="font-semibold text-gray-900">{groupName}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-semibold text-gray-900">{duesAmount} USDC</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Category:</span>
            <span className="font-semibold text-gray-900 capitalize">{category.replace('-', ' ')}</span>
          </div>
          {dueDate && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Due Date:</span>
              <span className="font-semibold text-gray-900">
                {new Date(dueDate).toLocaleDateString()}
              </span>
            </div>
          )}
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
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            <ShareIcon className="w-4 h-4" />
            Share with Group
          </button>

          <button
            onClick={copyToClipboard}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <ClipboardIcon className="w-4 h-4" />
            Copy Payment Link
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Campus Collection:</strong> Members can pay instantly using any Solana wallet or scan with their phone!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-6 ${className}`}>
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-purple-100 rounded-full">
            <GraduationCapIcon className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Collect Group Dues</h3>
        <p className="text-gray-600">Perfect for club memberships, event fees, and group expenses</p>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group/Club Name *
          </label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Computer Science Society"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const IconComponent = cat.icon
              return (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={`flex items-center gap-2 p-3 rounded-lg border transition-colors ${
                    category === cat.value
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (USDC) *
          </label>
          <div className="relative">
            <DollarSignIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={duesAmount}
              onChange={(e) => setDuesAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={duesDescription}
            onChange={(e) => setDuesDescription(e.target.value)}
            placeholder="e.g., Annual membership fee for 2024"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Due Date (Optional)
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <button
        onClick={createGroupDues}
        disabled={loading || !connected || !groupName.trim() || !duesAmount || !duesDescription.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Creating Dues Collection...
          </>
        ) : (
          <>
            <QrCodeIcon className="w-4 h-4" />
            Create Dues QR Code
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
            Connect your Solana wallet to create dues collection
          </p>
        </div>
      )}
    </div>
  )
}