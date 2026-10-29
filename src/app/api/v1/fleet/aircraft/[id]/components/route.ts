import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id
  const aircraft = database.fleet.find(
    (a) => a.id === id || a.tail === id || a.tailNumber === id
  )

  if (!aircraft) {
    return NextResponse.json([])
  }

  return NextResponse.json(aircraft.components || [])
}
