import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const severity = searchParams.get('severity')
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.toLowerCase()

  let list = [...database.alarms]

  if (severity && severity !== 'all') {
    list = list.filter((a) => a.severity.toLowerCase() === severity.toLowerCase())
  }

  if (status && status !== 'all') {
    list = list.filter((a) => a.status.toLowerCase() === status.toLowerCase())
  }

  if (search) {
    list = list.filter(
      (a) =>
        a.tailNumber.toLowerCase().includes(search) ||
        a.componentName.toLowerCase().includes(search) ||
        a.id.toLowerCase().includes(search)
    )
  }

  return NextResponse.json({
    items: list,
    total: list.length,
    page: 1,
    pageSize: 50,
    totalPages: 1,
  })
}
