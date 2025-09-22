# Hawamoni

**A blockchain-native group treasury for student groups and small teams**

Hawamoni enables secure, transparent group fund management with Solana Pay deposits, on-chain governed withdrawals (≥80% owner approval), and real-time SMS + in-app notifications.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Development Setup
```bash
# Clone the repository
git clone https://github.com/Techdee1/Hawamoni.git
cd Hawamoni

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the landing page.

## 🏗 Architecture Overview

Hawamoni is built as a **Progressive Web App (PWA)** using Next.js 14+ with the following architecture:

```
Frontend (PWA)
├── Landing Page (Public)
├── Authentication Flow
└── Protected App Dashboard
    ├── Group Management
    ├── Treasury Operations  
    ├── Withdrawal Governance
    └── Transaction History
```

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PWA**: next-pwa
- **Blockchain**: Solana Web3.js + Wallet Adapter
- **State Management**: Zustand
- **Forms**: React Hook Form
- **UI Components**: Headless UI + Custom Components

## 📱 PWA Features

- **Mobile-First Design**: Optimized for mobile devices
- **Offline Support**: View transaction history without internet
- **Push Notifications**: Real-time alerts for withdrawals and approvals  
- **Install Prompt**: Add to home screen functionality
- **QR Code Integration**: Camera access for Solana Pay

## 🔐 Key Features

### For Students & Small Teams
- **Transparent Treasury**: All funds held in program-owned accounts
- **Democratic Governance**: ≥80% approval required for withdrawals
- **Easy Deposits**: Solana Pay QR codes for instant funding
- **Real-time Notifications**: SMS + in-app alerts for all actions
- **Audit Trail**: Complete transaction history with on-chain proofs

### Technical Features
- **Wallet Authentication**: Nonce-based signing for security
- **On-chain Governance**: Smart contract enforced approval rules
- **Cross-platform**: Works on iOS, Android, and desktop browsers
- **Responsive Design**: Adapts to all screen sizes

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (public)/          # Public routes (landing, about)
│   │   ├── page.tsx       # Landing page
│   │   └── layout.tsx     # Public layout
│   ├── (auth)/            # Authentication routes
│   │   ├── signin/        # Sign in page
│   │   └── signup/        # Sign up page  
│   ├── (app)/             # Protected app routes
│   │   ├── dashboard/     # Main dashboard
│   │   ├── groups/        # Group management
│   │   ├── requests/      # Withdrawal requests
│   │   └── layout.tsx     # App layout with navigation
│   └── layout.tsx         # Root layout
├── components/
│   ├── landing/           # Landing page components
│   ├── ui/                # Shared UI components
│   ├── wallet/            # Wallet integration
│   └── app/               # Protected app components
├── lib/                   # Utilities and hooks
├── styles/                # Global styles
└── public/                # Static assets and PWA files
```

## 🔧 Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking

# PWA
npm run build-pwa       # Build with PWA optimization
npm run analyze         # Analyze bundle size
```

## 🌍 Environment Variables

Create a `.env.local` file with:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SOLANA_NETWORK=devnet

# Solana Configuration  
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_program_id_here

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# PWA Configuration
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_key_here
```

## 🎯 User Flows

### New User Journey
1. **Landing Page** → Learn about Hawamoni
2. **Sign Up** → Connect wallet and create account  
3. **Onboarding** → Guided tutorial
4. **Create/Join Group** → Start managing funds
5. **PWA Install** → Add to home screen

### Core App Flows
1. **Deposit**: Generate QR → Scan with wallet → Funds credited
2. **Withdrawal Request**: Create request → Notify owners → Collect approvals
3. **Approval Process**: Review request → Sign approval → Execute when threshold met
4. **History**: View all transactions → Export CSV → Verify on-chain

## 📊 Success Metrics (MVP)

- ✅ Working end-to-end demo on devnet
- ✅ Deposit-to-credit ≤ 60 seconds  
- ✅ PWA install rate ≥ 30% of active users
- ✅ Mobile-first responsive design
- ✅ Wallet onboarding success rate ≥ 80%

