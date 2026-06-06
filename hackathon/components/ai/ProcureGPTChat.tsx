'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageSquare, X, Send, Bot, User, Sparkles, Loader2, ChevronDown } from 'lucide-react'
import { DEMO_VENDORS, DEMO_RFQS, DEMO_PURCHASE_ORDERS, DEMO_INVOICES, MONTHLY_SPEND_DATA } from '@/lib/seed-data'
import { formatCurrency } from '@/lib/utils'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const QUICK_ACTIONS = [
  { label: 'Pending approvals', query: 'Show me all pending approvals' },
  { label: 'This month spend', query: "What's our total spend this month?" },
  { label: 'Top vendors', query: 'Who are our top performing vendors?' },
  { label: 'Open RFQs', query: 'List all open RFQs' },
]

function buildContext() {
  const openRFQs = DEMO_RFQS.filter(r => r.status === 'open')
  const totalSpend = MONTHLY_SPEND_DATA[MONTHLY_SPEND_DATA.length - 1].actual
  const activeVendors = DEMO_VENDORS.filter(v => v.status === 'active').length
  const pendingPOs = DEMO_PURCHASE_ORDERS.filter(po => po.status !== 'completed').length

  return `
COMPANY DATA CONTEXT:
- Active Vendors: ${activeVendors} out of ${DEMO_VENDORS.length} total
- Open RFQs: ${openRFQs.length} (${openRFQs.map(r => r.title).join(', ')})
- This Month Spend: ${formatCurrency(totalSpend)}
- Pending Purchase Orders: ${pendingPOs}
- Recent POs: ${DEMO_PURCHASE_ORDERS.map(po => `${po.po_number} (${po.status}) - ${formatCurrency(po.total)}`).join(', ')}
- Top Vendors: ${DEMO_VENDORS.slice(0, 3).map(v => `${v.company_name} (${v.category}, Rating: ${v.rating})`).join(', ')}
- Invoices Due: ${DEMO_INVOICES.filter(i => i.status === 'pending').length} pending, ${DEMO_INVOICES.filter(i => i.status === 'overdue').length} overdue
`
}

