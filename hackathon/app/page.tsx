import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  FileText,
  Mail,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Store,
  Workflow,
} from 'lucide-react'

const features = [
  { icon: Store, title: 'Vendor Management', text: 'GST, category, rating, contact details, status tracking, search and filters.' },
  { icon: FileText, title: 'RFQ Workflows', text: 'Create RFQs, add line items, assign vendors, set deadlines, and publish quickly.' },
  { icon: Workflow, title: 'Quotation Comparison', text: 'Compare vendors by price, delivery, quality score, and rating with winner selection.' },
  { icon: ShieldCheck, title: 'Approvals', text: 'Manager approval queue with approve/reject actions, remarks, and audit timeline.' },
  { icon: ShoppingCart, title: 'Purchase Orders', text: 'Auto-generated PO numbers, tax breakup, document preview, status updates.' },
  { icon: ReceiptText, title: 'Invoices', text: 'Generate invoices, calculate GST, print/download PDF, and send email-ready invoices.' },
]

const roles = [
  ['Procurement Officer', 'Create RFQs, compare quotations, generate POs and invoices'],
  ['Vendor', 'Submit quotations, track RFQ status, view purchase orders'],
  ['Manager / Approver', 'Approve or reject procurement requests with remarks'],
  ['Admin', 'Manage users, vendors, analytics, and audit visibility'],
]

export default function LandingPage() {
  return (
    <main style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F8FAFC 0%, #EEF2FF 55%, #FFF7ED 100%)', color: '#0F172A' }}>
      <nav style={{ maxWidth: 1180, margin: '0 auto', padding: '22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg,#6366F1,#8B5CF6)', color: 'white', display: 'grid', placeItems: 'center', fontWeight: 900, fontSize: 20 }}>VB</div>
          <div>
            <div style={{ fontWeight: 900, fontSize: 20 }}>VendorBridge</div>
            <div style={{ fontSize: 12, color: '#64748B', fontWeight: 600 }}>Procurement ERP</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/auth/login" className="btn btn-secondary" style={{ textDecoration: 'none' }}>Login</Link>
          <Link href="/auth/signup" className="btn btn-primary" style={{ textDecoration: 'none' }}>Create Account</Link>
        </div>
      </nav>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '72px 24px 48px', display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 36, alignItems: 'center' }} className="landing-hero">
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: 18, padding: '7px 12px' }}><Sparkles size={14} /> Hackathon Demo Ready</div>
          <h1 style={{ fontSize: 'clamp(40px, 7vw, 76px)', lineHeight: 0.95, letterSpacing: '-0.055em', marginBottom: 22 }}>
            Digitize procurement from RFQ to invoice.
          </h1>
          <p style={{ fontSize: 19, lineHeight: 1.7, color: '#475569', maxWidth: 710 }}>
            VendorBridge is a centralized ERP for vendors, RFQs, quotations, approvals, purchase orders, invoices, audit logs, and procurement analytics.
          </p>
          <div style={{ display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
            <Link href="/auth/login" className="btn btn-primary" style={{ textDecoration: 'none', padding: '14px 20px', fontSize: 15 }}>Open Demo Dashboard <ArrowRight size={18} /></Link>
            <a href="#workflow" className="btn btn-secondary" style={{ textDecoration: 'none', padding: '14px 20px', fontSize: 15 }}>View Workflow</a>
          </div>
          <div style={{ display: 'flex', gap: 18, marginTop: 30, flexWrap: 'wrap', color: '#475569', fontSize: 14 }}>
            {['Role-based access', 'GST calculations', 'PDF-ready invoices', 'Audit trail'].map(item => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><CheckCircle2 size={16} color="#16A34A" /> {item}</span>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 22, borderRadius: 24, boxShadow: '0 24px 80px rgba(99,102,241,.20)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18 }}>Live Procurement Snapshot</div>
              <div style={{ color: '#64748B', fontSize: 13 }}>Demo data included</div>
            </div>
            <BarChart3 color="#6366F1" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              ['Active RFQs', '4', '#EEF2FF'],
              ['Pending approvals', '3', '#FFF7ED'],
              ['Monthly spend', '₹41.6L', '#ECFDF5'],
              ['Vendors tracked', '8', '#FDF2F8'],
            ].map(([label, value, bg]) => (
              <div key={label} style={{ background: bg, borderRadius: 16, padding: 16, border: '1px solid rgba(15,23,42,.05)' }}>
                <div style={{ color: '#64748B', fontSize: 12, fontWeight: 700 }}>{label}</div>
                <div style={{ fontSize: 28, fontWeight: 900, marginTop: 6 }}>{value}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 16, padding: 16, borderRadius: 16, background: '#0F172A', color: 'white' }}>
            <div style={{ color: '#CBD5E1', fontSize: 12, marginBottom: 8 }}>Recommended vendor</div>
            <div style={{ fontWeight: 800 }}>TechVision Solutions</div>
            <div style={{ color: '#CBD5E1', fontSize: 13, marginTop: 5 }}>Lowest laptop quote + 4.8 rating + 14-day delivery.</div>
          </div>
        </div>
      </section>

      <section id="workflow" style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 24px' }}>
        <h2 style={{ fontSize: 34, letterSpacing: '-0.03em', marginBottom: 16 }}>End-to-end procurement workflow</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="feature-grid">
          {['Create RFQ', 'Receive Quotes', 'Approve Winner', 'Generate PO & Invoice'].map((step, i) => (
            <div className="card" key={step} style={{ padding: 18, borderRadius: 18 }}>
              <div style={{ width: 34, height: 34, borderRadius: 12, background: '#EEF2FF', color: '#4F46E5', display: 'grid', placeItems: 'center', fontWeight: 900, marginBottom: 12 }}>{i + 1}</div>
              <div style={{ fontWeight: 800 }}>{step}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 24px' }}>
        <h2 style={{ fontSize: 34, letterSpacing: '-0.03em', marginBottom: 16 }}>Built for the hackathon problem statement</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }} className="feature-grid">
          {features.map(({ icon: Icon, title, text }) => (
            <div className="card" key={title} style={{ padding: 22, borderRadius: 20 }}>
              <Icon color="#6366F1" size={24} />
              <h3 style={{ marginTop: 14, marginBottom: 8, fontSize: 18 }}>{title}</h3>
              <p style={{ color: '#64748B', lineHeight: 1.6, fontSize: 14 }}>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={{ maxWidth: 1180, margin: '0 auto', padding: '34px 24px 80px' }}>
        <h2 style={{ fontSize: 34, letterSpacing: '-0.03em', marginBottom: 16 }}>Role-based demo accounts</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }} className="feature-grid">
          {roles.map(([role, text]) => (
            <div className="card" key={role} style={{ padding: 18, borderRadius: 18 }}>
              <div style={{ fontWeight: 850, marginBottom: 8 }}>{role}</div>
              <div style={{ color: '#64748B', lineHeight: 1.55, fontSize: 13 }}>{text}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center' }}>
          <Link href="/auth/login" className="btn btn-primary" style={{ textDecoration: 'none', padding: '14px 22px' }}><Mail size={18} /> Try demo accounts</Link>
        </div>
      </section>
    </main>
  )
}
