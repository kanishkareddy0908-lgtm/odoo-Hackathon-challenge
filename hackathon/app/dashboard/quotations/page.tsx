'use client'

import { useState } from 'react'
import { DEMO_QUOTATIONS, DEMO_RFQS, DEMO_VENDORS } from '@/lib/seed-data'
import { formatCurrency } from '@/lib/utils'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { Trophy, TrendingDown, TrendingUp, Award, CheckCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function QuotationsPage() {
  const [selectedRFQ, setSelectedRFQ] = useState(DEMO_RFQS[0].id)
  const [selectedWinner, setSelectedWinner] = useState<string | null>(null)
  const [confirming, setConfirming] = useState(false)
  const [winnerConfirmId, setWinnerConfirmId] = useState<string | null>(null)

  const rfqQuotations = DEMO_QUOTATIONS.filter(q => q.rfq_id === selectedRFQ)
  const rfq = DEMO_RFQS.find(r => r.id === selectedRFQ)

  // Find min/max per item for color coding
  const itemPriceMap: Record<string, { min: number; max: number }> = {}
  if (rfq) {
    rfq.items.forEach(item => {
      const prices = rfqQuotations.map(q => {
        const qi = q.items.find(i => i.item_id === item.id)
        return qi?.unit_price || 0
      }).filter(p => p > 0)
      if (prices.length) {
        itemPriceMap[item.id] = { min: Math.min(...prices), max: Math.max(...prices) }
      }
    })
  }

  const getPriceColor = (itemId: string, price: number) => {
    const range = itemPriceMap[itemId]
    if (!range || price === 0) return { bg: '#F8FAFC', color: '#334155' }
    if (price === range.min) return { bg: '#DCFCE7', color: '#15803D' }
    if (price === range.max) return { bg: '#FEE2E2', color: '#B91C1C' }
    return { bg: '#FEF3C7', color: '#B45309' }
  }

  const getVendorScores = (q: typeof rfqQuotations[0]) => {
    const vendor = DEMO_VENDORS.find(v => v.id === q.vendor_id)
    const maxTotal = Math.max(...rfqQuotations.map(qq => qq.total))
    const minTotal = Math.min(...rfqQuotations.map(qq => qq.total))
    const maxDelivery = Math.max(...rfqQuotations.map(qq => qq.delivery_days))
    const priceScore = Math.round(((maxTotal - q.total) / (maxTotal - minTotal || 1)) * 100) || 50
    const deliveryScore = Math.round(((maxDelivery - q.delivery_days) / (maxDelivery || 1)) * 100) || 50
    const qualityScore = Math.round((vendor?.rating || 4) / 5 * 100)
    const performanceScore = 80
    return { priceScore, deliveryScore, qualityScore, performanceScore }
  }

  const radarData = rfq?.items.slice(0, 5).map((item, i) => ({
    subject: item.name.slice(0, 15),
    ...rfqQuotations.reduce((acc, q) => {
      const vendor = DEMO_VENDORS.find(v => v.id === q.vendor_id)
      const qi = q.items.find(i => i.item_id === item.id)
      acc[vendor?.company_name?.split(' ')[0] || 'V'] = qi?.unit_price || 0
      return acc
    }, {} as Record<string, number>)
  })) || []

  const handleSelectWinner = async (vendorId: string) => {
    setConfirming(true)
    await new Promise(r => setTimeout(r, 800))
    setSelectedWinner(vendorId)
    setWinnerConfirmId(null)
    setConfirming(false)
    const vendor = DEMO_VENDORS.find(v => v.id === vendorId)
    toast.success(`🎉 ${vendor?.company_name} selected as winner! Purchase Order will be generated.`)
  }

  const VENDOR_COLORS = ['#6366F1', '#10B981', '#F59E0B', '#3B82F6']

  return (
    <div style={{ maxWidth: '1400px', animation: 'fadeIn 0.4s ease' }}>
      <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A' }}>Quotation Comparison</h1>
          <p style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>Compare vendor quotes side-by-side</p>
        </div>
        <select className="input" value={selectedRFQ} onChange={e => setSelectedRFQ(e.target.value)} style={{ width: 'auto', minWidth: '280px' }}>
          {DEMO_RFQS.map(r => <option key={r.id} value={r.id}>{r.title}</option>)}
        </select>
      </div>

      {rfqQuotations.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
          <div style={{ fontWeight: 600, fontSize: '16px', color: '#0F172A', marginBottom: '6px' }}>No quotes received yet</div>
          <div style={{ color: '#64748B', fontSize: '14px' }}>Quotes will appear here once vendors submit them.</div>
        </div>
      ) : (
        <>
          {/* Color Legend */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>Price indicators:</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', background: '#DCFCE7', borderRadius: '9999px', fontSize: '12px', color: '#15803D', fontWeight: 600 }}>✓ Lowest price</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', background: '#FEF3C7', borderRadius: '9999px', fontSize: '12px', color: '#B45309', fontWeight: 600 }}>~ Mid range</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', background: '#FEE2E2', borderRadius: '9999px', fontSize: '12px', color: '#B91C1C', fontWeight: 600 }}>↑ Highest price</span>
          </div>

          {/* Comparison Table */}
          <div className="card" style={{ overflow: 'hidden', marginBottom: '20px' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '12px 16px', textAlign: 'left', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', fontSize: '12px', fontWeight: 600, color: '#64748B', minWidth: '180px', position: 'sticky', left: 0, zIndex: 2 }}>
                      Line Item
                    </th>
                    {rfqQuotations.map((q, idx) => {
                      const vendor = DEMO_VENDORS.find(v => v.id === q.vendor_id)
                      const scores = getVendorScores(q)
                      const isWinner = selectedWinner === q.vendor_id
                      return (
                        <th key={q.id} style={{ padding: '12px 16px', textAlign: 'center', background: isWinner ? '#EEF2FF' : '#F8FAFC', borderBottom: '1px solid #E2E8F0', minWidth: '200px', borderLeft: isWinner ? `3px solid ${VENDOR_COLORS[idx]}` : '1px solid #E2E8F0' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            {isWinner && (
                              <div style={{ background: '#6366F1', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Trophy size={10} /> WINNER
                              </div>
                            )}
                            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${VENDOR_COLORS[idx]}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: VENDOR_COLORS[idx], fontWeight: 700 }}>
                              {vendor?.company_name.charAt(0)}
                            </div>
                            <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>{vendor?.company_name}</div>
                            <div style={{ fontSize: '11px', color: '#94A3B8' }}>★ {vendor?.rating} · {vendor?.category}</div>
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {rfq?.items.map(item => (
                    <tr key={item.id}>
                      <td style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9', position: 'sticky', left: 0, background: 'white', zIndex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#0F172A', fontSize: '13px' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#94A3B8' }}>Qty: {item.quantity} {item.unit}</div>
                      </td>
                      {rfqQuotations.map((q, idx) => {
                        const qi = q.items.find(i => i.item_id === item.id)
                        const priceStyle = getPriceColor(item.id, qi?.unit_price || 0)
                        return (
                          <td key={q.id} style={{ padding: '10px 16px', borderBottom: '1px solid #F1F5F9', textAlign: 'center', borderLeft: '1px solid #F1F5F9' }}>
                            {qi ? (
                              <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '6px 12px', borderRadius: '8px', background: priceStyle.bg }}>
                                <span style={{ fontWeight: 700, fontSize: '13px', color: priceStyle.color }}>₹{qi.unit_price.toLocaleString('en-IN')}</span>
                                <span style={{ fontSize: '10px', color: priceStyle.color }}>Total: ₹{qi.total_price.toLocaleString('en-IN')}</span>
                                <span style={{ fontSize: '10px', color: '#94A3B8' }}>{qi.lead_time_days}d lead</span>
                              </div>
                            ) : (
                              <span style={{ color: '#CBD5E1', fontSize: '12px' }}>N/A</span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}

                  {/* Summary Row */}
                  <tr style={{ background: '#F8FAFC' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0F172A', position: 'sticky', left: 0, background: '#F8FAFC', zIndex: 1 }}>
                      Grand Total
                    </td>
                    {rfqQuotations.map((q, idx) => {
                      const minTotal = Math.min(...rfqQuotations.map(qq => qq.total))
                      const isLowest = q.total === minTotal
                      const scores = getVendorScores(q)
                      return (
                        <td key={q.id} style={{ padding: '12px 16px', textAlign: 'center', borderLeft: '1px solid #E2E8F0' }}>
                          <div style={{ fontWeight: 800, fontSize: '15px', color: isLowest ? '#15803D' : '#0F172A', marginBottom: '4px' }}>
                            {formatCurrency(q.total)}
                            {isLowest && <span style={{ fontSize: '11px', background: '#DCFCE7', color: '#15803D', padding: '1px 6px', borderRadius: '9999px', marginLeft: '6px' }}>LOWEST</span>}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B', marginBottom: '8px' }}>{q.delivery_days} days delivery</div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginBottom: '10px', fontSize: '11px' }}>
                            <div style={{ background: '#EEF2FF', borderRadius: '4px', padding: '3px 6px', color: '#4338CA' }}>Price: {scores.priceScore}%</div>
                            <div style={{ background: '#ECFDF5', borderRadius: '4px', padding: '3px 6px', color: '#15803D' }}>Speed: {scores.deliveryScore}%</div>
                          </div>
                          {!selectedWinner ? (
                            <button
                              onClick={() => setWinnerConfirmId(q.vendor_id)}
                              style={{
                                width: '100%', padding: '6px 12px', borderRadius: '6px',
                                background: VENDOR_COLORS[idx], color: 'white', border: 'none',
                                cursor: 'pointer', fontSize: '12px', fontWeight: 600,
                              }}>
                              Select Winner
                            </button>
                          ) : selectedWinner === q.vendor_id ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#15803D', fontWeight: 600, fontSize: '12px' }}>
                              <CheckCircle size={14} /> Selected
                            </div>
                          ) : null}
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Radar Chart */}
          {rfqQuotations.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="card" style={{ padding: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A', marginBottom: '16px' }}>Vendor Performance Radar</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <RadarChart data={[
                    { metric: 'Price', ...rfqQuotations.reduce((acc, q, i) => { const s = getVendorScores(q); acc[DEMO_VENDORS.find(v => v.id === q.vendor_id)?.company_name?.split(' ')[0] || `V${i}`] = s.priceScore; return acc }, {} as Record<string, number>) },
                    { metric: 'Delivery', ...rfqQuotations.reduce((acc, q, i) => { const s = getVendorScores(q); acc[DEMO_VENDORS.find(v => v.id === q.vendor_id)?.company_name?.split(' ')[0] || `V${i}`] = s.deliveryScore; return acc }, {} as Record<string, number>) },
                    { metric: 'Quality', ...rfqQuotations.reduce((acc, q, i) => { const s = getVendorScores(q); acc[DEMO_VENDORS.find(v => v.id === q.vendor_id)?.company_name?.split(' ')[0] || `V${i}`] = s.qualityScore; return acc }, {} as Record<string, number>) },
                    { metric: 'History', ...rfqQuotations.reduce((acc, q, i) => { const s = getVendorScores(q); acc[DEMO_VENDORS.find(v => v.id === q.vendor_id)?.company_name?.split(' ')[0] || `V${i}`] = s.performanceScore; return acc }, {} as Record<string, number>) },
                  ]}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    {rfqQuotations.map((q, i) => {
                      const vendor = DEMO_VENDORS.find(v => v.id === q.vendor_id)
                      return (
                        <Radar key={q.id} name={vendor?.company_name?.split(' ')[0] || `V${i}`}
                          dataKey={vendor?.company_name?.split(' ')[0] || `V${i}`}
                          stroke={VENDOR_COLORS[i]} fill={VENDOR_COLORS[i]} fillOpacity={0.15} />
                      )
                    })}
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <Award size={18} color="#F59E0B" />
                  <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#0F172A' }}>AI Recommendation</h3>
                </div>
                <div style={{ background: 'linear-gradient(135deg, #EEF2FF, #F5F3FF)', borderRadius: '10px', padding: '14px', marginBottom: '14px', border: '1px solid #C7D2FE' }}>
                  <div style={{ fontWeight: 700, color: '#4338CA', fontSize: '14px', marginBottom: '6px' }}>
                    🏆 Recommended: {DEMO_VENDORS.find(v => v.id === rfqQuotations[0].vendor_id)?.company_name}
                  </div>
                  <p style={{ fontSize: '13px', color: '#4338CA', lineHeight: 1.5 }}>
                    Based on weighted scoring (40% price + 30% delivery + 30% quality), this vendor achieves the highest overall score of 87/100.
                    They offer the <strong>lowest price</strong> with <strong>1-year onsite warranty</strong>.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
                  {rfqQuotations.map((q, i) => {
                    const vendor = DEMO_VENDORS.find(v => v.id === q.vendor_id)
                    const scores = getVendorScores(q)
                    const overall = Math.round(scores.priceScore * 0.4 + scores.deliveryScore * 0.3 + scores.qualityScore * 0.3)
                    return (
                      <div key={q.id} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: `${VENDOR_COLORS[i]}20`, color: VENDOR_COLORS[i], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px', flexShrink: 0 }}>
                          {i + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A' }}>{vendor?.company_name}</div>
                          <div style={{ height: '6px', borderRadius: '3px', background: '#F1F5F9', marginTop: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${overall}%`, background: VENDOR_COLORS[i], borderRadius: '3px', transition: 'width 1s ease' }} />
                          </div>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '14px', color: VENDOR_COLORS[i] }}>{overall}/100</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Confirm Winner Modal */}
      {winnerConfirmId && (
        <div className="modal-overlay" onClick={() => setWinnerConfirmId(null)}>
          <div className="modal" style={{ width: '400px', padding: '28px' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>🏆</div>
              <h3 style={{ fontWeight: 700, fontSize: '18px', color: '#0F172A', marginBottom: '8px' }}>Select Winner?</h3>
              <p style={{ fontSize: '14px', color: '#64748B' }}>
                Selecting <strong>{DEMO_VENDORS.find(v => v.id === winnerConfirmId)?.company_name}</strong> as the winner will approve their quotation and auto-generate a Purchase Order.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setWinnerConfirmId(null)} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
              <button onClick={() => handleSelectWinner(winnerConfirmId)} disabled={confirming} className="btn btn-primary" style={{ flex: 1 }}>
                {confirming ? <><Loader2 size={15} className="animate-spin" /> Processing...</> : 'Confirm Winner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
