// Application constants based on PRD requirements

export const APP_CONFIG = {
  NAME: 'Hawamoni',
  DESCRIPTION: 'Secure group treasury management for student clubs and small teams',
  VERSION: '0.1.0',
  DEFAULT_APPROVAL_THRESHOLD: 0.8, // 80% approval required
  MIN_GROUP_SIZE: 2,
  MAX_GROUP_SIZE: 50,
} as const

export const SOLANA_CONFIG = {
  NETWORK: process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet',
  RPC_URL: process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.devnet.solana.com',
  COMMITMENT: 'confirmed' as const,
  PROGRAM_ID: process.env.NEXT_PUBLIC_PROGRAM_ID || '',
} as const

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  TIMEOUT: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000'),
  RETRY_ATTEMPTS: 3,
} as const

export const WALLET_CONFIG = {
  SUPPORTED_WALLETS: [
    'phantom',
    'solflare',
    'backpack',
    'glow',
    'slope',
    'sollet',
  ] as const,
  AUTO_CONNECT: true,
} as const

export const UI_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  DESKTOP_BREAKPOINT: 1280,
  ITEMS_PER_PAGE: 20,
  NOTIFICATION_TIMEOUT: 5000,
} as const

export const PWA_CONFIG = {
  THEME_COLOR: '#00FFA3', // Solana Teal
  BACKGROUND_COLOR: '#061024', // Midnight
  DISPLAY: 'standalone' as const,
  ORIENTATION: 'portrait' as const,
} as const

export const ROUTES = {
  HOME: '/',
  SIGNIN: '/signin',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  GROUPS: '/groups',
  GROUP_DETAIL: '/groups/[id]',
  REQUESTS: '/requests',
  REQUEST_DETAIL: '/requests/[id]',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  CONTACT: '/contact',
} as const

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'hawamoni_auth_token',
  WALLET_PREFERENCE: 'hawamoni_wallet_preference',
  NOTIFICATION_SETTINGS: 'hawamoni_notification_settings',
  THEME_PREFERENCE: 'hawamoni_theme_preference',
  ONBOARDING_COMPLETED: 'hawamoni_onboarding_completed',
  PWA_INSTALL_PROMPTED: 'hawamoni_pwa_install_prompted',
} as const

export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
} as const

export const REQUEST_STATUS_COLORS = {
  pending: 'bg-africa-gold/20 text-africa-gold border border-africa-gold/30',
  approved: 'bg-olive/20 text-olive border border-olive/30',
  rejected: 'bg-terracotta/20 text-terracotta border border-terracotta/30',
  ready_to_execute: 'bg-solana-blue/20 text-solana-blue border border-solana-blue/30',
  executed: 'bg-solana-teal/20 text-solana-teal border border-solana-teal/30',
  cancelled: 'bg-muted/20 text-muted border border-muted/30',
} as const

export const TRANSACTION_STATUS_COLORS = {
  pending: 'bg-africa-gold/20 text-africa-gold border border-africa-gold/30',
  confirmed: 'bg-solana-teal/20 text-solana-teal border border-solana-teal/30',
  failed: 'bg-terracotta/20 text-terracotta border border-terracotta/30',
} as const

export const LAMPORTS_PER_SOL = 1_000_000_000

// Demo/Development constants
export const DEMO_CONFIG = {
  ENABLE_DEMO_MODE: process.env.NODE_ENV === 'development',
  DEMO_WALLET_PUBKEY: '11111111111111111111111111111112',
  DEMO_GROUP_ID: 'demo-group-123',
  DEMO_AMOUNT: 1.5, // SOL
} as const