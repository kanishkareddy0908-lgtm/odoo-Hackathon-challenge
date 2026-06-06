'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, Clock, AlertCircle, ChevronRight, MessageSquare, Loader2 } from 'lucide-react'
import { DEMO_QUOTATIONS, DEMO_RFQS, DEMO_VENDORS } from '@/lib/seed-data'
import { Quotation } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { toast } from 'sonner'

function ApprovalCard({ quotation, onAction }: { quotation: Quotation; onAction: (id: string, action: 'approved' | 'rejected', remarks: string) => void }) {
  const rfq = DEMO_RFQS.find(r => r.id === quotation.rfq_id)
  const vendor = DEMO_VENDORS.find(v => v.id === quotation.vendor_id)
  const [showRemarks, setShowRemarks] = useState(false)
  const [remarks, setRemarks] = useState('')
  const [pendingAction, setPendingAction] = useState<'approved' | 'rejected' | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleConfirm = async () => {
    if (!pendingAction) return
    setProcessing(true)
    await new Promise(r => setTimeout(r, 600))
    onAction(quotation.id, pendingAction, remarks)
    setProcessing(false)
    setShowRemarks(false)
  }

  const daysAgo = Math.floor((Date.now() - new Date(quotation.submitted_at || quotation.created_at).getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="card" style={{ padding: '20px', marginBottom: '14px', borderLeft: '4px solid #6366F1' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Vendor Avatar */}
        <div style={{
          width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
          background: `hsl(${(vendor?.company_name || 'V').charCodeAt(0) * 15 % 360}, 70%, 85%)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: `hsl(${(vendor?.company_name || 'V').charCodeAt(0) * 15 % 360}, 70%, 30%)`,
          fontWeight: 700, fontSize: '16px',
        }}>
          {(vendor?.company_name || 'V').charAt(0)}
        </div>

        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>{rfq?.title}</h3>
              <p style={{ fontSize: '13px', color: '#64748B' }}>{vendor?.company_name} · {vendor?.category}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 800, fontSize: '18px', color: '#0F172A' }}>{formatCurrency(quotation.total)}</div>
              <div style={{ fontSize: '11px', color: daysAgo > 7 ? '#EF4444' : '#94A3B8' }}>
                {daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                {daysAgo > 7 && ' ⚠️'}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
            <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Subtotal</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{formatCurrency(quotation.subtotal)}</div>
            </div>
            <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Tax</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{formatCurrency(quotation.tax_amount)}</div>
            </div>
            <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '8px 10px', textAlign: 'center' }}>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>Delivery</div>
              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{quotation.delivery_days} days</div>
            </div>
          </div>

          {quotation.notes && (
            <div style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px', marginBottom: '12px', fontSize: '13px', color: '#64748B' }}>
              <MessageSquare size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
              {quotation.notes}
            </div>
          )}

          {!showRemarks ? (
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => { setPendingAction('approved'); setShowRemarks(true) }} className="btn btn-success btn-sm" style={{ flex: 1 }}>
                <CheckCircle size={15} /> Approve
              </button>
              <button onClick={() => { setPendingAction('rejected'); setShowRemarks(true) }} className="btn btn-danger btn-sm" style={{ flex: 1 }}>
                <XCircle size={15} /> Reject
              </button>
              <button className="btn btn-secondary btn-sm">
                <ChevronRight size={15} /> View Details
              </button>
            </div>
          ) : (
            <div>
              <div style={{
                padding: '12px', borderRadius: '8px', marginBottom: '10px',
                background: pendingAction === 'approved' ? '#ECFDF5' : '#FEF2F2',
                border: `1px solid ${pendingAction === 'approved' ? '#BBF7D0' : '#FECACA'}`,
              }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: pendingAction === 'approved' ? '#15803D' : '#B91C1C', marginBottom: '8px' }}>
                  {pendingAction === 'approved' ? '✅ Confirm Approval' : '❌ Confirm Rejection'}
                </div>
                <textarea
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder={`Add ${pendingAction === 'approved' ? 'approval' : 'rejection'} remarks (optional)...`}
                  className="input" rows={2}
                  style={{ marginBottom: '8px' }}
                />
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={handleConfirm} disabled={processing} className={`btn btn-sm ${pendingAction === 'approved' ? 'btn-success' : 'btn-danger'}`} style={{ flex: 1 }}>
                    {processing ? <><Loader2 size={13} className="animate-spin" /> Processing...</> : `Confirm ${pendingAction}`}
                  </button>
                  <button onClick={() => setShowRemarks(false)} className="btn btn-secondary btn-sm">Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ApprovalsPage() {
  const [quotations, setQuotations] = useState(DEMO_QUOTATIONS.filter(q => q.status === 'submitted'))
  const [processed, setProcessed] = useState<Array<{ id: string; action: string; remarks: string }>>([])

  const handleAction = (id: string, action: 'approved' | 'rejected', remarks: string) => {
    setQuotations(prev => prev.filter(q => q.id !== id))
    setProcessed(prev => [...prev, { id, action, remarks }])
    toast.success(`Quotation ${action}! ${action === 'approved' ? 'Purchase Order will be generated.' : 'Vendor will be notified.'}`)
  }

  const TIMELINE = [
    { time: '09:15 AM', user: 'Priya Menon', action: 'Submitted quotation comparison report', icon: '📄' },
    { time: '10:30 AM', user: 'Rahul Gupta', action: 'Requested additional vendor quotes', icon: '📧' },
    { time: 'Yesterday', user: 'Priya Menon', action: 'Sent RFQ to 4 vendors', icon: '🚀' },
    { time: '2 days ago', user: 'System', action: 'Auto-reminder sent to pending vendors', icon: '🔔' },
  ]

  return (
    <div style={{ maxWidth: '1200px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Approval Queue</h1>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
          {quotations.length} pending approvals · {processed.length} processed today
        </p>
      </div>

      {quotations.length > 0 && (
        <div style={{ background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <AlertCircle size={16} color="#C2410C" />
          <span style={{ fontSize: '13px', color: '#C2410C', fontWeight: 500 }}>
            {quotations.length} quotations are awaiting your review. Oldest pending: {Math.max(...quotations.map(q => Math.floor((Date.now() - new Date(q.submitted_at || q.created_at).getTime()) / (1000 * 60 * 60 * 24))))} days.
          </span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Left: Approval Queue */}
        <div>
          {quotations.length > 0 ? (
            quotations.map(q => (
              <ApprovalCard key={q.id} quotation={q} onAction={handleAction} />
            ))
          ) : (
            <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
              <CheckCircle size={48} color="#10B981" style={{ margin: '0 auto 16px' }} />
              <div style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A', marginBottom: '6px' }}>All caught up!</div>
              <div style={{ color: '#64748B', fontSize: '14px' }}>No quotations pending approval.</div>
            </div>
          )}
        </div>

        {/* Right: Timeline & Stats */}
        <div>
          {/* Stats */}
          <div className="card" style={{ padding: '16px', marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A', marginBottom: '14px' }}>Today&apos;s Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Approved', value: processed.filter(p => p.action === 'approved').length, color: '#10B981', bg: '#ECFDF5' },
                { label: 'Rejected', value: processed.filter(p => p.action === 'rejected').length, color: '#EF4444', bg: '#FEF2F2' },
                { label: 'Pending', value: quotations.length, color: '#F59E0B', bg: '#FFFBEB' },
                { label: 'Total', value: DEMO_QUOTATIONS.length, color: '#6366F1', bg: '#EEF2FF' },
              ].map(stat => (
                <div key={stat.label} style={{ background: stat.bg, borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: '22px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card" style={{ padding: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A', marginBottom: '14px' }}>Recent Activity</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {TIMELINE.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px', paddingBottom: '14px', position: 'relative' }}>
                  {i < TIMELINE.length - 1 && (
                    <div style={{ position: 'absolute', left: '17px', top: '30px', width: '2px', height: 'calc(100% - 8px)', background: '#F1F5F9' }} />
                  )}
                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px' }}>
                    {item.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{item.user}</div>
                    <div style={{ fontSize: '12px', color: '#64748B', lineHeight: 1.4 }}>{item.action}</div>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginTop: '2px' }}>{item.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
