import { Group, Member, Request, Activity, Notification, TreasuryStats, AIInsight } from '@/types/dashboard'

// Mock members
export const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Akeem Odebiyi',
    email: 'damilareodebiyi3@gmail.com',
    avatar: '/avatars/akeem.jpg',
    role: 'owner',
    walletAddress: '7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv',
    joinedAt: '2025-09-01T10:00:00Z',
    votingWeight: 2
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    avatar: '/avatars/sarah.jpg',
    role: 'member',
    walletAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    joinedAt: '2025-09-05T14:30:00Z',
    votingWeight: 1
  },
  {
    id: '3',
    name: 'David Chen',
    email: 'david@example.com',
    avatar: '/avatars/david.jpg',
    role: 'member',
    walletAddress: 'AQoKYV7tYpTrFZN6P5oUufbQKAUr9mNYGe1TTJC9wajM',
    joinedAt: '2025-09-08T09:15:00Z',
    votingWeight: 1
  },
  {
    id: '4',
    name: 'Grace Okafor',
    email: 'grace@example.com',
    avatar: '/avatars/grace.jpg',
    role: 'member',
    walletAddress: 'HdAobhGso5gDbhEjcqMcnJMBjX7pT9FzWe7JqSMqrMCJ',
    joinedAt: '2025-09-10T16:45:00Z',
    votingWeight: 1
  }
]

// Mock groups
export const mockGroups: Group[] = [
  {
    id: 'group-1',
    name: 'Family Savings',
    logo: '/group-logos/family.png',
    balance: 2.5, // SOL
    fiatBalance: 625000, // NGN (assuming 1 SOL = ₦250,000)
    approvalsRequired: 3,
    currentApprovals: 1,
    pdaAddress: 'FamSav1ng2PDA3xKXtg2CW87d97TXJSDpbD5jBkheTqA',
    members: mockMembers,
    role: 'owner',
    createdAt: '2025-09-01T10:00:00Z',
    lastActivity: '2025-09-20T15:30:00Z'
  },
  {
    id: 'group-2',
    name: 'Office Equipment Fund',
    logo: '/group-logos/office.png',
    balance: 1.2, // SOL
    fiatBalance: 300000, // NGN
    approvalsRequired: 2,
    currentApprovals: 2,
    pdaAddress: 'OffEqu1p2PDA9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsG',
    members: mockMembers.slice(0, 3),
    role: 'member',
    createdAt: '2025-09-05T14:00:00Z',
    lastActivity: '2025-09-22T11:20:00Z'
  },
  {
    id: 'group-3',
    name: 'Travel Fund 2025',
    logo: '/group-logos/travel.png',
    balance: 0.8, // SOL
    fiatBalance: 200000, // NGN
    approvalsRequired: 4,
    currentApprovals: 0,
    pdaAddress: 'TrvFnd252PDAFZNPLoUufbQKAUr9mNYGe1TTJC9wajM',
    members: mockMembers,
    role: 'member',
    createdAt: '2025-09-15T12:00:00Z',
    lastActivity: '2025-09-23T08:45:00Z'
  }
]

