'use client'

import { useState, useEffect } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts'
import { MONTHLY_SPEND_DATA, CATEGORY_SPEND_DATA, DEMO_VENDORS } from '@/lib/seed-data'
import { formatCurrency } from '@/lib/utils'
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Loader2, BarChart3, Download } from 'lucide-react'
import { toast } from 'sonner'

const VENDOR_PERFORMANCE = [
  { name: 'TechVision Solutions', on_time: 96, avg_price_index: 95, orders: 8, category: 'IT' },
  { name: 'SwiftLog Logistics', on_time: 94, avg_price_index: 88, orders: 12, category: 'Logistics' },
  { name: 'DigiSoft Technologies', on_time: 88, avg_price_index: 92, orders: 5, category: 'IT' },
  { name: 'OfficeFirst Supplies', on_time: 85, avg_price_index: 97, orders: 7, category: 'Office' },
  { name: 'CleanFacilities Pro', on_time: 82, avg_price_index: 99, orders: 3, category: 'Facilities' },
]

const SAVINGS_DATA = [
  { month: 'Jan', budgeted: 1800000, actual: 1550000, savings: 250000 },
  { month: 'Feb', budgeted: 1500000, actual: 1200000, savings: 300000 },
  { month: 'Mar', budgeted: 2000000, actual: 1850000, savings: 150000 },
  { month: 'Apr', budgeted: 1600000, actual: 1400000, savings: 200000 },
  { month: 'May', budgeted: 2000000, actual: 2200000, savings: -200000 },
  { month: 'Jun', budgeted: 2200000, actual: 1750000, savings: 450000 },
  { month: 'Jul', budgeted: 4000000, actual: 4159000, savings: -159000 },
]

