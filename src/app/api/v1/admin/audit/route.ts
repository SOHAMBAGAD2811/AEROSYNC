import { NextResponse } from 'next/server'
import { database } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json(database.audit)
}
