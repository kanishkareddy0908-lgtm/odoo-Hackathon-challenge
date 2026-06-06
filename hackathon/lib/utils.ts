import CryptoJS from 'crypto-js'

export function computeHash(data: {
  entity_id: string
  action: string
  performed_by: string
  timestamp: string
  previous_hash: string
}): string {
  const payload = `${data.entity_id}|${data.action}|${data.performed_by}|${data.timestamp}|${data.previous_hash}`
  return CryptoJS.SHA256(payload).toString()
}

export function verifyAuditChain(logs: Array<{
  id: string
  entity_id: string
  action: string
  performed_by: string
  created_at: string
  previous_hash: string
  current_hash: string
}>): boolean {
  for (let i = 0; i < logs.length; i++) {
    const log = logs[i]
    const expected = computeHash({
      entity_id: log.entity_id,
      action: log.action,
      performed_by: log.performed_by,
      timestamp: log.created_at,
      previous_hash: log.previous_hash,
    })
    if (expected !== log.current_hash) return false
  }
  return true
}

export function formatCurrency(amount: number, currency = 'INR'): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generatePONumber(sequence: number): string {
  const year = new Date().getFullYear()
  return `VB-PO-${year}-${String(sequence).padStart(4, '0')}`
}

export function generateInvoiceNumber(sequence: number): string {
  const year = new Date().getFullYear()
  return `VB-INV-${year}-${String(sequence).padStart(4, '0')}`
}

export function numberToWords(num: number): string {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen']
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety']

  function convert(n: number): string {
    if (n < 20) return ones[n]
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '')
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '')
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '')
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '')
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '')
  }

  const intPart = Math.floor(num)
  return convert(intPart) + ' Rupees Only'
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  })
}

export function getDaysUntil(dateStr: string): number {
  const target = new Date(dateStr)
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