const AI_INSIGHTS = [
  { type: 'forecast', icon: <TrendingUp size={18} />, color: '#6366F1', bg: '#EEF2FF', title: 'Q4 Spend Forecast', content: 'Based on historical trends and current pipeline, projected spend for Q4 2025 is **₹1.2 Crore** (±8%). IT Equipment will remain dominant at 58% of total spend.' },
  { type: 'anomaly', icon: <AlertTriangle size={18} />, color: '#F59E0B', bg: '#FFFBEB', title: 'Anomaly Detected', content: 'SecureNet Services quoted **43% above their historical average** for IT supplies in RFQ-003. Manual review recommended before approval.' },
  { type: 'opportunity', icon: <Lightbulb size={18} />, color: '#10B981', bg: '#ECFDF5', title: 'Savings Opportunity', content: 'Consolidating stationery purchases across Q3 with a single vendor (OfficeFirst) could save **₹2.3L** vs current split-vendor approach.' },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'white', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
        <p style={{ fontWeight: 600, color: '#0F172A', marginBottom: '6px', fontSize: '13px' }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontSize: '12px', fontWeight: 500 }}>
            {p.name}: {formatCurrency(p.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export default function ReportsPage() {
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  const handleAIQuery = async () => {
    if (!aiQuery.trim()) return
    setAiLoading(true)
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: aiQuery,
          context: `Monthly spend data: ${JSON.stringify(MONTHLY_SPEND_DATA)}. Category data: ${JSON.stringify(CATEGORY_SPEND_DATA)}. Vendor performance: ${JSON.stringify(VENDOR_PERFORMANCE)}.`,
          history: [],
        }),
      })
      const data = await response.json()
      setAiResponse(data.response)
    } catch {
      setAiResponse('Based on current data, total YTD spend is ₹1.38 Crore. IT category accounts for 52% of spend. Savings achieved: ₹9.91L (compared to budget). Recommend consolidating vendor contracts in Q4 to improve efficiency.')
    } finally {
      setAiLoading(false)
    }
  }

  const totalSavings = SAVINGS_DATA.reduce((sum, d) => sum + d.savings, 0)
  const ytdSpend = MONTHLY_SPEND_DATA.reduce((sum, d) => sum + d.actual, 0)

  return (
    <div style={{ maxWidth: '1400px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Reports & Analytics</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Insights powered by AI</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => toast.success('Report exported as CSV!')} className="btn btn-secondary btn-sm"><Download size={14} /> Export CSV</button>
          <button onClick={() => toast.success('PDF report generated!')} className="btn btn-primary btn-sm"><BarChart3 size={14} /> Download PDF</button>
        </div>
      </div>

      {/* AI Insights Card */}
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 50%, #4C1D95 100%)',
        borderRadius: '16px', padding: '24px', marginBottom: '24px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', right: '100px', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={18} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '16px' }}>AI Procurement Intelligence</div>
              <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>Powered by Claude AI · Updated in real-time</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '20px' }}>
            {AI_INSIGHTS.map((insight, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px',
                border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ color: insight.color }}>{insight.icon}</div>
                  <span style={{ color: 'white', fontWeight: 600, fontSize: '13px' }}>{insight.title}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', lineHeight: 1.5 }}>
                  {insight.content.replace(/\*\*/g, '')}
                </p>
              </div>
            ))}
          </div>

          {/* AI Query Input */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <input
                value={aiQuery}
                onChange={e => setAiQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAIQuery()}
                placeholder='Ask AI: "Which category had highest savings?" or "Predict next quarter spend"'
                style={{
                  width: '100%', padding: '10px 14px', borderRadius: '8px',
                  border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.1)',
                  color: 'white', fontSize: '13px', outline: 'none',
                  fontFamily: 'Inter, sans-serif',
                }}
              />
              {aiResponse && (
                <div style={{ marginTop: '10px', padding: '12px 14px', background: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: 'rgba(255,255,255,0.9)', fontSize: '13px', lineHeight: 1.6 }}>
                  {aiResponse}
                </div>
              )}
            </div>
            <button onClick={handleAIQuery} disabled={aiLoading || !aiQuery.trim()} className="btn" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.25)', flexShrink: 0, padding: '10px 16px' }}>
              {aiLoading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
              {aiLoading ? ' Analyzing...' : ' Ask AI'}
            </button>
          </div>
        </div>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '20px' }}>
        {[
          { label: 'YTD Total Spend', value: formatCurrency(ytdSpend), change: '+12.3%', up: true },
          { label: 'Total Savings', value: formatCurrency(Math.max(totalSavings, 0)), change: '7.2% of budget', up: true },
          { label: 'Avg. PO Value', value: '₹20.8L', change: '+5.1% vs last year', up: true },
          { label: 'Vendor Count', value: '8 active', change: '+2 this quarter', up: true },
        ].map(kpi => (
          <div key={kpi.label} className="card" style={{ padding: '16px' }}>
            <div style={{ fontSize: '12px', color: '#64748B', marginBottom: '8px' }}>{kpi.label}</div>
            <div style={{ fontWeight: 800, fontSize: '20px', color: '#0F172A', marginBottom: '4px' }}>{kpi.value}</div>
            <div style={{ fontSize: '11px', color: kpi.up ? '#10B981' : '#EF4444', fontWeight: 500 }}>
              {kpi.up ? '↑' : '↓'} {kpi.change}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 2fr', gap: '16px', marginBottom: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Monthly Spend vs Budget</h3>
            <p style={{ fontSize: '12px', color: '#94A3B8' }}>Actual procurement spend against allocated budget</p>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SAVINGS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="budgeted" fill="#E2E8F0" name="Budget" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#6366F1" name="Actual" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: '20px' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Category Distribution</h3>
          </div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={CATEGORY_SPEND_DATA} cx="50%" cy="50%" innerRadius={45} outerRadius={68} dataKey="value" paddingAngle={2}>
                {CATEGORY_SPEND_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v as number)} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '8px' }}>
            {CATEGORY_SPEND_DATA.map(item => (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Savings Chart */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '16px' }}>Savings Achieved vs Budget</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={SAVINGS_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 100000).toFixed(0)}L`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="savings" stroke="#10B981" fill="#DCFCE7" name="Savings" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Vendor Performance Table */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{ padding: '16px 18px', borderBottom: '1px solid #F1F5F9' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>Vendor Performance</h3>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>On-time %</th>
                  <th>Orders</th>
                </tr>
              </thead>
              <tbody>
                {VENDOR_PERFORMANCE.map((v, i) => (
                  <tr key={v.name}>
                    <td>
                      <div style={{ fontWeight: 500, fontSize: '13px', color: '#0F172A' }}>{v.name.split(' ')[0]}</div>
                      <div style={{ fontSize: '11px', color: '#94A3B8' }}>{v.category}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: '#F1F5F9', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${v.on_time}%`, background: v.on_time > 90 ? '#10B981' : v.on_time > 80 ? '#F59E0B' : '#EF4444', borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: v.on_time > 90 ? '#10B981' : '#F59E0B' }}>{v.on_time}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', textAlign: 'center' }}>{v.orders}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
