'use client'

import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Plus, Store, FileText, Receipt, CheckCircle, ShoppingCart, FileSpreadsheet, Trash2, RefreshCw, Pencil, Loader2, Sparkles, Route } from 'lucide-react'
import { DEMO_RFQS, DEMO_VENDORS, DEMO_QUOTATIONS } from '@/lib/seed-data'
import { VendorCategory } from '@/lib/types'
import {
  DEMO_MODE_COPY,
  DemoApprovalInput,
  DemoInvoiceInput,
  DemoPOInput,
  DemoQuotationInput,
  DemoRFQInput,
  DemoVendorInput,
  DemoWorkflowData,
  emptyWorkflowData,
  loadWorkflowData,
  resetWorkflowData,
  saveWorkflowData,
} from '@/lib/demo-workflow'

const categories: VendorCategory[] = ['IT', 'Office Supplies', 'Construction', 'Services', 'Logistics', 'Facilities', 'Others']

type UserSession = { name: string; email: string; role: 'admin' | 'procurement_officer' | 'manager' | 'vendor' }
type SaveType = 'vendor' | 'rfq' | 'quotation' | 'approval' | 'po' | 'invoice' | 'reset' | null

const can = {
  vendor: ['admin', 'procurement_officer'],
  rfq: ['admin', 'procurement_officer'],
  quotation: ['admin', 'vendor'],
  approval: ['admin', 'manager'],
  po: ['admin', 'procurement_officer'],
  invoice: ['admin', 'procurement_officer'],
}

function isAllowed(user: UserSession | null, area: keyof typeof can) {
  return !!user && can[area].includes(user.role)
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>{children}</label>
}

function RoleGate({ allowed, children }: { allowed: boolean; children: React.ReactNode }) {
  if (allowed) return <>{children}</>
  return (
    <div style={{ padding: '18px', borderRadius: '12px', background: '#FFF7ED', border: '1px solid #FED7AA', color: '#9A3412', fontSize: '13px', lineHeight: 1.6 }}>
      This action is restricted for your current role. Switch demo account to test this workflow.
    </div>
  )
}

function SectionCard({ icon, title, subtitle, children }: { icon: React.ReactNode; title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="card" style={{ padding: '22px', marginBottom: '18px' }}>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '18px' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: '#EEF2FF', color: '#4F46E5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{icon}</div>
        <div>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>{title}</h2>
          <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  )
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="card" style={{ padding: '16px' }}>
      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>{value}</div>
    </div>
  )
}

function SubmitButton({ loading, children }: { loading: boolean; children: React.ReactNode }) {
  return (
    <button className="btn btn-primary" disabled={loading} style={{ opacity: loading ? 0.8 : 1 }}>
      {loading ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : children}
    </button>
  )
}

