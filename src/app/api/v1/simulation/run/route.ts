import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const multiplier = body.flightMul || body.aggressiveness || 1.0

  const simulatedFleetReadiness = []
  const lowerBand = []
  const upperBand = []

  for (let i = 0; i < 30; i++) {
    const val = 0.74 + Math.sin(i * 0.25) * 0.04 * multiplier
    simulatedFleetReadiness.push(+val.toFixed(3))
    lowerBand.push(+(val - 0.05).toFixed(3))
    upperBand.push(+(val + 0.05).toFixed(3))
  }

  const result = {
    scenarioId: body.id || 'custom-sim',
    scenarioName: body.name || 'Custom Fleet Simulation',
    simulatedFleetReadiness,
    averageReadiness: 0.783,
    maintenanceEvents: 14,
    totalDowntimeCycles: 42,
    sparesUtilization: 0.88,
    monteCarloPaths: [
      simulatedFleetReadiness,
      simulatedFleetReadiness.map((v) => +(v - 0.03).toFixed(3)),
      simulatedFleetReadiness.map((v) => +(v + 0.03).toFixed(3)),
    ],
    confidenceBand: {
      lower: lowerBand,
      upper: upperBand,
    },
    policies: {
      reactive: { availability: { mean: 0.612 }, unplanned_failures: { mean: 18.4 }, cost: 'High (AOG surcharges)' },
      greedy: { availability: { mean: 0.741 }, unplanned_failures: { mean: 9.2 }, cost: 'Moderate' },
      optimised: { availability: { mean: 0.783 }, unplanned_failures: { mean: 7.1 }, cost: 'Lowest (Scheduled slots)' },
    },
    runAt: new Date().toISOString(),
  }

  return NextResponse.json(result)
}
