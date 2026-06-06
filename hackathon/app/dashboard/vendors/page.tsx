'use client'

import { useState } from 'react'
import { Search, Plus, Star, Filter, Download, MoreHorizontal, Phone, Mail, MapPin, ChevronDown } from 'lucide-react'
import { DEMO_VENDORS } from '@/lib/seed-data'
import { Vendor, VendorCategory } from '@/lib/types'
import { toast } from 'sonner'

const CATEGORIES: VendorCategory[] = ['IT', 'Office Supplies', 'Construction', 'Services', 'Logistics', 'Facilities', 'Others']

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="stars">
      {[1, 2, 3, 4, 5].map(star => (
        <svg key={star} width="13" height="13" viewBox="0 0 24 24" fill={star <= Math.round(rating) ? '#F59E0B' : '#E2E8F0'} stroke="none">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: '12px', color: '#64748B', marginLeft: '4px' }}>{rating.toFixed(1)}</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: { bg: '#DCFCE7', color: '#15803D', dot: '#22C55E' },
    inactive: { bg: '#F1F5F9', color: '#475569', dot: '#94A3B8' },
    blacklisted: { bg: '#FEE2E2', color: '#B91C1C', dot: '#EF4444' },
  }
  const s = styles[status as keyof typeof styles] || styles.active
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '3px 10px', borderRadius: '9999px', background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600 }}>
      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.dot }} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function AddVendorModal({ onClose, onAdd }: { onClose: () => void; onAdd: (v: Vendor) => void }) {
  const [form, setForm] = useState({
    company_name: '', contact_name: '', email: '', phone: '', address: '',
    gst_number: '', pan_number: '', category: 'IT' as VendorCategory,
    bank_name: '', account_number: '', ifsc_code: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      company_name: form.company_name,
      contact_name: form.contact_name,
      email: form.email, phone: form.phone, address: form.address,
      gst_number: form.gst_number, pan_number: form.pan_number,
      category: form.category, status: 'active', rating: 0,
      bank_details: form.bank_name ? {
        bank_name: form.bank_name, account_number: form.account_number,
        ifsc_code: form.ifsc_code, account_type: 'Current'
      } : undefined,
      created_at: new Date().toISOString(),
    }
    onAdd(newVendor)
    toast.success(`Vendor "${form.company_name}" added successfully!`)
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ width: '600px' }} onClick={e => e.stopPropagation()}>
        <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>Add New Vendor</h2>
            <p style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>Fill in the vendor details below</p>
          </div>
          <button onClick={onClose} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: '#64748B' }}>×</button>
        </div>
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Company Name *</label>
              <input required className="input" value={form.company_name} onChange={e => setForm(p => ({ ...p, company_name: e.target.value }))} placeholder="TechVision Solutions" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Contact Person *</label>
              <input required className="input" value={form.contact_name} onChange={e => setForm(p => ({ ...p, contact_name: e.target.value }))} placeholder="Amit Patel" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Email *</label>
              <input required type="email" className="input" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="contact@vendor.com" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Phone *</label>
              <input required className="input" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="+91-9876543210" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Address</label>
              <textarea className="input" value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} placeholder="Full address with PIN code" rows={2} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>GST Number *</label>
              <input required className="input" value={form.gst_number} onChange={e => setForm(p => ({ ...p, gst_number: e.target.value }))} placeholder="29AABCT1332L1ZV" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>PAN Number</label>
              <input className="input" value={form.pan_number} onChange={e => setForm(p => ({ ...p, pan_number: e.target.value }))} placeholder="AABCT1332L" />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Vendor Category *</label>
              <select required className="input" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value as VendorCategory }))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '16px', marginBottom: '16px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontWeight: 600, fontSize: '13px', color: '#374151', marginBottom: '12px' }}>🏦 Bank Details (Optional)</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748B', marginBottom: '4px' }}>Bank Name</label>
                <input className="input" value={form.bank_name} onChange={e => setForm(p => ({ ...p, bank_name: e.target.value }))} placeholder="HDFC Bank" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748B', marginBottom: '4px' }}>Account Number</label>
                <input className="input" value={form.account_number} onChange={e => setForm(p => ({ ...p, account_number: e.target.value }))} placeholder="50100123456789" />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#64748B', marginBottom: '4px' }}>IFSC Code</label>
                <input className="input" value={form.ifsc_code} onChange={e => setForm(p => ({ ...p, ifsc_code: e.target.value }))} placeholder="HDFC0001234" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">Add Vendor</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(DEMO_VENDORS)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [actionMenuId, setActionMenuId] = useState<string | null>(null)

  const filtered = vendors.filter(v => {
    const matchSearch = v.company_name.toLowerCase().includes(search.toLowerCase()) ||
      v.contact_name.toLowerCase().includes(search.toLowerCase()) ||
      v.email.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === 'all' || v.category === categoryFilter
    const matchStatus = statusFilter === 'all' || v.status === statusFilter
    return matchSearch && matchCategory && matchStatus
  })

  const handleStatusChange = (vendorId: string, newStatus: 'active' | 'inactive' | 'blacklisted') => {
    setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, status: newStatus } : v))
    toast.success(`Vendor status updated to ${newStatus}`)
    setActionMenuId(null)
  }

  const handleExportCSV = () => {
    const headers = ['Company Name', 'Category', 'GST Number', 'Contact', 'Email', 'Phone', 'Status', 'Rating']
    const rows = filtered.map(v => [v.company_name, v.category, v.gst_number, v.contact_name, v.email, v.phone, v.status, v.rating])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'vendors.csv'; a.click()
    toast.success('Vendors exported as CSV!')
  }

  return (
    <div style={{ maxWidth: '1400px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Vendor Management</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
            {vendors.filter(v => v.status === 'active').length} active · {vendors.filter(v => v.status === 'inactive').length} inactive · {vendors.filter(v => v.status === 'blacklisted').length} blacklisted
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleExportCSV} className="btn btn-secondary btn-sm">
            <Download size={15} /> Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary btn-sm">
            <Plus size={15} /> Add Vendor
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: '16px', display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input className="input" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search vendors..." style={{ paddingLeft: '32px' }} />
        </div>
        <select className="input" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={{ width: 'auto', minWidth: '150px' }}>
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select className="input" value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ width: 'auto', minWidth: '130px' }}>
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="blacklisted">Blacklisted</option>
        </select>
        <div style={{ fontSize: '13px', color: '#64748B', whiteSpace: 'nowrap' }}>{filtered.length} vendors</div>
      </div>

      {/* Table */}
      <div className="card" style={{ overflow: 'hidden' }}>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Vendor</th>
                <th>Category</th>
                <th>GST Number</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(vendor => (
                <tr key={vendor.id} style={{ cursor: 'pointer' }}>
                  <td onClick={() => setSelectedVendor(vendor)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '36px', height: '36px', borderRadius: '10px', flexShrink: 0,
                        background: `hsl(${vendor.company_name.charCodeAt(0) * 15 % 360}, 70%, 85%)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: `hsl(${vendor.company_name.charCodeAt(0) * 15 % 360}, 70%, 30%)`,
                        fontWeight: 700, fontSize: '14px',
                      }}>
                        {vendor.company_name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '13px' }}>{vendor.company_name}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>{vendor.address?.split(',').slice(-1)[0]?.trim()}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="badge badge-indigo">{vendor.category}</span>
                  </td>
                  <td style={{ fontSize: '13px', color: '#334155', fontFamily: 'monospace' }}>{vendor.gst_number}</td>
                  <td>
                    <div style={{ fontSize: '13px' }}>
                      <div style={{ color: '#334155', fontWeight: 500 }}>{vendor.contact_name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#94A3B8', fontSize: '11px', marginTop: '2px' }}>
                        <Mail size={11} />{vendor.email}
                      </div>
                    </div>
                  </td>
                  <td><StatusBadge status={vendor.status} /></td>
                  <td><StarRating rating={vendor.rating} /></td>
                  <td>
                    <div style={{ position: 'relative' }}>
                      <button onClick={(e) => { e.stopPropagation(); setActionMenuId(actionMenuId === vendor.id ? null : vendor.id) }}
                        style={{ background: '#F1F5F9', border: 'none', borderRadius: '6px', padding: '6px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                        <MoreHorizontal size={16} color="#64748B" />
                      </button>
                      {actionMenuId === vendor.id && (
                        <>
                          <div onClick={() => setActionMenuId(null)} style={{ position: 'fixed', inset: 0, zIndex: 40 }} />
                          <div style={{
                            position: 'absolute', right: 0, top: '34px', background: 'white',
                            border: '1px solid #E2E8F0', borderRadius: '10px', boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                            zIndex: 50, minWidth: '160px', overflow: 'hidden',
                          }}>
                            {[
                              { label: 'View Details', action: () => { setSelectedVendor(vendor); setActionMenuId(null) } },
                              { label: 'Set Active', action: () => handleStatusChange(vendor.id, 'active'), color: '#15803D' },
                              { label: 'Set Inactive', action: () => handleStatusChange(vendor.id, 'inactive'), color: '#64748B' },
                              { label: 'Blacklist', action: () => handleStatusChange(vendor.id, 'blacklisted'), color: '#B91C1C' },
                            ].map(item => (
                              <button key={item.label} onClick={item.action} style={{
                                width: '100%', padding: '9px 14px', background: 'none', border: 'none',
                                cursor: 'pointer', textAlign: 'left', fontSize: '13px',
                                color: item.color || '#334155', fontWeight: 500,
                                transition: 'background 0.1s',
                              }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFC')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                                {item.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '48px', color: '#64748B' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🔍</div>
              <div style={{ fontWeight: 600 }}>No vendors found</div>
              <div style={{ fontSize: '13px', marginTop: '4px' }}>Try adjusting your search or filters</div>
            </div>
          )}
        </div>
      </div>

      {/* Vendor Detail Modal */}
      {selectedVendor && (
        <div className="modal-overlay" onClick={() => setSelectedVendor(null)}>
          <div className="modal" style={{ width: '600px' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '24px 28px', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A' }}>Vendor Profile</h2>
              <button onClick={() => setSelectedVendor(null)} style={{ background: '#F1F5F9', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '18px', color: '#64748B' }}>×</button>
            </div>
            <div style={{ padding: '24px 28px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '24px', alignItems: 'center' }}>
                <div style={{
                  width: '60px', height: '60px', borderRadius: '16px', flexShrink: 0,
                  background: `hsl(${selectedVendor.company_name.charCodeAt(0) * 15 % 360}, 70%, 85%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: `hsl(${selectedVendor.company_name.charCodeAt(0) * 15 % 360}, 70%, 30%)`,
                  fontWeight: 700, fontSize: '24px',
                }}>
                  {selectedVendor.company_name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ fontWeight: 700, fontSize: '20px', color: '#0F172A', marginBottom: '4px' }}>{selectedVendor.company_name}</h3>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <StatusBadge status={selectedVendor.status} />
                    <span className="badge badge-indigo">{selectedVendor.category}</span>
                    <StarRating rating={selectedVendor.rating} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[
                  { icon: <Mail size={14} />, label: 'Email', value: selectedVendor.email },
                  { icon: <Phone size={14} />, label: 'Phone', value: selectedVendor.phone },
                  { icon: <MapPin size={14} />, label: 'Address', value: selectedVendor.address },
                  { label: 'GST Number', value: selectedVendor.gst_number },
                  { label: 'PAN Number', value: selectedVendor.pan_number || 'Not provided' },
                  { label: 'Contact Person', value: selectedVendor.contact_name },
                ].map((item, i) => (
                  <div key={i} style={{ background: '#F8FAFC', borderRadius: '8px', padding: '12px' }}>
                    <div style={{ fontSize: '11px', color: '#94A3B8', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.label}</div>
                    <div style={{ fontSize: '13px', color: '#334155', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {item.icon && <span style={{ color: '#6366F1' }}>{item.icon}</span>}
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {selectedVendor.bank_details && (
                <div style={{ background: '#EEF2FF', borderRadius: '10px', padding: '14px', border: '1px solid #C7D2FE' }}>
                  <div style={{ fontWeight: 600, fontSize: '13px', color: '#4338CA', marginBottom: '10px' }}>🏦 Bank Details</div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {Object.entries(selectedVendor.bank_details).map(([key, val]) => (
                      <div key={key}>
                        <div style={{ fontSize: '11px', color: '#6366F1', textTransform: 'capitalize' }}>{key.replace('_', ' ')}</div>
                        <div style={{ fontSize: '13px', color: '#1E1B4B', fontWeight: 500 }}>{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <AddVendorModal
          onClose={() => setShowAddModal(false)}
          onAdd={(v) => setVendors(prev => [v, ...prev])}
        />
      )}
    </div>
  )
}
