'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, FileText, Clock, DollarSign, ArrowRight, Eye } from 'lucide-react'
import { DEMO_RFQS } from '@/lib/seed-data'
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils'

const PRIORITY_COLORS = {
  Low: { bg: '#F1F5F9', color: '#64748B' },
  Medium: { bg: '#DBEAFE', color: '#1D4ED8' },
  High: { bg: '#FEF3C7', color: '#B45309' },
  Urgent: { bg: '#FEE2E2', color: '#B91C1C' },
}

const STATUS_COLORS = {
  draft: { bg: '#F1F5F9', color: '#475569' },
  open: { bg: '#DBEAFE', color: '#1D4ED8' },
  closed: { bg: '#DCFCE7', color: '#15803D' },
  cancelled: { bg: '#FEE2E2', color: '#B91C1C' },
}

export default function RFQsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = DEMO_RFQS.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || r.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div style={{ maxWidth: '1200px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Request for Quotations</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
            {DEMO_RFQS.filter(r => r.status === 'open').length} open · {DEMO_RFQS.filter(r => r.status === 'draft').length} draft
          </p>
        </div>
        <Link href="/dashboard/rfqs/new" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
          <Plus size={15} /> Create RFQ
        </Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search RFQs..." style={{ paddingLeft: '32px' }} />
        </div>
        <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto', minWidth: '130px' }}>
          <option value="all">All Status</option>
          <option value="open">Open</option>
          <option value="draft">Draft</option>
          <option value="closed">Closed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* RFQ Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
        {filtered.map(rfq => {
          const daysLeft = getDaysUntil(rfq.deadline)
          const priorityStyle = PRIORITY_COLORS[rfq.priority]
          const statusStyle = STATUS_COLORS[rfq.status]
          return (
            <div key={rfq.id} className="card" style={{ padding: '20px', transition: 'transform 0.15s, box-shadow 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: statusStyle.bg, color: statusStyle.color }}>
                      {rfq.status.toUpperCase()}
                    </span>
                    <span style={{ display: 'inline-flex', padding: '2px 8px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: priorityStyle.bg, color: priorityStyle.color }}>
                      {rfq.priority}
                    </span>
                  </div>
                  <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', lineHeight: 1.3, marginBottom: '4px' }}>{rfq.title}</h3>
                  <p style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{rfq.description}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Budget</div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>{formatCurrency(rfq.total_budget)}</div>
                </div>
                <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>Items</div>
                  <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '14px' }}>{rfq.items.length} line items</div>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                  <Clock size={13} color={daysLeft < 3 ? '#EF4444' : '#94A3B8'} />
                  <span style={{ color: daysLeft < 3 ? '#EF4444' : '#64748B', fontWeight: daysLeft < 3 ? 600 : 400 }}>
                    {daysLeft < 0 ? `Expired ${Math.abs(daysLeft)}d ago` : `${daysLeft} days left`}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <Link href={`/dashboard/rfqs/${rfq.id}`} style={{
                    display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 12px',
                    borderRadius: '6px', background: '#6366F1', color: 'white',
                    fontSize: '12px', fontWeight: 600, textDecoration: 'none',
                    transition: 'background 0.15s',
                  }}>
                    <Eye size={13} /> View
                  </Link>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 40px', color: '#64748B' }}>
          <FileText size={48} color="#E2E8F0" style={{ margin: '0 auto 16px' }} />
          <div style={{ fontWeight: 600, fontSize: '16px', marginBottom: '4px' }}>No RFQs found</div>
          <div style={{ fontSize: '14px', marginBottom: '20px' }}>Start by creating your first procurement request</div>
          <Link href="/dashboard/rfqs/new" className="btn btn-primary" style={{ textDecoration: 'none', display: 'inline-flex' }}>
            <Plus size={16} /> Create RFQ
          </Link>
        </div>
      )}
    </div>
  )
}
