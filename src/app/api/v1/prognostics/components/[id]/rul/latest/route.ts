import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const compId = params.id
  return NextResponse.json({
    id: `pred-latest`,
    componentId: compId,
    aircraftId: 'tail-1',
    predictionTimestamp: new Date().toISOString(),
    cycle: 142,
    rulPoint: 18.0,
    rulLower10: 10.0,
    rulUpper90: 28.0,
    modelVersion: 'flare-rul-histgbm-v1',
    confidence: 0.92,
    shapDrivers: [
      { feature: 'sensor_11', shapValue: 0.62, featureValue: 554.2, description: 'Static pressure at HPC outlet Ps30' },
      { feature: 'sensor_4', shapValue: 0.31, featureValue: 1412.8, description: 'Total temp at LPT outlet T50' },
      { feature: 'sensor_12', shapValue: 0.18, featureValue: 8.41, description: 'Bypass ratio airflow deviation' },
    ],
    isSynthetic: true,
  })
}
