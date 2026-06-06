'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard, Store, FileText, Receipt, CheckCircle, ShoppingCart,
  BarChart3, Shield, Settings, LogOut, ChevronLeft, ChevronRight,
  Bell, Search, Sun, Moon, Menu, SquarePen
} from 'lucide-react'
import { toast } from 'sonner'

// Custom FileInvoice icon since lucide doesn't have it
const FileInvoiceIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10 9 9 9 8 9"/>
  </svg>
)

interface NavItem {
  href: string
  label: string
  icon: React.ReactNode
  badge?: number
  adminOnly?: boolean
  roles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/input', label: 'Input Center', icon: <SquarePen size={18} /> },
  { href: '/dashboard/vendors', label: 'Vendors', icon: <Store size={18} />, roles: ['admin', 'procurement_officer'] },
  { href: '/dashboard/rfqs', label: 'RFQs', icon: <FileText size={18} />, roles: ['admin', 'procurement_officer', 'vendor'] },
  { href: '/dashboard/quotations', label: 'Quotations', icon: <Receipt size={18} />, roles: ['admin', 'procurement_officer', 'vendor'] },
  { href: '/dashboard/approvals', label: 'Approvals', icon: <CheckCircle size={18} />, badge: 3, roles: ['admin', 'manager'] },
  { href: '/dashboard/purchase-orders', label: 'Purchase Orders', icon: <ShoppingCart size={18} />, roles: ['admin', 'procurement_officer', 'vendor'] },
  { href: '/dashboard/invoices', label: 'Invoices', icon: <FileInvoiceIcon size={18} />, roles: ['admin', 'procurement_officer'] },
  { href: '/dashboard/reports', label: 'Reports', icon: <BarChart3 size={18} />, roles: ['admin', 'manager', 'procurement_officer'] },
  { href: '/dashboard/audit', label: 'Audit Trail', icon: <Shield size={18} />, roles: ['admin', 'manager'] },
  { href: '/dashboard/settings', label: 'Settings', icon: <Settings size={18} />, adminOnly: true },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('vb_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('vb_user')
    toast.success('Logged out successfully')
    router.push('/auth/login')
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      admin: 'Administrator',
      procurement_officer: 'Proc. Officer',
      manager: 'Manager',
      vendor: 'Vendor',
    }
    return labels[role] || role
  }

  const getRoleBadgeColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: '#6366F1',
      procurement_officer: '#10B981',
      manager: '#F59E0B',
      vendor: '#3B82F6',
    }
    return colors[role] || '#6366F1'
  }

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(href)
  }

  return (
    <div className="sidebar" style={{ width: collapsed ? '72px' : '240px', minWidth: collapsed ? '72px' : '240px' }}>
      {/* Logo */}
      <div style={{
        padding: collapsed ? '20px 0' : '20px 16px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        justifyContent: collapsed ? 'center' : 'flex-start',
        height: '64px',
        flexShrink: 0,
      }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: '18px',
        }}>
          🌉
        </div>
        {!collapsed && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: 'white', fontWeight: 800, fontSize: '16px', letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
              VendorBridge
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', whiteSpace: 'nowrap' }}>Procurement ERP</div>
          </div>
        )}
      </div>

      {/* Nav Items */}
      <div style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', padding: '8px 0' }}>
        {NAV_ITEMS.map(item => {
          if (item.adminOnly && user?.role !== 'admin') return null
          if (item.roles && user?.role && !item.roles.includes(user.role)) return null
          const active = isActive(item.href)
          return (
            <Link key={item.href} href={item.href} className={`nav-item ${active ? 'active' : ''}`}
              style={{ justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '10px' : '10px 16px' }}
              title={collapsed ? item.label : undefined}>
              <span style={{ flexShrink: 0 }}>{item.icon}</span>
              {!collapsed && (
                <span style={{ flex: 1, fontSize: '14px' }}>{item.label}</span>
              )}
              {!collapsed && item.badge && item.badge > 0 && (
                <span style={{
                  background: '#EF4444', color: 'white', borderRadius: '9999px',
                  fontSize: '10px', fontWeight: 700, padding: '1px 6px', minWidth: '18px',
                  textAlign: 'center', flexShrink: 0,
                }}>
                  {item.badge}
                </span>
              )}
              {collapsed && item.badge && item.badge > 0 && (
                <span style={{
                  position: 'absolute', top: '4px', right: '6px',
                  background: '#EF4444', color: 'white', borderRadius: '9999px',
                  fontSize: '9px', fontWeight: 700, padding: '1px 4px', minWidth: '14px', textAlign: 'center',
                }}>
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </div>

      {/* User Profile + Logout */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '12px 8px', flexShrink: 0 }}>
        {!collapsed && user && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '10px 10px', marginBottom: '8px',
            background: 'rgba(255,255,255,0.05)', borderRadius: '8px',
          }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '50%',
              background: `linear-gradient(135deg, ${getRoleBadgeColor(user.role)}, #8B5CF6)`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '14px', flexShrink: 0,
            }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ color: 'white', fontSize: '13px', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {user.name}
              </div>
              <div style={{
                display: 'inline-block', background: `${getRoleBadgeColor(user.role)}20`,
                color: getRoleBadgeColor(user.role), borderRadius: '4px',
                fontSize: '10px', fontWeight: 600, padding: '1px 6px', marginTop: '2px',
              }}>
                {getRoleLabel(user.role)}
              </div>
            </div>
          </div>
        )}

        <button onClick={handleLogout} className="nav-item btn-ghost"
          style={{
            width: '100%', justifyContent: collapsed ? 'center' : 'flex-start',
            color: '#94A3B8', padding: collapsed ? '10px' : '8px 10px',
            display: 'flex', alignItems: 'center', gap: '10px',
            background: 'none', border: 'none', cursor: 'pointer', borderRadius: '8px',
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
          <LogOut size={16} style={{ color: '#EF4444', flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: '13px', color: '#EF4444', fontWeight: 500 }}>Logout</span>}
        </button>

        {/* Collapse Toggle */}
        <button onClick={onToggle} style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-end',
          padding: '8px 12px', background: 'none', border: 'none', cursor: 'pointer',
          color: 'rgba(255,255,255,0.3)', transition: 'color 0.15s',
          marginTop: '4px', borderRadius: '8px',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.7)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}>
          {collapsed ? <ChevronRight size={16} /> : <><span style={{ fontSize: '12px', marginRight: '4px' }}>Collapse</span><ChevronLeft size={16} /></>}
        </button>
      </div>
    </div>
  )
}

