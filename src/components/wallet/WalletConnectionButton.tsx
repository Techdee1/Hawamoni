'use client'

import React from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton, WalletDisconnectButton } from '@solana/wallet-adapter-react-ui'
import { useSolanaConnection } from '@/hooks/useSolanaConnection'
import { WalletIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline'

interface WalletConnectionButtonProps {
  variant?: 'primary' | 'secondary' | 'minimal'
  showBalance?: boolean
  className?: string
}

export function WalletConnectionButton({ 
  variant = 'primary', 
  showBalance = false,
  className = '' 
}: WalletConnectionButtonProps) {
  const { connected, publicKey } = useWallet()
  const { wallet, isLoading } = useSolanaConnection()

  if (connected && publicKey) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        {/* Wallet Info */}
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 bg-slate/20 rounded-lg px-3 py-2">
            <WalletIcon className="h-4 w-4 text-solana-teal" />
            <div className="text-sm">
              <div className="text-white font-medium">
                {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
              </div>
              {showBalance && (
                <div className="text-muted text-xs">
                  {isLoading ? 'Loading...' : `${wallet.balance?.toFixed(4) || '0.0000'} SOL`}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Disconnect Button */}
        <WalletDisconnectButton className="!bg-red-500/20 !text-red-400 hover:!bg-red-500/30 !border-red-500/30 !rounded-lg !px-3 !py-2 !text-sm !font-medium transition-colors">
          <ArrowRightOnRectangleIcon className="h-4 w-4 mr-1" />
          Disconnect
        </WalletDisconnectButton>
      </div>
    )
  }

  // Connection Button Variants
  const baseClasses = "!font-medium !transition-all !duration-200 !rounded-lg"
  
  const variantClasses = {
    primary: "!bg-gradient-to-r !from-solana-teal !to-solana-blue hover:!from-solana-teal/90 hover:!to-solana-blue/90 !text-white !border-none !shadow-lg hover:!shadow-solana-teal/25",
    secondary: "!bg-slate/20 !text-white !border !border-slate/30 hover:!bg-slate/30 hover:!border-solana-teal/50",
    minimal: "!bg-transparent !text-solana-teal !border !border-solana-teal/30 hover:!bg-solana-teal/10"
  }

  return (
    <WalletMultiButton 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <WalletIcon className="h-4 w-4 mr-2" />
      Connect Wallet
    </WalletMultiButton>
  )
}

// Compact wallet display for mobile
export function WalletBadge() {
  const { connected, publicKey } = useWallet()
  const { wallet, isLoading } = useSolanaConnection()

  if (!connected || !publicKey) {
    return (
      <WalletConnectionButton 
        variant="minimal" 
        className="!text-xs !px-2 !py-1"
      />
    )
  }

  return (
    <div className="flex items-center space-x-2 bg-slate/20 rounded-full px-3 py-1">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      <div className="text-xs text-white">
        {publicKey.toString().slice(0, 4)}...{publicKey.toString().slice(-4)}
      </div>
      {!isLoading && (
        <div className="text-xs text-muted">
          {wallet.balance?.toFixed(2) || '0.00'} SOL
        </div>
      )}
    </div>
  )
}

// Wallet status indicator
export function WalletStatus() {
  const { connected, connecting, wallet } = useWallet()
  const { wallet: walletInfo, isLoading } = useSolanaConnection()

  if (connecting) {
    return (
      <div className="flex items-center space-x-2 text-yellow-400">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-400"></div>
        <span className="text-sm">Connecting...</span>
      </div>
    )
  }

  if (connected) {
    return (
      <div className="flex items-center space-x-2 text-green-400">
        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
        <span className="text-sm">
          Connected to {wallet?.adapter.name}
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-muted">
      <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
      <span className="text-sm">Wallet not connected</span>
    </div>
  )
}