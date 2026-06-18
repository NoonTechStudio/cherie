'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const BUTTER = '#FFEDAB'
const CHERRY = '#75070C'

const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

const PROBLEMS = [
  {
    icon: '🗓',
    title: 'Double bookings happen',
    body: 'Two clients, same slot. Awkward cancellations. Lost trust.',
  },
  {
    icon: '📱',
    title: 'Clients forget appointments',
    body: 'No reminder means no-show. Your time, wasted.',
  },
  {
    icon: '📒',
    title: 'Your client list is scattered',
    body: 'Phone contacts, chat history, paper registers. No real record.',
  },
]

const STEPS = [
  {
    n: '1',
    title: 'Create your account',
    body: 'Enter your name, mobile number, and city. Done in under 2 minutes.',
  },
  {
    n: '2',
    title: 'Set up your business',
    body: 'Enter your business name and choose Heena artist or beauty parlor. Your profile is ready instantly.',
  },
  {
    n: '3',
    title: 'Start taking bookings',
    body: 'Share your booking link with clients. They book, you get notified. That\'s it.',
  },
]

const FEATURES = [
  { icon: '📅', title: 'Appointment booking', body: 'Accept bookings anytime, even while you sleep. Clients pick their own slot.' },
  { icon: '👥', title: 'Client management', body: 'Every client\'s history, preferences, and visit count — all in one place.' },
  { icon: '🔔', title: 'SMS & WhatsApp reminders', body: 'Automatic reminders sent before every appointment. No more no-shows.' },
  { icon: '📊', title: 'Today\'s overview', body: 'See today\'s bookings and this week\'s count the moment you open the app.' },
  { icon: '📱', title: 'Mobile first', body: 'Built for your phone. Works on any screen with no app download needed.' },
  { icon: '🔒', title: 'Secure & private', body: 'OTP-based login. Your client data belongs to you, always.' },
]

const PLANS = [
  {
    id: '1mo',
    label: '1 Month',
    price: '₹79',
    per: '/month',
    note: null,
    badge: null,
    highlight: false,
    link: 'https://rzp.io/rzp/6E6mIZf',
  },
  {
    id: '3mo',
    label: '3 Months',
    price: '₹199',
    per: '/ 3 months',
    note: '₹66/month',
    badge: 'Save ₹38',
    highlight: true,
    link: 'https://rzp.io/rzp/ZXmxrna7',
  },
  {
    id: '6mo',
    label: '6 Months',
    price: '₹379',
    per: '/ 6 months',
    note: '₹63/month',
    badge: 'Best value — Save ₹95',
    highlight: false,
    link: 'https://rzp.io/rzp/aMnOxzYj',
  },
]

const FAQS = [
  {
    q: 'Do I need to download an app?',
    a: 'No. Chérie works right in your phone\'s browser. Just open the link and you\'re in.',
  },
  {
    q: 'What happens after my 3-day trial?',
    a: 'You choose a plan and continue. If you don\'t subscribe, your account is paused — but your data stays safe.',
  },
  {
    q: 'Can my clients book on their own?',
    a: 'Yes. Share your booking link and clients can pick their own slot anytime, 24/7.',
  },
  {
    q: 'Is my client data safe?',
    a: 'Absolutely. We use OTP-based login and your data is never shared with anyone.',
  },
  {
    q: 'What if I need help setting up?',
    a: 'WhatsApp us directly at +91 80004 03090. We\'ll set it up with you on a call.',
  },
]

