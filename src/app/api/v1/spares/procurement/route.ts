import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  return NextResponse.json({
    items: database.procurement,
    total: database.procurement.length,
    page: 1,
    pageSize: 50,
    totalPages: 1,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const newOrder = {
    id: `PO-2026-${String(Math.floor(Math.random() * 9000 + 1000))}`,
    partId: body.partId || 'sp-1',
    partNumber: body.partNumber || body.part || 'ENG-PART-01',
    partName: body.partName || body.desc || 'Aviation Spare Part',
    part: body.partNumber || body.part || 'ENG-PART-01',
    desc: body.partName || body.desc || 'Aviation Spare Part',
    subsystem: body.subsystem || 'Aviation Subsystem',
    quantity: body.quantity || body.qty || 1,
    qty: body.quantity || body.qty || 1,
    unit: body.unit || 'EA',
    unitCost: body.unitCost || 100000,
    totalCost: (body.quantity || body.qty || 1) * (body.unitCost || 100000),
    totalInr: (body.quantity || body.qty || 1) * (body.unitCost || 100000),
    currency: 'INR',
    status: 'pending' as const,
    urgency: body.urgency || 'high',
    supplier: body.supplier || 'HAL Bengaluru',
    supplierType: body.supplierType || 'Domestic HAL',
    baseDepot: body.baseDepot || 'Ambala AFB',
    linkedTail: body.linkedTail || 'A-001',
    expectedDelivery: body.expectedDelivery || '2026-11-20',
    expectedDeliveryDate: body.expectedDelivery || '2026-11-20',
    requestedBy: body.requestedBy || 'Logistics Officer',
    date: new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  }

  database.procurement.unshift(newOrder)
  database.audit.unshift({
    id: `aud-${Date.now()}`,
    action: 'CREATE_PROCUREMENT_PO',
    target: `${newOrder.id} (${newOrder.partNumber})`,
    user: 'logistics',
    time: 'Just now',
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json(newOrder, { status: 201 })
}
