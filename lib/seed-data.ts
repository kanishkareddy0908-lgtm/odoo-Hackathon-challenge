import { Vendor, RFQ, Quotation, PurchaseOrder, Invoice, AuditLog, User } from './types'

// Demo seed data for hackathon
export const DEMO_USERS: User[] = [
  { id: 'user-admin-1', email: 'admin@vendorbridge.com', name: 'Arjun Sharma', role: 'admin', avatar_url: '', created_at: '2025-01-01T00:00:00Z' },
  { id: 'user-officer-1', email: 'officer@vendorbridge.com', name: 'Priya Menon', role: 'procurement_officer', avatar_url: '', created_at: '2025-01-01T00:00:00Z' },
  { id: 'user-manager-1', email: 'manager@vendorbridge.com', name: 'Rahul Gupta', role: 'manager', avatar_url: '', created_at: '2025-01-01T00:00:00Z' },
]

export const DEMO_VENDORS: Vendor[] = [
  {
    id: 'vendor-1', company_name: 'TechVision Solutions', contact_name: 'Amit Patel',
    email: 'amit@techvision.com', phone: '+91-9876543210', address: '42, Whitefield, Bangalore - 560066',
    gst_number: '29AABCT1332L1ZV', pan_number: 'AABCT1332L', category: 'IT', status: 'active', rating: 4.8,
    bank_details: { bank_name: 'HDFC Bank', account_number: '50100123456789', ifsc_code: 'HDFC0001234', account_type: 'Current' },
    created_at: '2025-01-15T00:00:00Z'
  },
  {
    id: 'vendor-2', company_name: 'OfficeFirst Supplies', contact_name: 'Rekha Nair',
    email: 'rekha@officefirst.com', phone: '+91-9865432109', address: '15, MG Road, Pune - 411001',
    gst_number: '27AAACO1234L1ZT', pan_number: 'AAACO1234L', category: 'Office Supplies', status: 'active', rating: 4.3,
    bank_details: { bank_name: 'SBI', account_number: '30123456789', ifsc_code: 'SBIN0001234', account_type: 'Current' },
    created_at: '2025-02-10T00:00:00Z'
  },
  {
    id: 'vendor-3', company_name: 'BuildRight Construction', contact_name: 'Suresh Kumar',
    email: 'suresh@buildright.com', phone: '+91-9754321098', address: '88, Industrial Area, Hyderabad - 500016',
    gst_number: '36AABCB1234L1ZU', pan_number: 'AABCB1234L', category: 'Construction', status: 'active', rating: 4.1,
    created_at: '2025-01-20T00:00:00Z'
  },
  {
    id: 'vendor-4', company_name: 'SwiftLog Logistics', contact_name: 'Meena Krishnan',
    email: 'meena@swiftlog.com', phone: '+91-9643210987', address: '23, KIADB, Chennai - 600032',
    gst_number: '33AABCS1234L1ZW', pan_number: 'AABCS1234L', category: 'Logistics', status: 'active', rating: 4.6,
    created_at: '2025-03-05T00:00:00Z'
  },
  {
    id: 'vendor-5', company_name: 'CleanFacilities Pro', contact_name: 'Deepak Joshi',
    email: 'deepak@cleanfac.com', phone: '+91-9532109876', address: '67, Sector 18, Noida - 201301',
    gst_number: '09AABCC1234L1ZX', pan_number: 'AABCC1234L', category: 'Facilities', status: 'active', rating: 3.9,
    created_at: '2025-02-28T00:00:00Z'
  },
  {
    id: 'vendor-6', company_name: 'DigiSoft Technologies', contact_name: 'Ananya Singh',
    email: 'ananya@digisoft.com', phone: '+91-9421098765', address: '11, Cyber City, Gurgaon - 122002',
    gst_number: '06AABCD1234L1ZY', pan_number: 'AABCD1234L', category: 'IT', status: 'active', rating: 4.5,
    created_at: '2025-03-15T00:00:00Z'
  },
  {
    id: 'vendor-7', company_name: 'PaperMart Stationery', contact_name: 'Vijay Malhotra',
    email: 'vijay@papermart.com', phone: '+91-9310987654', address: '34, Lajpat Nagar, Delhi - 110024',
    gst_number: '07AABCP1234L1ZZ', pan_number: 'AABCP1234L', category: 'Office Supplies', status: 'inactive', rating: 3.7,
    created_at: '2025-01-08T00:00:00Z'
  },
  {
    id: 'vendor-8', company_name: 'SecureNet Services', contact_name: 'Lakshmi Rao',
    email: 'lakshmi@securenet.com', phone: '+91-9209876543', address: '56, Jubilee Hills, Hyderabad - 500033',
    gst_number: '36AABCN1234L1ZA', pan_number: 'AABCN1234L', category: 'Services', status: 'blacklisted', rating: 2.1,
    created_at: '2024-11-20T00:00:00Z'
  },
]

