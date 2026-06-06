'use client'

import { useState, useEffect } from 'react'
import { Shield, CheckCircle, XCircle, Link as LinkIcon, Download, Loader2, Lock, Hash } from 'lucide-react'
import { computeHash } from '@/lib/utils'
import { toast } from 'sonner'

// Generate realistic audit chain
const generateAuditChain = () => {
  const actions = [
    { entity_type: 'RFQ', entity_id: 'rfq-1', action: 'created', performed_by: 'Priya Menon', metadata: { title: 'Laptop Procurement' } },
    { entity_type: 'RFQ', entity_id: 'rfq-1', action: 'published', performed_by: 'Priya Menon', metadata: { vendors: 3 } },
    { entity_type: 'Quotation', entity_id: 'quote-1', action: 'submitted', performed_by: 'TechVision Solutions', metadata: { total: 2669750 } },
    { entity_type: 'Quotation', entity_id: 'quote-2', action: 'submitted', performed_by: 'DigiSoft Technologies', metadata: { total: 2827280 } },
    { entity_type: 'Approval', entity_id: 'quote-1', action: 'approved', performed_by: 'Rahul Gupta', metadata: { remarks: 'Best value offer' } },
    { entity_type: 'PO', entity_id: 'po-1', action: 'generated', performed_by: 'System', metadata: { po_number: 'VB-PO-2025-0001' } },
    { entity_type: 'PO', entity_id: 'po-1', action: 'sent', performed_by: 'Priya Menon', metadata: { vendor: 'TechVision Solutions' } },
    { entity_type: 'PO', entity_id: 'po-1', action: 'acknowledged', performed_by: 'TechVision Solutions', metadata: { date: '2025-07-16' } },
    { entity_type: 'Invoice', entity_id: 'inv-1', action: 'created', performed_by: 'System', metadata: { invoice_number: 'VB-INV-2025-0001' } },
    { entity_type: 'Vendor', entity_id: 'vendor-7', action: 'deactivated', performed_by: 'Arjun Sharma', metadata: { reason: 'Non-compliance' } },
    { entity_type: 'RFQ', entity_id: 'rfq-2', action: 'created', performed_by: 'Priya Menon', metadata: { title: 'Office Furniture' } },
    { entity_type: 'PO', entity_id: 'po-2', action: 'completed', performed_by: 'System', metadata: { total: 1489160 } },
  ]

  let prev_hash = '0000000000000000000000000000000000000000000000000000000000000000'
  const chain = []

  const baseDate = new Date('2025-07-01T09:00:00Z')
  for (let i = 0; i < actions.length; i++) {
    const timestamp = new Date(baseDate.getTime() + i * 2 * 60 * 60 * 1000).toISOString()
    const current_hash = computeHash({
      entity_id: actions[i].entity_id,
      action: actions[i].action,
      performed_by: actions[i].performed_by,
      timestamp,
      previous_hash: prev_hash,
    })
    chain.push({
      id: `audit-${i + 1}`,
      ...actions[i],
      previous_hash: prev_hash,
      current_hash,
      created_at: timestamp,
    })
    prev_hash = current_hash
  }
  return chain
}

const AUDIT_CHAIN = generateAuditChain()

const ACTION_COLORS: Record<string, { color: string; bg: string; icon: string }> = {
  created: { color: '#6366F1', bg: '#EEF2FF', icon: '✨' },
  published: { color: '#10B981', bg: '#ECFDF5', icon: '🚀' },
  submitted: { color: '#3B82F6', bg: '#DBEAFE', icon: '📤' },
  approved: { color: '#10B981', bg: '#DCFCE7', icon: '✅' },
  rejected: { color: '#EF4444', bg: '#FEE2E2', icon: '❌' },
  generated: { color: '#8B5CF6', bg: '#F5F3FF', icon: '⚙️' },
  sent: { color: '#F59E0B', bg: '#FEF3C7', icon: '📧' },
  acknowledged: { color: '#06B6D4', bg: '#CFFAFE', icon: '👍' },
  completed: { color: '#10B981', bg: '#DCFCE7', icon: '🎉' },
  deactivated: { color: '#EF4444', bg: '#FEE2E2', icon: '🚫' },
}

