import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    environment: 'production',
    framework: 'nextjs',
    deployment: 'vercel',
    timestamp: new Date().toISOString(),
    services: {
      prognostics: 'online',
      planner: 'online',
      spares: 'online',
      ingestion: 'online',
      records: 'online',
    },
  })
}
