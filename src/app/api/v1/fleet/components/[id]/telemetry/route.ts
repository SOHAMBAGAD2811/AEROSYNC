import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const compId = params.id
  const { searchParams } = new URL(req.url)
  const limit = parseInt(searchParams.get('limit') || '50', 10)

  const telemetry = []
  const now = Date.now()

  for (let i = limit; i >= 1; i--) {
    telemetry.push({
      id: `tel-${i}`,
      aircraftId: 'tail-1',
      componentId: compId,
      sensorName: 'sensor_11',
      value: +(550 + Math.sin(i * 0.2) * 8 + (limit - i) * 0.15).toFixed(2),
      unit: 'psia',
      timestamp: new Date(now - i * 60000).toISOString(),
      cycle: 150 - i,
      isAnomaly: i < 5,
      isSynthetic: true,
    })
  }

  return NextResponse.json(telemetry)
}
