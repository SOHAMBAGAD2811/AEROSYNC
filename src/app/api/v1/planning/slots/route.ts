import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  return NextResponse.json({
    items: database.slots,
    total: database.slots.length,
    page: 1,
    pageSize: 50,
    totalPages: 1,
  })
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const newSlot = {
    id: `SCH-${Math.floor(Math.random() * 900 + 100)}`,
    aircraftId: body.aircraftId || 'tail-1',
    tailNumber: body.tailNumber || body.tail || 'A-001',
    tail: body.tailNumber || body.tail || 'A-001',
    model: body.model || 'Dassault Rafale F3R',
    component: body.component || 'Turbofan Engine #1',
    slotDate: body.slotDate || new Date().toISOString().split('T')[0],
    scheduledStart: body.scheduledStart || new Date().toISOString(),
    scheduledEnd: body.scheduledEnd || new Date().toISOString(),
    facility: body.facility || 'Ambala AFB · Hangar Alpha 1',
    hangarBay: body.hangarBay || 'Hangar Alpha 1',
    baseCode: body.baseCode || 'AMB',
    status: 'draft' as const,
    durationDays: body.durationDays || 2,
    rulLeadDays: body.rulLeadDays || 8,
    penalty: 0.0,
    missionConflict: false,
    urgency: body.urgency || 'high',
    workOrderIds: body.workOrderIds || [],
    approvedBy: null,
    createdAt: new Date().toISOString(),
  }

  database.slots.unshift(newSlot)
  database.audit.unshift({
    id: `aud-${Date.now()}`,
    action: 'PROPOSE_SCHEDULE_SLOT',
    target: `${newSlot.id} (${newSlot.tailNumber})`,
    user: 'meo',
    time: 'Just now',
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json(newSlot, { status: 201 })
}