// Mock requests
export const mockRequests: Request[] = [
  {
    id: 'req-1',
    groupId: 'group-1',
    requesterId: '2',
    requesterName: 'Sarah Johnson',
    requesterAvatar: '/avatars/sarah.jpg',
    recipientId: '2',
    recipientName: 'Sarah Johnson',
    recipientAddress: '9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM',
    amount: 0.4,
    fiatAmount: 100000,
    reason: 'Medical emergency fund',
    description: 'Need funds for hospital bills after accident. Have medical receipts for verification.',
    status: 'pending',
    approvals: [
      {
        memberId: '1',
        memberName: 'Akeem Odebiyi',
        memberAvatar: '/avatars/akeem.jpg',
        approvedAt: '2025-09-23T10:30:00Z',
        signature: '5VKjR3RjWMzGDGqFUJt7z8FHvJzVVZRRtGqSQQwjz8FHvJzVVZ',
        comment: 'Approved - emergency verified'
      }
    ],
    approvalsRequired: 3,
    createdAt: '2025-09-23T09:15:00Z',
    attachments: [
      {
        id: 'att-1',
        type: 'image',
        url: '/attachments/medical-receipt.jpg',
        filename: 'medical-receipt.jpg',
        size: 245760
      }
    ]
  },
  {
    id: 'req-2',
    groupId: 'group-2',
    requesterId: '3',
    requesterName: 'David Chen',
    requesterAvatar: '/avatars/david.jpg',
    recipientAddress: 'CompSupp1y3xKXtg2CW87d97TXJSDpbD5jBkheTqA',
    amount: 0.2,
    fiatAmount: 50000,
    reason: 'New laptop for development work',
    description: 'Current laptop is outdated and affecting productivity. Quote attached.',
    status: 'approved',
    approvals: [
      {
        memberId: '1',
        memberName: 'Akeem Odebiyi',
        memberAvatar: '/avatars/akeem.jpg',
        approvedAt: '2025-09-22T14:20:00Z',
        signature: '3kR9RjWMzGDGqFUJt7z8FHvJzVVZRRtGqSQQwjz8FH',
        comment: 'Good investment for productivity'
      },
      {
        memberId: '2',
        memberName: 'Sarah Johnson',
        memberAvatar: '/avatars/sarah.jpg',
        approvedAt: '2025-09-22T16:45:00Z',
        signature: '7mT4RjWMzGDGqFUJt7z8FHvJzVVZRRtGqSQQwjz8FH',
        comment: 'Approved'
      }
    ],
    approvalsRequired: 2,
    createdAt: '2025-09-22T11:00:00Z',
    executedAt: '2025-09-22T17:30:00Z',
    txSignature: '5eykt4UsFv8P8NaQLj4JNJyeZrwHaAiw6QYD7m1tQ9v8y9ZzQzGvj3tTGgMjJmNjYnGjF4TvF8P8NaQLj4JNJyeZrwH'
  }
]

// Mock activity feed
export const mockActivity: Activity[] = [
  {
    id: 'act-1',
    type: 'request_created',
    groupId: 'group-1',
    memberId: '2',
    memberName: 'Sarah Johnson',
    memberAvatar: '/avatars/sarah.jpg',
    amount: 0.4,
    fiatAmount: 100000,
    description: 'Created withdrawal request for medical emergency',
    timestamp: '2025-09-23T09:15:00Z'
  },
  {
    id: 'act-2',
    type: 'request_approved',
    groupId: 'group-1',
    memberId: '1',
    memberName: 'Akeem Odebiyi',
    memberAvatar: '/avatars/akeem.jpg',
    amount: 0.4,
    fiatAmount: 100000,
    description: 'Approved withdrawal request from Sarah Johnson',
    timestamp: '2025-09-23T10:30:00Z'
  },
  {
    id: 'act-3',
    type: 'request_executed',
    groupId: 'group-2',
    memberId: '3',
    memberName: 'David Chen',
    memberAvatar: '/avatars/david.jpg',
    amount: 0.2,
    fiatAmount: 50000,
    description: 'Laptop purchase request executed',
    txSignature: '5eykt4UsFv8P8NaQLj4JNJyeZrwHaAiw6QYD7m1tQ9v8y9ZzQzGvj3tTGgMjJmNjYnGjF4TvF8P8NaQLj4JNJyeZrwH',
    explorerLink: 'https://explorer.solana.com/tx/5eykt4UsFv8P8NaQLj4JNJyeZrwHaAiw6QYD7m1tQ9v8y9ZzQzGvj3tTGgMjJmNjYnGjF4TvF8P8NaQLj4JNJyeZrwH',
    timestamp: '2025-09-22T17:30:00Z'
  },
  {
    id: 'act-4',
    type: 'deposit',
    groupId: 'group-1',
    memberId: '1',
    memberName: 'Akeem Odebiyi',
    memberAvatar: '/avatars/akeem.jpg',
    amount: 0.5,
    fiatAmount: 125000,
    description: 'Monthly savings deposit',
    txSignature: '4dkZbGvj3tTGgMjJmNjYnGjF4TvF8P8NaQLj4JNJyeZrwHaAiw6QYD7m1tQ9v8y9ZzQzGv',
    explorerLink: 'https://explorer.solana.com/tx/4dkZbGvj3tTGgMjJmNjYnGjF4TvF8P8NaQLj4JNJyeZrwHaAiw6QYD7m1tQ9v8y9ZzQzGv',
    timestamp: '2025-09-20T15:30:00Z'
  }
]

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'sms',
    recipient: '+2348123456789',
    message: 'New withdrawal request from Sarah Johnson for ₦100,000. Approve/reject in Hawamoni app.',
    status: 'delivered',
    groupId: 'group-1',
    requestId: 'req-1',
    sentAt: '2025-09-23T09:16:00Z',
    deliveredAt: '2025-09-23T09:16:05Z'
  },
  {
    id: 'notif-2',
    type: 'in_app',
    recipient: 'user-1',
    message: 'Your approval is needed for a withdrawal request in Family Savings',
    status: 'delivered',
    groupId: 'group-1',
    requestId: 'req-1',
    sentAt: '2025-09-23T09:15:30Z',
    deliveredAt: '2025-09-23T09:15:30Z'
  }
]

