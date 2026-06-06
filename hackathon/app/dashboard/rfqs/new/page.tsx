'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Trash2, Sparkles, Loader2, ChevronDown, ChevronUp, Check, ArrowRight, ArrowLeft, Save } from 'lucide-react'
import { DEMO_VENDORS } from '@/lib/seed-data'
import { RFQItem, VendorCategory } from '@/lib/types'
import { toast } from 'sonner'

const CATEGORIES: VendorCategory[] = ['IT', 'Office Supplies', 'Construction', 'Services', 'Logistics', 'Facilities', 'Others']

const STEPS = [
  { label: 'RFQ Details', desc: 'Basic information' },
  { label: 'Line Items', desc: 'Products/services' },
  { label: 'Vendor Selection', desc: 'Choose vendors' },
]

function StepIndicator({ current }: { current: number }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '32px' }}>
      {STEPS.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
            <div className="step-circle" style={{
              background: i < current ? '#6366F1' : i === current ? '#6366F1' : '#E2E8F0',
              color: i <= current ? 'white' : '#94A3B8',
            }}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: i <= current ? '#0F172A' : '#94A3B8' }}>{step.label}</div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{step.desc}</div>
            </div>
          </div>
          {i < STEPS.length - 1 && (
            <div className="step-line" style={{ margin: '0 16px', background: i < current ? '#6366F1' : '#E2E8F0' }} />
          )}
        </div>
      ))}
    </div>
  )
}

