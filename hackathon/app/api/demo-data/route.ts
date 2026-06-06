import { NextResponse } from 'next/server'
import {
  DEMO_USERS,
  DEMO_VENDORS,
  DEMO_RFQS,
  DEMO_QUOTATIONS,
  DEMO_PURCHASE_ORDERS,
  DEMO_INVOICES,
} from '@/lib/seed-data'

export async function GET() {
  return NextResponse.json({
    users: DEMO_USERS,
    vendors: DEMO_VENDORS,
    rfqs: DEMO_RFQS,
    quotations: DEMO_QUOTATIONS,
    purchaseOrders: DEMO_PURCHASE_ORDERS,
    invoices: DEMO_INVOICES,
    auditLogs: [],
  })
}
