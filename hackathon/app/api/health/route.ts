import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    ok: true,
    app: 'VendorBridge',
    version: '1.0.0-hackathon',
    modules: ['auth', 'vendors', 'rfqs', 'quotations', 'approvals', 'purchase-orders', 'invoices', 'audit', 'reports'],
    timestamp: new Date().toISOString(),
  })
}