export default function WorkflowInputPage() {
  const [data, setData] = useState<DemoWorkflowData>(emptyWorkflowData)
  const [user, setUser] = useState<UserSession | null>(null)
  const [saving, setSaving] = useState<SaveType>(null)
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null)
  const [vendorForm, setVendorForm] = useState({ company_name: '', contact_name: '', email: '', phone: '', category: 'IT' as VendorCategory, gst_number: '', address: '' })
  const [rfqForm, setRfqForm] = useState({ title: '', description: '', item_name: '', quantity: 1, unit: 'Nos', budget: 0, category: 'IT' as VendorCategory, deadline: '', vendors: [] as string[], status: 'open' as 'draft' | 'open' })
  const [quoteForm, setQuoteForm] = useState({ rfq_id: '', vendor_id: '', unit_price: 0, delivery_days: 7, tax_percent: 18, notes: '' })
  const [approvalForm, setApprovalForm] = useState({ quotation_id: '', action: 'approved' as 'approved' | 'rejected', remarks: '' })
  const [poForm, setPoForm] = useState({ quotation_id: '', terms: 'Delivery and payment terms as per selected quotation.' })
  const [invoiceForm, setInvoiceForm] = useState({ po_number: '', amount: 0, due_date: '', email_to: '' })

  useEffect(() => {
    setData(loadWorkflowData())
    const stored = localStorage.getItem('vb_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const allVendors = useMemo(() => [
    ...DEMO_VENDORS.map(v => ({ id: v.id, name: v.company_name, email: v.email, rating: v.rating })),
    ...data.vendors.map(v => ({ id: v.id, name: v.company_name, email: v.email, rating: 4.2 })),
  ], [data.vendors])

  const allRFQs = useMemo(() => [
    ...DEMO_RFQS.map(r => ({ id: r.id, title: r.title, quantity: r.items[0]?.quantity || 1 })),
    ...data.rfqs.map(r => ({ id: r.id, title: r.title, quantity: r.quantity })),
  ], [data.rfqs])

  const allQuotations = useMemo(() => [
    ...DEMO_QUOTATIONS.map(q => ({ id: q.id, label: `${q.id} • ₹${q.total.toLocaleString('en-IN')} • ${q.delivery_days} days`, total: q.total, delivery_days: q.delivery_days, vendor_id: q.vendor_id })),
    ...data.quotations.map(q => ({ id: q.id, label: `${q.id} • ₹${q.total.toLocaleString('en-IN')} • ${q.delivery_days} days`, total: q.total, delivery_days: q.delivery_days, vendor_id: q.vendor_id })),
  ], [data.quotations])

  const recommendedQuote = useMemo(() => {
    if (!allQuotations.length) return null
    return [...allQuotations].sort((a, b) => {
      const aVendor = allVendors.find(v => v.id === a.vendor_id)
      const bVendor = allVendors.find(v => v.id === b.vendor_id)
      const aScore = a.total / 100000 + a.delivery_days * 10000 - (aVendor?.rating || 4) * 50000
      const bScore = b.total / 100000 + b.delivery_days * 10000 - (bVendor?.rating || 4) * 50000
      return aScore - bScore
    })[0]
  }, [allQuotations, allVendors])

  const updateData = (next: DemoWorkflowData) => {
    setData(next)
    saveWorkflowData(next)
  }

  const withLoading = async (type: SaveType, action: () => void, message: string) => {
    setSaving(type)
    await new Promise(r => setTimeout(r, 450))
    action()
    setSaving(null)
    toast.success(message)
  }

  const addVendor = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAllowed(user, 'vendor')) return toast.error('Only Admin or Procurement Officer can manage vendors.')
    await withLoading('vendor', () => {
      const vendor: DemoVendorInput = { id: editingVendorId || `vendor-input-${Date.now()}`, ...vendorForm, created_at: new Date().toISOString() }
      const vendors = editingVendorId ? data.vendors.map(v => v.id === editingVendorId ? vendor : v) : [vendor, ...data.vendors]
      updateData({ ...data, vendors })
      setEditingVendorId(null)
      setVendorForm({ company_name: '', contact_name: '', email: '', phone: '', category: 'IT', gst_number: '', address: '' })
    }, editingVendorId ? 'Vendor updated' : 'Vendor input saved')
  }

  const editVendor = (vendor: DemoVendorInput) => {
    setEditingVendorId(vendor.id)
    setVendorForm({ company_name: vendor.company_name, contact_name: vendor.contact_name, email: vendor.email, phone: vendor.phone, category: vendor.category, gst_number: vendor.gst_number, address: vendor.address })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const deleteVendor = (id: string) => {
    updateData({ ...data, vendors: data.vendors.filter(v => v.id !== id) })
    toast.success('Vendor deleted from input records')
  }

  const addRFQ = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAllowed(user, 'rfq')) return toast.error('Only Admin or Procurement Officer can create RFQs.')
    await withLoading('rfq', () => {
      const rfq: DemoRFQInput = { id: `rfq-input-${Date.now()}`, ...rfqForm, created_at: new Date().toISOString() }
      updateData({ ...data, rfqs: [rfq, ...data.rfqs] })
      setRfqForm({ title: '', description: '', item_name: '', quantity: 1, unit: 'Nos', budget: 0, category: 'IT', deadline: '', vendors: [], status: 'open' })
    }, 'RFQ created with vendor assignment')
  }

  const addQuotation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAllowed(user, 'quotation')) return toast.error('Only Vendor or Admin can submit quotations.')
    await withLoading('quotation', () => {
      const selectedRFQ = allRFQs.find(r => r.id === quoteForm.rfq_id)
      const quantity = selectedRFQ?.quantity || 1
      const subtotal = quoteForm.unit_price * quantity
      const total = Math.round(subtotal + subtotal * (quoteForm.tax_percent / 100))
      const quotation: DemoQuotationInput = { id: `quote-input-${Date.now()}`, ...quoteForm, total, status: 'submitted', created_at: new Date().toISOString() }
      updateData({ ...data, quotations: [quotation, ...data.quotations] })
      setQuoteForm({ rfq_id: '', vendor_id: '', unit_price: 0, delivery_days: 7, tax_percent: 18, notes: '' })
    }, 'Quotation submitted and added to comparison')
  }

  const addApproval = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAllowed(user, 'approval')) return toast.error('Only Manager or Admin can approve/reject quotations.')
    await withLoading('approval', () => {
      const approval: DemoApprovalInput = { id: `approval-input-${Date.now()}`, ...approvalForm, created_at: new Date().toISOString() }
      updateData({ ...data, approvals: [approval, ...data.approvals] })
      setApprovalForm({ quotation_id: '', action: 'approved', remarks: '' })
    }, `Quotation ${approvalForm.action}`)
  }

  const addPO = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAllowed(user, 'po')) return toast.error('Only Admin or Procurement Officer can generate POs.')
    await withLoading('po', () => {
      const count = data.purchaseOrders.length + 1
      const po: DemoPOInput = { id: `po-input-${Date.now()}`, quotation_id: poForm.quotation_id, po_number: `VB-PO-DEMO-${String(count).padStart(4, '0')}`, terms: poForm.terms, created_at: new Date().toISOString() }
      updateData({ ...data, purchaseOrders: [po, ...data.purchaseOrders] })
      setPoForm({ quotation_id: '', terms: 'Delivery and payment terms as per selected quotation.' })
    }, 'Purchase order generated')
  }

  const addInvoice = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAllowed(user, 'invoice')) return toast.error('Only Admin or Procurement Officer can generate invoices.')
    await withLoading('invoice', () => {
      const count = data.invoices.length + 1
      const invoice: DemoInvoiceInput = { id: `invoice-input-${Date.now()}`, invoice_number: `VB-INV-DEMO-${String(count).padStart(4, '0')}`, ...invoiceForm, created_at: new Date().toISOString() }
      updateData({ ...data, invoices: [invoice, ...data.invoices] })
      setInvoiceForm({ po_number: '', amount: 0, due_date: '', email_to: '' })
    }, 'Invoice generated with branded PDF-ready details')
  }

  const clearAll = async () => {
    await withLoading('reset', () => {
      resetWorkflowData()
      setData(emptyWorkflowData)
    }, 'Demo input records reset. Seed data is still available.')
  }

  const timeline = [
    { label: 'RFQ Created', done: data.rfqs.length > 0 || DEMO_RFQS.length > 0 },
    { label: 'Quotation Received', done: data.quotations.length > 0 || DEMO_QUOTATIONS.length > 0 },
    { label: 'Manager Approved', done: data.approvals.some(a => a.action === 'approved') },
    { label: 'PO Generated', done: data.purchaseOrders.length > 0 },
    { label: 'Invoice Generated', done: data.invoices.length > 0 },
  ]

  return (
    <div style={{ maxWidth: '1050px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'flex-start', marginBottom: '22px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>Workflow Input Center</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '5px' }}>Real input forms for the end-to-end VendorBridge demo workflow.</p>
        </div>
        <button onClick={clearAll} disabled={saving === 'reset'} className="btn btn-secondary btn-sm">
          {saving === 'reset' ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />} Reset Demo Inputs
        </button>
      </div>

      <div style={{ padding: '12px 14px', background: '#EEF2FF', border: '1px solid #C7D2FE', color: '#3730A3', borderRadius: '12px', marginBottom: '18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Sparkles size={16} /> {DEMO_MODE_COPY}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '12px', marginBottom: '20px' }}>
        <Stat label="Vendors Added" value={data.vendors.length} />
        <Stat label="RFQs Created" value={data.rfqs.length} />
        <Stat label="Quotes Submitted" value={data.quotations.length} />
        <Stat label="Approvals" value={data.approvals.length} />
        <Stat label="POs" value={data.purchaseOrders.length} />
        <Stat label="Invoices" value={data.invoices.length} />
      </div>

      <SectionCard icon={<Route size={18} />} title="Procurement Timeline" subtitle="Live progress from your input records.">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px' }}>
          {timeline.map((step, index) => (
            <div key={step.label} style={{ padding: '14px', borderRadius: '12px', background: step.done ? '#ECFDF5' : '#F8FAFC', border: `1px solid ${step.done ? '#BBF7D0' : '#E2E8F0'}` }}>
              <div style={{ fontSize: '18px', marginBottom: '6px' }}>{step.done ? '✅' : '○'} {index + 1}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: step.done ? '#166534' : '#64748B' }}>{step.label}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon={<Sparkles size={18} />} title="AI Vendor Recommendation" subtitle="Explains which quotation looks best for price, delivery and rating.">
        {recommendedQuote ? (
          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>Recommended: {allVendors.find(v => v.id === recommendedQuote.vendor_id)?.name || 'Selected Vendor'}</div>
            <div style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.6 }}>Reason: balanced score using quotation price, delivery days and vendor rating. Quote amount is ₹{recommendedQuote.total.toLocaleString('en-IN')} with {recommendedQuote.delivery_days} day delivery.</div>
          </div>
        ) : (
          <div style={{ padding: '18px', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center', color: '#64748B' }}>No quotations yet. Submit a quotation to generate a recommendation.</div>
        )}
      </SectionCard>

      <SectionCard icon={<Store size={18} />} title="1. Vendor Registration Input" subtitle="Add or edit vendors with GST and contact details.">
        <RoleGate allowed={isAllowed(user, 'vendor')}>
          <form onSubmit={addVendor} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
            <div><FieldLabel>Company name *</FieldLabel><input required className="input" value={vendorForm.company_name} onChange={e => setVendorForm(p => ({ ...p, company_name: e.target.value }))} placeholder="GreenSteel Industries" /></div>
            <div><FieldLabel>Contact person *</FieldLabel><input required className="input" value={vendorForm.contact_name} onChange={e => setVendorForm(p => ({ ...p, contact_name: e.target.value }))} placeholder="Ravi Kumar" /></div>
            <div><FieldLabel>Email *</FieldLabel><input required type="email" className="input" value={vendorForm.email} onChange={e => setVendorForm(p => ({ ...p, email: e.target.value }))} placeholder="vendor@example.com" /></div>
            <div><FieldLabel>Phone *</FieldLabel><input required className="input" value={vendorForm.phone} onChange={e => setVendorForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91-9876543210" /></div>
            <div><FieldLabel>Category *</FieldLabel><select className="input" value={vendorForm.category} onChange={e => setVendorForm(p => ({ ...p, category: e.target.value as VendorCategory }))}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><FieldLabel>GST number *</FieldLabel><input required className="input" value={vendorForm.gst_number} onChange={e => setVendorForm(p => ({ ...p, gst_number: e.target.value }))} placeholder="29ABCDE1234F1Z5" /></div>
            <div style={{ gridColumn: '1 / -1' }}><FieldLabel>Address</FieldLabel><textarea className="input" rows={2} value={vendorForm.address} onChange={e => setVendorForm(p => ({ ...p, address: e.target.value }))} placeholder="Full address" /></div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '10px' }}><SubmitButton loading={saving === 'vendor'}><Plus size={15} /> {editingVendorId ? 'Update Vendor' : 'Save Vendor'}</SubmitButton>{editingVendorId && <button type="button" className="btn btn-secondary" onClick={() => { setEditingVendorId(null); setVendorForm({ company_name: '', contact_name: '', email: '', phone: '', category: 'IT', gst_number: '', address: '' }) }}>Cancel Edit</button>}</div>
          </form>
        </RoleGate>
      </SectionCard>

      <SectionCard icon={<FileText size={18} />} title="2. RFQ Creation Input" subtitle="Create a request and assign vendors.">
        <RoleGate allowed={isAllowed(user, 'rfq')}>
          <form onSubmit={addRFQ} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
            <div style={{ gridColumn: '1 / -1' }}><FieldLabel>RFQ title *</FieldLabel><input required className="input" value={rfqForm.title} onChange={e => setRfqForm(p => ({ ...p, title: e.target.value }))} placeholder="Procurement of laptops for engineering team" /></div>
            <div style={{ gridColumn: '1 / -1' }}><FieldLabel>Description *</FieldLabel><textarea required className="input" rows={2} value={rfqForm.description} onChange={e => setRfqForm(p => ({ ...p, description: e.target.value }))} placeholder="Describe the procurement requirement" /></div>
            <div><FieldLabel>Item/service name *</FieldLabel><input required className="input" value={rfqForm.item_name} onChange={e => setRfqForm(p => ({ ...p, item_name: e.target.value }))} placeholder="Laptop 15.6 inch" /></div>
            <div><FieldLabel>Quantity *</FieldLabel><input required type="number" min="1" className="input" value={rfqForm.quantity} onChange={e => setRfqForm(p => ({ ...p, quantity: Number(e.target.value) }))} /></div>
            <div><FieldLabel>Unit</FieldLabel><input className="input" value={rfqForm.unit} onChange={e => setRfqForm(p => ({ ...p, unit: e.target.value }))} placeholder="Nos / Months / Boxes" /></div>
            <div><FieldLabel>Budget *</FieldLabel><input required type="number" min="0" className="input" value={rfqForm.budget} onChange={e => setRfqForm(p => ({ ...p, budget: Number(e.target.value) }))} /></div>
            <div><FieldLabel>Category</FieldLabel><select className="input" value={rfqForm.category} onChange={e => setRfqForm(p => ({ ...p, category: e.target.value as VendorCategory }))}>{categories.map(c => <option key={c}>{c}</option>)}</select></div>
            <div><FieldLabel>Deadline *</FieldLabel><input required type="date" className="input" value={rfqForm.deadline} onChange={e => setRfqForm(p => ({ ...p, deadline: e.target.value }))} /></div>
            <div><FieldLabel>Status</FieldLabel><select className="input" value={rfqForm.status} onChange={e => setRfqForm(p => ({ ...p, status: e.target.value as 'draft' | 'open' }))}><option value="open">Open / Publish</option><option value="draft">Draft</option></select></div>
            <div><FieldLabel>Assign vendors</FieldLabel><select multiple className="input" value={rfqForm.vendors} onChange={e => setRfqForm(p => ({ ...p, vendors: Array.from(e.target.selectedOptions).map(o => o.value) }))} style={{ minHeight: '92px' }}>{allVendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
            <div style={{ gridColumn: '1 / -1' }}><SubmitButton loading={saving === 'rfq'}><Plus size={15} /> Create RFQ</SubmitButton></div>
          </form>
        </RoleGate>
      </SectionCard>

      <SectionCard icon={<Receipt size={18} />} title="3. Vendor Quotation Input" subtitle="Submit quotation price, delivery days and tax.">
        <RoleGate allowed={isAllowed(user, 'quotation')}>
          <form onSubmit={addQuotation} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
            <div><FieldLabel>Select RFQ *</FieldLabel><select required className="input" value={quoteForm.rfq_id} onChange={e => setQuoteForm(p => ({ ...p, rfq_id: e.target.value }))}><option value="">Choose RFQ</option>{allRFQs.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}</select></div>
            <div><FieldLabel>Select Vendor *</FieldLabel><select required className="input" value={quoteForm.vendor_id} onChange={e => setQuoteForm(p => ({ ...p, vendor_id: e.target.value }))}><option value="">Choose vendor</option>{allVendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
            <div><FieldLabel>Unit price *</FieldLabel><input required type="number" min="0" className="input" value={quoteForm.unit_price} onChange={e => setQuoteForm(p => ({ ...p, unit_price: Number(e.target.value) }))} /></div>
            <div><FieldLabel>Delivery days *</FieldLabel><input required type="number" min="1" className="input" value={quoteForm.delivery_days} onChange={e => setQuoteForm(p => ({ ...p, delivery_days: Number(e.target.value) }))} /></div>
            <div><FieldLabel>Tax %</FieldLabel><input type="number" min="0" className="input" value={quoteForm.tax_percent} onChange={e => setQuoteForm(p => ({ ...p, tax_percent: Number(e.target.value) }))} /></div>
            <div style={{ gridColumn: '1 / -1' }}><FieldLabel>Vendor notes</FieldLabel><textarea className="input" rows={2} value={quoteForm.notes} onChange={e => setQuoteForm(p => ({ ...p, notes: e.target.value }))} placeholder="Warranty, delivery, payment terms..." /></div>
            <div style={{ gridColumn: '1 / -1' }}><SubmitButton loading={saving === 'quotation'}><Plus size={15} /> Submit Quotation</SubmitButton></div>
          </form>
        </RoleGate>
      </SectionCard>

      <SectionCard icon={<CheckCircle size={18} />} title="4. Approval Input" subtitle="Approve or reject a quotation with remarks.">
        <RoleGate allowed={isAllowed(user, 'approval')}>
          <form onSubmit={addApproval} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
            <div><FieldLabel>Quotation *</FieldLabel><select required className="input" value={approvalForm.quotation_id} onChange={e => setApprovalForm(p => ({ ...p, quotation_id: e.target.value }))}><option value="">Choose quotation</option>{allQuotations.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}</select></div>
            <div><FieldLabel>Action *</FieldLabel><select className="input" value={approvalForm.action} onChange={e => setApprovalForm(p => ({ ...p, action: e.target.value as 'approved' | 'rejected' }))}><option value="approved">Approve</option><option value="rejected">Reject</option></select></div>
            <div style={{ gridColumn: '1 / -1' }}><FieldLabel>Remarks</FieldLabel><textarea className="input" rows={2} value={approvalForm.remarks} onChange={e => setApprovalForm(p => ({ ...p, remarks: e.target.value }))} placeholder="Reason for approval/rejection" /></div>
            <div style={{ gridColumn: '1 / -1' }}><SubmitButton loading={saving === 'approval'}><Plus size={15} /> Save Approval</SubmitButton></div>
          </form>
        </RoleGate>
      </SectionCard>

      <SectionCard icon={<ShoppingCart size={18} />} title="5. Purchase Order Input" subtitle="Generate PO from an approved quotation.">
        <RoleGate allowed={isAllowed(user, 'po')}>
          <form onSubmit={addPO} style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
            <div><FieldLabel>Quotation *</FieldLabel><select required className="input" value={poForm.quotation_id} onChange={e => setPoForm(p => ({ ...p, quotation_id: e.target.value }))}><option value="">Choose quotation</option>{allQuotations.map(q => <option key={q.id} value={q.id}>{q.label}</option>)}</select></div>
            <div><FieldLabel>Terms & conditions</FieldLabel><textarea className="input" rows={2} value={poForm.terms} onChange={e => setPoForm(p => ({ ...p, terms: e.target.value }))} /></div>
            <div><SubmitButton loading={saving === 'po'}><Plus size={15} /> Generate PO Number</SubmitButton></div>
          </form>
        </RoleGate>
      </SectionCard>

      <SectionCard icon={<FileSpreadsheet size={18} />} title="6. Invoice Input" subtitle="Generate invoice and prepare email recipient.">
        <RoleGate allowed={isAllowed(user, 'invoice')}>
          <form onSubmit={addInvoice} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '14px' }}>
            <div><FieldLabel>PO number *</FieldLabel><select required className="input" value={invoiceForm.po_number} onChange={e => setInvoiceForm(p => ({ ...p, po_number: e.target.value }))}><option value="">Choose PO</option>{data.purchaseOrders.map(po => <option key={po.id} value={po.po_number}>{po.po_number}</option>)}</select></div>
            <div><FieldLabel>Amount *</FieldLabel><input required type="number" min="0" className="input" value={invoiceForm.amount} onChange={e => setInvoiceForm(p => ({ ...p, amount: Number(e.target.value) }))} /></div>
            <div><FieldLabel>Due date *</FieldLabel><input required type="date" className="input" value={invoiceForm.due_date} onChange={e => setInvoiceForm(p => ({ ...p, due_date: e.target.value }))} /></div>
            <div><FieldLabel>Email to *</FieldLabel><input required type="email" className="input" value={invoiceForm.email_to} onChange={e => setInvoiceForm(p => ({ ...p, email_to: e.target.value }))} placeholder="vendor@example.com" /></div>
            <div style={{ gridColumn: '1 / -1' }}><SubmitButton loading={saving === 'invoice'}><Plus size={15} /> Generate Invoice</SubmitButton></div>
          </form>
        </RoleGate>
      </SectionCard>

      <SectionCard icon={<FileText size={18} />} title="Saved Input Records" subtitle="Your records are saved in browser localStorage; seed demo data remains available separately.">
        {Object.values(data).every(arr => arr.length === 0) ? (
          <div style={{ padding: '22px', background: '#F8FAFC', borderRadius: '12px', textAlign: 'center', color: '#64748B' }}>No user-entered records yet. Create your first RFQ or vendor above.</div>
        ) : (
          <div style={{ display: 'grid', gap: '14px' }}>
            {data.vendors.length > 0 && (
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>Editable Vendors</h3>
                {data.vendors.map(v => (
                  <div key={v.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#F8FAFC', borderRadius: '10px', marginBottom: '8px' }}>
                    <div><b>{v.company_name}</b><div style={{ fontSize: '12px', color: '#64748B' }}>{v.email} · {v.category} · {v.gst_number}</div></div>
                    <div style={{ display: 'flex', gap: '8px' }}><button className="btn btn-secondary btn-sm" onClick={() => editVendor(v)}><Pencil size={13} /> Edit</button><button className="btn btn-secondary btn-sm" onClick={() => deleteVendor(v.id)}><Trash2 size={13} /> Delete</button></div>
                  </div>
                ))}
              </div>
            )}
            <pre style={{ background: '#0F172A', color: '#E2E8F0', padding: '16px', borderRadius: '12px', overflowX: 'auto', fontSize: '12px', lineHeight: 1.6 }}>{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </SectionCard>
    </div>
  )
}
