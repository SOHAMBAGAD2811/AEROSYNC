import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const order = database.workOrders.find((w) => w.id === params.id)
  if (!order) {
    return NextResponse.json({ detail: 'Work order not found' }, { status: 404 })
  }
  return NextResponse.json(order)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}))
  const order = database.workOrders.find((w) => w.id === params.id)
  if (order) {
    Object.assign(order, body, { updatedAt: new Date().toISOString() })
    return NextResponse.json(order)
  }
  return NextResponse.json({ detail: 'Work order not found' }, { status: 404 })
}