interface HeaderProps {
  title: string
  subtitle?: string
  sidebarCollapsed: boolean
  onMenuToggle: () => void
}

export function Header({ title, subtitle, sidebarCollapsed, onMenuToggle }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('vb_dark_mode')
    if (stored === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDark = () => {
    const next = !darkMode
    setDarkMode(next)
    localStorage.setItem('vb_dark_mode', String(next))
    document.documentElement.classList.toggle('dark', next)
  }

  const NOTIFICATIONS = [
    { id: 1, title: 'Quote Submitted', message: 'TechVision submitted quote for RFQ-001', time: '2m ago', read: false, type: 'info' },
    { id: 2, title: 'Approval Required', message: 'Quote #QT-003 awaiting your approval', time: '15m ago', read: false, type: 'warning' },
    { id: 3, title: 'PO Acknowledged', message: 'VB-PO-2025-0001 acknowledged by vendor', time: '1h ago', read: true, type: 'success' },
    { id: 4, title: 'Invoice Overdue', message: 'Invoice VB-INV-2025-0003 is overdue', time: '2h ago', read: false, type: 'error' },
  ]

  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length

  return (
    <header style={{
      height: '64px', background: 'white', borderBottom: '1px solid #E2E8F0',
      display: 'flex', alignItems: 'center', paddingLeft: '24px', paddingRight: '24px',
      position: 'sticky', top: 0, zIndex: 30, gap: '16px',
    }}>
      {/* Mobile menu toggle */}
      <button onClick={onMenuToggle} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'none', padding: '4px' }} className="mobile-menu-btn">
        <Menu size={20} color="#64748B" />
      </button>

      {/* Title */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', lineHeight: 1 }}>{title}</h1>
        {subtitle && <p style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{subtitle}</p>}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Search */}
        <button onClick={() => setSearchOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 12px',
          background: '#F1F5F9', border: '1px solid #E2E8F0', borderRadius: '8px',
          cursor: 'pointer', color: '#94A3B8', fontSize: '13px',
        }}>
          <Search size={15} />
          <span>Search... </span>
          <span style={{ fontSize: '11px', background: '#E2E8F0', padding: '1px 5px', borderRadius: '4px', color: '#64748B' }}>⌘K</span>
        </button>

        {/* Dark Mode */}
        <button onClick={toggleDark} style={{
          width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E2E8F0',
          background: '#F8FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {darkMode ? <Sun size={16} color="#F59E0B" /> : <Moon size={16} color="#64748B" />}
        </button>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button onClick={() => setNotifOpen(!notifOpen)} style={{
            width: '36px', height: '36px', borderRadius: '8px', border: '1px solid #E2E8F0',
            background: '#F8FAFC', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative',
          }}>
            <Bell size={16} color="#64748B" />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '-4px', right: '-4px',
                background: '#EF4444', color: 'white', borderRadius: '50%',
                width: '16px', height: '16px', fontSize: '9px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: '2px solid white',
              }}>{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <>
              <div onClick={() => setNotifOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
              <div style={{
                position: 'absolute', top: '44px', right: 0, width: '320px',
                background: 'white', border: '1px solid #E2E8F0', borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.12)', zIndex: 50, overflow: 'hidden',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Notifications</span>
                  <button style={{ fontSize: '12px', color: '#6366F1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Mark all read</button>
                </div>
                {NOTIFICATIONS.map(n => (
                  <div key={n.id} style={{
                    padding: '12px 16px', borderBottom: '1px solid #F1F5F9', cursor: 'pointer',
                    background: n.read ? 'white' : '#F8FAFF',
                    transition: 'background 0.1s',
                  }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '8px', height: '8px', borderRadius: '50%', flexShrink: 0, marginTop: '5px',
                        background: n.read ? '#E2E8F0' : (n.type === 'error' ? '#EF4444' : n.type === 'warning' ? '#F59E0B' : n.type === 'success' ? '#10B981' : '#6366F1'),
                      }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', marginBottom: '2px' }}>{n.title}</div>
                        <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>{n.message}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '4px' }}>{n.time}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
