import { NextResponse } from 'next/server'

export async function GET() {
  const scenarios = [
    {
      id: 'scen-1',
      name: 'Baseline 30-Day Operational Regime',
      description: 'Standard peacetime sortie rate with reactive scheduling.',
      maintenanceInterval: 50,
      aggressiveness: 0.5,
      spareBufferDays: 14,
      fleetSize: 100,
    },
    {
      id: 'scen-2',
      name: 'High-Tempo Surge Deployment',
      description: '2x sortie frequency with CP-SAT proactive hangar slot optimization.',
      maintenanceInterval: 35,
      aggressiveness: 0.85,
      spareBufferDays: 28,
      fleetSize: 100,
    },
  ]
  return NextResponse.json(scenarios)
}
