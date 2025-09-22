'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'
import { 
  ArrowRightIcon, 
  ShieldCheckIcon, 
  UsersIcon, 
  DevicePhoneMobileIcon,
  CurrencyDollarIcon,
  EyeIcon,
  ClockIcon,
  BellIcon,
  ChartBarIcon,
  SparklesIcon,
  GlobeAltIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  HomeIcon,
  PlayIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

// Custom hook for intersection observer
const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting)
    }, {
      threshold: 0.3,
      ...options,
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return [ref, isIntersecting] as const
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  // Intersection observers for solution steps
  const [step1Ref, step1Visible] = useIntersectionObserver()
  const [step2Ref, step2Visible] = useIntersectionObserver()
  const [step3Ref, step3Visible] = useIntersectionObserver()
  const [taglineRef, taglineVisible] = useIntersectionObserver()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])
  return (
    <div className="min-h-screen bg-midnight text-white overflow-hidden">
      {/* Navigation */}
      <nav className={`fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ease-out ${
        isScrolled 
          ? 'w-[60%] mt-4 bg-midnight/60 backdrop-blur-xl border border-slate/30 rounded-2xl shadow-2xl shadow-solana-teal/10' 
          : 'w-full mt-0 bg-midnight/40 backdrop-blur-md border-b border-slate/20 rounded-none shadow-none'
      }`}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between items-center">
            <div className="flex items-center space-x-3">
              <Image 
                src="/logo.png" 
                alt="Hawamoni Logo" 
                width={32} 
                height={32}
                className="glow-teal"
              />
              <div className="text-xl font-bold gradient-text">
                Hawamoni
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-muted hover:text-solana-blue transition-colors">
                Features
              </Link>
              <Link href="#how-it-works" className="text-muted hover:text-solana-blue transition-colors">
                How it Works
              </Link>
              <Link href="#demo" className="text-muted hover:text-solana-blue transition-colors">
                Demo
              </Link>
              <Link href="/signin" className="text-muted hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="btn-primary">
                Get Started
              </Link>
            </div>
            <div className="md:hidden">
              <Link href="/signup" className="btn-primary text-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-solana-teal/10 via-solana-blue/5 to-africa-gold/10"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-solana-teal/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-solana-magenta/20 rounded-full blur-3xl"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-7xl mb-8">
              <span className="block text-white">Collective, Transparent</span>
              <span className="block gradient-text">Money Management</span>
              <span className="block text-white">for Students and Teams</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl leading-8 text-muted">
              Pool funds, approve withdrawals together, and track every transaction — powered by{' '}
              <span className="font-semibold bg-gradient-to-r from-solana-teal via-solana-blue to-solana-magenta bg-clip-text text-transparent">
                Solana Pay
              </span>
              .
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/signup" className="btn-primary px-8 py-4 text-lg glow-teal">
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link href="#demo" className="btn-secondary px-8 py-4 text-lg">
                <PlayIcon className="mr-2 h-5 w-5" />
                Watch Demo
              </Link>
            </div>
          </div>

          {/* Hero Visual Placeholder */}
          <div className="mx-auto mt-20 max-w-4xl">
            <div className="relative bg-slate/40 backdrop-blur-sm rounded-2xl border border-slate/30 p-8 text-center glow-teal">
              <div className="flex justify-center items-center space-x-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-solana-teal to-solana-blue flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-midnight" />
                </div>
                <ArrowRightIcon className="h-6 w-6 text-solana-blue" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-africa-gold to-terracotta flex items-center justify-center">
                  <span className="text-midnight font-bold">₦</span>
                </div>
                <ArrowRightIcon className="h-6 w-6 text-africa-gold" />
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-olive to-solana-teal flex items-center justify-center">
                  <CheckCircleIcon className="h-6 w-6 text-midnight" />
                </div>
              </div>
              <p className="text-muted">
                Visual: Multiple people approving a Naira transaction together
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Problem Statement */}
      <div className="py-24 bg-gradient-to-b from-midnight to-slate/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-4">
              The Problem with Group Funds Today
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-slate/30 rounded-xl border border-terracotta/30">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-terracotta/20 flex items-center justify-center">
                <EyeIcon className="h-8 w-8 text-terracotta" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Lack of Transparency</h3>
              <p className="text-muted">"Who's holding the money?"</p>
            </div>

            <div className="text-center p-6 bg-slate/30 rounded-xl border border-terracotta/30">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-terracotta/20 flex items-center justify-center">
                <UsersIcon className="h-8 w-8 text-terracotta" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">No Accountability</h3>
              <p className="text-muted">"Decisions made without group input."</p>
            </div>

            <div className="text-center p-6 bg-slate/30 rounded-xl border border-terracotta/30">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-terracotta/20 flex items-center justify-center">
                <ClockIcon className="h-8 w-8 text-terracotta" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Delays & Fraud</h3>
              <p className="text-muted">"Funds disappear without records."</p>
            </div>
          </div>
        </div>
      </div>

      {/* Solution - How Hawamoni Works */}
      <div id="how-it-works" className="py-24 bg-midnight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-4">
              Our Solution: Collective Governance + Transparency
            </h2>
          </div>

          <div className="max-w-6xl mx-auto relative">
            {/* Vertical Chain Line - segments animate in as steps become visible */}
            <div className="absolute left-8 md:left-16 top-0 w-1 bg-gradient-to-b from-transparent via-transparent to-transparent h-full hidden sm:block">
              {/* Chain Segment 1 to 2 */}
              <div className={`absolute top-32 left-0 w-full h-32 bg-gradient-to-b from-solana-teal to-africa-gold transition-all duration-1000 ease-out ${
                step1Visible ? 'opacity-60 scale-y-100' : 'opacity-0 scale-y-0'
              }`} style={{ transformOrigin: 'top' }}></div>
              
              {/* Chain Segment 2 to 3 */}
              <div className={`absolute top-96 left-0 w-full h-32 bg-gradient-to-b from-africa-gold to-olive transition-all duration-1000 ease-out ${
                step2Visible ? 'opacity-60 scale-y-100' : 'opacity-0 scale-y-0'
              }`} style={{ transformOrigin: 'top' }}></div>
            </div>
            
            {/* Step 1 */}
            <div ref={step1Ref} className={`relative mb-32 transition-all duration-1000 ease-out ${
              step1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}>
              <div className="flex items-center gap-8">
                {/* Chain Node - Left */}
                <div className="relative flex-shrink-0">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-solana-teal to-solana-blue flex items-center justify-center glow-teal shadow-2xl shadow-solana-teal/40 transition-all duration-1000 ease-out ${
                    step1Visible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
                  }`}>
                    <CurrencyDollarIcon className="h-16 w-16 text-midnight" />
                  </div>
                </div>
                
                {/* Text Content - Right */}
                <div className="flex-1">
                  <h3 className="text-3xl font-semibold mb-4 text-white">1. Deposit Easily</h3>
                  <p className="text-xl text-muted">Use Solana Pay to add money to the group treasury.</p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div ref={step2Ref} className={`relative mb-32 transition-all duration-1000 ease-out ${
              step2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className="flex items-center gap-8">
                {/* Chain Node - Left */}
                <div className="relative flex-shrink-0">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-africa-gold to-terracotta flex items-center justify-center glow-blue shadow-2xl shadow-africa-gold/40 transition-all duration-1000 ease-out ${
                    step2Visible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
                  }`}>
                    <DevicePhoneMobileIcon className="h-16 w-16 text-midnight" />
                  </div>
                </div>
                
                {/* Text Content - Right */}
                <div className="flex-1">
                  <h3 className="text-3xl font-semibold mb-4 text-white">2. Request Withdrawals</h3>
                  <p className="text-xl text-muted">Submit a reason + amount when you need funds.</p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div ref={step3Ref} className={`relative transition-all duration-1000 ease-out ${
              step3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`} style={{ transitionDelay: '400ms' }}>
              <div className="flex items-center gap-8">
                {/* Chain Node - Left */}
                <div className="relative flex-shrink-0">
                  <div className={`w-32 h-32 rounded-full bg-gradient-to-r from-olive to-solana-teal flex items-center justify-center glow-magenta shadow-2xl shadow-olive/40 transition-all duration-1000 ease-out ${
                    step3Visible ? 'scale-100 rotate-0' : 'scale-75 rotate-12'
                  }`}>
                    <ShieldCheckIcon className="h-16 w-16 text-midnight" />
                  </div>
                </div>
                
                {/* Text Content - Right */}
                <div className="flex-1">
                  <h3 className="text-3xl font-semibold mb-4 text-white">3. Approve Together</h3>
                  <p className="text-xl text-muted">At least 80% of group members must approve before money moves.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-16" ref={taglineRef}>
            <div className="text-xl text-solana-blue font-medium">
              {[
                'Every', 'transaction', 'is', 'verified,', 'recorded,', 'and', 'visible', '—', 'no', 'hidden', 'hands.'
              ].map((word, index) => (
                <span
                  key={index}
                  className={`inline-block mr-2 transition-all duration-500 ease-out ${
                    taglineVisible 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  }`}
                  style={{ 
                    transitionDelay: taglineVisible ? `${index * 150}ms` : '0ms',
                    textShadow: '0 0 20px rgba(6, 182, 212, 0.3)'
                  }}
                >
                  {word}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24 bg-gradient-to-b from-slate/10 to-midnight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-4">
              Built for Trust and Simplicity
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 bg-slate/40 backdrop-blur-sm rounded-xl border border-solana-teal/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-solana-teal/20 hover:bg-slate/50 cursor-pointer">
              <div className="w-12 h-12 mb-4 rounded-lg bg-solana-teal/20 flex items-center justify-center">
                <ShieldCheckIcon className="h-6 w-6 text-solana-teal" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">On-chain Governance</h3>
              <p className="text-muted">80% approval required for all withdrawals</p>
            </div>

            <div className="p-6 bg-slate/40 backdrop-blur-sm rounded-xl border border-solana-blue/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-solana-blue/20 hover:bg-slate/50 cursor-pointer">
              <div className="w-12 h-12 mb-4 rounded-lg bg-solana-blue/20 flex items-center justify-center">
                <BellIcon className="h-6 w-6 text-solana-blue" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Real-time Notifications</h3>
              <p className="text-muted">SMS & in-app notifications for every action</p>
            </div>

            <div className="p-6 bg-slate/40 backdrop-blur-sm rounded-xl border border-africa-gold/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-africa-gold/20 hover:bg-slate/50 cursor-pointer">
              <div className="w-12 h-12 mb-4 rounded-lg bg-africa-gold/20 flex items-center justify-center">
                <ChartBarIcon className="h-6 w-6 text-africa-gold" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Transparent Audit Trail</h3>
              <p className="text-muted">Every transaction recorded and visible</p>
            </div>

            <div className="p-6 bg-slate/40 backdrop-blur-sm rounded-xl border border-olive/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-olive/20 hover:bg-slate/50 cursor-pointer">
              <div className="w-12 h-12 mb-4 rounded-lg bg-olive/20 flex items-center justify-center">
                <CurrencyDollarIcon className="h-6 w-6 text-olive" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Fast Solana Pay Deposits</h3>
              <p className="text-muted">Lightning-fast QR code payments</p>
            </div>

            <div className="p-6 bg-slate/40 backdrop-blur-sm rounded-xl border border-solana-magenta/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-solana-magenta/20 hover:bg-slate/50 cursor-pointer">
              <div className="w-12 h-12 mb-4 rounded-lg bg-solana-magenta/20 flex items-center justify-center">
                <DevicePhoneMobileIcon className="h-6 w-6 text-solana-magenta" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">Mobile-first UX</h3>
              <p className="text-muted">Student-friendly, intuitive interface</p>
            </div>

            <div className="p-6 bg-slate/40 backdrop-blur-sm rounded-xl border border-terracotta/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-terracotta/20 hover:bg-slate/50 cursor-pointer">
              <div className="w-12 h-12 mb-4 rounded-lg bg-terracotta/20 flex items-center justify-center">
                <SparklesIcon className="h-6 w-6 text-terracotta" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">AI-powered Insights</h3>
              <p className="text-muted">Fraud detection & spending analytics (future)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="py-24 bg-midnight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-4">
              Who is Hawamoni For?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-8 bg-gradient-to-br from-slate/40 to-slate/20 rounded-2xl border border-solana-teal/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-solana-teal/15 hover:from-slate/50 hover:to-slate/30 cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-solana-teal to-solana-blue flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <AcademicCapIcon className="h-8 w-8 text-midnight" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Student Groups</h3>
              <p className="text-muted">Class dues, club funds, and association treasuries</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-slate/40 to-slate/20 rounded-2xl border border-africa-gold/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-africa-gold/15 hover:from-slate/50 hover:to-slate/30 cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-africa-gold to-terracotta flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <BuildingOfficeIcon className="h-8 w-8 text-midnight" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Co-founders & Startups</h3>
              <p className="text-muted">Shared treasury management and reimbursements</p>
            </div>

            <div className="text-center p-8 bg-gradient-to-br from-slate/40 to-slate/20 rounded-2xl border border-olive/20 transition-all duration-300 ease-out hover:scale-105 hover:shadow-2xl hover:shadow-olive/15 hover:from-slate/50 hover:to-slate/30 cursor-pointer">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-olive to-solana-teal flex items-center justify-center transition-transform duration-300 hover:scale-110">
                <HomeIcon className="h-8 w-8 text-midnight" />
              </div>
              <h3 className="text-xl font-semibold mb-4 text-white">Community Savings (Ajo)</h3>
              <p className="text-muted">Rotating savings and group contributions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Section */}
      <div className="py-24 bg-gradient-to-b from-slate/20 to-midnight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-8">
              Transparent. Secure. Built on Solana.
            </h2>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mb-8">
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate/40 rounded-full border border-solana-teal/20">
                <GlobeAltIcon className="h-5 w-5 text-solana-teal" />
                <span className="text-solana-teal font-medium">Solana Blockchain</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate/40 rounded-full border border-solana-blue/20">
                <CurrencyDollarIcon className="h-5 w-5 text-solana-blue" />
                <span className="text-solana-blue font-medium">Solana Pay</span>
              </div>
              <div className="flex items-center space-x-2 px-4 py-2 bg-slate/40 rounded-full border border-africa-gold/20">
                <ShieldCheckIcon className="h-5 w-5 text-africa-gold" />
                <span className="text-africa-gold font-medium">Blockchain-verified</span>
              </div>
            </div>
            
            <p className="mx-auto max-w-2xl text-lg text-muted">
              Transactions are processed on Solana's blockchain — low fees, high speed, and tamper-proof records.
            </p>
          </div>
        </div>
      </div>

      {/* Demo Section */}
      <div id="demo" className="py-24 bg-midnight">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-8">
              See How It Works in Action
            </h2>
            
            <div className="relative max-w-4xl mx-auto">
              <div className="bg-slate/40 backdrop-blur-sm rounded-2xl border border-slate/30 p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-solana-teal to-solana-blue flex items-center justify-center glow-teal">
                  <PlayIcon className="h-12 w-12 text-midnight" />
                </div>
                <p className="text-lg text-muted mb-6">
                  1-2 minute demo video or interactive walkthrough will be embedded here
                </p>
                <button className="btn-primary px-8 py-3">
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 bg-gradient-to-br from-solana-teal/10 via-midnight to-solana-magenta/10 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-solana-teal/5 to-africa-gold/5"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-5xl text-white mb-6">
            Start managing your group funds the transparent way.
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-muted mb-12">
            Join student groups and teams who trust Hawamoni for collective financial management.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/signup" className="btn-primary px-8 py-4 text-lg glow-teal">
              Create a Group Treasury
              <ArrowRightIcon className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/signup" className="btn-secondary px-8 py-4 text-lg">
              Join the Beta
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-slate border-t border-slate/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <Image 
                src="/logo.png" 
                alt="Hawamoni Logo" 
                width={24} 
                height={24}
              />
              <span className="text-lg font-bold gradient-text">Hawamoni</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6 mb-6 md:mb-0">
              <Link href="/about" className="text-muted hover:text-solana-blue transition-colors">
                About
              </Link>
              <Link href="/docs" className="text-muted hover:text-solana-blue transition-colors">
                Docs
              </Link>
              <Link href="/contact" className="text-muted hover:text-solana-blue transition-colors">
                Contact
              </Link>
              <Link href="https://github.com/Techdee1/Hawamoni" className="text-muted hover:text-solana-blue transition-colors">
                GitHub
              </Link>
            </div>
            
            <div className="flex space-x-4">
              <Link href="#" className="text-muted hover:text-solana-teal transition-colors">
                Twitter
              </Link>
              <Link href="#" className="text-muted hover:text-solana-teal transition-colors">
                Telegram
              </Link>
              <Link href="#" className="text-muted hover:text-solana-teal transition-colors">
                LinkedIn
              </Link>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate/30 text-center">
            <p className="text-muted text-sm">
              Hawamoni — Collective trust for collective money.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}