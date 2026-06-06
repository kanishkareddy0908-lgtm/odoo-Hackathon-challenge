'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Eye, EyeOff, Mail, Lock, User, Loader2, ArrowRight, Building2 } from 'lucide-react'

const ROLES = [
  { value: 'admin', label: 'Administrator' },
  { value: 'procurement_officer', label: 'Procurement Officer' },
  { value: 'manager', label: 'Manager / Approver' },
]

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'procurement_officer'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.name.trim()) newErrors.name = 'Full name is required'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 8) newErrors.password = 'Minimum 8 characters'
    else if (!/(?=.*[A-Z])(?=.*[0-9])/.test(formData.password)) newErrors.password = 'Must include uppercase and number'
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      // Store user locally for demo
      const newUser = {
        id: `user-new-${Date.now()}`,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        avatar_url: '',
      }
      localStorage.setItem('vb_user', JSON.stringify(newUser))
      toast.success('Account created! Welcome to VendorBridge.')
      await new Promise(r => setTimeout(r, 500))
      router.push('/dashboard')
    } catch {
      toast.error('Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const update = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setErrors(prev => { const n = { ...prev }; delete n[field]; return n })
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#FAFAFA', alignItems: 'center', justifyContent: 'center', padding: '32px' }}>
      <div style={{ width: '100%', maxWidth: '460px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#6366F1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '20px' }}>🌉</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>VendorBridge</span>
          </div>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Create your account</h1>
          <p style={{ color: '#64748B', fontSize: '15px' }}>Get started with VendorBridge ERP</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', border: '1px solid #E2E8F0' }}>
          <form onSubmit={handleSignup}>
            {/* Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Full Name</label>
              <div style={{ position: 'relative' }}>
                <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="text" value={formData.name} onChange={e => update('name', e.target.value)}
                  placeholder="Arjun Sharma" className="input" style={{ paddingLeft: '38px', borderColor: errors.name ? '#EF4444' : undefined }} />
              </div>
              {errors.name && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
            </div>

            {/* Email */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Work Email</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="email" value={formData.email} onChange={e => update('email', e.target.value)}
                  placeholder="you@company.com" className="input" style={{ paddingLeft: '38px', borderColor: errors.email ? '#EF4444' : undefined }} />
              </div>
              {errors.email && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.email}</p>}
            </div>

            {/* Role */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Role</label>
              <div style={{ position: 'relative' }}>
                <Building2 size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <select value={formData.role} onChange={e => update('role', e.target.value)}
                  className="input" style={{ paddingLeft: '38px' }}>
                  {ROLES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={e => update('password', e.target.value)}
                  placeholder="Min 8 chars, uppercase + number" className="input"
                  style={{ paddingLeft: '38px', paddingRight: '40px', borderColor: errors.password ? '#EF4444' : undefined }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF' }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Confirm Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                <input type="password" value={formData.confirmPassword} onChange={e => update('confirmPassword', e.target.value)}
                  placeholder="Repeat password" className="input"
                  style={{ paddingLeft: '38px', borderColor: errors.confirmPassword ? '#EF4444' : undefined }} />
              </div>
              {errors.confirmPassword && <p style={{ color: '#EF4444', fontSize: '12px', marginTop: '4px' }}>{errors.confirmPassword}</p>}
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ width: '100%' }}>
              {loading ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : <>Create Account <ArrowRight size={16} /></>}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#64748B' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: '#6366F1', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </div>
      </div>
    </div>
  )
}
