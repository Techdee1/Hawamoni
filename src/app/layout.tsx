import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import { WalletProvider } from '../components/providers/WalletProvider'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})

export const metadata: Metadata = {
  title: {
    default: 'Hawamoni - Secure Group Treasury Management',
    template: '%s | Hawamoni'
  },
  description: 'A blockchain-native group treasury for student groups and small teams. Secure deposits via Solana Pay, on-chain governed withdrawals, and real-time notifications.',
  keywords: ['solana', 'blockchain', 'treasury', 'group management', 'defi', 'student clubs', 'team finance', 'naira', 'africa'],
  authors: [{ name: 'Hawamoni Team' }],
  creator: 'Hawamoni Team',
  publisher: 'Hawamoni',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'Hawamoni',
    title: 'Hawamoni - Secure Group Treasury Management',
    description: 'A blockchain-native group treasury for student groups and small teams',
    images: [
      {
        url: '/logo.png',
        width: 800,
        height: 800,
        alt: 'Hawamoni Logo - Naira symbol with Solana gradients',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hawamoni - Secure Group Treasury Management',
    description: 'A blockchain-native group treasury for student groups and small teams',
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/logo.png',
    },
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00FFA3' },
    { media: '(prefers-color-scheme: dark)', color: '#00FFA3' },
  ],
  colorScheme: 'dark',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Hawamoni" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#061024" />
        <meta name="msapplication-TileImage" content="/logo.png" />
      </head>
      <body className={`${inter.className} font-sans antialiased`}>
        <WalletProvider>
          <div id="app-root" className="min-h-screen">
            {children}
          </div>
        </WalletProvider>
        <div id="modal-root" />
        <div id="toast-root" />
      </body>
    </html>
  )
}