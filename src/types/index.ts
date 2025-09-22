// Core application types based on the PRD requirements

export interface User {
  id: string
  walletPubkey: string
  phone?: string
  displayName?: string
  createdAt: Date
}

export interface Group {
  id: string
  pdaPubkey: string
  name: string
  description?: string
  treasuryPubkey: string
  approvalsRequired: number
  createdBy: string
  createdAt: Date
  members: GroupMember[]
  balance?: number
}

export interface GroupMember {
  groupId: string
  userId: string
  role: 'owner' | 'member'
  joinedAt: Date
  user?: User
}

export interface WithdrawalRequest {
  id: string
  groupId: string
  requestPda: string
  requester: string
  recipientPubkey: string
  amount: number
  tokenMint?: string
  reason: string
  status: RequestStatus
  approvalsCount: number
  approvalsRequired: number
  executedTx?: string
  createdAt: Date
  updatedAt: Date
  approvals: Approval[]
}

export interface Approval {
  id: string
  requestId: string
  approver: string
  approved: boolean
  timestamp: Date
}

export interface Deposit {
  id: string
  groupId: string
  txSig: string
  senderPubkey: string
  amount: number
  status: TransactionStatus
  createdAt: Date
}

export interface Notification {
  id: string
  userId: string
  eventType: NotificationEventType
  payload: Record<string, any>
  providerMessageId?: string
  status: NotificationStatus
  createdAt: Date
}

// Enums
export enum RequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  READY_TO_EXECUTE = 'ready_to_execute',
  EXECUTED = 'executed',
  CANCELLED = 'cancelled'
}

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed'
}

export enum NotificationEventType {
  WITHDRAW_REQUEST_CREATED = 'withdraw_request_created',
  APPROVAL_RECEIVED = 'approval_received',
  WITHDRAWAL_EXECUTED = 'withdrawal_executed',
  DEPOSIT_CONFIRMED = 'deposit_confirmed'
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed'
}

// API Response types
export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Wallet and Solana types
export interface WalletContextType {
  publicKey: string | null
  connected: boolean
  connecting: boolean
  connect: () => Promise<void>
  disconnect: () => Promise<void>
  signMessage: (message: Uint8Array) => Promise<Uint8Array>
  signTransaction: (transaction: any) => Promise<any>
}

export interface SolanaPayRequest {
  recipient: string
  amount?: number
  reference?: string
  label?: string
  message?: string
  memo?: string
}

// Form types
export interface CreateGroupForm {
  name: string
  description?: string
  owners: string[]
}

export interface CreateRequestForm {
  recipientPubkey: string
  amount: number
  reason: string
}

export interface AuthNonce {
  nonce: string
  expiresAt: Date
}

export interface AuthToken {
  token: string
  user: User
  expiresAt: Date
}