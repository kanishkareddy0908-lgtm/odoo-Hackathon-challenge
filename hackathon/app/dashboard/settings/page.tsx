'use client'

import { useState } from 'react'
import { Settings, User, Mail, Building, Shield, Bell, Palette, Save, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('organization')

  const [orgSettings, setOrgSettings] = useState({
    company_name: 'VendorBridge Inc.',
    gst_number: '29AABCV1234L1ZQ',
    address: '42, Tech Park, Whitefield, Bangalore - 560066',
    email: 'procurement@vendorbridge.com',
    phone: '+91-80-12345678',
    website: 'https://vendorbridge.com',
  })

  const [emailSettings, setEmailSettings] = useState({
    from_name: 'VendorBridge Procurement',
    from_email: 'noreply@vendorbridge.com',
    po_subject: 'Purchase Order {{po_number}} from {{company_name}}',
    invoice_subject: 'Invoice {{invoice_number}} from {{company_name}}',
  })

  const [gstSettings, setGstSettings] = useState({
    default_gst_type: 'CGST+SGST',
    cgst_rate: 9,
    sgst_rate: 9,
    igst_rate: 18,
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 1000))
    setSaving(false)
    toast.success('Settings saved successfully!')
  }

  const SECTIONS = [
    { id: 'organization', label: 'Organization', icon: <Building size={16} /> },
    { id: 'email', label: 'Email Templates', icon: <Mail size={16} /> },
    { id: 'gst', label: 'GST Configuration', icon: <Shield size={16} /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell size={16} /> },
    { id: 'users', label: 'User Management', icon: <User size={16} /> },
  ]

  const DEMO_USERS = [
    { name: 'Arjun Sharma', email: 'admin@vendorbridge.com', role: 'Admin', status: 'active', lastLogin: '2 hours ago' },
    { name: 'Priya Menon', email: 'officer@vendorbridge.com', role: 'Procurement Officer', status: 'active', lastLogin: '30 minutes ago' },
    { name: 'Rahul Gupta', email: 'manager@vendorbridge.com', role: 'Manager', status: 'active', lastLogin: '1 day ago' },
  ]

  return (
    <div style={{ maxWidth: '1000px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Settings</h1>
        <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Configure VendorBridge for your organization</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '20px' }}>
        {/* Sidebar */}
        <div className="card" style={{ padding: '8px', height: 'fit-content' }}>
          {SECTIONS.map(section => (
            <button key={section.id} onClick={() => setActiveSection(section.id)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              background: activeSection === section.id ? '#EEF2FF' : 'none',
              color: activeSection === section.id ? '#6366F1' : '#475569',
              fontWeight: activeSection === section.id ? 600 : 400, fontSize: '14px',
              transition: 'all 0.15s', textAlign: 'left', marginBottom: '2px',
            }}>
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="card" style={{ padding: '24px' }}>
          {activeSection === 'organization' && (
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '20px' }}>Organization Profile</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {[
                  { label: 'Company Name', key: 'company_name', placeholder: 'VendorBridge Inc.' },
                  { label: 'GST Number', key: 'gst_number', placeholder: '29AABCV1234L1ZQ' },
                  { label: 'Email', key: 'email', placeholder: 'procurement@company.com' },
                  { label: 'Phone', key: 'phone', placeholder: '+91-80-12345678' },
                  { label: 'Website', key: 'website', placeholder: 'https://company.com' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{field.label}</label>
                    <input className="input" value={orgSettings[field.key as keyof typeof orgSettings]}
                      onChange={e => setOrgSettings(p => ({ ...p, [field.key]: e.target.value }))}
                      placeholder={field.placeholder} />
                  </div>
                ))}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Address</label>
                  <textarea className="input" value={orgSettings.address} onChange={e => setOrgSettings(p => ({ ...p, address: e.target.value }))} rows={2} />
                </div>
              </div>
            </div>
          )}

          {activeSection === 'gst' && (
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '20px' }}>GST Configuration</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Default GST Type</label>
                  <select className="input" value={gstSettings.default_gst_type} onChange={e => setGstSettings(p => ({ ...p, default_gst_type: e.target.value }))}>
                    <option value="CGST+SGST">CGST + SGST (Intra-state)</option>
                    <option value="IGST">IGST (Inter-state)</option>
                  </select>
                </div>
                {[
                  { label: 'CGST Rate (%)', key: 'cgst_rate' },
                  { label: 'SGST Rate (%)', key: 'sgst_rate' },
                  { label: 'IGST Rate (%)', key: 'igst_rate' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{field.label}</label>
                    <input type="number" className="input" value={gstSettings[field.key as keyof typeof gstSettings]}
                      onChange={e => setGstSettings(p => ({ ...p, [field.key]: +e.target.value }))} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 'email' && (
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '20px' }}>Email Templates</h3>
              <div style={{ display: 'grid', gap: '16px' }}>
                {[
                  { label: 'From Name', key: 'from_name' },
                  { label: 'From Email', key: 'from_email' },
                  { label: 'PO Email Subject', key: 'po_subject' },
                  { label: 'Invoice Email Subject', key: 'invoice_subject' },
                ].map(field => (
                  <div key={field.key}>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{field.label}</label>
                    <input className="input" value={emailSettings[field.key as keyof typeof emailSettings]}
                      onChange={e => setEmailSettings(p => ({ ...p, [field.key]: e.target.value }))} />
                  </div>
                ))}
                <div style={{ background: '#EEF2FF', borderRadius: '8px', padding: '12px', fontSize: '12px', color: '#4338CA' }}>
                  <strong>Available variables:</strong> {'{{po_number}}'}, {'{{invoice_number}}'}, {'{{company_name}}'}, {'{{vendor_name}}'}, {'{{amount}}'}
                </div>
              </div>
            </div>
          )}

          {activeSection === 'notifications' && (
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '20px' }}>Notification Preferences</h3>
              {[
                { label: 'New quotation submitted', desc: 'When a vendor submits a quote' },
                { label: 'Approval required', desc: 'When a quote needs manager approval' },
                { label: 'PO acknowledged', desc: 'When vendor acknowledges a PO' },
                { label: 'Invoice overdue', desc: 'When payment deadline passes' },
                { label: 'RFQ deadline approaching', desc: '3 days before RFQ closes' },
              ].map((notif, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 500, color: '#0F172A' }}>{notif.label}</div>
                    <div style={{ fontSize: '12px', color: '#94A3B8' }}>{notif.desc}</div>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" defaultChecked style={{ width: '16px', height: '16px', accentColor: '#6366F1' }} />
                  </label>
                </div>
              ))}
            </div>
          )}

          {activeSection === 'users' && (
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '16px', color: '#0F172A', marginBottom: '20px' }}>User Management</h3>
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Last Login</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DEMO_USERS.map(user => (
                      <tr key={user.email}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#6366F1', fontSize: '13px' }}>
                              {user.name.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '13px', color: '#0F172A' }}>{user.name}</div>
                              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-indigo">{user.role}</span></td>
                        <td><span className="badge badge-green">{user.status}</span></td>
                        <td style={{ fontSize: '12px', color: '#64748B' }}>{user.lastLogin}</td>
                        <td>
                          <button className="btn btn-secondary btn-sm" onClick={() => toast.info('User edit coming soon!')}>Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={handleSave} disabled={saving} className="btn btn-primary">
              {saving ? <><Loader2 size={15} className="animate-spin" /> Saving...</> : <><Save size={15} /> Save Settings</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
