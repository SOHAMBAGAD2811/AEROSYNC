import { NextResponse } from 'next/server'

export async function GET() {
  const result = {
    scenarioId: 'scen-latest',
    scenarioName: 'AeroSync CP-SAT Operational Benchmark',
    simulatedFleetReadiness: Array.from({ length: 30 }, (_, i) => +(0.76 + Math.sin(i * 0.2) * 0.03).toFixed(3)),
    averageReadiness: 0.783,
    maintenanceEvents: 12,
    totalDowntimeCycles: 36,
    sparesUtilization: 0.89,
    monteCarloPaths: [],
    confidenceBand: {
      lower: Array.from({ length: 30 }, () => 0.72),
      upper: Array.from({ length: 30 }, () => 0.82),
    },
    runAt: new Date().toISOString(),
  }
  return NextResponse.json([result])
}
