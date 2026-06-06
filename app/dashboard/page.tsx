'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  TrendingUp, TrendingDown, Store, FileText, CheckCircle, DollarSign,
  Plus, ArrowRight, Clock, AlertCircle, BarChart3, ExternalLink
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Area, AreaChart,
} from 'recharts'
import {
  DEMO_VENDORS, DEMO_RFQS, DEMO_QUOTATIONS, DEMO_PURCHASE_ORDERS,
  DEMO_INVOICES, MONTHLY_SPEND_DATA, CATEGORY_SPEND_DATA
} from '@/lib/seed-data'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

function useCountUp(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function StatCard({ title, value, suffix = '', icon, trend, trendValue, color, onClick }: {
  title: string; value: number; suffix?: string; icon: React.ReactNode;
  trend?: 'up' | 'down'; trendValue?: string; color: string; onClick?: () => void
}) {
  const count = useCountUp(value)
  return (
    <div className="card" onClick={onClick} style={{
      padding: '20px', cursor: onClick ? 'pointer' : 'default',
      transition: 'transform 0.2s, box-shadow 0.2s',
      borderLeft: `4px solid ${color}`,
    }}
      onMouseEnter={e => { if (onClick) { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)' } }}
      onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
        <div style={{ fontSize: '13px', fontWeight: 500, color: '#64748B' }}>{title}</div>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
          {icon}
        </div>
      </div>
      <div style={{ fontSize: '28px', fontWeight: 800, color: '#0F172A', letterSpacing: '-1px', marginBottom: '6px' }}>
        {suffix === '₹' ? formatCurrency(count) : `${count}${suffix}`}
      </div>
      {trend && trendValue && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
          {trend === 'up' ? <TrendingUp size={14} color="#10B981" /> : <TrendingDown size={14} color="#EF4444" />}
          <span style={{ color: trend === 'up' ? '#10B981' : '#EF4444', fontWeight: 600 }}>{trendValue}</span>
          <span style={{ color: '#94A3B8' }}>vs last month</span>
        </div>
      )}
    </div>
  )
}

const getStatusBadgeClass = (status: string) => {
  const map: Record<string, string> = {
    open: 'badge-blue', closed: 'badge-gray', draft: 'badge-yellow',
    cancelled: 'badge-red', active: 'badge-green', completed: 'badge-green',
    sent: 'badge-blue', acknowledged: 'badge-indigo', pending: 'badge-yellow',
    paid: 'badge-green', overdue: 'badge-red', submitted: 'badge-purple',
    accepted: 'badge-green', rejected: 'badge-red',
  }
  return `badge ${map[status] || 'badge-gray'}`
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: '6px', fontSize: '13px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '12px', fontWeight: 500 }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('vb_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const activeVendors = DEMO_VENDORS.filter(v => v.status === 'active').length
  const openRFQs = DEMO_RFQS.filter(r => r.status === 'open').length
  const pendingApprovals = DEMO_QUOTATIONS.filter(q => q.status === 'submitted').length
  const monthlySpend = MONTHLY_SPEND_DATA[MONTHLY_SPEND_DATA.length - 1].actual

  const QUICK_ACTIONS = [
    { label: 'Create New RFQ', icon: <Plus size={16} />, href: '/dashboard/rfqs/new', color: '#6366F1', bg: '#EEF2FF' },
    { label: 'Add Vendor', icon: <Store size={16} />, href: '/dashboard/vendors', color: '#10B981', bg: '#ECFDF5' },
    { label: 'View Approvals', icon: <CheckCircle size={16} />, href: '/dashboard/approvals', color: '#F59E0B', bg: '#FFFBEB' },
    { label: 'Reports & Analytics', icon: <BarChart3 size={16} />, href: '/dashboard/reports', color: '#8B5CF6', bg: '#F5F3FF' },
  ]

  return (
    <div style={{ maxWidth: '1400px', animation: 'fadeIn 0.4s ease' }}>
      {/* Welcome */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginBottom: '4px' }}>
          Good morning, {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p style={{ color: '#64748B', fontSize: '14px' }}>
          Here&apos;s what&apos;s happening with your procurement today
        </p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <StatCard
          title="Active Vendors" value={activeVendors}
          icon={<Store size={18} />} trend="up" trendValue="+2" color="#6366F1"
          onClick={() => router.push('/dashboard/vendors')}
        />
        <StatCard
          title="Open RFQs" value={openRFQs}
          icon={<FileText size={18} />} trend="up" trendValue="+1" color="#10B981"
          onClick={() => router.push('/dashboard/rfqs')}
        />
        <StatCard
          title="Pending Approvals" value={pendingApprovals}
          icon={<CheckCircle size={18} />} trend="down" trendValue="-1" color="#F59E0B"
          onClick={() => router.push('/dashboard/approvals')}
        />
        <StatCard
          title="Monthly Spend" value={monthlySpend} suffix="₹"
          icon={<DollarSign size={18} />} trend="up" trendValue="+4%" color="#8B5CF6"
          onClick={() => router.push('/dashboard/reports')}
        />
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '24px' }}>
        {QUICK_ACTIONS.map((action) => (
          <Link key={action.label} href={action.href} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '14px 16px', borderRadius: '10px',
            background: action.bg, border: `1px solid ${action.color}20`,
            textDecoration: 'none', transition: 'all 0.15s',
            cursor: 'pointer',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${action.color}20` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ''; (e.currentTarget as HTMLElement).style.boxShadow = '' }}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: action.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
              {action.icon}
            </div>
            <span style={{ color: action.color, fontWeight: 600, fontSize: '13px' }}>{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Tables Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        {/* Recent RFQs */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Recent RFQs</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Latest procurement requests</p>
            </div>
            <Link href="/dashboard/rfqs" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6366F1', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {DEMO_RFQS.slice(0, 4).map(rfq => (
                  <tr key={rfq.id}>
                    <td style={{ maxWidth: '160px' }}>
                      <div style={{ fontWeight: 500, color: '#0F172A', fontSize: '13px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rfq.title}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{formatCurrency(rfq.total_budget)}</div>
                    </td>
                    <td><span className={getStatusBadgeClass(rfq.status)}>{rfq.status}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#64748B' }}>
                        <Clock size={12} />
                        {formatDate(rfq.deadline)}
                      </div>
                    </td>
                    <td>
                      <Link href={`/dashboard/rfqs/${rfq.id}`} style={{ color: '#6366F1', display: 'flex', alignItems: 'center' }}>
                        <ExternalLink size={14} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent POs */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Recent Purchase Orders</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Latest approved orders</p>
            </div>
            <Link href="/dashboard/purchase-orders" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#6366F1', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}>
              View all <ArrowRight size={14} />
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_PURCHASE_ORDERS.map(po => {
                  const vendor = DEMO_VENDORS.find(v => v.id === po.vendor_id)
                  return (
                    <tr key={po.id}>
                      <td>
                        <div style={{ fontWeight: 600, fontSize: '13px', color: '#6366F1' }}>{po.po_number}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{formatDate(po.created_at)}</div>
                      </td>
                      <td style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>{vendor?.company_name}</td>
                      <td style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{formatCurrency(po.total)}</td>
                      <td><span className={getStatusBadgeClass(po.status)}>{po.status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Invoice Summary */}
          <div style={{ padding: '12px 20px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '16px' }}>
            {DEMO_INVOICES.map(inv => (
              <div key={inv.id} style={{ flex: 1, padding: '10px', background: inv.status === 'paid' ? '#ECFDF5' : '#FFFBEB', borderRadius: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '4px' }}>{inv.invoice_number}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{formatCurrency(inv.amount_due)}</div>
                <span className={getStatusBadgeClass(inv.status)} style={{ marginTop: '4px', display: 'inline-flex' }}>{inv.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', marginBottom: '24px' }}>
        {/* Monthly Spend Chart */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Monthly Procurement Spend</h3>
              <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Last 6 months — actual vs budget</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#6366F1' }} />
                <span style={{ fontSize: '12px', color: '#64748B' }}>Actual</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#E2E8F0' }} />
                <span style={{ fontSize: '12px', color: '#64748B' }}>Budget</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={MONTHLY_SPEND_DATA} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budgeted" fill="#E2E8F0" name="Budget" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#6366F1" name="Actual" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Donut */}
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Spend by Category</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8', marginTop: '2px' }}>Distribution this year</p>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={CATEGORY_SPEND_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} dataKey="value">
                {CATEGORY_SPEND_DATA.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val) => formatCurrency(val as number)} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginTop: '8px' }}>
            {CATEGORY_SPEND_DATA.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ fontSize: '11px', color: '#64748B' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alerts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertCircle size={18} color="#B45309" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#92400E' }}>RFQ Deadline Approaching</div>
            <div style={{ fontSize: '12px', color: '#B45309', marginTop: '2px' }}>IT Support Contract deadline in 3 days</div>
          </div>
        </div>
        <div style={{ background: '#FEE2E2', border: '1px solid #FECACA', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <AlertCircle size={18} color="#B91C1C" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#7F1D1D' }}>Invoice Pending Payment</div>
            <div style={{ fontSize: '12px', color: '#B91C1C', marginTop: '2px' }}>VB-INV-2025-0001 due in 9 days</div>
          </div>
        </div>
        <div style={{ background: '#ECFDF5', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          <CheckCircle size={18} color="#15803D" />
          <div>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#14532D' }}>PO Acknowledged</div>
            <div style={{ fontSize: '12px', color: '#15803D', marginTop: '2px' }}>VB-PO-2025-0001 confirmed by TechVision</div>
          </div>
        </div>
      </div>
    </div>
  )
}
