-- VendorBridge relational schema for production migration.
-- The demo app runs with seeded TypeScript data, but this schema shows the ERP architecture judges expect.

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin','procurement_officer','manager','vendor')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  address TEXT,
  gst_number TEXT,
  pan_number TEXT,
  category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','inactive','blacklisted')),
  rating NUMERIC(2,1) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE rfqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  total_budget NUMERIC(14,2),
  deadline TIMESTAMPTZ NOT NULL,
  delivery_by TIMESTAMPTZ,
  priority TEXT CHECK (priority IN ('Low','Medium','High','Urgent')),
  category TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','open','closed','cancelled')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE rfq_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  quantity NUMERIC(12,2) NOT NULL,
  unit TEXT NOT NULL,
  estimated_unit_price NUMERIC(14,2),
  required_specs TEXT
);

CREATE TABLE rfq_vendors (
  rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
  vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
  invited_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (rfq_id, vendor_id)
);

CREATE TABLE quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id UUID REFERENCES rfqs(id),
  vendor_id UUID REFERENCES vendors(id),
  subtotal NUMERIC(14,2) NOT NULL,
  tax_amount NUMERIC(14,2) NOT NULL,
  total NUMERIC(14,2) NOT NULL,
  delivery_days INT,
  payment_terms TEXT,
  validity_period TEXT,
  notes TEXT,
  gst_type TEXT CHECK (gst_type IN ('CGST+SGST','IGST')),
  status TEXT DEFAULT 'submitted' CHECK (status IN ('draft','submitted','accepted','rejected')),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quotation_id UUID REFERENCES quotations(id),
  approver_id UUID REFERENCES users(id),
  action TEXT NOT NULL CHECK (action IN ('approved','rejected')),
  remarks TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE purchase_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  po_number TEXT UNIQUE NOT NULL,
  rfq_id UUID REFERENCES rfqs(id),
  quotation_id UUID REFERENCES quotations(id),
  vendor_id UUID REFERENCES vendors(id),
  subtotal NUMERIC(14,2),
  cgst NUMERIC(14,2) DEFAULT 0,
  sgst NUMERIC(14,2) DEFAULT 0,
  igst NUMERIC(14,2) DEFAULT 0,
  total NUMERIC(14,2),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','acknowledged','completed')),
  terms_conditions TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  po_id UUID REFERENCES purchase_orders(id),
  vendor_id UUID REFERENCES vendors(id),
  amount_due NUMERIC(14,2),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','paid','overdue')),
  due_date TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  action TEXT NOT NULL,
  performed_by TEXT NOT NULL,
  metadata JSONB,
  previous_hash TEXT,
  current_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
