import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const lowStock = searchParams.get('lowStock') === 'true'
  const search = searchParams.get('search')?.toLowerCase()

  let parts = [...database.spares]

  if (lowStock) {
    parts = parts.filter((p) => p.quantityOnHand <= p.reorderPoint)
  }

  if (search) {
    parts = parts.filter(
      (p) =>
        p.partNumber.toLowerCase().includes(search) ||
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
    )
  }

  return NextResponse.json({
    items: parts,
    total: parts.length,
    page: 1,
    pageSize: 50,
    totalPages: 1,
  })
}
