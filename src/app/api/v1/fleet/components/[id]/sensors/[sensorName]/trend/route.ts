import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string; sensorName: string } }
) {
  const sensorName = params.sensorName || 'sensor_11'
  const readings = []
  const now = Date.now()

  for (let i = 100; i >= 1; i--) {
    const cycle = 120 - i
    const baseVal = sensorName.includes('11') ? 550 : sensorName.includes('2') ? 640 : 1400
    readings.push({
      cycle,
      value: +(baseVal + Math.sin(cycle * 0.1) * 6 + cycle * 0.08).toFixed(2),
      timestamp: new Date(now - i * 180000).toISOString(),
    })
  }

  return NextResponse.json({
    sensorName,
    readings,
  })
}