export default function ProcureGPTChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi! I'm **ProcureGPT** 🤖, your AI procurement assistant. I have access to your company's procurement data.\n\nTry asking me:\n• Which vendor gave the cheapest quote for laptops?\n• What's our spend this month?\n• List all open RFQs\n• Who are our top vendors?",
      timestamp: new Date(),
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, open])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const context = buildContext()
      const historyMessages = messages.slice(-8).map(m => ({
        role: m.role,
        content: m.content,
      }))

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          context,
          history: historyMessages,
        }),
      })

      if (!response.ok) throw new Error('Failed to get response')

      const data = await response.json()
      const assistantMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response || 'I apologize, I could not process that request.',
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, assistantMsg])
    } catch {
      // Fallback local response
      const localResponse = generateLocalResponse(text)
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: localResponse,
        timestamp: new Date(),
      }])
    } finally {
      setLoading(false)
    }
  }

  const generateLocalResponse = (question: string): string => {
    const q = question.toLowerCase()
    if (q.includes('vendor') && (q.includes('cheap') || q.includes('lowest') || q.includes('best'))) {
      return `**Best Quote Analysis for Laptops (RFQ-001):**\n\n🥇 **TechVision Solutions** — ₹62,000/unit (Total: ₹26.7L)\n🥈 DigiSoft Technologies — ₹65,500/unit (Total: ₹28.3L)\n\n**TechVision Solutions wins** with 5.3% lower pricing and 1-year onsite warranty. They also have a higher rating (4.8 ⭐) vs DigiSoft (4.5 ⭐).`
    }
    if (q.includes('spend') || q.includes('month')) {
      return `**July 2025 Spend Summary:**\n\n💰 Total Spend: **₹41,59,000**\n📈 vs Budget: ₹40,00,000 (+4% over budget)\n\nBreakdown:\n• IT Equipment: ₹26,69,750 (64%)\n• Office Furniture: ₹14,89,160 (36%)\n\n⚠️ Note: IT spend exceeded budget by ₹59,000. Recommend reviewing Q3 IT allocation.`
    }
    if (q.includes('pending') || q.includes('approval')) {
      return `**Pending Approvals (3 items):**\n\n1. 🔴 Quote QT-002 — DigiSoft Laptops (₹28.3L) — 5 days pending\n2. 🟡 Quote QT-003 — OfficeFirst Furniture (₹14.9L) — 12 days pending\n3. 🟡 Quote QT-004 — TechVision IT Support (₹31.6L) — 3 days pending\n\n⚡ **Urgent:** QT-002 deadline is in 2 days!`
    }
    if (q.includes('rfq') || q.includes('open')) {
      return `**Open RFQs (3 active):**\n\n1. 💻 **Laptop Procurement** — Deadline: Aug 15 | Budget: ₹35L | 2 quotes received\n2. 🔧 **IT Support Contract** — Deadline: Jul 31 | Budget: ₹27.6L | 1 quote received\n3. 🖥️ **Server Upgrade** — Deadline: Sep 1 | Budget: ₹25L | No quotes yet ⚠️\n\nAction needed: Send reminders for Server Upgrade RFQ.`
    }
    if (q.includes('top vendor') || q.includes('best vendor')) {
      return `**Top Performing Vendors:**\n\n🥇 **TechVision Solutions** — Rating 4.8⭐ | IT Category | 2 active orders\n🥈 **SwiftLog Logistics** — Rating 4.6⭐ | Logistics | On-time delivery 95%\n🥉 **DigiSoft Technologies** — Rating 4.5⭐ | IT | Premium service\n\nAll three vendors have excellent track records. TechVision is recommended for IT procurement.`
    }
    return `I understand you're asking about "${question}". Based on the current procurement data:\n\n• You have ${DEMO_VENDORS.filter(v => v.status === 'active').length} active vendors\n• ${DEMO_RFQS.filter(r => r.status === 'open').length} open RFQs\n• Monthly spend: ${formatCurrency(4159000)}\n\nFor more specific insights, please connect your Anthropic API key. I can then provide detailed AI-powered analysis of your procurement data.`
  }

  const renderMessage = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>{line.slice(2, -2)}</div>
      }
      if (line.includes('**')) {
        const parts = line.split(/\*\*(.*?)\*\*/g)
        return (
          <div key={i} style={{ marginBottom: '3px', lineHeight: 1.5 }}>
            {parts.map((part, j) => j % 2 === 1 ? <strong key={j}>{part}</strong> : part)}
          </div>
        )
      }
      if (line.startsWith('•') || line.startsWith('-') || line.match(/^\d+\./)) {
        return <div key={i} style={{ paddingLeft: '8px', marginBottom: '3px', color: '#334155', lineHeight: 1.5 }}>{line}</div>
      }
      if (line === '') return <div key={i} style={{ height: '6px' }} />
      return <div key={i} style={{ marginBottom: '3px', lineHeight: 1.5 }}>{line}</div>
    })
  }

  return (
    <>
      {/* Floating Button */}
      <div className="chat-widget">
        {!open && (
          <div style={{ position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: '-4px', borderRadius: '50%',
              background: 'rgba(99,102,241,0.3)', animation: 'pulse 2s ease-in-out infinite',
            }} />
            <style>{`@keyframes pulse { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.1); opacity: 0.3; } }`}</style>
            <button onClick={() => setOpen(true)} style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
              border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(99,102,241,0.4)',
              position: 'relative', zIndex: 1,
              transition: 'transform 0.2s ease',
            }} title="Open ProcureGPT">
              <Bot size={24} color="white" />
            </button>
          </div>
        )}
      </div>

      {/* Chat Panel */}
      {open && (
        <div className="chat-panel">
          {/* Header */}
          <div style={{
            padding: '14px 16px',
            background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '8px',
                background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Bot size={18} color="white" />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 700, fontSize: '14px' }}>ProcureGPT</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34D399' }} />
                  <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '11px' }}>AI Assistant · Online</span>
                </div>
              </div>
              <div style={{ marginLeft: '8px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px', padding: '2px 8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Sparkles size={10} color="white" />
                <span style={{ color: 'white', fontSize: '10px', fontWeight: 600 }}>Claude AI</span>
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '6px', cursor: 'pointer', padding: '6px', color: 'white' }}>
              <ChevronDown size={16} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map(msg => (
              <div key={msg.id} style={{
                display: 'flex', gap: '8px', alignItems: 'flex-start',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
              }}>
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'assistant' ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : '#E2E8F0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {msg.role === 'assistant' ? <Bot size={14} color="white" /> : <User size={14} color="#64748B" />}
                </div>
                <div style={{
                  maxWidth: '85%',
                  padding: '10px 12px',
                  borderRadius: msg.role === 'user' ? '12px 2px 12px 12px' : '2px 12px 12px 12px',
                  background: msg.role === 'user' ? '#6366F1' : '#F8FAFC',
                  border: msg.role === 'assistant' ? '1px solid #E2E8F0' : 'none',
                  color: msg.role === 'user' ? 'white' : '#334155',
                  fontSize: '13px',
                  lineHeight: 1.5,
                }}>
                  {renderMessage(msg.content)}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={14} color="white" />
                </div>
                <div style={{ padding: '12px 14px', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '2px 12px 12px 12px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{
                      width: '6px', height: '6px', borderRadius: '50%', background: '#6366F1',
                      animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                  <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }`}</style>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div style={{ padding: '8px 14px', borderTop: '1px solid #F1F5F9', display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
            {QUICK_ACTIONS.map(qa => (
              <button key={qa.label} onClick={() => sendMessage(qa.query)} style={{
                padding: '4px 10px', borderRadius: '9999px', border: '1px solid #E2E8F0',
                background: '#F8FAFC', color: '#6366F1', fontSize: '11px', fontWeight: 500,
                cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap',
              }}>
                {qa.label}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid #E2E8F0', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage(input)}
                placeholder="Ask about vendors, RFQs, spend..."
                style={{
                  flex: 1, padding: '9px 12px', border: '1px solid #E2E8F0', borderRadius: '8px',
                  fontSize: '13px', outline: 'none', fontFamily: 'Inter, sans-serif',
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => (e.target.style.borderColor = '#6366F1')}
                onBlur={e => (e.target.style.borderColor = '#E2E8F0')}
              />
              <button onClick={() => sendMessage(input)} disabled={loading || !input.trim()} style={{
                width: '36px', height: '36px', borderRadius: '8px',
                background: input.trim() ? 'linear-gradient(135deg, #6366F1, #8B5CF6)' : '#E2E8F0',
                border: 'none', cursor: input.trim() ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', flexShrink: 0,
              }}>
                {loading ? <Loader2 size={15} color="white" className="animate-spin" /> : <Send size={15} color={input.trim() ? 'white' : '#94A3B8'} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
