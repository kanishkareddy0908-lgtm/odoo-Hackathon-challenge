import { DEMO_PURCHASE_ORDERS, DEMO_QUOTATIONS, DEMO_RFQS, DEMO_VENDORS } from './seed-data'
import { VendorCategory } from './types'

export type DemoVendorInput = {
  id: string
  company_name: string
  contact_name: string
  email: string
  phone: string
  category: VendorCategory
  gst_number: string
  address: string
  created_at: string
}

export type DemoRFQInput = {
  id: string
  title: string
  description: string
  item_name: string
  quantity: number
  unit: string
  budget: number
  category: VendorCategory
  deadline: string
  vendors: string[]
  status: 'draft' | 'open'
  created_at: string
}

export type DemoQuotationInput = {
  id: string
  rfq_id: string
  vendor_id: string
  unit_price: number
  delivery_days: number
  tax_percent: number
  notes: string
  total: number
  status: 'submitted'
  created_at: string
}

export type DemoApprovalInput = {
  id: string
  quotation_id: string
  action: 'approved' | 'rejected'
  remarks: string
  created_at: string
}

export type DemoPOInput = {
  id: string
  quotation_id: string
  po_number: string
  terms: string
  created_at: string
}

export type DemoInvoiceInput = {
  id: string
  po_number: string
  invoice_number: string
  amount: number
  due_date: string
  email_to: string
  created_at: string
}

export type DemoWorkflowData = {
  vendors: DemoVendorInput[]
  rfqs: DemoRFQInput[]
  quotations: DemoQuotationInput[]
  approvals: DemoApprovalInput[]
  purchaseOrders: DemoPOInput[]
  invoices: DemoInvoiceInput[]
}

export const WORKFLOW_STORAGE_KEY = 'vb_input_workflow_records'

export const emptyWorkflowData: DemoWorkflowData = {
  vendors: [],
  rfqs: [],
  quotations: [],
  approvals: [],
  purchaseOrders: [],
  invoices: [],
}

export const DEMO_MODE_COPY = 'Demo Mode · realistic sample procurement data loaded. Use Input Center to add your own records or reset anytime.'

export function loadWorkflowData(): DemoWorkflowData {
  if (typeof window === 'undefined') return emptyWorkflowData
  try {
    const raw = localStorage.getItem(WORKFLOW_STORAGE_KEY)
    return raw ? { ...emptyWorkflowData, ...JSON.parse(raw) } : emptyWorkflowData
  } catch {
    return emptyWorkflowData
  }
}

export function saveWorkflowData(data: DemoWorkflowData) {
  localStorage.setItem(WORKFLOW_STORAGE_KEY, JSON.stringify(data))
}

export function resetWorkflowData() {
  localStorage.removeItem(WORKFLOW_STORAGE_KEY)
}

export function getWorkflowCounts(data: DemoWorkflowData) {
  return {
    vendors: DEMO_VENDORS.length + data.vendors.length,
    rfqs: DEMO_RFQS.length + data.rfqs.length,
    quotations: DEMO_QUOTATIONS.length + data.quotations.length,
    approvals: data.approvals.length,
    purchaseOrders: DEMO_PURCHASE_ORDERS.length + data.purchaseOrders.length,
    invoices: data.invoices.length,
  }
}
