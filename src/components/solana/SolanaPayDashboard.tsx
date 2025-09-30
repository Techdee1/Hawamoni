'use client'

import React, { useState } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { 
  CreditCardIcon, 
  UsersIcon, 
  GraduationCapIcon,
  QrCodeIcon,
  WalletIcon,
  ArrowRightIcon
} from 'lucide-react'
import { WalletConnectionButton } from '../wallet/WalletConnectionButton'
import { SplitBillCard } from './SplitBillCard'
import { GroupDuesCard } from './GroupDuesCard'

interface SolanaPayDashboardProps {
  className?: string
}

type ActiveView = 'overview' | 'payment-request' | 'split-bill' | 'group-dues'

export const SolanaPayDashboard: React.FC<SolanaPayDashboardProps> = ({
  className = ''
}) => {
  const { connected, publicKey } = useWallet()
  const [activeView, setActiveView] = useState<ActiveView>('overview')

  const paymentOptions = [
    {
      id: 'payment-request' as const,
      title: 'Payment Request',
      description: 'Request payment for services, reimbursements, or personal transactions',
      icon: CreditCardIcon,
      color: 'blue',
      features: ['QR Code Generation', 'Custom Messages', 'Instant Notifications']
    },
    {
      id: 'split-bill' as const,
      title: 'Split Bill',
      description: 'Split expenses among friends for meals, events, or group purchases',
      icon: UsersIcon,
      color: 'green',
      features: ['Equal Split', 'Multi-participant', 'Group QR Codes']
    },
    {
      id: 'group-dues' as const,
      title: 'Group Dues',
      description: 'Collect membership fees, event tickets, or club contributions',
      icon: GraduationCapIcon,
      color: 'purple',
      features: ['Category Organization', 'Due Date Tracking', 'Campus Focused']
    }
  ]

  const handleSuccess = (result: any) => {
    console.log('Payment created successfully:', result)
    // You could add toast notification here
  }

  const handleError = (error: Error) => {
    console.error('Payment creation error:', error)
    // You could add toast notification here
  }

  const renderActiveView = () => {
    switch (activeView) {
      case 'payment-request':
        return (
          <div className="text-center p-8">
            <p className="text-gray-600">Payment Request Card coming soon!</p>
          </div>
        )
      case 'split-bill':
        return (
          <SplitBillCard
            onSuccess={handleSuccess}
            onError={handleError}
            className="max-w-md mx-auto"
          />
        )
      case 'group-dues':
        return (
          <GroupDuesCard
            onSuccess={handleSuccess}
            onError={handleError}
            className="max-w-md mx-auto"
          />
        )
      default:
        return null
    }
  }

  if (!connected) {
    return (
      <div className={`bg-white rounded-xl shadow-lg border border-gray-200 p-8 text-center ${className}`}>
        <div className="flex items-center justify-center mb-6">
          <div className="p-4 bg-blue-100 rounded-full">
            <WalletIcon className="w-8 h-8 text-blue-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Campus Payments Powered by Solana
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Connect your Solana wallet to start creating payment requests, splitting bills, 
          and collecting group dues with QR codes.
        </p>
        <WalletConnectionButton />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {paymentOptions.map((option) => {
            const IconComponent = option.icon
            return (
              <div key={option.id} className="p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 bg-${option.color}-100 rounded-lg w-fit mx-auto mb-3`}>
                  <IconComponent className={`w-5 h-5 text-${option.color}-600`} />
                </div>
                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                  {option.title}
                </h3>
                <p className="text-xs text-gray-600">
                  {option.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (activeView !== 'overview') {
    return (
      <div className={className}>
        <div className="mb-6">
          <button
            onClick={() => setActiveView('overview')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back to Solana Pay Options
          </button>
        </div>
        {renderActiveView()}
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Solana Pay</h2>
            <p className="text-gray-600">Create instant payment requests with QR codes</p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Connected: {publicKey?.toString().slice(0, 8)}...
          </div>
        </div>
        <WalletConnectionButton />
      </div>

      {/* Payment Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {paymentOptions.map((option) => {
          const IconComponent = option.icon
          const colorClasses = {
            blue: 'from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700',
            green: 'from-green-500 to-green-600 hover:from-green-600 hover:to-green-700',
            purple: 'from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700'
          }

          return (
            <div key={option.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className={`bg-gradient-to-r ${colorClasses[option.color as keyof typeof colorClasses]} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-3">
                  <IconComponent className="w-6 h-6" />
                  <h3 className="text-xl font-semibold">{option.title}</h3>
                </div>
                <p className="text-white/90 text-sm">{option.description}</p>
              </div>
              
              <div className="p-6">
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <QrCodeIcon className="w-4 h-4 text-gray-400" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button
                  onClick={() => setActiveView(option.id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r ${colorClasses[option.color as keyof typeof colorClasses]} text-white rounded-lg transition-all font-medium`}
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Campus Stats */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Campus Payment Benefits</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-2">⚡</div>
            <h4 className="font-semibold text-gray-900 mb-1">Instant Payments</h4>
            <p className="text-sm text-gray-600">Settle payments in seconds with Solana's speed</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-2">💰</div>
            <h4 className="font-semibold text-gray-900 mb-1">Low Fees</h4>
            <p className="text-sm text-gray-600">Minimal transaction costs, perfect for students</p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 mb-2">📱</div>
            <h4 className="font-semibold text-gray-900 mb-1">Mobile First</h4>
            <p className="text-sm text-gray-600">QR codes work with any mobile Solana wallet</p>
          </div>
        </div>
      </div>
    </div>
  )
}