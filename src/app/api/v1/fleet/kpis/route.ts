import { NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'
import { AircraftStatus } from '@/types'

export async function GET() {
  const ready = database.fleet.filter((a) => a.status === AircraftStatus.MissionReady).length
  const maintenance = database.fleet.filter((a) => a.status === AircraftStatus.InMaintenance).length
  const grounded = database.fleet.filter((a) => a.status === AircraftStatus.Grounded).length
  const alarms = database.fleet.filter((a) => a.status === AircraftStatus.Alarm).length
  const total = database.fleet.length

  return NextResponse.json({
    missionReady: ready,
    inMaintenance: maintenance,
    grounded,
    activeAlarms: alarms,
    totalAircraft: total,
    readinessRate: +(ready / total).toFixed(3),
    isSynthetic: true,
    timestamp: new Date().toISOString(),
  })
}