function AIPanel({ onGenerate }: { onGenerate: (data: Partial<{ title: string; description: string; items: RFQItem[]; total_budget: number; category: VendorCategory }>) => void }) {
  const [open, setOpen] = useState(true)
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [typingText, setTypingText] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim()) return
    setLoading(true)

    try {
      const response = await fetch('/api/rfq-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await response.json()
      
      // Typing animation effect
      setTypingText('')
      const text = '✅ RFQ generated successfully! Fields have been auto-filled. Review and edit as needed.'
      let i = 0
      const interval = setInterval(() => {
        setTypingText(text.slice(0, i++))
        if (i > text.length) clearInterval(interval)
      }, 25)
      
      onGenerate(data.rfq)
      toast.success('AI generated your RFQ! Review and edit the fields.')
    } catch {
      // Fallback demo generation
      const generated = generateDemoRFQ(prompt)
      onGenerate(generated)
      setTypingText('✅ RFQ generated with AI! All fields populated — review before submitting.')
      toast.success('RFQ auto-filled from your description!')
    } finally {
      setLoading(false)
    }
  }

  const generateDemoRFQ = (promptText: string) => {
    const lower = promptText.toLowerCase()
    if (lower.includes('chair') || lower.includes('furniture')) {
      return {
        title: 'Ergonomic Office Furniture Procurement',
        description: 'Procurement of ergonomic office chairs and furniture for enhanced employee comfort and productivity.',
        category: 'Office Supplies' as VendorCategory,
        total_budget: 500000,
        items: [
          { id: `item-${Date.now()}-1`, name: 'Ergonomic Office Chair', description: 'Mesh back with lumbar support, adjustable height', quantity: 100, unit: 'Nos', estimated_unit_price: 8500, required_specs: 'BIFMA certified, 5-star base, armrests' },
          { id: `item-${Date.now()}-2`, name: 'Installation Service', description: 'Assembly and installation at 3 floors', quantity: 1, unit: 'Lump Sum', estimated_unit_price: 15000 },
        ]
      }
    }
    if (lower.includes('laptop') || lower.includes('computer')) {
      return {
        title: 'Laptop Procurement for Engineering Team',
        description: 'High-performance laptops required for software engineering and development work.',
        category: 'IT' as VendorCategory,
        total_budget: 3000000,
        items: [
          { id: `item-${Date.now()}-1`, name: 'Laptop 15.6" FHD', description: 'i7/Ryzen 7, 16GB RAM, 512GB SSD', quantity: 50, unit: 'Nos', estimated_unit_price: 60000, required_specs: 'Min 16GB RAM, NVIDIA GPU preferred' },
          { id: `item-${Date.now()}-2`, name: 'Laptop Bag', description: '15.6" padded bag', quantity: 50, unit: 'Nos', estimated_unit_price: 1200 },
        ]
      }
    }
    return {
      title: 'Procurement Request',
      description: promptText,
      category: 'Services' as VendorCategory,
      total_budget: 500000,
      items: [{ id: `item-${Date.now()}-1`, name: 'Service/Product', description: 'As described', quantity: 1, unit: 'Nos', estimated_unit_price: 500000 }]
    }
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #EEF2FF 0%, #F5F3FF 100%)',
      border: '1px solid #C7D2FE', borderRadius: '12px', marginBottom: '24px', overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', padding: '14px 18px', background: 'none', border: 'none',
        display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={16} color="white" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontWeight: 700, fontSize: '14px', color: '#4338CA' }}>AI RFQ Auto-Generator</div>
            <div style={{ fontSize: '12px', color: '#6366F1' }}>Describe your need in plain English → AI fills all fields</div>
          </div>
        </div>
        {open ? <ChevronUp size={16} color="#6366F1" /> : <ChevronDown size={16} color="#6366F1" />}
      </button>

      {open && (
        <div style={{ padding: '0 18px 18px', borderTop: '1px solid #C7D2FE' }}>
          <div style={{ paddingTop: '14px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#4338CA', marginBottom: '8px' }}>
              Describe what you need (in plain English):
            </label>
            <textarea
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder={`Example: "I need 100 ergonomic office chairs for our 3-floor office expansion. Delivery within 30 days. Budget around 5 lakhs. Prefer mesh chairs with lumbar support."`}
              style={{
                width: '100%', minHeight: '80px', padding: '10px 12px',
                border: '1px solid #C7D2FE', borderRadius: '8px', fontSize: '14px',
                fontFamily: 'Inter, sans-serif', outline: 'none', resize: 'vertical',
                background: 'white', color: '#0F172A', lineHeight: 1.5,
              }}
            />
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', alignItems: 'center' }}>
              <button onClick={handleGenerate} disabled={loading || !prompt.trim()} className="btn btn-primary btn-sm" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)' }}>
                {loading ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><Sparkles size={14} /> Generate with AI</>}
              </button>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['100 ergonomic chairs, 30 days delivery, budget ₹5L', '50 laptops for engineers, 16GB RAM, i7', 'Annual cloud support contract for 200 users'].map(ex => (
                  <button key={ex.slice(0, 10)} onClick={() => setPrompt(ex)} style={{
                    padding: '4px 10px', borderRadius: '9999px', border: '1px solid #C7D2FE',
                    background: 'white', color: '#6366F1', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap',
                  }}>
                    {ex.slice(0, 20)}...
                  </button>
                ))}
              </div>
            </div>
            {typingText && (
              <div style={{ marginTop: '10px', padding: '10px 12px', background: '#DCFCE7', borderRadius: '8px', border: '1px solid #BBF7D0', fontSize: '13px', color: '#15803D', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {typingText}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function NewRFQPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [saving, setSaving] = useState(false)

  const [details, setDetails] = useState({
    title: '', description: '', category: 'IT' as VendorCategory,
    total_budget: '', deadline: '', delivery_by: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent', currency: 'INR',
  })

  const [items, setItems] = useState<RFQItem[]>([
    { id: `item-${Date.now()}`, name: '', description: '', quantity: 1, unit: 'Nos', estimated_unit_price: 0 }
  ])

  const [selectedVendors, setSelectedVendors] = useState<string[]>([])
  const [vendorSearch, setVendorSearch] = useState('')
  const [vendorCategoryFilter, setVendorCategoryFilter] = useState<string>('all')

  const handleAIGenerate = (data: Partial<{ title: string; description: string; items: RFQItem[]; total_budget: number; category: VendorCategory }>) => {
    if (data.title) setDetails(p => ({ ...p, title: data.title! }))
    if (data.description) setDetails(p => ({ ...p, description: data.description! }))
    if (data.category) setDetails(p => ({ ...p, category: data.category! }))
    if (data.total_budget) setDetails(p => ({ ...p, total_budget: String(data.total_budget) }))
    if (data.items) setItems(data.items)
  }

  const addItem = () => setItems(prev => [...prev, { id: `item-${Date.now()}`, name: '', description: '', quantity: 1, unit: 'Nos', estimated_unit_price: 0 }])
  const removeItem = (id: string) => setItems(prev => prev.filter(i => i.id !== id))
  const updateItem = (id: string, field: keyof RFQItem, value: string | number) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i))
  }

  const totalEstimated = items.reduce((sum, i) => sum + (i.quantity * i.estimated_unit_price), 0)

  const filteredVendors = DEMO_VENDORS.filter(v => {
    const matchSearch = v.company_name.toLowerCase().includes(vendorSearch.toLowerCase())
    const matchCat = vendorCategoryFilter === 'all' || v.category === vendorCategoryFilter
    return matchSearch && matchCat && v.status === 'active'
  })

  const handleSubmit = async (isDraft = false) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 800))
    toast.success(`RFQ ${isDraft ? 'saved as draft' : 'published and sent to vendors'}!`)
    router.push('/dashboard/rfqs')
  }

  return (
    <div style={{ maxWidth: '900px', animation: 'fadeIn 0.4s ease' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Create New RFQ</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Request for Quotation</p>
        </div>
        <button onClick={() => router.back()} className="btn btn-secondary btn-sm">← Back</button>
      </div>

      {/* Step Indicator */}
      <StepIndicator current={step} />

      {/* AI Panel — only on step 0 */}
      {step === 0 && <AIPanel onGenerate={handleAIGenerate} />}

      {/* Step Content */}
      <div className="card" style={{ padding: '28px' }}>
        {/* STEP 1: Details */}
        {step === 0 && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '20px' }}>RFQ Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>RFQ Title *</label>
                <input required className="input" value={details.title} onChange={e => setDetails(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Procurement of 50 Laptops for Engineering Team" />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Description</label>
                <textarea className="input" value={details.description} onChange={e => setDetails(p => ({ ...p, description: e.target.value }))} placeholder="Describe the requirement in detail..." rows={3} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Category *</label>
                <select className="input" value={details.category} onChange={e => setDetails(p => ({ ...p, category: e.target.value as VendorCategory }))}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Priority</label>
                <select className="input" value={details.priority} onChange={e => setDetails(p => ({ ...p, priority: e.target.value as typeof details.priority }))}>
                  {['Low', 'Medium', 'High', 'Urgent'].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Total Budget (₹)</label>
                <input type="number" className="input" value={details.total_budget} onChange={e => setDetails(p => ({ ...p, total_budget: e.target.value }))} placeholder="3500000" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Submission Deadline *</label>
                <input type="date" className="input" value={details.deadline} onChange={e => setDetails(p => ({ ...p, deadline: e.target.value }))} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Delivery Required By</label>
                <input type="date" className="input" value={details.delivery_by} onChange={e => setDetails(p => ({ ...p, delivery_by: e.target.value }))} />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Line Items */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Line Items</h3>
              <div style={{ fontSize: '14px', color: '#64748B' }}>
                Estimated Total: <strong style={{ color: '#6366F1' }}>₹{totalEstimated.toLocaleString('en-IN')}</strong>
              </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {['Item Name', 'Description', 'Qty', 'Unit', 'Est. Unit Price (₹)', 'Est. Total', ''].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={item.id}>
                      <td style={{ padding: '8px 6px' }}>
                        <input className="input" value={item.name} onChange={e => updateItem(item.id, 'name', e.target.value)} placeholder={`Item ${idx + 1}`} style={{ minWidth: '160px' }} />
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <input className="input" value={item.description} onChange={e => updateItem(item.id, 'description', e.target.value)} placeholder="Specs/requirements" style={{ minWidth: '150px' }} />
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <input type="number" className="input" value={item.quantity} onChange={e => updateItem(item.id, 'quantity', +e.target.value)} style={{ width: '70px' }} min={1} />
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <select className="input" value={item.unit} onChange={e => updateItem(item.id, 'unit', e.target.value)} style={{ width: '90px' }}>
                          {['Nos', 'Pcs', 'Kg', 'L', 'Months', 'Hours', 'Reams', 'Boxes', 'Lump Sum'].map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <input type="number" className="input" value={item.estimated_unit_price} onChange={e => updateItem(item.id, 'estimated_unit_price', +e.target.value)} style={{ width: '110px' }} min={0} />
                      </td>
                      <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 600, color: '#6366F1', whiteSpace: 'nowrap' }}>
                        ₹{(item.quantity * item.estimated_unit_price).toLocaleString('en-IN')}
                      </td>
                      <td style={{ padding: '8px 6px' }}>
                        <button onClick={() => removeItem(item.id)} disabled={items.length === 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: '4px', opacity: items.length === 1 ? 0.3 : 1 }}>
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button onClick={addItem} className="btn btn-secondary btn-sm" style={{ marginTop: '12px' }}>
              <Plus size={14} /> Add Item
            </button>
          </div>
        )}

        {/* STEP 3: Vendor Selection */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A' }}>Select Vendors</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: '#64748B' }}>{selectedVendors.length} selected</span>
                <button onClick={() => setSelectedVendors(filteredVendors.map(v => v.id))} className="btn btn-secondary btn-sm">Select All</button>
                <button onClick={() => setSelectedVendors([])} className="btn btn-secondary btn-sm">Clear</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
              <input className="input" value={vendorSearch} onChange={e => setVendorSearch(e.target.value)} placeholder="Search vendors..." style={{ flex: 1 }} />
              <select className="input" value={vendorCategoryFilter} onChange={e => setVendorCategoryFilter(e.target.value)} style={{ width: 'auto', minWidth: '140px' }}>
                <option value="all">All Categories</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {filteredVendors.map(vendor => {
                const selected = selectedVendors.includes(vendor.id)
                return (
                  <div key={vendor.id} onClick={() => setSelectedVendors(prev => selected ? prev.filter(id => id !== vendor.id) : [...prev, vendor.id])} style={{
                    display: 'flex', gap: '12px', alignItems: 'center',
                    padding: '12px 14px', borderRadius: '10px', cursor: 'pointer',
                    border: `2px solid ${selected ? '#6366F1' : '#E2E8F0'}`,
                    background: selected ? '#EEF2FF' : 'white',
                    transition: 'all 0.15s',
                  }}>
                    <div style={{
                      width: '18px', height: '18px', borderRadius: '4px',
                      border: `2px solid ${selected ? '#6366F1' : '#CBD5E1'}`,
                      background: selected ? '#6366F1' : 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}>
                      {selected && <Check size={12} color="white" />}
                    </div>
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                      background: `hsl(${vendor.company_name.charCodeAt(0) * 15 % 360}, 70%, 85%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: `hsl(${vendor.company_name.charCodeAt(0) * 15 % 360}, 70%, 30%)`,
                      fontWeight: 700, fontSize: '14px',
                    }}>
                      {vendor.company_name.charAt(0)}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{vendor.company_name}</div>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '2px' }}>
                        <span style={{ fontSize: '11px', color: '#6366F1', background: '#EEF2FF', padding: '1px 6px', borderRadius: '4px' }}>{vendor.category}</span>
                        <span style={{ fontSize: '11px', color: '#F59E0B' }}>★ {vendor.rating}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', paddingTop: '20px', borderTop: '1px solid #F1F5F9' }}>
          <div>
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="btn btn-secondary">
                <ArrowLeft size={16} /> Previous
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => handleSubmit(true)} disabled={saving} className="btn btn-secondary">
              <Save size={15} /> Save Draft
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={() => setStep(s => s + 1)} disabled={!details.title} className="btn btn-primary">
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={() => handleSubmit(false)} disabled={saving || selectedVendors.length === 0} className="btn btn-primary">
                {saving ? <><Loader2 size={16} className="animate-spin" /> Publishing...</> : <>Publish RFQ <ArrowRight size={16} /></>}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