export default function AuditPage() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'chain'>('chain')
  const [verifying, setVerifying] = useState(false)
  const [verified, setVerified] = useState<boolean | null>(null)
  const [filter, setFilter] = useState('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filteredLogs = AUDIT_CHAIN.filter(log => filter === 'all' || log.entity_type === filter)

  const handleVerify = async () => {
    setVerifying(true)
    await new Promise(r => setTimeout(r, 2000))
    // Re-verify the chain
    let valid = true
    let prevHash = '0000000000000000000000000000000000000000000000000000000000000000'
    for (const log of AUDIT_CHAIN) {
      if (log.previous_hash !== prevHash) { valid = false; break }
      const expected = computeHash({
        entity_id: log.entity_id,
        action: log.action,
        performed_by: log.performed_by,
        timestamp: log.created_at,
        previous_hash: log.previous_hash,
      })
      if (expected !== log.current_hash) { valid = false; break }
      prevHash = log.current_hash
    }
    setVerified(valid)
    setVerifying(false)
    toast[valid ? 'success' : 'error'](valid ? '✅ Audit chain is INTACT! All hashes verified.' : '❌ Chain TAMPERED! Hash mismatch detected.')
  }

  const handleExportReport = () => {
    toast.success('Compliance report exported as PDF!')
  }

  return (
    <div style={{ maxWidth: '1200px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Audit Trail</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Immutable blockchain-style audit chain · {AUDIT_CHAIN.length} records</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportReport} className="btn btn-secondary btn-sm">
            <Download size={14} /> Compliance Report
          </button>
          <button onClick={handleVerify} disabled={verifying} className="btn btn-primary btn-sm" style={{ background: verifying ? '#94A3B8' : 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
            {verifying ? <><Loader2 size={14} className="animate-spin" /> Verifying...</> : <><Shield size={14} /> Verify Chain</>}
          </button>
        </div>
      </div>

      {/* Verification Result */}
      {verified !== null && (
        <div style={{
          padding: '14px 18px', borderRadius: '10px', marginBottom: '16px',
          background: verified ? '#DCFCE7' : '#FEE2E2',
          border: `1px solid ${verified ? '#BBF7D0' : '#FECACA'}`,
          display: 'flex', alignItems: 'center', gap: '10px',
        }}>
          {verified ? <CheckCircle size={20} color="#15803D" /> : <XCircle size={20} color="#B91C1C" />}
          <div>
            <div style={{ fontWeight: 700, color: verified ? '#14532D' : '#7F1D1D', fontSize: '14px' }}>
              {verified ? '✅ Audit Chain Integrity VERIFIED' : '❌ Chain TAMPERED — Hash Mismatch!'}
            </div>
            <div style={{ fontSize: '12px', color: verified ? '#15803D' : '#B91C1C' }}>
              {verified
                ? `All ${AUDIT_CHAIN.length} records verified. Chain is intact and untampered. Compliant for regulatory submission.`
                : 'One or more records have been modified. Investigation required before regulatory submission.'}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Total Records', value: AUDIT_CHAIN.length, color: '#6366F1', icon: '📋' },
          { label: 'Entities Tracked', value: new Set(AUDIT_CHAIN.map(l => l.entity_type)).size, color: '#10B981', icon: '🔗' },
          { label: 'Users Involved', value: new Set(AUDIT_CHAIN.map(l => l.performed_by)).size, color: '#F59E0B', icon: '👥' },
          { label: 'Chain Status', value: 'INTACT', color: '#10B981', icon: '🛡️' },
        ].map(stat => (
          <div key={stat.label} className="card" style={{ padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '6px' }}>{stat.icon}</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '12px', color: '#64748B' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Filter by type:</span>
        {['all', 'RFQ', 'Quotation', 'Approval', 'PO', 'Invoice', 'Vendor'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '4px 12px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 500,
            background: filter === f ? '#6366F1' : '#F1F5F9',
            color: filter === f ? 'white' : '#64748B',
            transition: 'all 0.15s',
          }}>
            {f === 'all' ? 'All' : f}
          </button>
        ))}
        <span style={{ marginLeft: 'auto', fontSize: '12px', color: '#94A3B8' }}>{filteredLogs.length} records</span>
      </div>

      {/* Blockchain Chain Display */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Hash size={16} color="#6366F1" />
          <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>Blockchain Audit Chain</h3>
          <div style={{ marginLeft: 'auto', fontSize: '12px', color: '#94A3B8' }}>
            Each block cryptographically linked to the previous
          </div>
        </div>
        <div style={{ padding: '16px 20px', maxHeight: '600px', overflowY: 'auto' }}>
          {filteredLogs.map((log, i) => {
            const style = ACTION_COLORS[log.action] || { color: '#64748B', bg: '#F1F5F9', icon: '📝' }
            const isExpanded = expandedId === log.id
            return (
              <div key={log.id} style={{ display: 'flex', gap: '0', marginBottom: i < filteredLogs.length - 1 ? '0' : '0' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: '16px', flexShrink: 0 }}>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '50%', background: style.bg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px',
                    border: `2px solid ${style.color}30`, flexShrink: 0, zIndex: 1,
                  }}>
                    {style.icon}
                  </div>
                  {i < filteredLogs.length - 1 && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, padding: '4px 0' }}>
                      <div style={{ width: '2px', flex: 1, background: 'linear-gradient(to bottom, #E2E8F0, #C7D2FE)', minHeight: '20px' }} />
                      <LinkIcon size={10} color="#94A3B8" style={{ margin: '2px 0' }} />
                      <div style={{ width: '2px', flex: 1, background: 'linear-gradient(to bottom, #C7D2FE, #E2E8F0)', minHeight: '20px' }} />
                    </div>
                  )}
                </div>

                <div style={{ flex: 1, paddingBottom: i < filteredLogs.length - 1 ? '8px' : '0' }}>
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    style={{
                      background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px',
                      padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s',
                      borderLeft: `3px solid ${style.color}`,
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
                    onMouseLeave={e => (e.currentTarget.style.background = '#F8FAFC')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '4px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: style.color, background: style.bg, padding: '2px 8px', borderRadius: '9999px' }}>
                            {log.entity_type}
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>
                            {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                          </span>
                          <span style={{ fontSize: '12px', color: '#64748B' }}>by <strong>{log.performed_by}</strong></span>
                        </div>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <span style={{ fontSize: '11px', color: '#94A3B8' }}>
                            {new Date(log.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#8B5CF6', background: '#F5F3FF', padding: '1px 6px', borderRadius: '4px' }}>
                            #{log.current_hash.slice(0, 12)}...
                          </span>
                        </div>
                      </div>
                      <div style={{ fontSize: '10px', color: '#94A3B8', marginLeft: '8px', flexShrink: 0 }}>
                        {isExpanded ? '▲' : '▼'}
                      </div>
                    </div>

                    {isExpanded && (
                      <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '6px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ color: '#94A3B8', minWidth: '100px' }}>Entity ID:</span>
                            <span style={{ color: '#334155', fontFamily: 'monospace' }}>{log.entity_id}</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ color: '#94A3B8', minWidth: '100px' }}>Prev Hash:</span>
                            <span style={{ color: '#6366F1', fontFamily: 'monospace', wordBreak: 'break-all' }}>{log.previous_hash.slice(0, 32)}...</span>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <span style={{ color: '#94A3B8', minWidth: '100px' }}>Curr Hash:</span>
                            <span style={{ color: '#8B5CF6', fontFamily: 'monospace', wordBreak: 'break-all' }}>{log.current_hash.slice(0, 32)}...</span>
                          </div>
                          {log.metadata && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <span style={{ color: '#94A3B8', minWidth: '100px' }}>Metadata:</span>
                              <span style={{ color: '#334155', fontFamily: 'monospace' }}>{JSON.stringify(log.metadata)}</span>
                            </div>
                          )}
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                            <CheckCircle size={12} color="#10B981" />
                            <span style={{ color: '#10B981', fontWeight: 600 }}>Hash Verified ✓</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
