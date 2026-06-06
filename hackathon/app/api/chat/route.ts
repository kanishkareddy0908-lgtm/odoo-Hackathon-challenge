import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message, context, history } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_api_key') {
      return NextResponse.json({ 
        response: generateFallbackResponse(message)
      })
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey })

    const systemPrompt = `You are ProcureGPT, an AI procurement assistant for VendorBridge ERP — an enterprise procurement and vendor management platform. You have access to the company's live procurement data provided in context.

Your capabilities:
- Answer questions about vendors, RFQs, quotations, purchase orders, and invoices
- Analyze spending patterns and provide cost-saving recommendations
- Draft procurement documents (RFQs, POs)
- Identify risks and anomalies in procurement data
- Provide actionable procurement insights

Formatting:
- Use **bold** for important numbers and names
- Use bullet points for lists
- Be concise but comprehensive
- Always include actionable recommendations when relevant
- Format currency in Indian Rupees (₹) with lakhs notation when appropriate

${context}`

    const messages = [
      ...(history || []).map((h: { role: string; content: string }) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user' as const, content: message },
    ]

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : 'No response generated.'
    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ response: generateFallbackResponse('') })
  }
}

function generateFallbackResponse(question: string): string {
  const q = question.toLowerCase()
  if (q.includes('vendor') && (q.includes('cheap') || q.includes('lowest'))) {
    return '**TechVision Solutions** submitted the lowest quote for laptops at ₹62,000/unit with 1-year warranty. They score highest overall when considering price, delivery time, and rating.'
  }
  if (q.includes('spend') || q.includes('month')) {
    return 'This month\'s total procurement spend is **₹41,59,000** against a budget of ₹40,00,000 (+4% over budget). IT equipment accounts for 64% of spend.'
  }
  if (q.includes('approval') || q.includes('pending')) {
    return 'There are **3 pending approvals** requiring action:\n1. DigiSoft Laptops — ₹28.3L (5 days pending) 🔴\n2. OfficeFirst Furniture — ₹14.9L (12 days pending) 🟡\n3. TechVision IT Support — ₹31.6L (3 days pending) 🟡'
  }
  return 'I can help you with procurement questions about vendors, RFQs, purchase orders, spending, and more. Connect your Anthropic API key for full AI capabilities!'
}
