'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { 
  PlusIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  QrCodeIcon,
  PaperAirplaneIcon,
  ShareIcon,
  ClipboardDocumentCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowTopRightOnSquareIcon,
  ClipboardIcon,
  BellIcon,
  ChevronDownIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { SolanaPayDashboard } from '@/components/solana/SolanaPayDashboard'
import { 
  mockGroups, 
  mockRequests, 
  mockActivity, 
  mockTreasuryStats, 
  mockAIInsights,
  getCurrentGroup,
  getPendingRequestsForUser,
  getRecentActivity,
  formatSOLAmount,
  formatNGNAmount
} from '@/lib/mockData'

export default function DashboardPage() {
  const { isAuthenticated, isLoading, user, logout } = useAuth()
  const router = useRouter()
  
  // Dashboard state
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(mockGroups[0]?.id || null)
  const [showDepositModal, setShowDepositModal] = useState(false)
  const [showRequestModal, setShowRequestModal] = useState(false)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSolanaPayDashboard, setShowSolanaPayDashboard] = useState(false)

  const currentGroup = selectedGroupId ? getCurrentGroup(selectedGroupId) : null
  const pendingRequests = getPendingRequestsForUser('1') // Mock current user ID
  const recentActivity = getRecentActivity(selectedGroupId || undefined)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/signin')
    }
  }, [isAuthenticated, isLoading, router])

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Could add toast notification here
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-midnight text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-solana-teal mx-auto mb-4"></div>
          <p className="text-muted">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-midnight text-white">
      {/* Navigation Header */}
      <nav className="border-b border-slate/30 bg-slate/20 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="Hawamoni Logo" 
                width={32} 
                height={32}
                className="glow-teal"
              />
              <span className="text-lg sm:text-xl font-bold gradient-text">Hawamoni</span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-6">
              {/* Group Selector */}
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <select
                    value={selectedGroupId || ''}
                    onChange={(e) => {
                      if (e.target.value === 'create-new') {
                        setShowCreateGroupModal(true)
                      } else {
                        setSelectedGroupId(e.target.value)
                      }
                    }}
                    className="appearance-none bg-slate/40 border border-slate/30 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-solana-teal"
                  >
                    {mockGroups.map(group => (
                      <option key={group.id} value={group.id} className="bg-slate/80">
                        {group.name}
                      </option>
                    ))}
                    <option value="create-new" className="bg-solana-teal/20 text-solana-teal">
                      + Create New Group
                    </option>
                  </select>
                  <ChevronDownIcon className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" />
                </div>
                
                <button
                  onClick={() => setShowCreateGroupModal(true)}
                  className="bg-gradient-to-r from-solana-teal to-solana-blue p-2 rounded-lg hover:from-solana-teal/80 hover:to-solana-blue/80 transition-all duration-200 glow-teal-sm"
                  title="Create New Group"
                >
                  <PlusIcon className="h-5 w-5 text-white" />
                </button>
              </div>
              
              {/* Balance Display */}
              {currentGroup && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {formatSOLAmount(currentGroup.balance)}
                  </div>
                  <div className="text-sm text-muted">
                    {formatNGNAmount(currentGroup.fiatBalance)}
                  </div>
                </div>
              )}
              
              {/* Approvals Badge */}
              {currentGroup && (
                <div className="bg-solana-teal/20 border border-solana-teal/30 rounded-full px-3 py-1">
                  <span className="text-xs text-solana-teal font-medium">
                    Approvals: {currentGroup.currentApprovals}/{currentGroup.approvalsRequired}
                  </span>
                </div>
              )}

              {/* Desktop User Menu */}
              <div className="flex items-center space-x-4">
                <button className="relative">
                  <BellIcon className="h-6 w-6 text-muted hover:text-white transition-colors" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    2
                  </span>
                </button>
                
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="text-sm text-white">{user?.email?.split('@')[0]}</div>
                    <div className="text-xs text-muted">7xKX...HkQv</div>
                  </div>
                  <button 
                    onClick={() => copyToClipboard('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv')}
                    className="text-muted hover:text-white transition-colors"
                  >
                    <ClipboardIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <button className="text-muted hover:text-white transition-colors">
                  <Cog6ToothIcon className="h-6 w-6" />
                </button>
                
                <button
                  onClick={logout}
                  className="text-muted hover:text-red-400 transition-colors text-sm"
                >
                  Sign Out
                </button>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden p-2 rounded-md text-muted hover:text-white transition-colors"
            >
              {showMobileMenu ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {showMobileMenu && (
            <div className="lg:hidden border-t border-slate/30 bg-slate/40 backdrop-blur-sm">
              <div className="px-4 py-4 space-y-4">
                {/* Mobile Group Selector */}
                <div>
                  <label className="block text-xs font-medium text-muted mb-2">Current Group</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <select
                        value={selectedGroupId || ''}
                        onChange={(e) => {
                          if (e.target.value === 'create-new') {
                            setShowCreateGroupModal(true)
                            setShowMobileMenu(false)
                          } else {
                            setSelectedGroupId(e.target.value)
                          }
                        }}
                        className="w-full appearance-none bg-slate/40 border border-slate/30 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-solana-teal"
                      >
                        {mockGroups.map(group => (
                          <option key={group.id} value={group.id} className="bg-slate/80">
                            {group.name}
                          </option>
                        ))}
                        <option value="create-new" className="bg-solana-teal/20 text-solana-teal">
                          + Create New Group
                        </option>
                      </select>
                      <ChevronDownIcon className="h-4 w-4 absolute right-2 top-1/2 transform -translate-y-1/2 text-muted pointer-events-none" />
                    </div>
                    
                    <button
                      onClick={() => {
                        setShowCreateGroupModal(true)
                        setShowMobileMenu(false)
                      }}
                      className="bg-gradient-to-r from-solana-teal to-solana-blue p-2 rounded-lg hover:from-solana-teal/80 hover:to-solana-blue/80 transition-all duration-200 glow-teal-sm"
                      title="Create New Group"
                    >
                      <PlusIcon className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>

                {/* Mobile Balance */}
                {currentGroup && (
                  <div className="bg-slate/60 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-xl font-bold text-white mb-1">
                        {formatSOLAmount(currentGroup.balance)}
                      </div>
                      <div className="text-sm text-muted mb-2">
                        {formatNGNAmount(currentGroup.fiatBalance)}
                      </div>
                      <div className="bg-solana-teal/20 border border-solana-teal/30 rounded-full px-3 py-1 inline-block">
                        <span className="text-xs text-solana-teal font-medium">
                          Approvals: {currentGroup.currentApprovals}/{currentGroup.approvalsRequired}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Mobile User Info */}
                <div className="border-t border-slate/30 pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div>
                        <div className="text-sm font-medium text-white">{user?.email?.split('@')[0]}</div>
                        <div className="text-xs text-muted">7xKX...HkQv</div>
                      </div>
                      <button 
                        onClick={() => copyToClipboard('7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv')}
                        className="text-muted hover:text-white transition-colors"
                      >
                        <ClipboardIcon className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <button className="relative">
                      <BellIcon className="h-6 w-6 text-muted hover:text-white transition-colors" />
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        2
                      </span>
                    </button>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button className="flex-1 flex items-center justify-center space-x-2 bg-slate/40 hover:bg-slate/60 text-white py-2 px-4 rounded-lg transition-colors">
                      <Cog6ToothIcon className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                    
                    <button
                      onClick={logout}
                      className="flex-1 flex items-center justify-center bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition-colors"
                    >
                      <span className="text-sm">Sign Out</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.email?.split('@')[0]}
          </h1>
          <p className="text-muted">Manage your group treasuries and transactions</p>
        </div>

        {/* View Toggle */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 bg-slate/20 rounded-xl p-2 w-fit">
            <button
              onClick={() => setShowSolanaPayDashboard(false)}
              className={`px-4 py-2 rounded-lg transition-all font-medium ${
                !showSolanaPayDashboard
                  ? 'bg-white/10 text-white'
                  : 'text-muted hover:text-white'
              }`}
            >
              Treasury Dashboard
            </button>
            <button
              onClick={() => setShowSolanaPayDashboard(true)}
              className={`px-4 py-2 rounded-lg transition-all font-medium flex items-center gap-2 ${
                showSolanaPayDashboard
                  ? 'bg-gradient-to-r from-solana-teal to-solana-blue text-white glow-teal-sm'
                  : 'text-muted hover:text-white'
              }`}
            >
              <QrCodeIcon className="w-4 h-4" />
              Solana Pay
            </button>
          </div>
        </div>

        {/* Conditional Content */}
        {showSolanaPayDashboard ? (
          <SolanaPayDashboard className="mb-8" />
        ) : (
          <>
            {/* Quick Actions */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button 
            onClick={() => setShowDepositModal(true)}
            className="p-6 bg-gradient-to-br from-solana-teal/20 to-solana-blue/20 backdrop-blur-sm rounded-xl border border-solana-teal/30 hover:from-solana-teal/30 hover:to-solana-blue/30 transition-all duration-300 text-left group glow-teal-sm"
          >
            <div className="flex items-center justify-between mb-4">
              <QrCodeIcon className="h-10 w-10 text-solana-teal" />
              <span className="text-xs text-muted group-hover:text-white transition-colors">Solana Pay</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">Deposit</h3>
            <p className="text-muted text-sm group-hover:text-white/80 transition-colors">
              Add funds via QR code or wallet transfer
            </p>
          </button>

          <button 
            onClick={() => setShowRequestModal(true)}
            className="p-6 bg-gradient-to-br from-africa-gold/20 to-olive/20 backdrop-blur-sm rounded-xl border border-africa-gold/30 hover:from-africa-gold/30 hover:to-olive/30 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <PaperAirplaneIcon className="h-10 w-10 text-africa-gold" />
              <span className="text-xs text-muted group-hover:text-white transition-colors">Request</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">Create Request</h3>
            <p className="text-muted text-sm group-hover:text-white/80 transition-colors">
              Request withdrawal with reason and attachments
            </p>
          </button>

          <button 
            onClick={() => setShowInviteModal(true)}
            className="p-6 bg-gradient-to-br from-solana-blue/20 to-slate/20 backdrop-blur-sm rounded-xl border border-solana-blue/30 hover:from-solana-blue/30 hover:to-slate/30 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between mb-4">
              <ShareIcon className="h-10 w-10 text-solana-blue" />
              <span className="text-xs text-muted group-hover:text-white transition-colors">Invite</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-1">Invite Member</h3>
            <p className="text-muted text-sm group-hover:text-white/80 transition-colors">
              Add new members to your group
            </p>
          </button>
        </div>

        {/* AI Insights */}
        {mockAIInsights.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-white mb-4">Smart Insights</h2>
            <div className="space-y-3">
              {mockAIInsights.slice(0, 2).map(insight => (
                <div 
                  key={insight.id}
                  className={`p-4 rounded-lg border ${
                    insight.priority === 'high' 
                      ? 'bg-red-500/10 border-red-500/30 text-red-400'
                      : insight.priority === 'medium'
                      ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {insight.priority === 'high' && <ExclamationTriangleIcon className="h-5 w-5 mt-0.5" />}
                      <div>
                        <h4 className="font-medium mb-1">{insight.title}</h4>
                        <p className="text-sm opacity-90">{insight.message}</p>
                      </div>
                    </div>
                    {insight.actionLabel && (
                      <button className="text-xs font-medium hover:underline">
                        {insight.actionLabel}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Requests & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Pending Requests */}
            {pendingRequests.length > 0 && (
              <div className="bg-slate/40 backdrop-blur-sm rounded-xl border border-slate/30 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-white flex items-center">
                    <ClipboardDocumentCheckIcon className="h-6 w-6 mr-2 text-orange-400" />
                    Pending Your Approval
                  </h2>
                  <span className="text-sm text-orange-400 font-medium">
                    {pendingRequests.length} request{pendingRequests.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-4">
                  {pendingRequests.slice(0, 3).map(request => (
                    <div key={request.id} className="bg-slate/60 rounded-lg p-4 border border-slate/40">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-solana-teal to-solana-blue flex items-center justify-center text-white font-bold text-sm">
                            {request.requesterName.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-white">{request.requesterName}</span>
                              <span className="text-xs text-muted">
                                {new Date(request.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-white font-semibold mb-1">
                              {formatSOLAmount(request.amount)} ({formatNGNAmount(request.fiatAmount)})
                            </p>
                            <p className="text-sm text-muted mb-2">{request.reason}</p>
                            <div className="text-xs text-muted">
                              {request.approvals.length} / {request.approvalsRequired} approvals
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <button className="flex items-center space-x-1 bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                            <CheckCircleIcon className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                          <button className="flex items-center space-x-1 bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                            <XCircleIcon className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activity */}
            <div className="bg-slate/40 backdrop-blur-sm rounded-xl border border-slate/30 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white flex items-center">
                  <ChartBarIcon className="h-6 w-6 mr-2 text-solana-blue" />
                  Recent Activity
                </h2>
                <button className="text-sm text-solana-teal hover:text-solana-blue transition-colors">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentActivity.slice(0, 6).map(activity => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solana-teal to-solana-blue flex items-center justify-center text-white font-bold text-xs">
                      {activity.memberName.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-white">{activity.description}</span>
                        <span className="text-xs text-muted">
                          {new Date(activity.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      {activity.amount && (
                        <div className="text-xs text-muted mb-1">
                          {formatSOLAmount(activity.amount)} ({formatNGNAmount(activity.fiatAmount!)})
                        </div>
                      )}
                      {activity.txSignature && (
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => copyToClipboard(activity.txSignature!)}
                            className="text-xs text-solana-teal hover:text-solana-blue transition-colors flex items-center space-x-1"
                          >
                            <ClipboardIcon className="h-3 w-3" />
                            <span>Copy TX</span>
                          </button>
                          {activity.explorerLink && (
                            <a
                              href={activity.explorerLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-solana-teal hover:text-solana-blue transition-colors flex items-center space-x-1"
                            >
                              <ArrowTopRightOnSquareIcon className="h-3 w-3" />
                              <span>Explorer</span>
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Treasury & Members */}
          <div className="space-y-8">
            {/* Treasury Stats */}
            <div className="bg-gradient-to-br from-africa-gold/20 to-olive/20 backdrop-blur-sm rounded-xl border border-africa-gold/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Treasury Overview</h3>
                <CurrencyDollarIcon className="h-6 w-6 text-africa-gold" />
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {formatNGNAmount(mockTreasuryStats.totalFiatBalance)}
                  </div>
                  <div className="text-sm text-muted">
                    {formatSOLAmount(mockTreasuryStats.totalBalance)} total across all groups
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted block">Monthly change</span>
                    <span className={`font-medium ${
                      mockTreasuryStats.monthlyChange >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {mockTreasuryStats.monthlyChange >= 0 ? '+' : ''}{mockTreasuryStats.monthlyChange}%
                    </span>
                  </div>
                  <div>
                    <span className="text-muted block">Transactions</span>
                    <span className="text-white font-medium">{mockTreasuryStats.transactionCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Group Members */}
            {currentGroup && (
              <div className="bg-slate/40 backdrop-blur-sm rounded-xl border border-slate/30 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center">
                    <UsersIcon className="h-5 w-5 mr-2" />
                    {currentGroup.name} ({currentGroup.members.length})
                  </h3>
                </div>

                <div className="space-y-3">
                  {currentGroup.members.slice(0, 4).map(member => (
                    <div key={member.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-solana-teal to-solana-blue flex items-center justify-center text-white font-bold text-xs">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{member.name}</div>
                          <div className="text-xs text-muted">{member.email}</div>
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded-full ${
                        member.role === 'owner' 
                          ? 'bg-africa-gold/20 text-africa-gold border border-africa-gold/30'
                          : 'bg-slate/40 text-muted border border-slate/30'
                      }`}>
                        {member.role}
                      </div>
                    </div>
                  ))}
                  
                  {currentGroup.members.length > 4 && (
                    <div className="text-xs text-center text-muted pt-2">
                      +{currentGroup.members.length - 4} more members
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

          </>
        )}

        {/* Simple Modal Placeholders */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowDepositModal(false)}>
            <div className="bg-slate/90 backdrop-blur-sm rounded-xl border border-slate/30 p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-white mb-4">Deposit Funds</h3>
              <p className="text-muted mb-4">Solana Pay QR code generation coming soon...</p>
              <button 
                onClick={() => setShowDepositModal(false)}
                className="btn-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showRequestModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowRequestModal(false)}>
            <div className="bg-slate/90 backdrop-blur-sm rounded-xl border border-slate/30 p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-white mb-4">Create Request</h3>
              <p className="text-muted mb-4">Request creation form coming soon...</p>
              <button 
                onClick={() => setShowRequestModal(false)}
                className="btn-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showInviteModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowInviteModal(false)}>
            <div className="bg-slate/90 backdrop-blur-sm rounded-xl border border-slate/30 p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-white mb-4">Invite Member</h3>
              <p className="text-muted mb-4">Member invitation system coming soon...</p>
              <button 
                onClick={() => setShowInviteModal(false)}
                className="btn-primary w-full"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {showCreateGroupModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateGroupModal(false)}>
            <div className="bg-slate/90 backdrop-blur-sm rounded-xl border border-slate/30 p-6 max-w-md w-full mx-4" onClick={e => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-white mb-6">Create New Group</h3>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Group Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Family Savings, Business Group..."
                    className="w-full bg-slate/40 border border-slate/30 rounded-lg px-4 py-2 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-solana-teal"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Description (Optional)</label>
                  <textarea
                    placeholder="Brief description of the group purpose..."
                    rows={3}
                    className="w-full bg-slate/40 border border-slate/30 rounded-lg px-4 py-2 text-white placeholder-muted focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-solana-teal resize-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Required Approvals</label>
                  <select className="w-full bg-slate/40 border border-slate/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-solana-teal focus:border-solana-teal">
                    <option value="1">1 approval required</option>
                    <option value="2">2 approvals required</option>
                    <option value="3">3 approvals required</option>
                    <option value="4">4 approvals required</option>
                    <option value="5">5 approvals required</option>
                  </select>
                </div>
                
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <div className="text-blue-400 mt-0.5">ℹ️</div>
                    <div>
                      <p className="text-sm text-blue-400 font-medium mb-1">Multi-Signature Security</p>
                      <p className="text-xs text-blue-300">
                        This determines how many members must approve withdrawals. Higher numbers = more security.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowCreateGroupModal(false)}
                    className="flex-1 bg-slate/60 hover:bg-slate/80 text-white border border-slate/30 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-solana-teal to-solana-blue hover:from-solana-teal/80 hover:to-solana-blue/80 text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium"
                  >
                    Create Group
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}