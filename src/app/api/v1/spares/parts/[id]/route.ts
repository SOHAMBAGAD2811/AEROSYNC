import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const part = database.spares.find(
    (p) => p.id === params.id || p.partNumber === params.id || p.pn === params.id
  )
  if (!part) {
    return NextResponse.json({ detail: 'Part not found' }, { status: 404 })
  }
  return NextResponse.json(part)
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json().catch(() => ({}))
  const part = database.spares.find(
    (p) => p.id === params.id || p.partNumber === params.id || p.pn === params.id
  )
  if (part) {
    Object.assign(part, body)
    return NextResponse.json(part)
  }
  return NextResponse.json({ detail: 'Part not found' }, { status: 404 })
}
