// Dashboard-specific types and interfaces

export interface Group {
  id: string
  name: string
  logo?: string
  balance: number // SOL amount
  fiatBalance: number // NGN equivalent
  approvalsRequired: number
  currentApprovals: number
  pdaAddress: string
  members: Member[]
  role: 'owner' | 'member'
  createdAt: string
  lastActivity: string
}

export interface Member {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'member'
  walletAddress: string
  joinedAt: string
  votingWeight?: number
}

export interface Request {
  id: string
  groupId: string
  requesterId: string
  requesterName: string
  requesterAvatar?: string
  recipientId?: string
  recipientName?: string
  recipientAddress?: string
  amount: number // SOL amount
  fiatAmount: number // NGN equivalent
  reason: string
  description?: string
  attachments?: Attachment[]
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'cancelled'
  approvals: Approval[]
  approvalsRequired: number
  createdAt: string
  executedAt?: string
  txSignature?: string
  onChainProof?: string
}

export interface Approval {
  memberId: string
  memberName: string
  memberAvatar?: string
  approvedAt: string
  signature: string
  comment?: string
}

export interface Attachment {
  id: string
  type: 'image' | 'document' | 'receipt'
  url: string
  ipfsHash?: string
  filename: string
  size: number
}

export interface Activity {
  id: string
  type: 'deposit' | 'request_created' | 'request_approved' | 'request_rejected' | 'request_executed' | 'member_added' | 'sms_sent'
  groupId: string
  memberId: string
  memberName: string
  memberAvatar?: string
  amount?: number
  fiatAmount?: number
  description: string
  txSignature?: string
  explorerLink?: string
  metadata?: Record<string, any>
  timestamp: string
}

export interface Notification {
  id: string
  type: 'sms' | 'in_app' | 'email'
  recipient: string
  message: string
  status: 'sent' | 'delivered' | 'failed' | 'pending'
  groupId?: string
  requestId?: string
  sentAt: string
  deliveredAt?: string
  errorMessage?: string
}

export interface TreasuryStats {
  totalBalance: number // SOL
  totalFiatBalance: number // NGN
  monthlyChange: number // percentage
  transactionCount: number
  pendingRequests: number
  sparklineData: number[] // 30-day balance history
}

export interface AIInsight {
  id: string
  type: 'spending_pattern' | 'fraud_alert' | 'budget_recommendation' | 'savings_tip'
  priority: 'low' | 'medium' | 'high'
  title: string
  message: string
  actionLabel?: string
  actionUrl?: string
  relatedRequestId?: string
  createdAt: string
  dismissed?: boolean
}

export interface SolanaPayQR {
  reference: string
  amount: number
  label: string
  message: string
  qrCodeUrl: string
}

export interface ExportOptions {
  format: 'csv' | 'pdf' | 'json'
  dateRange: {
    start: string
    end: string
  }
  includeAttachments: boolean
  includeMembers: boolean
  groupIds: string[]
}

// Dashboard view state
export interface DashboardState {
  selectedGroupId: string | null
  currentGroup: Group | null
  groups: Group[]
  pendingRequests: Request[]
  recentActivity: Activity[]
  notifications: Notification[]
  treasuryStats: TreasuryStats
  aiInsights: AIInsight[]
  isLoading: boolean
  error: string | null
}

// API response types
export interface GroupsResponse {
  groups: Group[]
  totalCount: number
}

export interface RequestsResponse {
  requests: Request[]
  totalCount: number
  hasMore: boolean
}

export interface ActivityResponse {
  activities: Activity[]
  hasMore: boolean
}