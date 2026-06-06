'use client'

import { useState } from 'react'
import { DEMO_INVOICES, DEMO_VENDORS, DEMO_PURCHASE_ORDERS } from '@/lib/seed-data'
import { Invoice } from '@/lib/types'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Mail, Download, CheckCircle, Clock, AlertCircle, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import { toast } from 'sonner'

function InvoiceStatusBadge({ status }: { status: string }) {
  const styles = {
    pending: { bg: '#FEF3C7', color: '#B45309', icon: <Clock size={11} /> },
    paid: { bg: '#DCFCE7', color: '#15803D', icon: <CheckCircle size={11} /> },
    overdue: { bg: '#FEE2E2', color: '#B91C1C', icon: <AlertCircle size={11} /> },
  }
  const s = styles[status as keyof typeof styles] || styles.pending
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '4px 10px', borderRadius: '9999px', background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600 }}>
      {s.icon} {status.toUpperCase()}
    </span>
  )
}

function SendEmailModal({ invoice, vendor, onClose }: { invoice: Invoice; vendor: { email: string; company_name: string }; onClose: () => void }) {
  const [sending, setSending] = useState(false)
  const [to, setTo] = useState(vendor.email)
  const [cc, setCc] = useState('accounts@vendorbridge.com')
  const [subject, setSubject] = useState(`Invoice ${invoice.invoice_number} from VendorBridge`)
  const [body, setBody] = useState(`Dear ${vendor.company_name} Team,\n\nPlease find attached Invoice ${invoice.invoice_number} for the amount of ${formatCurrency(invoice.amount_due)}.\n\nPayment due by: ${formatDate(invoice.due_date)}\n\nKindly process the payment and confirm receipt.\n\nBest regards,\nProcurement Team\nVendorBridge Inc.`)

  const handleSend = async () => {
    setSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    toast.success(`Invoice emailed to ${to}!`)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: '540px' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Send Invoice via Email</h3>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: '6px', width: '30px', height: '30px', cursor: 'pointer', fontSize: '16px', color: '#64748B' }}>×</button>
        </div>
        <div style={{ padding: '20px 24px' }}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>To</label>
            <input className="input" value={to} onChange={e => setTo(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>CC</label>
            <input className="input" value={cc} onChange={e => setCc(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Subject</label>
            <input className="input" value={subject} onChange={e => setSubject(e.target.value)} />
          </div>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Message</label>
            <textarea className="input" value={body} onChange={e => setBody(e.target.value)} rows={6} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#F8FAFC', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', color: '#64748B' }}>
            <span>📎</span>
            <span>{invoice.invoice_number}.pdf (Auto-attached)</span>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
            <button onClick={handleSend} disabled={sending} className="btn btn-primary" style={{ flex: 1 }}>
              {sending ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <><Mail size={14} /> Send Invoice</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(DEMO_INVOICES)
  const [emailModal, setEmailModal] = useState<{ invoice: Invoice; vendor: { email: string; company_name: string } } | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const handleMarkPaid = (id: string) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status: 'paid' as const } : inv))
    toast.success('Invoice marked as paid!')
  }


  const handleDownloadInvoice = async (invoice: Invoice) => {
    setDownloadingId(invoice.id)
    await new Promise(r => setTimeout(r, 500))
    const vendor = DEMO_VENDORS.find(v => v.id === invoice.vendor_id)
    const po = DEMO_PURCHASE_ORDERS.find(p => p.id === invoice.po_id)
    const doc = new jsPDF()

    doc.setFillColor(79, 70, 229)
    doc.rect(0, 0, 210, 28, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.text('VendorBridge ERP', 14, 18)
    doc.setFontSize(10)
    doc.text('Procurement Invoice', 160, 18)

    doc.setTextColor(15, 23, 42)
    doc.setFontSize(16)
    doc.text(`Invoice: ${invoice.invoice_number}`, 14, 42)
    doc.setFontSize(10)
    doc.text(`PO Number: ${po?.po_number || 'N/A'}`, 14, 50)
    doc.text(`Due Date: ${formatDate(invoice.due_date)}`, 14, 56)

    doc.setFontSize(12)
    doc.text('Bill To', 14, 72)
    doc.setFontSize(10)
    doc.text(vendor?.company_name || 'Vendor', 14, 80)
    doc.text(vendor?.address || 'Registered vendor address', 14, 86)
    doc.text(`GST: ${vendor?.gst_number || 'N/A'}`, 14, 92)
    doc.text(`Email: ${vendor?.email || 'N/A'}`, 14, 98)

    doc.setFontSize(12)
    doc.text('Amount Summary', 120, 72)
    doc.setFontSize(10)
    doc.text(`Subtotal: ${formatCurrency(invoice.amount_due - invoice.tax_breakdown.total_tax)}`, 120, 82)
    doc.text(`Tax: ${formatCurrency(invoice.tax_breakdown.total_tax)}`, 120, 90)
    doc.setFontSize(13)
    doc.text(`Total Due: ${formatCurrency(invoice.amount_due)}`, 120, 102)

    doc.setDrawColor(226, 232, 240)
    doc.line(14, 118, 196, 118)
    doc.setFontSize(11)
    doc.text('Terms & Conditions', 14, 132)
    doc.setFontSize(9)
    doc.text('1. Payment must be completed before the due date mentioned above.', 14, 142)
    doc.text('2. Taxes are calculated according to the selected GST breakdown.', 14, 149)
    doc.text('3. This invoice is generated from VendorBridge demo ERP workflow.', 14, 156)

    doc.setFontSize(10)
    doc.text('Authorized Signature', 148, 190)
    doc.line(145, 184, 195, 184)
    doc.setFontSize(8)
    doc.setTextColor(100, 116, 139)
    doc.text('VendorBridge Inc. · Hyderabad · GST: 36AABCV2026L1Z5', 14, 282)

    doc.save(`${invoice.invoice_number}.pdf`)
    setDownloadingId(null)
    toast.success('Branded invoice PDF downloaded')
  }

  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, i) => sum + i.amount_due, 0)
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + i.amount_due, 0)

  return (
    <div style={{ maxWidth: '1200px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Invoices</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Track and manage vendor invoices</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'Total Pending', value: totalPending, color: '#F59E0B', bg: '#FFFBEB', icon: '⏳', count: invoices.filter(i => i.status === 'pending').length },
          { label: 'Total Paid', value: totalPaid, color: '#10B981', bg: '#ECFDF5', icon: '✅', count: invoices.filter(i => i.status === 'paid').length },
          { label: 'Overdue', value: invoices.filter(i => i.status === 'overdue').reduce((s, i) => s + i.amount_due, 0), color: '#EF4444', bg: '#FEF2F2', icon: '🔴', count: invoices.filter(i => i.status === 'overdue').length },
        ].map(card => (
          <div key={card.label} className="card" style={{ padding: '18px', borderLeft: `4px solid ${card.color}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>{card.label}</span>
              <span style={{ fontSize: '20px' }}>{card.icon}</span>
            </div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: card.color }}>{formatCurrency(card.value)}</div>
            <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>{card.count} invoice{card.count !== 1 ? 's' : ''}</div>
          </div>
        ))}
      </div>

      {/* Invoice List */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Tax</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.length === 0 ? (
                <tr><td colSpan={7} style={{ textAlign: 'center', padding: '28px', color: '#64748B' }}>No invoices yet. Generate your first invoice from Input Center.</td></tr>
              ) : invoices.map(invoice => {
                const vendor = DEMO_VENDORS.find(v => v.id === invoice.vendor_id)
                const po = DEMO_PURCHASE_ORDERS.find(p => p.id === invoice.po_id)
                const isOverdue = new Date(invoice.due_date) < new Date() && invoice.status === 'pending'
                return (
                  <tr key={invoice.id}>
                    <td>
                      <div style={{ fontWeight: 700, color: '#6366F1', fontSize: '13px' }}>{invoice.invoice_number}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>PO: {po?.po_number}</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{vendor?.company_name}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{vendor?.email}</div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '14px', color: '#0F172A' }}>{formatCurrency(invoice.amount_due)}</td>
                    <td>
                      <div style={{ fontSize: '12px', color: '#64748B' }}>
                        {invoice.tax_breakdown.cgst && <div>CGST: {formatCurrency(invoice.tax_breakdown.cgst)}</div>}
                        {invoice.tax_breakdown.sgst && <div>SGST: {formatCurrency(invoice.tax_breakdown.sgst)}</div>}
                        {invoice.tax_breakdown.igst && <div>IGST: {formatCurrency(invoice.tax_breakdown.igst)}</div>}
                      </div>
                    </td>
                    <td>
                      <span style={{ color: isOverdue ? '#EF4444' : '#64748B', fontWeight: isOverdue ? 600 : 400, fontSize: '13px' }}>
                        {formatDate(invoice.due_date)}
                        {isOverdue && <span style={{ display: 'block', fontSize: '11px' }}>OVERDUE</span>}
                      </span>
                    </td>
                    <td><InvoiceStatusBadge status={invoice.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => setEmailModal({ invoice, vendor: { email: vendor?.email || '', company_name: vendor?.company_name || '' } })} style={{ padding: '5px', background: '#EEF2FF', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#6366F1' }}>
                          <Mail size={14} />
                        </button>
                        <button onClick={() => handleDownloadInvoice(invoice)} disabled={downloadingId === invoice.id} title="Download branded invoice PDF" style={{ padding: '5px', background: '#F8FAFC', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#64748B' }}>
                          {downloadingId === invoice.id ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                        </button>
                        {invoice.status === 'pending' && (
                          <button onClick={() => handleMarkPaid(invoice.id)} style={{ padding: '5px 10px', background: '#DCFCE7', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#15803D', fontSize: '11px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle size={12} /> Mark Paid
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {emailModal && (
        <SendEmailModal
          invoice={emailModal.invoice}
          vendor={emailModal.vendor}
          onClose={() => setEmailModal(null)}
        />
      )}
    </div>
  )
}