## 🤝 Contributing

### Frontend Team Responsibilities
- Build responsive PWA with Next.js and TypeScript
- Implement wallet integration and authentication
- Create landing page and marketing flows  
- Design mobile-first UI components
- Integrate with backend APIs
- Implement push notifications
- Ensure accessibility and performance

### Development Workflow
1. Create feature branch from `main`
2. Implement feature with tests
3. Submit PR with description
4. Code review and testing
5. Merge to main and deploy

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
vercel --prod

# Environment variables set in Vercel dashboard
```

### Manual Deployment
```bash
npm run build
npm run start
```

## 📋 Roadmap

### Phase 1 (Current - MVP)
- [x] Landing page and PWA setup
- [x] Wallet authentication  
- [x] Group creation and management
- [x] Deposit via Solana Pay QR codes
- [x] Withdrawal request and approval flow
- [x] Basic notifications and history

### Phase 2 (Future)
- [ ] Advanced analytics dashboard
- [ ] Batch operations and scheduling  
- [ ] Enhanced mobile gestures
- [ ] Biometric authentication
- [ ] Multi-language support
- [ ] Advanced notification preferences

## 🔗 Links

- **Live Demo**: [Coming Soon]
- **API Documentation**: [Backend Repository]
- **Design System**: [Figma Link]
- **Project Board**: [GitHub Projects]

## 📞 Support

For frontend development questions:
- Create an issue in this repository
- Contact the frontend team lead
- Check the development documentation

---

**Built with ❤️ for transparent group fund management** 🏦

> **Blockchain-native group treasury for student groups and small teams**

Hawamoni is a secure, transparent group fund management platform built on Solana. Deposits via Solana Pay, withdrawals require ≥80% owner approval, and real-time SMS + in-app notifications ensure trust and transparency.

## ✨ Key Features

- **⚡ Fast Deposits**: Instant deposits via Solana Pay QR codes/links
- **🗳️ On-chain Governance**: Withdrawals require supermajority (≥80%) approval
- **📱 Real-time Notifications**: SMS + in-app alerts for all treasury activity
- **🔍 Full Audit Trail**: Complete transaction history with CSV exports
- **👥 Mobile-first UX**: Simple interface for non-technical users

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   Next.js       │    │  Java Spring    │    │  Node.js Solana  │
│   Frontend      │◄──►│  Boot Backend   │◄──►│  Service         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └──────────────────┘
                                │                        │
                       ┌─────────────────┐              │
                       │  Python FastAPI │              │
                       │  AI Service     │              │
                       │                 │              │
                       └─────────────────┘              │
                                │                        │
        ┌──────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────┐    ┌─────────────────┐    ┌──────────────────┐
│   PostgreSQL    │    │     Redis       │    │  Rust/Anchor     │
│   Database      │    │     Queue       │    │  Program         │
│                 │    │                 │    │  (Solana)        │
└─────────────────┘    └─────────────────┘    └──────────────────┘
```

## 🎯 Core Workflow

1. **Create Group**: Set up treasury with owners and approval threshold (≥80%)
2. **Deposit Funds**: Generate Solana Pay QR → Scan with wallet → Funds credited
3. **Request Withdrawal**: Owner creates request with amount, recipient, reason
4. **Approve/Reject**: Owners vote via wallet signatures
5. **Execute**: Once threshold met, withdrawal executes automatically
6. **Notify**: SMS + in-app notifications at every step

## 📋 Project Structure

