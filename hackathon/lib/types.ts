export type UserRole = 'admin' | 'procurement_officer' | 'manager' | 'vendor'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar_url?: string
  created_at: string
}

export interface Vendor {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  address: string
  gst_number: string
  pan_number?: string
  category: VendorCategory
  status: 'active' | 'inactive' | 'blacklisted'
  rating: number
  bank_details?: BankDetails
  created_at: string
}

export type VendorCategory = 'IT' | 'Office Supplies' | 'Construction' | 'Services' | 'Logistics' | 'Facilities' | 'Others'

export interface BankDetails {
  bank_name: string
  account_number: string
  ifsc_code: string
  account_type: string
}

export interface RFQItem {
  id: string
  name: string
  description: string
  quantity: number
  unit: string
  estimated_unit_price: number
  required_specs?: string
}

export type RFQStatus = 'draft' | 'open' | 'closed' | 'cancelled'
export type RFQPriority = 'Low' | 'Medium' | 'High' | 'Urgent'

export interface RFQ {
  id: string
  title: string
  description: string
  items: RFQItem[]
  total_budget: number
  deadline: string
  delivery_by?: string
  priority: RFQPriority
  category: VendorCategory
  status: RFQStatus
  created_by: string
  created_at: string
  currency?: string
}

export interface RFQVendor {
  rfq_id: string
  vendor_id: string
  invited_at: string
  magic_token: string
  token_expires_at: string
}

export interface QuotationItem {
  item_id: string
  item_name: string
  unit_price: number
  total_price: number
  lead_time_days: number
  availability: 'Yes' | 'Partial' | 'No'
}

export type QuotationStatus = 'draft' | 'submitted' | 'accepted' | 'rejected'

export interface Quotation {
  id: string
  rfq_id: string
  vendor_id: string
  items: QuotationItem[]
  subtotal: number
  tax_amount: number
  total: number
  delivery_days: number
  payment_terms?: string
  validity_period?: string
  notes?: string
  gst_type: 'CGST+SGST' | 'IGST'
  status: QuotationStatus
  submitted_at?: string
  created_at: string
}

export interface Approval {
  id: string
  quotation_id: string
  approver_id: string
  action: 'approved' | 'rejected'
  remarks?: string
  created_at: string
}

export type POStatus = 'draft' | 'sent' | 'acknowledged' | 'completed'

export interface PurchaseOrder {
  id: string
  po_number: string
  rfq_id: string
  quotation_id: string
  vendor_id: string
  items: QuotationItem[]
  subtotal: number
  cgst: number
  sgst: number
  igst: number
  total: number
  status: POStatus
  terms_conditions?: string
  created_at: string
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue'

export interface Invoice {
  id: string
  invoice_number: string
  po_id: string
  vendor_id: string
  amount_due: number
  tax_breakdown: {
    cgst?: number
    sgst?: number
    igst?: number
    total_tax: number
  }
  status: InvoiceStatus
  due_date: string
  created_at: string
}

export interface AuditLog {
  id: string
  entity_type: string
  entity_id: string
  action: string
  performed_by: string
  metadata?: Record<string, unknown>
  previous_hash?: string
  current_hash: string
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  read: boolean
  link?: string
  created_at: string
}
