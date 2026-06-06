import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null)

  if (!body?.invoiceNumber || !body?.to) {
    return NextResponse.json(
      { ok: false, message: 'invoiceNumber and to are required.' },
      { status: 400 }
    )
  }

  // Hackathon-safe default: mock successful send unless RESEND_API_KEY is configured.
  // The UI can demo the full flow without exposing real email credentials.
  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({
      ok: true,
      mode: 'mock',
      message: `Invoice ${body.invoiceNumber} queued for ${body.to}. Configure RESEND_API_KEY to send real email.`,
    })
  }

  return NextResponse.json({
    ok: true,
    mode: 'ready',
    message: 'Email provider key detected. Connect Resend SDK here for production sending.',
  })
}
