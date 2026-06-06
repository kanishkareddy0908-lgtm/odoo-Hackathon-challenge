'use client'

import { useParams, useRouter } from 'next/navigation'
import { DEMO_RFQS, DEMO_VENDORS, DEMO_QUOTATIONS } from '@/lib/seed-data'
import { formatCurrency, formatDate, getDaysUntil } from '@/lib/utils'
import { Clock, DollarSign, Tag, ArrowLeft, Users, FileText, Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'

export default function RFQDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const rfq = DEMO_RFQS.find(r => r.id === id)

  if (!rfq) return (
    <div style={{ textAlign: 'center', padding: '80px' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
      <h2 style={{ fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>RFQ not found</h2>
      <button onClick={() => router.back()} className="btn btn-primary">Go back</button>
    </div>
  )

  const daysLeft = getDaysUntil(rfq.deadline)
  const quotes = DEMO_QUOTATIONS.filter(q => q.rfq_id === rfq.id)

  const handleSendToVendors = async () => {
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    toast.success('RFQ sent to selected vendors with magic links!')
  }

  const PRIORITY_COLORS = {
    Low: '#64748B', Medium: '#3B82F6', High: '#F59E0B', Urgent: '#EF4444'
  }

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button onClick={() => router.back()} className="btn btn-ghost btn-sm"><ArrowLeft size={15} /> RFQs</button>
        <span style={{ color: '#94A3B8' }}>/</span>
        <span style={{ fontSize: '14px', color: '#64748B' }}>{rfq.title}</span>
      </div>

      {/* Header Card */}
      <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '10px', flexWrap: 'wrap' }}>
              <span className={`badge ${rfq.status === 'open' ? 'badge-blue' : rfq.status === 'closed' ? 'badge-green' : 'badge-yellow'}`}>
                {rfq.status.toUpperCase()}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: '9999px', fontSize: '11px', fontWeight: 600, background: '#FEF3C7', color: PRIORITY_COLORS[rfq.priority] }}>
                {rfq.priority} Priority
              </span>
              <span className="badge badge-indigo">{rfq.category}</span>
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', lineHeight: 1.3, marginBottom: '8px' }}>{rfq.title}</h1>
            <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.6 }}>{rfq.description}</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { icon: <DollarSign size={16} />, label: 'Budget', value: formatCurrency(rfq.total_budget), color: '#6366F1' },
            { icon: <Clock size={16} />, label: 'Deadline', value: formatDate(rfq.deadline), subtext: daysLeft < 0 ? 'Expired' : `${daysLeft} days left`, color: daysLeft < 3 ? '#EF4444' : '#10B981' },
            { icon: <FileText size={16} />, label: 'Line Items', value: `${rfq.items.length} items`, color: '#F59E0B' },
            { icon: <Users size={16} />, label: 'Quotes Received', value: `${quotes.length} quotes`, color: '#8B5CF6' },
          ].map(item => (
            <div key={item.label} style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px', display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: `${item.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: item.color, flexShrink: 0 }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>{item.label}</div>
                <div style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{item.value}</div>
                {item.subtext && <div style={{ fontSize: '11px', color: item.color }}>{item.subtext}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Line Items */}
      <div className="card" style={{ overflow: 'hidden', marginBottom: '16px' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9' }}>
          <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Line Items</h3>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Est. Unit Price</th>
                <th>Est. Total</th>
              </tr>
            </thead>
            <tbody>
              {rfq.items.map((item, i) => (
                <tr key={item.id}>
                  <td style={{ color: '#94A3B8', textAlign: 'center' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600, color: '#0F172A', fontSize: '13px' }}>{item.name}</td>
                  <td style={{ fontSize: '12px', color: '#64748B', maxWidth: '200px' }}>{item.description}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{item.quantity}</td>
                  <td style={{ color: '#64748B' }}>{item.unit}</td>
                  <td style={{ color: '#0F172A' }}>{formatCurrency(item.estimated_unit_price)}</td>
                  <td style={{ fontWeight: 700, color: '#6366F1' }}>{formatCurrency(item.quantity * item.estimated_unit_price)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ background: '#F8FAFC' }}>
                <td colSpan={6} style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: '#0F172A' }}>Total Estimated:</td>
                <td style={{ padding: '12px 14px', fontWeight: 800, color: '#6366F1', fontSize: '15px' }}>
                  {formatCurrency(rfq.items.reduce((s, i) => s + i.quantity * i.estimated_unit_price, 0))}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
        {quotes.length > 0 && (
          <button onClick={() => router.push(`/dashboard/quotations`)} className="btn btn-secondary">
            View {quotes.length} Quote{quotes.length > 1 ? 's' : ''}
          </button>
        )}
        {rfq.status === 'open' && (
          <button onClick={handleSendToVendors} disabled={sending} className="btn btn-primary">
            {sending ? <><Loader2 size={15} className="animate-spin" /> Sending...</> : <><Send size={15} /> Send to Vendors</>}
          </button>
        )}
      </div>
    </div>
  )
}