export default function LandingPage() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen" style={{ fontFamily: 'var(--font-inter, Inter, sans-serif)' }}>

      {/* NAVBAR */}
      <header
        className="sticky top-0 z-50 w-full"
        style={{ backgroundColor: CHERRY }}
      >
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <span
            className="text-2xl font-bold select-none"
            style={{ color: BUTTER, fontFamily: 'var(--font-playfair, serif)' }}
          >
            Chérie
          </span>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium transition-opacity hover:opacity-70"
                style={{ color: BUTTER }}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: BUTTER }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold px-5 py-2 rounded-full transition-opacity hover:opacity-90"
              style={{ backgroundColor: BUTTER, color: CHERRY }}
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg"
            style={{ color: BUTTER }}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-5 py-4 flex flex-col gap-4"
            style={{ backgroundColor: CHERRY, borderColor: `${BUTTER}33` }}
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium"
                style={{ color: BUTTER }}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              className="text-sm font-medium"
              style={{ color: BUTTER }}
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold text-center py-3 rounded-full"
              style={{ backgroundColor: BUTTER, color: CHERRY }}
              onClick={() => setMobileOpen(false)}
            >
              Start Free Trial
            </Link>
          </div>
        )}
      </header>

      {/* SECTION 1: HERO */}
      <section
        className="px-5 py-20 md:py-28 flex flex-col items-center text-center"
        style={{ backgroundColor: BUTTER }}
      >
        <h1
          className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl"
          style={{ color: CHERRY, fontFamily: 'var(--font-playfair, serif)' }}
        >
          Appointments sorted. Clients happy. You in control.
        </h1>
        <p
          className="mt-5 text-base md:text-lg max-w-xl leading-relaxed"
          style={{ color: CHERRY }}
        >
          The simplest booking app built for Heena artists and beauty parlors in India. Set up in 2 minutes. No tech skills needed.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 items-center">
          <Link
            href="/register"
            className="px-7 py-3.5 rounded-full text-base font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: CHERRY, color: BUTTER }}
          >
            Start Your Free Trial
          </Link>
          <a
            href="#features"
            className="px-7 py-3.5 rounded-full text-base font-semibold border-2 transition-opacity hover:opacity-80"
            style={{ borderColor: CHERRY, color: CHERRY, backgroundColor: 'transparent' }}
          >
            See How It Works
          </a>
        </div>
        <p className="mt-5 text-sm opacity-70" style={{ color: CHERRY }}>
          3 days free · No card required · Cancel anytime
        </p>
      </section>

      {/* SECTION 2: PROBLEM */}
      <section className="px-5 py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-10"
            style={{ color: CHERRY, fontFamily: 'var(--font-playfair, serif)' }}
          >
            Still managing bookings on WhatsApp?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PROBLEMS.map((p) => (
              <div
                key={p.title}
                className="rounded-2xl p-6 border-2"
                style={{ backgroundColor: '#FFFFFF', borderColor: CHERRY }}
              >
                <div className="text-4xl mb-3">{p.icon}</div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: CHERRY }}
                >
                  {p.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: HOW IT WORKS */}
      <section
        className="px-5 py-16 md:py-20"
        style={{ backgroundColor: BUTTER }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-10"
            style={{ color: CHERRY, fontFamily: 'var(--font-playfair, serif)' }}
          >
            Up and running in 3 steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map((s) => (
              <div key={s.n} className="flex flex-col items-center text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-4 shrink-0"
                  style={{ backgroundColor: CHERRY, color: BUTTER }}
                >
                  {s.n}
                </div>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: CHERRY }}
                >
                  {s.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: CHERRY, opacity: 0.8 }}>
                  {s.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: FEATURES */}
      <section id="features" className="px-5 py-16 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-10"
            style={{ color: CHERRY, fontFamily: 'var(--font-playfair, serif)' }}
          >
            Everything you need. Nothing you don't.
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 border-t-4"
                style={{ backgroundColor: '#FFF9E5', borderTopColor: CHERRY }}
              >
                <div className="text-4xl mb-3">{f.icon}</div>
                <h3
                  className="text-base font-bold mb-1.5"
                  style={{ color: CHERRY }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed text-gray-600">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: PRICING */}
      <section
        id="pricing"
        className="px-5 py-16 md:py-20"
        style={{ backgroundColor: CHERRY }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-3"
            style={{ color: BUTTER, fontFamily: 'var(--font-playfair, serif)' }}
          >
            Simple pricing. No surprises.
          </h2>
          <p
            className="text-center text-sm md:text-base mb-10 opacity-80"
            style={{ color: BUTTER }}
          >
            Start free for 3 days. Then pick what works for you. No card needed during trial.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map((p) => (
              <div
                key={p.id}
                className={`rounded-2xl p-6 flex flex-col ${p.highlight ? 'border-2 shadow-xl scale-[1.03]' : 'border'}`}
                style={{
                  backgroundColor: p.highlight ? '#FFFFFF' : `${BUTTER}22`,
                  borderColor: p.highlight ? BUTTER : `${BUTTER}44`,
                  color: p.highlight ? CHERRY : BUTTER,
                }}
              >
                {p.badge && (
                  <span
                    className="self-start text-xs font-bold px-3 py-1 rounded-full mb-3"
                    style={{
                      backgroundColor: p.highlight ? CHERRY : BUTTER,
                      color: p.highlight ? BUTTER : CHERRY,
                    }}
                  >
                    {p.badge}
                  </span>
                )}
                <p className="text-sm font-medium mb-1">{p.label}</p>
                <p
                  className="text-3xl font-bold"
                  style={{ color: p.highlight ? CHERRY : BUTTER }}
                >
                  {p.price}
                  <span className="text-base font-normal ml-1 opacity-70">{p.per}</span>
                </p>
                {p.note && (
                  <p className="text-xs mt-1 opacity-70">{p.note}</p>
                )}
                <a
                  href={p.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 py-3 rounded-full text-sm font-semibold text-center transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: p.highlight ? CHERRY : BUTTER,
                    color: p.highlight ? BUTTER : CHERRY,
                  }}
                >
                  Get Started
                </a>
              </div>
            ))}
          </div>

          <p
            className="text-center text-xs mt-6 opacity-60"
            style={{ color: BUTTER }}
          >
            No card needed during trial · Payments secured by Razorpay
          </p>
          <p
            className="text-center text-xs mt-1 font-medium opacity-70"
            style={{ color: BUTTER }}
          >
            🔒 Razorpay — India's trusted payment gateway
          </p>
        </div>
      </section>

      {/* SECTION 6: FAQ */}
      <section
        id="faq"
        className="px-5 py-16 md:py-20"
        style={{ backgroundColor: BUTTER }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-2xl md:text-3xl font-bold text-center mb-10"
            style={{ color: CHERRY, fontFamily: 'var(--font-playfair, serif)' }}
          >
            Questions? Answered.
          </h2>
          <Accordion type="single" collapsible className="w-full space-y-2">
            {FAQS.map((f, i) => (
              <AccordionItem
                key={i}
                value={`faq-${i}`}
                className="rounded-xl border px-4"
                style={{ borderColor: `${CHERRY}33`, backgroundColor: 'rgba(255,255,255,0.6)' }}
              >
                <AccordionTrigger
                  className="text-sm font-semibold text-left hover:no-underline py-4 [&[data-state=open]]:text-[#75070C]"
                  style={{ color: CHERRY }}
                >
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed pb-4 text-gray-700">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* SECTION 7: FINAL CTA */}
      <section
        className="px-5 py-20 flex flex-col items-center text-center"
        style={{ backgroundColor: CHERRY }}
      >
        <h2
          className="text-2xl md:text-4xl font-bold max-w-2xl leading-snug"
          style={{ color: BUTTER, fontFamily: 'var(--font-playfair, serif)' }}
        >
          Your next client is waiting. Let's get you ready.
        </h2>
        <p
          className="mt-4 text-sm md:text-base max-w-md opacity-80"
          style={{ color: BUTTER }}
        >
          Join Heena artists and beauty parlors already using Chérie to run their bookings professionally.
        </p>
        <Link
          href="/register"
          className="mt-8 px-8 py-4 rounded-full text-base font-bold transition-opacity hover:opacity-90"
          style={{ backgroundColor: BUTTER, color: CHERRY }}
        >
          Start Free — No Card Needed
        </Link>
      </section>

      {/* FOOTER */}
      <footer
        className="px-5 pt-10 pb-6"
        style={{ backgroundColor: CHERRY }}
      >
        <div
          className="max-w-6xl mx-auto border-t mb-8"
          style={{ borderColor: `${BUTTER}33` }}
        />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Left */}
          <div>
            <p
              className="text-xl font-bold mb-1"
              style={{ color: BUTTER, fontFamily: 'var(--font-playfair, serif)' }}
            >
              Chérie
            </p>
            <p className="text-xs opacity-60" style={{ color: BUTTER }}>
              A product by Meridian Grid
            </p>
          </div>

          {/* Center */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 md:justify-center">
            {[
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'FAQ', href: '#faq' },
              { label: 'Sign In', href: '/login' },
            ].map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity"
                style={{ color: BUTTER }}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Right */}
          <div className="flex flex-col gap-1.5 md:items-end text-sm" style={{ color: BUTTER }}>
            <a
              href="mailto:hello@meridiangrid.in"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              hello@meridiangrid.in
            </a>
            <a
              href="tel:+918000403090"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              +91 80004 03090
            </a>
            <a
              href="https://wa.me/918000403090"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-70 hover:opacity-100 transition-opacity"
            >
              WhatsApp us
            </a>
          </div>
        </div>

        <div
          className="max-w-6xl mx-auto border-t pt-5 text-center text-xs opacity-50"
          style={{ borderColor: `${BUTTER}33`, color: BUTTER }}
        >
          © 2026 Chérie by Meridian Grid. All rights reserved.
        </div>
      </footer>

    </div>
  )
}