export const DEMO_RFQS: RFQ[] = [
  {
    id: 'rfq-1', title: 'Procurement of 50 Laptops for Engineering Team',
    description: 'We require 50 high-performance laptops for our engineering department. These should be suitable for software development with adequate RAM and storage.',
    items: [
      { id: 'item-1-1', name: 'Laptop - 15.6" FHD', description: 'i7 12th Gen, 16GB RAM, 512GB SSD, Windows 11 Pro', quantity: 35, unit: 'Nos', estimated_unit_price: 65000, required_specs: 'Min 16GB RAM, 512GB NVMe SSD' },
      { id: 'item-1-2', name: 'Laptop Bag', description: '15.6" laptop bag with padding', quantity: 50, unit: 'Nos', estimated_unit_price: 1200 },
      { id: 'item-1-3', name: 'Wireless Mouse', description: 'Ergonomic wireless mouse', quantity: 50, unit: 'Nos', estimated_unit_price: 800 },
    ],
    total_budget: 3500000, deadline: '2025-08-15T00:00:00Z', delivery_by: '2025-09-01T00:00:00Z',
    priority: 'High', category: 'IT', status: 'open', created_by: 'user-officer-1', created_at: '2025-07-01T00:00:00Z', currency: 'INR'
  },
  {
    id: 'rfq-2', title: 'Office Furniture for New Floor',
    description: 'Setting up 3rd floor with complete furniture including desks, chairs, and storage units.',
    items: [
      { id: 'item-2-1', name: 'Ergonomic Office Chair', description: 'Mesh back, adjustable armrests, lumbar support', quantity: 60, unit: 'Nos', estimated_unit_price: 8500 },
      { id: 'item-2-2', name: 'Work Desk', description: '4x2 ft office desk with cable management', quantity: 60, unit: 'Nos', estimated_unit_price: 12000 },
      { id: 'item-2-3', name: 'Storage Cabinet', description: '3-shelf lockable steel cabinet', quantity: 20, unit: 'Nos', estimated_unit_price: 5500 },
    ],
    total_budget: 1500000, deadline: '2025-08-20T00:00:00Z', delivery_by: '2025-09-10T00:00:00Z',
    priority: 'Medium', category: 'Office Supplies', status: 'closed', created_by: 'user-officer-1', created_at: '2025-06-15T00:00:00Z', currency: 'INR'
  },
  {
    id: 'rfq-3', title: 'Annual IT Support & Maintenance Contract',
    description: 'We need a comprehensive IT support contract covering hardware maintenance, helpdesk support, and network monitoring.',
    items: [
      { id: 'item-3-1', name: 'Helpdesk Support (L1 & L2)', description: '24x7 support, SLA 4hrs response', quantity: 12, unit: 'Months', estimated_unit_price: 150000 },
      { id: 'item-3-2', name: 'On-site Engineer', description: 'Dedicated on-site IT engineer', quantity: 12, unit: 'Months', estimated_unit_price: 80000 },
    ],
    total_budget: 2760000, deadline: '2025-07-31T00:00:00Z', delivery_by: '2025-08-01T00:00:00Z',
    priority: 'High', category: 'IT', status: 'open', created_by: 'user-officer-1', created_at: '2025-07-05T00:00:00Z', currency: 'INR'
  },
  {
    id: 'rfq-4', title: 'Stationery and Office Supplies Q3',
    description: 'Quarterly procurement of office stationery and consumable supplies.',
    items: [
      { id: 'item-4-1', name: 'A4 Paper Ream', description: '80 GSM, 500 sheets', quantity: 200, unit: 'Reams', estimated_unit_price: 280 },
      { id: 'item-4-2', name: 'Ballpoint Pens', description: 'Blue/Black ink, box of 50', quantity: 30, unit: 'Boxes', estimated_unit_price: 150 },
    ],
    total_budget: 100000, deadline: '2025-07-25T00:00:00Z', delivery_by: '2025-08-01T00:00:00Z',
    priority: 'Low', category: 'Office Supplies', status: 'draft', created_by: 'user-officer-1', created_at: '2025-07-10T00:00:00Z', currency: 'INR'
  },
  {
    id: 'rfq-5', title: 'Server Hardware Upgrade',
    description: 'Upgrading data center with new generation servers and networking equipment.',
    items: [
      { id: 'item-5-1', name: 'Rack Server (2U)', description: 'Dual Xeon, 256GB RAM, 10TB SSD RAID', quantity: 5, unit: 'Nos', estimated_unit_price: 450000 },
      { id: 'item-5-2', name: '48-Port Managed Switch', description: 'Layer 3, 10GbE uplinks', quantity: 3, unit: 'Nos', estimated_unit_price: 85000 },
    ],
    total_budget: 2505000, deadline: '2025-09-01T00:00:00Z', delivery_by: '2025-09-30T00:00:00Z',
    priority: 'Urgent', category: 'IT', status: 'open', created_by: 'user-officer-1', created_at: '2025-07-08T00:00:00Z', currency: 'INR'
  },
]

