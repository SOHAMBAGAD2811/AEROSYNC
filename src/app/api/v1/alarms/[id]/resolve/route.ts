import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}))
  const alarm = database.alarms.find((a) => a.id === params.id)
  if (alarm) {
    alarm.status = 'resolved'
    database.audit.unshift({
      id: `aud-${Date.now()}`,
      action: 'RESOLVE_ALARM',
      target: `${alarm.id} (${alarm.tailNumber}) - ${body.notes || 'Maintenance Completed'}`,
      user: 'meo',
      time: 'Just now',
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(alarm)
  }
  return NextResponse.json({ detail: 'Alarm not found' }, { status: 404 })
}
