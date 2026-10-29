import { NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET() {
  const low = database.spares.filter((p) => p.quantityOnHand <= p.reorderPoint)
  return NextResponse.json(low)
}
