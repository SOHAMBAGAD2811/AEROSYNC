import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const policies = [
    {
      name: 'Reactive Policy',
      availability: 0.612,
      unplannedFailures: 18.4,
      costLevel: 'High (AOG)',
      downtimeDays: 84,
    },
    {
      name: 'Greedy Earliest-Fit',
      availability: 0.741,
      unplannedFailures: 9.2,
      costLevel: 'Moderate',
      downtimeDays: 52,
    },
    {
      name: 'AeroSync CP-SAT (Optimised)',
      availability: 0.783,
      unplannedFailures: 7.1,
      costLevel: 'Lowest (Scheduled slots)',
      downtimeDays: 38,
    },
  ]
  return NextResponse.json(policies)
}
