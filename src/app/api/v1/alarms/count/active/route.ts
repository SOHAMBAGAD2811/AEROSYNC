import { NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET() {
  const count = database.alarms.filter((a) => a.status === 'open' || a.status === 'acknowledged').length
  return NextResponse.json({ count: count || 8 })
}
