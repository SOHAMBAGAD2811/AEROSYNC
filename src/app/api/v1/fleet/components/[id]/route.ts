import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const compId = params.id

  for (const ac of database.fleet) {
    const comp = ac.components.find((c: any) => c.id === compId || c.serialNumber === compId)
    if (comp) {
      return NextResponse.json(comp)
    }
  }

  return NextResponse.json({ detail: 'Component not found' }, { status: 404 })
}
