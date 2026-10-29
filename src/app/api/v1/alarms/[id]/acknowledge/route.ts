import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const alarm = database.alarms.find((a) => a.id === params.id)
  if (alarm) {
    alarm.status = 'acknowledged'
    database.audit.unshift({
      id: `aud-${Date.now()}`,
      action: 'ACKNOWLEDGE_ALARM',
      target: `${alarm.id} (${alarm.tailNumber})`,
      user: 'meo',
      time: 'Just now',
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json(alarm)
  }
  return NextResponse.json({ detail: 'Alarm not found' }, { status: 404 })
}