```
hawamoni/
├── frontend/           # Next.js TypeScript app
├── backend/           # Java Spring Boot API
├── solana-service/    # Node.js Solana Pay integration  
├── ai-service/        # Python FastAPI ML service
├── anchor-program/    # Rust/Anchor smart contracts
├── database/          # SQL schemas and migrations
├── docs/              # Documentation and guides
└── .github/           # CI/CD workflows
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Java 17+
- Python 3.9+
- Rust & Anchor CLI
- Solana CLI (devnet)
- PostgreSQL
- Redis

### Environment Setup

1. **Clone and setup**:
   ```bash
   git clone https://github.com/Techdee1/Hawamoni.git
   cd Hawamoni
   cp .env.example .env
   ```

2. **Configure environment variables**:
   ```bash
   # Database
   DATABASE_URL=postgresql://user:pass@localhost:5432/hawamoni
   REDIS_URL=redis://localhost:6379
   
   # Solana
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_PROGRAM_ID=your_program_id
   
   # SMS Provider
   SMS_API_KEY=your_africas_talking_api_key
   SMS_USERNAME=your_username
   
   # AI Service
   OPENAI_API_KEY=your_openai_key
   ```

3. **Start services**:
   ```bash
   # Database
   docker-compose up -d postgres redis
   
   # Backend services
   cd backend && ./mvnw spring-boot:run &
   cd ../solana-service && npm run dev &
   cd ../ai-service && uvicorn main:app --reload &
   
   # Frontend
   cd ../frontend && npm run dev
   ```

4. **Deploy Anchor program**:
   ```bash
   cd anchor-program
   anchor build
   anchor deploy
   ```

## 📱 Demo Script

### MVP Demo Flow (3 minutes)

1. **Authentication**: Connect wallet → Sign nonce → Login ✅
2. **Create Group**: Add 5 owners → Show 4 required approvals ✅  
3. **Deposit**: Generate QR → Scan with Phantom → Confirm tx → Balance updated ✅
4. **Request Withdrawal**: Create request → SMS notifications sent ✅
5. **Approve**: 4 owners approve → Status changes to "Ready to Execute" ✅
6. **Execute**: Withdrawal executes → Funds transferred → SMS confirmations ✅
7. **Audit Trail**: Download CSV with all transactions ✅

## 🎯 Success Metrics (MVP)

- ✅ End-to-end demo on Solana devnet
- ✅ Deposit-to-credit latency ≤ 60 seconds  
- ✅ SMS delivery success rate ≥ 90%
- ✅ Automated tests passing in CI

## 👥 Target Users

- **Student Clubs**: Transparent dues collection and vendor payments
- **Project Teams**: Fund management and reimbursements  
- **Campus Merchants**: Accept payments with verifiable receipts

## 🔐 Security Features

- **Program Derived Accounts (PDAs)**: Funds held in smart contract
- **Multi-signature Governance**: No single point of failure
- **Wallet Authentication**: Nonce-based signing (no passwords)
- **Audit Trail**: All transactions recorded on-chain
- **Rate Limiting**: API protection against abuse

## 🛣️ Roadmap

### ✅ MVP (Hackathon Ready)
- [ ] Wallet authentication
- [ ] Group creation/joining
- [ ] Solana Pay deposits
- [ ] Withdrawal requests & approvals
- [ ] SMS notifications
- [ ] Basic audit trail

### 🔮 Future Features
- Tokenized shares & weighted voting
- Dispute resolution system
- Scheduled & batch payments
- Gasless transactions
- Budget limits & auto-approvals
- AI fraud detection & insights
- Multi-chain support

## 🤝 Contributing

This is a hackathon project built for transparency and trust in group treasury management. Contributions welcome!

### Team Roles
- **Frontend**: Next.js, wallet integration, mobile UX
- **Backend**: Java Spring Boot, APIs, SMS, job queue
- **AI**: Python FastAPI, fraud detection, insights

## 📄 License

MIT License - see [LICENSE](LICENSE) for details

## 🆘 Support

- 📧 Email: support@hawamoni.com
- 🐦 Twitter: [@HawamoniApp](https://twitter.com/HawamoniApp)
- 📖 Docs: [docs.hawamoni.com](https://docs.hawamoni.com)

---

**Built with ❤️ on Solana for transparent group treasuries**