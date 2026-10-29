import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.toLowerCase()

  let orders = [...database.workOrders]

  if (status && status !== 'all') {
    orders = orders.filter((o) => o.status === status)
  }

  if (search) {
    orders = orders.filter(
      (o) =>
        o.id.toLowerCase().includes(search) ||
        o.tail.toLowerCase().includes(search) ||
        o.scope.toLowerCase().includes(search) ||
        o.description.toLowerCase().includes(search)
    )
  }

  return NextResponse.json({
    items: orders,
    total: orders.length,
    page: 1,
    pageSize: 50,
    totalPages: 1,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const newOrder = {
    id: `WO-2026-${Math.floor(Math.random() * 9000 + 1000)}`,
    aircraftId: body.aircraftId || 'tail-1',
    tailNumber: body.tailNumber || body.tail || 'A-001',
    tail: body.tailNumber || body.tail || 'A-001',
    model: body.model || 'Dassault Rafale F3R',
    component: body.component || 'Turbofan Engine #1',
    component_serial: body.component_serial || 'ENG-SN-0042',
    serial: body.serial || body.component_serial || 'ENG-SN-0042',
    alarmId: body.alarmId || null,
    title: body.title || body.scope || 'Inspection & Rectification',
    scope: body.scope || body.title || 'Inspection & Rectification',
    description: body.description || 'Maintenance directive executed per tech log entry.',
    status: (body.status || 'draft') as any,
    priority: body.priority || 'high',
    priorityNum: 3,
    estimatedDurationHours: body.estimatedDurationHours || (body.durationDays ? body.durationDays * 24 : 48),
    durationDays: body.durationDays || 2,
    assignedBase: body.assignedBase || 'Ambala AFB',
    hangarBay: body.hangarBay || 'Hangar Alpha 1',
    targetDate: body.targetDate || new Date().toISOString().split('T')[0],
    leadOfficer: body.leadOfficer || 'Flight Lt. V. Raghavan',
    approvalLead: body.approvalLead || 'Wing Commander S. Nair',
    partsRequired: body.partsRequired || [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  database.workOrders.unshift(newOrder)
  database.audit.unshift({
    id: `aud-${Date.now()}`,
    action: 'CREATE_WORK_ORDER',
    target: `${newOrder.id} (${newOrder.tailNumber})`,
    user: 'meo',
    time: 'Just now',
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json(newOrder, { status: 201 })
}
