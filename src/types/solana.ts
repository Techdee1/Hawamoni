import { PublicKey } from '@solana/web3.js'
import BigNumber from 'bignumber.js'

// Solana Pay Types
export interface SolanaPayRequest {
  recipient: PublicKey | string
  amount?: BigNumber
  splToken?: PublicKey
  reference?: PublicKey[]
  label?: string
  message?: string
  memo?: string
}

export interface PaymentRequestData {
  id?: string
  groupId: number
  createdBy: number
  amount: number
  currency: 'SOL' | 'USDC'
  memo?: string
  recipientWallet: string
  label?: string
  message?: string
  expiresAt?: Date
}

export interface SolanaPayURL {
  url: string
  qrCode: string
  reference: PublicKey[]
}

export interface WalletConnection {
  address: string
  connected: boolean
  balance?: number
}

export interface TransactionStatus {
  signature?: string
  status: 'pending' | 'confirmed' | 'failed' | 'expired'
  confirmations?: number
  error?: string
}

export interface PaymentRequestResponse {
  id: string
  request: PaymentRequestData
  paymentUrl: string
  qrCodeData: string
  reference: string[]
  status: TransactionStatus
  createdAt: Date
  expiresAt: Date
}

// Campus-specific payment types
export interface Participant {
  name: string
  walletAddress: string
  amount: number
}

export interface PaymentMetadata {
  timestamp: number
  category?: string
  campus?: boolean
  recurring?: boolean
  splitType?: string
}

export interface SplitBillRequest {
  type?: 'split-bill'
  totalAmount: number
  participants: Participant[]
  description: string
  createdBy: string
  metadata?: PaymentMetadata
}

export interface GroupDuesRequest {
  type?: 'group-dues'
  groupName: string
  amount: number
  description: string
  dueDate?: string
  category: string
  collectedBy: string
  metadata?: PaymentMetadata
}

export interface ReimbursementRequest {
  amount: number
  toWallet: string
  fromGroup: number
  description: string
  receipt?: string // file URL
}