import { NextRequest, NextResponse } from 'next/server'
import { USERS } from '@/lib/mock-data'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    try {
      const parts = token.split('.')
      if (parts.length >= 2) {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf-8'))
        const user = USERS.find((u) => u.username === payload.username) || {
          id: payload.sub,
          username: payload.username,
          role: payload.role || 'commander',
          name: payload.name || 'IAF Officer',
          email: `${payload.username}@iaf.aero`,
          unit: 'Western Air Command',
        }
        return NextResponse.json(user)
      }
    } catch {
      // fallback
    }
  }

  return NextResponse.json(USERS[0])
}
