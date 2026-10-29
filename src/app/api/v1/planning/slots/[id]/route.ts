import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const slot = database.slots.find((s) => s.id === params.id)
  if (!slot) {
    return NextResponse.json({ detail: 'Slot not found' }, { status: 404 })
  }
  return NextResponse.json(slot)
}
