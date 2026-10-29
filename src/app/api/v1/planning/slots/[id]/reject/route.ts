import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}))
  const slot = database.slots.find((s) => s.id === params.id)
  if (slot) {
    slot.status = 'rejected' as any
    database.audit.unshift({
      id: `aud-${Date.now()}`,
      action: 'REJECT_SCHEDULE_SLOT',
      target: `${slot.id} (${slot.tailNumber}) - Reason: ${body.reason || 'Operational priority'}`,
      user: 'commander',
      time: 'Just now',
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(slot)
  }
  return NextResponse.json({ detail: 'Slot not found' }, { status: 404 })
}
