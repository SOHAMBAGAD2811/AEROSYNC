import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const compId = params.id
  const predictions = []

  for (let i = 1; i <= 60; i++) {
    const cycle = 80 + i
    const rulPoint = Math.max(1, 120 - i * 1.5 + Math.sin(i * 0.5) * 2)
    predictions.push({
      id: `pred-${i}`,
      componentId: compId,
      aircraftId: 'tail-1',
      predictionTimestamp: new Date(Date.now() - (60 - i) * 86400000).toISOString(),
      cycle,
      rulPoint: +rulPoint.toFixed(1),
      rulLower10: +Math.max(1, rulPoint - 8).toFixed(1),
      rulUpper90: +(rulPoint + 10).toFixed(1),
      modelVersion: 'flare-rul-histgbm-v1',
      confidence: 0.9,
      shapDrivers: [
        { feature: 'sensor_11', shapValue: 0.62, featureValue: 554.2, description: 'Ps30 HPC pressure' },
        { feature: 'sensor_4', shapValue: 0.31, featureValue: 1412.8, description: 'T50 LPT temperature' },
      ],
      isSynthetic: true,
    })
  }

  return NextResponse.json({
    predictions,
    alarmThreshold: 25,
  })
}
