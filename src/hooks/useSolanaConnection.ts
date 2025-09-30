import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, Connection, LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useState, useEffect, useCallback } from 'react'
import { WalletConnection } from '@/types/solana'

export function useSolanaConnection() {
  const { connection } = useConnection()
  const { publicKey, connected, wallet, disconnect } = useWallet()
  const [walletInfo, setWalletInfo] = useState<WalletConnection>({
    address: '',
    connected: false,
    balance: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  // Get wallet balance
  const getBalance = useCallback(async (address: PublicKey): Promise<number> => {
    try {
      const balance = await connection.getBalance(address)
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      console.error('Error fetching balance:', error)
      return 0
    }
  }, [connection])

  // Update wallet info when connection changes
  useEffect(() => {
    const updateWalletInfo = async () => {
      if (connected && publicKey) {
        setIsLoading(true)
        try {
          const balance = await getBalance(publicKey)
          setWalletInfo({
            address: publicKey.toString(),
            connected: true,
            balance
          })
        } catch (error) {
          console.error('Error updating wallet info:', error)
          setWalletInfo({
            address: publicKey.toString(),
            connected: true,
            balance: 0
          })
        } finally {
          setIsLoading(false)
        }
      } else {
        setWalletInfo({
          address: '',
          connected: false,
          balance: 0
        })
      }
    }

    updateWalletInfo()
  }, [connected, publicKey, getBalance])

  // Refresh balance
  const refreshBalance = useCallback(async () => {
    if (publicKey) {
      setIsLoading(true)
      try {
        const balance = await getBalance(publicKey)
        setWalletInfo(prev => ({ ...prev, balance }))
      } catch (error) {
        console.error('Error refreshing balance:', error)
      } finally {
        setIsLoading(false)
      }
    }
  }, [publicKey, getBalance])

  // Check if address is valid Solana address
  const isValidSolanaAddress = useCallback((address: string): boolean => {
    try {
      new PublicKey(address)
      return true
    } catch {
      return false
    }
  }, [])

  // Get connection info
  const getConnectionInfo = useCallback(async () => {
    try {
      const version = await connection.getVersion()
      const slot = await connection.getSlot()
      const blockhash = await connection.getLatestBlockhash()
      
      return {
        version,
        slot,
        blockhash: blockhash.blockhash,
        network: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet'
      }
    } catch (error) {
      console.error('Error getting connection info:', error)
      return null
    }
  }, [connection])

  return {
    connection,
    wallet: walletInfo,
    isLoading,
    refreshBalance,
    getBalance,
    isValidSolanaAddress,
    getConnectionInfo,
    disconnect
  }
}