import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const order = database.procurement.find((p) => p.id === params.id)
  if (order) {
    order.status = 'approved'
    database.audit.unshift({
      id: `aud-${Date.now()}`,
      action: 'APPROVE_PROCUREMENT_PO',
      target: `${order.id} (${order.partNumber})`,
      user: 'logistics',
      time: 'Just now',
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(order)
  }
  return NextResponse.json({ detail: 'Procurement order not found' }, { status: 404 })
}
