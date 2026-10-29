import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const alarm = database.alarms.find(
    (a) => a.id === params.id || a.id.toLowerCase() === params.id.toLowerCase()
  ) || database.alarms[0]

  return NextResponse.json(alarm)
}