export const DEMO_QUOTATIONS: Quotation[] = [
  {
    id: 'quote-1', rfq_id: 'rfq-1', vendor_id: 'vendor-1',
    items: [
      { item_id: 'item-1-1', item_name: 'Laptop - 15.6" FHD', unit_price: 62000, total_price: 2170000, lead_time_days: 14, availability: 'Yes' },
      { item_id: 'item-1-2', item_name: 'Laptop Bag', unit_price: 1100, total_price: 55000, lead_time_days: 7, availability: 'Yes' },
      { item_id: 'item-1-3', item_name: 'Wireless Mouse', unit_price: 750, total_price: 37500, lead_time_days: 7, availability: 'Yes' },
    ],
    subtotal: 2262500, tax_amount: 407250, total: 2669750,
    delivery_days: 14, payment_terms: 'Net 30', validity_period: '30 days',
    notes: 'All items include 1-year onsite warranty. EMI options available.', gst_type: 'CGST+SGST',
    status: 'accepted', submitted_at: '2025-07-10T00:00:00Z', created_at: '2025-07-10T00:00:00Z'
  },
  {
    id: 'quote-2', rfq_id: 'rfq-1', vendor_id: 'vendor-6',
    items: [
      { item_id: 'item-1-1', item_name: 'Laptop - 15.6" FHD', unit_price: 65500, total_price: 2292500, lead_time_days: 7, availability: 'Yes' },
      { item_id: 'item-1-2', item_name: 'Laptop Bag', unit_price: 1250, total_price: 62500, lead_time_days: 3, availability: 'Yes' },
      { item_id: 'item-1-3', item_name: 'Wireless Mouse', unit_price: 820, total_price: 41000, lead_time_days: 3, availability: 'Yes' },
    ],
    subtotal: 2396000, tax_amount: 431280, total: 2827280,
    delivery_days: 7, payment_terms: 'Advance 50%, Balance on delivery', validity_period: '15 days',
    notes: 'Premium service with 3-year warranty upgrade available.', gst_type: 'CGST+SGST',
    status: 'submitted', submitted_at: '2025-07-09T00:00:00Z', created_at: '2025-07-09T00:00:00Z'
  },
  {
    id: 'quote-3', rfq_id: 'rfq-2', vendor_id: 'vendor-2',
    items: [
      { item_id: 'item-2-1', item_name: 'Ergonomic Office Chair', unit_price: 7800, total_price: 468000, lead_time_days: 21, availability: 'Yes' },
      { item_id: 'item-2-2', item_name: 'Work Desk', unit_price: 11500, total_price: 690000, lead_time_days: 21, availability: 'Yes' },
      { item_id: 'item-2-3', item_name: 'Storage Cabinet', unit_price: 5200, total_price: 104000, lead_time_days: 14, availability: 'Yes' },
    ],
    subtotal: 1262000, tax_amount: 227160, total: 1489160,
    delivery_days: 21, payment_terms: 'Net 45', validity_period: '30 days',
    notes: 'Includes installation and assembly.', gst_type: 'CGST+SGST',
    status: 'submitted', submitted_at: '2025-06-25T00:00:00Z', created_at: '2025-06-25T00:00:00Z'
  },
  {
    id: 'quote-4', rfq_id: 'rfq-3', vendor_id: 'vendor-1',
    items: [
      { item_id: 'item-3-1', item_name: 'Helpdesk Support (L1 & L2)', unit_price: 145000, total_price: 1740000, lead_time_days: 5, availability: 'Yes' },
      { item_id: 'item-3-2', item_name: 'On-site Engineer', unit_price: 78000, total_price: 936000, lead_time_days: 5, availability: 'Yes' },
    ],
    subtotal: 2676000, tax_amount: 481680, total: 3157680,
    delivery_days: 5, payment_terms: 'Monthly', validity_period: '60 days',
    notes: 'SLA guaranteed with penalty clauses.', gst_type: 'IGST',
    status: 'submitted', submitted_at: '2025-07-12T00:00:00Z', created_at: '2025-07-12T00:00:00Z'
  },
]

