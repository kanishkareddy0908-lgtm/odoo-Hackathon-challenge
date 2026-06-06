'use client'

import { useState } from 'react'
import { DEMO_PURCHASE_ORDERS, DEMO_VENDORS, DEMO_RFQS } from '@/lib/seed-data'
import { formatCurrency, formatDate, numberToWords } from '@/lib/utils'
import { PurchaseOrder } from '@/lib/types'
import { Download, Mail, Printer, CheckCircle, Eye, Loader2, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

function POStatusBadge({ status }: { status: string }) {
  const styles = {
    draft: { bg: '#F1F5F9', color: '#475569' },
    sent: { bg: '#DBEAFE', color: '#1D4ED8' },
    acknowledged: { bg: '#FEF3C7', color: '#B45309' },
    completed: { bg: '#DCFCE7', color: '#15803D' },
  }
  const s = styles[status as keyof typeof styles] || styles.draft
  return (
    <span style={{ display: 'inline-flex', padding: '3px 10px', borderRadius: '9999px', background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600, textTransform: 'uppercase' }}>
      {status}
    </span>
  )
}

function POPreviewModal({ po, onClose }: { po: PurchaseOrder; onClose: () => void }) {
  const vendor = DEMO_VENDORS.find(v => v.id === po.vendor_id)
  const rfq = DEMO_RFQS.find(r => r.id === po.rfq_id)
  const [emailSending, setEmailSending] = useState(false)

  const handleDownloadPDF = async () => {
    toast.loading('Generating PDF...')
    await new Promise(r => setTimeout(r, 1000))
    toast.dismiss()
    toast.success('PDF downloaded successfully!')
  }

  const handleEmailVendor = async () => {
    setEmailSending(true)
    await new Promise(r => setTimeout(r, 1200))
    setEmailSending(false)
    toast.success(`PO emailed to ${vendor?.email}!`)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: '750px', maxWidth: '95vw' }} onClick={e => e.stopPropagation()}>
        {/* Actions Bar */}
        <div style={{ padding: '14px 24px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Purchase Order Preview</h3>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button onClick={handleDownloadPDF} className="btn btn-secondary btn-sm"><Download size={14} /> Download PDF</button>
            <button onClick={handleEmailVendor} disabled={emailSending} className="btn btn-primary btn-sm">
              {emailSending ? <><Loader2 size={14} className="animate-spin" /> Sending...</> : <><Mail size={14} /> Email Vendor</>}
            </button>
            <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: '6px', width: '30px', height: '30px', cursor: 'pointer', fontSize: '16px', color: '#64748B' }}>×</button>
          </div>
        </div>

        {/* PO Document */}
        <div style={{ padding: '28px 32px', maxHeight: '75vh', overflowY: 'auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', paddingBottom: '20px', borderBottom: '2px solid #6366F1' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🌉</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '20px', color: '#0F172A' }}>VendorBridge Inc.</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>42, Tech Park, Bangalore - 560066 | GST: 29AABCV1234L1ZQ</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#6366F1', marginBottom: '4px' }}>PURCHASE ORDER</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>{po.po_number}</div>
              <div style={{ fontSize: '12px', color: '#64748B' }}>Date: {formatDate(po.created_at)}</div>
              <POStatusBadge status={po.status} />
            </div>
          </div>

          {/* Vendor Details */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Bill To</div>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>VendorBridge Inc.</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>42, Tech Park, Bangalore - 560066</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>Tel: +91-80-12345678</div>
            </div>
            <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontWeight: 700, color: '#64748B', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px' }}>Vendor / Ship From</div>
              <div style={{ fontWeight: 600, color: '#0F172A' }}>{vendor?.company_name}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>{vendor?.address}</div>
              <div style={{ fontSize: '13px', color: '#64748B' }}>GST: {vendor?.gst_number}</div>
            </div>
          </div>

          {/* Line Items */}
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', marginBottom: '20px' }}>
            <thead>
              <tr style={{ background: '#6366F1' }}>
                {['#', 'Item Description', 'HSN', 'Qty', 'Unit', 'Unit Price', 'Amount'].map(h => (
                  <th key={h} style={{ padding: '10px 12px', textAlign: h === '#' || h === 'HSN' || h === 'Qty' || h === 'Unit' ? 'center' : 'left', color: 'white', fontWeight: 600, fontSize: '12px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {po.items.map((item, i) => (
                <tr key={item.item_id} style={{ background: i % 2 === 0 ? 'white' : '#F8FAFC' }}>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748B' }}>{i + 1}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 500, color: '#0F172A' }}>{item.item_name}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748B', fontFamily: 'monospace', fontSize: '11px' }}>8471</td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', fontWeight: 600, color: '#0F172A' }}>
                    {po.items.find(x => x.item_id === item.item_id)?.lead_time_days ? rfq?.items.find(x => x.id === item.item_id)?.quantity || 1 : 1}
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'center', color: '#64748B' }}>Nos</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', color: '#0F172A' }}>₹{item.unit_price.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600, color: '#0F172A' }}>₹{item.total_price.toLocaleString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tax & Total */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
            <div style={{ minWidth: '280px' }}>
              {[
                { label: 'Subtotal', value: formatCurrency(po.subtotal) },
                { label: 'CGST (9%)', value: formatCurrency(po.cgst) },
                { label: 'SGST (9%)', value: formatCurrency(po.sgst) },
                po.igst > 0 ? { label: 'IGST (18%)', value: formatCurrency(po.igst) } : null,
              ].filter(Boolean).map((row, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: '1px solid #F1F5F9', fontSize: '13px' }}>
                  <span style={{ color: '#64748B' }}>{row!.label}</span>
                  <span style={{ fontWeight: 500, color: '#0F172A' }}>{row!.value}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', background: '#F8FAFC', marginTop: '4px', borderRadius: '8px', paddingLeft: '10px', paddingRight: '10px' }}>
                <span style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>Grand Total</span>
                <span style={{ fontWeight: 800, color: '#6366F1', fontSize: '16px' }}>{formatCurrency(po.total)}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', marginTop: '6px', fontStyle: 'italic' }}>
                Amount in words: {numberToWords(po.total)}
              </div>
            </div>
          </div>

          {/* Terms */}
          <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '14px', marginBottom: '16px', fontSize: '12px', color: '#64748B' }}>
            <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '6px' }}>Terms & Conditions:</div>
            <div>1. Delivery shall be made within the agreed timeline. Penalty of 0.5% per week for delays.</div>
            <div>2. All items must meet the specifications mentioned in the RFQ.</div>
            <div>3. Payment will be processed within 30 days of receipt of invoice.</div>
            <div>4. Warranty as per quotation terms applies.</div>
          </div>

          {/* Signatures */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', paddingTop: '20px', borderTop: '1px solid #E2E8F0' }}>
            {['Authorized Signatory (Vendor)', 'Authorized Signatory (VendorBridge)'].map(label => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ height: '48px', borderBottom: '1px solid #0F172A', marginBottom: '6px' }} />
                <div style={{ fontSize: '12px', color: '#64748B' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PurchaseOrdersPage() {
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null)
  const [poList, setPOList] = useState(DEMO_PURCHASE_ORDERS)

  const handleMarkAcknowledged = (poId: string) => {
    setPOList(prev => prev.map(po => po.id === poId ? { ...po, status: 'acknowledged' as const } : po))
    toast.success('PO marked as acknowledged!')
  }

  return (
    <div style={{ maxWidth: '1200px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Purchase Orders</h1>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
          {poList.filter(po => po.status !== 'completed').length} active · {poList.filter(po => po.status === 'completed').length} completed
        </p>
      </div>

      {/* PO Cards */}
      <div style={{ display: 'grid', gap: '14px' }}>
        {poList.map(po => {
          const vendor = DEMO_VENDORS.find(v => v.id === po.vendor_id)
          const rfq = DEMO_RFQS.find(r => r.id === po.rfq_id)
          return (
            <div key={po.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', flexShrink: 0,
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '14px',
                }}>
                  PO
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: '#6366F1' }}>{po.po_number}</div>
                      <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{rfq?.title}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 800, fontSize: '18px', color: '#0F172A' }}>{formatCurrency(po.total)}</div>
                      <POStatusBadge status={po.status} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '14px' }}>
                    {[
                      { label: 'Vendor', value: vendor?.company_name || 'Unknown' },
                      { label: 'Subtotal', value: formatCurrency(po.subtotal) },
                      { label: 'Tax', value: formatCurrency(po.cgst + po.sgst + po.igst) },
                      { label: 'Created', value: formatDate(po.created_at) },
                    ].map(item => (
                      <div key={item.label} style={{ background: '#F8FAFC', borderRadius: '8px', padding: '10px' }}>
                        <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '2px' }}>{item.label}</div>
                        <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={() => setSelectedPO(po)} className="btn btn-primary btn-sm">
                      <Eye size={14} /> Preview PO
                    </button>
                    {po.status === 'sent' && (
                      <button onClick={() => handleMarkAcknowledged(po.id)} className="btn btn-success btn-sm">
                        <CheckCircle size={14} /> Mark Acknowledged
                      </button>
                    )}
                    <button className="btn btn-secondary btn-sm">
                      <Download size={14} /> Download
                    </button>
                    <button className="btn btn-secondary btn-sm">
                      <Mail size={14} /> Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {selectedPO && <POPreviewModal po={selectedPO} onClose={() => setSelectedPO(null)} />}
    </div>
  )
}