// Mock treasury stats
export const mockTreasuryStats: TreasuryStats = {
  totalBalance: 4.5, // SOL
  totalFiatBalance: 1125000, // NGN
  monthlyChange: 12.5, // +12.5%
  transactionCount: 24,
  pendingRequests: 2,
  sparklineData: [1000000, 1050000, 980000, 1100000, 1080000, 1150000, 1125000] // 7-day history in NGN
}

// Mock AI insights
export const mockAIInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'spending_pattern',
    priority: 'medium',
    title: 'High Activity Week',
    message: 'You had 40% more transactions this week than usual. Consider reviewing your spending patterns.',
    actionLabel: 'View Details',
    actionUrl: '/dashboard/analytics',
    createdAt: '2025-09-23T08:00:00Z'
  },
  {
    id: 'insight-2',
    type: 'fraud_alert',
    priority: 'high',
    title: 'Unusual Request Pattern',
    message: 'Large withdrawal request from new recipient. Review carefully before approving.',
    actionLabel: 'Review Request',
    relatedRequestId: 'req-1',
    createdAt: '2025-09-23T09:20:00Z'
  },
  {
    id: 'insight-3',
    type: 'budget_recommendation',
    priority: 'low',
    title: 'Savings Goal Progress',
    message: 'You\'re 75% toward your monthly savings goal. Great progress!',
    actionLabel: 'View Goals',
    createdAt: '2025-09-22T12:00:00Z'
  }
]

// Helper functions
export function getCurrentGroup(groupId: string): Group | null {
  return mockGroups.find(g => g.id === groupId) || null
}

export function getPendingRequestsForUser(userId: string): Request[] {
  return mockRequests.filter(req => 
    req.status === 'pending' && 
    !req.approvals.some(approval => approval.memberId === userId)
  )
}

export function getRecentActivity(groupId?: string, limit = 10): Activity[] {
  let activities = mockActivity
  
  if (groupId) {
    activities = activities.filter(act => act.groupId === groupId)
  }
  
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

export function formatSOLAmount(amount: number): string {
  return `${amount.toFixed(3)} SOL`
}

export function formatNGNAmount(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(amount)
}

export function getSOLToNGNRate(): number {
  return 250000 // Mock rate: 1 SOL = ₦250,000
}

export function solToNGN(solAmount: number): number {
  return solAmount * getSOLToNGNRate()
}

export function ngnToSOL(ngnAmount: number): number {
  return ngnAmount / getSOLToNGNRate()
}