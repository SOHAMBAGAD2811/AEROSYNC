import { NextRequest, NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const subset = searchParams.get('subset') || 'FD001'
  const limitUnits = parseInt(searchParams.get('limit_units') || '10', 10)

  database.audit.unshift({
    id: `aud-${Date.now()}`,
    action: 'INGEST_CMAPSS_STREAM',
    target: `${subset} (${limitUnits} engines)`,
    user: 'admin',
    time: 'Just now',
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({
    status: 'success',
    subset,
    units_loaded: limitUnits,
    rows_loaded: limitUnits * 206,
    quality_score: 99.4,
    message: `Ingested ${limitUnits} engine trajectories from ${subset} with 100% Pandera schema validation.`,
  })
}
