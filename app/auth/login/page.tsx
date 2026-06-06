'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, Loader2, ArrowRight, Building2, Zap, Shield, TrendingUp } from 'lucide-react'

const DEMO_ACCOUNTS = [
  { email: 'admin@vendorbridge.com', password: 'Admin@123', role: 'Admin', color: '#6366F1' },
  { email: 'officer@vendorbridge.com', password: 'Officer@123', role: 'Procurement Officer', color: '#10B981' },
  { email: 'manager@vendorbridge.com', password: 'Manager@123', role: 'Manager', color: '#F59E0B' },
]

const FEATURES = [
  { icon: <Zap size={18} />, title: 'AI-Powered RFQs', desc: 'Generate RFQs from plain English with Claude AI' },
  { icon: <Shield size={18} />, title: 'Immutable Audit Trail', desc: 'Blockchain-style tamper-proof audit logs' },
  { icon: <TrendingUp size={18} />, title: 'Predictive Analytics', desc: 'Forecast spend with AI-driven insights' },
  { icon: <Building2 size={18} />, title: 'Vendor Portal', desc: 'Magic-link portal for seamless vendor collaboration' },
]

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      // Simulate auth for demo — in production uses Supabase
      const demo = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password)
      if (demo) {
        // Store mock session
        localStorage.setItem('vb_user', JSON.stringify({
          id: `user-${demo.role.toLowerCase().replace(' ', '-')}-1`,
          email: demo.email,
          name: demo.role === 'Admin' ? 'Arjun Sharma' : demo.role === 'Procurement Officer' ? 'Priya Menon' : 'Rahul Gupta',
          role: demo.role === 'Admin' ? 'admin' : demo.role === 'Procurement Officer' ? 'procurement_officer' : 'manager',
          avatar_url: '',
        }))
        toast.success(`Welcome back! Logged in as ${demo.role}`)
        await new Promise(r => setTimeout(r, 500))
        router.push('/dashboard')
      } else {
        // Try Supabase if configured
        if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_url') {
          const { createClient } = await import('@/lib/supabase/client')
          const supabase = createClient()
          const { error } = await supabase.auth.signInWithPassword({ email, password })
          if (error) throw error
          router.push('/dashboard')
        } else {
          toast.error('Invalid credentials. Try the demo accounts below.')
        }
      }
    } catch {
      toast.error('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = (account: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setErrors({})
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      {/* Left Panel — Branding */}
      <div style={{
        width: '50%',
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 30%, #4C1D95 60%, #6D28D9 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none'
        }}>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.03)',
              width: `${[300, 200, 400, 150, 250, 180][i]}px`,
              height: `${[300, 200, 400, 150, 250, 180][i]}px`,
              top: `${[10, 60, -10, 40, 70, 20][i]}%`,
              left: `${[20, 60, 40, 80, 10, 50][i]}%`,
              transform: 'translate(-50%, -50%)',
            }} />
          ))}
          {/* Animated procurement flow nodes */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }} viewBox="0 0 400 600">
            <circle cx="60" cy="150" r="20" fill="#818CF8" opacity="0.6">
              <animate attributeName="cy" values="150;140;150" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="340" cy="250" r="15" fill="#A78BFA" opacity="0.5">
              <animate attributeName="cy" values="250;240;250" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="200" cy="400" r="25" fill="#7C3AED" opacity="0.4">
              <animate attributeName="cy" values="400;385;400" dur="4s" repeatCount="indefinite" />
            </circle>
            <path d="M60 150 Q200 200 340 250" stroke="#818CF8" strokeWidth="1.5" fill="none" strokeDasharray="5,5">
              <animate attributeName="strokeDashoffset" values="0;-20" dur="1.5s" repeatCount="indefinite" />
            </path>
            <path d="M340 250 Q270 325 200 400" stroke="#A78BFA" strokeWidth="1.5" fill="none" strokeDasharray="5,5">
              <animate attributeName="strokeDashoffset" values="0;-20" dur="2s" repeatCount="indefinite" />
            </path>
          </svg>
        </div>

        {/* Logo */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <span style={{ fontSize: '22px' }}>🌉</span>
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 800, fontSize: '22px', letterSpacing: '-0.5px' }}>VendorBridge</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>Procurement ERP</div>
            </div>
          </div>

          <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 800, lineHeight: 1.2, marginBottom: '16px', letterSpacing: '-1px' }}>
            Intelligent Procurement,<br />
            <span style={{ color: '#A78BFA' }}>Reimagined.</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '16px', lineHeight: 1.6, maxWidth: '380px' }}>
            AI-powered vendor management and procurement automation that saves time, reduces costs, and ensures compliance.
          </p>
        </div>

        {/* Features */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '48px' }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{ color: '#A78BFA', marginBottom: '8px' }}>{f.icon}</div>
                <div style={{ color: 'white', fontWeight: 600, fontSize: '13px', marginBottom: '4px' }}>{f.title}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: '32px' }}>
            {[['12+', 'Vendors Managed'], ['₹13L+', 'Spend Tracked'], ['98%', 'Uptime SLA']].map(([val, label]) => (
              <div key={label}>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '22px' }}>{val}</div>
                <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div style={{
        width: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px',
        background: '#FAFAFA',
      }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', marginBottom: '8px', letterSpacing: '-0.5px' }}>
              Welcome back
            </h2>
            <p style={{ color: '#64748B', fontSize: '15px' }}>
              Sign in to your VendorBridge account
            </p>
          </div>

          {/* Demo Account Quick Fill */}
          <div style={{
            background: '#EEF2FF', border: '1px solid #C7D2FE', borderRadius: '12px',
            padding: '14px 16px', marginBottom: '24px'
          }}>
            <div style={{ fontSize: '12px', fontWeight: 600, color: '#4338CA', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🚀 Demo Accounts — Click to fill
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {DEMO_ACCOUNTS.map(account => (
                <button key={account.email} onClick={() => fillDemo(account)} style={{
                  padding: '5px 12px', borderRadius: '6px', border: `1px solid ${account.color}30`,
                  background: `${account.color}10`, color: account.color, fontSize: '12px',
                  fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
                }} onMouseEnter={e => (e.currentTarget.style.background = `${account.color}20`)}
                  onMouseLeave={e => (e.currentTarget.style.background = `${account.color}10`)}>
                  {account.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Email address
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setErrors(prev => ({ ...prev, email: undefined })) }}
                  placeholder="you@company.com"
                  className="input"
                  style={{ paddingLeft: '38px', borderColor: errors.email ? '#EF4444' : undefined }}
                />
              </div>
              {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => { setPassword(e.target.value); setErrors(prev => ({ ...prev, password: undefined })) }}
                  placeholder="••••••••"
                  className="input"
                  style={{ paddingLeft: '38px', paddingRight: '40px', borderColor: errors.password ? '#EF4444' : undefined }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '2px'
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            {/* Remember Me + Forgot */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
                <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#6366F1' }} />
                Remember me
              </label>
              <Link href="/auth/forgot-password" style={{ fontSize: '14px', color: '#6366F1', textDecoration: 'none', fontWeight: 500 }}>
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#64748B' }}>
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" style={{ color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>
              Sign up
            </Link>
          </div>

          {/* Social proof */}
          <div style={{
            marginTop: '40px', padding: '16px', background: 'white', borderRadius: '10px',
            border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <div style={{ fontSize: '24px' }}>🔒</div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>Enterprise-grade security</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>SOC2 compliant · End-to-end encrypted · GDPR ready</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
