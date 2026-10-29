import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const days = parseInt(searchParams.get('days') || '30', 10)

  const forecast = []
  const startDate = new Date('2026-10-20')

  for (let i = 0; i < days; i++) {
    const d = new Date(startDate)
    d.setDate(d.getDate() + i)
    const baseVal = 72 + Math.sin(i * 0.3) * 4
    forecast.push({
      date: d.toISOString().split('T')[0],
      baseline: +(baseVal - 8).toFixed(1),
      optimistic: +(baseVal + 6).toFixed(1),
      pessimistic: +(baseVal - 14).toFixed(1),
      cpsat: +(baseVal + 3.5).toFixed(1),
    })
  }

  return NextResponse.json(forecast)
}
