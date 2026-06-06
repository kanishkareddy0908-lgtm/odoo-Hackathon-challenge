import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey || apiKey === 'your_anthropic_api_key') {
      return NextResponse.json({ rfq: generateFallbackRFQ(prompt) })
    }

    const Anthropic = (await import('@anthropic-ai/sdk')).default
    const client = new Anthropic({ apiKey })

    const systemPrompt = `You are a procurement specialist AI. Extract RFQ details from user descriptions and return structured JSON.
    
Return ONLY valid JSON with this exact structure (no extra text):
{
  "title": "string",
  "description": "string", 
  "category": "IT" | "Office Supplies" | "Construction" | "Services" | "Logistics" | "Facilities" | "Others",
  "total_budget": number,
  "items": [
    {
      "id": "item-1",
      "name": "string",
      "description": "string",
      "quantity": number,
      "unit": "Nos" | "Pcs" | "Kg" | "L" | "Months" | "Hours" | "Reams" | "Boxes" | "Lump Sum",
      "estimated_unit_price": number,
      "required_specs": "string (optional)"
    }
  ]
}

Rules:
- Extract all line items mentioned
- Estimate reasonable market prices in Indian Rupees if not specified
- Use Indian numbering (lakhs, crores) to set budget
- Be specific in descriptions
- Include relevant specifications`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 1500,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const rfq = JSON.parse(text)
    return NextResponse.json({ rfq })
  } catch (error) {
    console.error('RFQ generate error:', error)
    return NextResponse.json({ rfq: generateFallbackRFQ('') })
  }
}

function generateFallbackRFQ(prompt: string) {
  const lower = prompt.toLowerCase()
  if (lower.includes('chair') || lower.includes('furniture')) {
    return {
      title: 'Ergonomic Office Furniture Procurement',
      description: 'High-quality ergonomic office furniture for employee comfort and productivity enhancement.',
      category: 'Office Supplies',
      total_budget: 500000,
      items: [
        { id: 'item-1', name: 'Ergonomic Office Chair', description: 'Mesh back, adjustable height and armrests, lumbar support', quantity: 100, unit: 'Nos', estimated_unit_price: 8500, required_specs: 'BIFMA certified, 5-star base' },
        { id: 'item-2', name: 'Assembly & Installation', description: 'On-site assembly for all chairs across 3 floors', quantity: 1, unit: 'Lump Sum', estimated_unit_price: 15000 },
      ]
    }
  }
  return {
    title: 'General Procurement Request',
    description: prompt,
    category: 'Services',
    total_budget: 100000,
    items: [{ id: 'item-1', name: 'Service', description: prompt, quantity: 1, unit: 'Nos', estimated_unit_price: 100000 }]
  }
}
