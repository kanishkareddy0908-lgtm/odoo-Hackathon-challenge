'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar, { Header } from '@/components/layout/Sidebar'
import ProcureGPTChat from '@/components/ai/ProcureGPTChat'
import { DEMO_MODE_COPY } from '@/lib/demo-workflow'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [pageTitle, setPageTitle] = useState('Dashboard')
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('vb_user')
    if (!stored) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(stored))
  }, [router])

  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', border: '3px solid #6366F1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ color: '#64748B', fontSize: '14px' }}>Loading VendorBridge...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F8FAFC' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      
      <div className="main-content" style={{ 
        marginLeft: collapsed ? '72px' : '240px',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <Header 
          title={pageTitle} 
          sidebarCollapsed={collapsed}
          onMenuToggle={() => setCollapsed(!collapsed)}
        />
        <main style={{ flex: 1, padding: '24px', overflowX: 'hidden' }}>
          <div style={{ marginBottom: '16px', padding: '11px 14px', borderRadius: '12px', background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#3730A3', fontSize: '13px', fontWeight: 600 }}>
            {DEMO_MODE_COPY}
          </div>
          {children}
        </main>
      </div>

      {/* ProcureGPT Floating Chat */}
      <ProcureGPTChat />
    </div>
  )
}
