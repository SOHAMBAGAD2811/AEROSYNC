import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status')
  const search = searchParams.get('search')?.toLowerCase()

  let results = [...database.fleet]

  if (status && status !== 'all') {
    results = results.filter((a) => a.status === status)
  }

  if (search) {
    results = results.filter(
      (a) =>
        a.tail.toLowerCase().includes(search) ||
        a.model.toLowerCase().includes(search) ||
        a.base.toLowerCase().includes(search)
    )
  }

  // Format matching FastAPI AircraftRead
  const mapped = results.map((a) => ({
    id: a.id,
    tail_number: a.tail,
    tail: a.tail,
    model: a.model,
    aircraft_type: a.type,
    base: a.base,
    base_code: a.baseCode,
    status: a.status,
    flight_hours_total: a.flightHours,
    totalFlightHours: a.flightHours,
    totalCycles: a.totalCycles,
    rulPoint: a.rulPoint,
    rulLower: a.rulLower,
    rulUpper: a.rulUpper,
    lastInspection: a.lastInspection,
    nextInspection: a.nextInspection,
    engineSerial: a.engineSerial,
    data_source_tag: 'synthetic',
  }))

  return NextResponse.json(mapped)
}