export const DEMO_PURCHASE_ORDERS: PurchaseOrder[] = [
  {
    id: 'po-1', po_number: 'VB-PO-2025-0001', rfq_id: 'rfq-1', quotation_id: 'quote-1', vendor_id: 'vendor-1',
    items: [
      { item_id: 'item-1-1', item_name: 'Laptop - 15.6" FHD', unit_price: 62000, total_price: 2170000, lead_time_days: 14, availability: 'Yes' },
      { item_id: 'item-1-2', item_name: 'Laptop Bag', unit_price: 1100, total_price: 55000, lead_time_days: 7, availability: 'Yes' },
      { item_id: 'item-1-3', item_name: 'Wireless Mouse', unit_price: 750, total_price: 37500, lead_time_days: 7, availability: 'Yes' },
    ],
    subtotal: 2262500, cgst: 203625, sgst: 203625, igst: 0, total: 2669750,
    status: 'acknowledged', terms_conditions: 'Standard T&C apply. Delivery within agreed timeline. Warranty as per quote.',
    created_at: '2025-07-15T00:00:00Z'
  },
  {
    id: 'po-2', po_number: 'VB-PO-2025-0002', rfq_id: 'rfq-2', quotation_id: 'quote-3', vendor_id: 'vendor-2',
    items: [
      { item_id: 'item-2-1', item_name: 'Ergonomic Office Chair', unit_price: 7800, total_price: 468000, lead_time_days: 21, availability: 'Yes' },
      { item_id: 'item-2-2', item_name: 'Work Desk', unit_price: 11500, total_price: 690000, lead_time_days: 21, availability: 'Yes' },
      { item_id: 'item-2-3', item_name: 'Storage Cabinet', unit_price: 5200, total_price: 104000, lead_time_days: 14, availability: 'Yes' },
    ],
    subtotal: 1262000, cgst: 113580, sgst: 113580, igst: 0, total: 1489160,
    status: 'completed', terms_conditions: 'Standard T&C apply.',
    created_at: '2025-07-01T00:00:00Z'
  },
]

export const DEMO_INVOICES: Invoice[] = [
  {
    id: 'inv-1', invoice_number: 'VB-INV-2025-0001', po_id: 'po-1', vendor_id: 'vendor-1',
    amount_due: 2669750, tax_breakdown: { cgst: 203625, sgst: 203625, total_tax: 407250 },
    status: 'pending', due_date: '2025-08-14T00:00:00Z', created_at: '2025-07-15T00:00:00Z'
  },
  {
    id: 'inv-2', invoice_number: 'VB-INV-2025-0002', po_id: 'po-2', vendor_id: 'vendor-2',
    amount_due: 1489160, tax_breakdown: { cgst: 113580, sgst: 113580, total_tax: 227160 },
    status: 'paid', due_date: '2025-07-31T00:00:00Z', created_at: '2025-07-01T00:00:00Z'
  },
]

export const MONTHLY_SPEND_DATA = [
  { month: 'Feb', actual: 1200000, budgeted: 1500000 },
  { month: 'Mar', actual: 1850000, budgeted: 2000000 },
  { month: 'Apr', actual: 1400000, budgeted: 1600000 },
  { month: 'May', actual: 2200000, budgeted: 2000000 },
  { month: 'Jun', actual: 1750000, budgeted: 2200000 },
  { month: 'Jul', actual: 4159000, budgeted: 4000000 },
]

export const CATEGORY_SPEND_DATA = [
  { name: 'IT', value: 7200000, color: '#6366F1' },
  { name: 'Office Supplies', value: 2800000, color: '#10B981' },
  { name: 'Services', value: 1900000, color: '#F59E0B' },
  { name: 'Logistics', value: 850000, color: '#3B82F6' },
  { name: 'Facilities', value: 620000, color: '#EC4899' },
  { name: 'Construction', value: 1489160, color: '#8B5CF6' },
]
