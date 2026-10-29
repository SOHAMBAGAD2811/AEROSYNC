import { NextRequest, NextResponse } from 'next/server'
import { USERS } from '@/lib/mock-data'

export async function POST(req: NextRequest) {
  let username = ''
  let password = ''

  const contentType = req.headers.get('content-type') || ''
  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => ({}))
    username = body.username || ''
    password = body.password || ''
  } else {
    const formData = await req.formData().catch(() => new FormData())
    username = (formData.get('username') as string) || ''
    password = (formData.get('password') as string) || ''
  }

  const user = USERS.find((u) => u.username.toLowerCase() === username.toLowerCase()) || {
    id: `usr-${username || 'demo'}`,
    username: username || 'demo',
    role: (username as any) || 'commander',
    name: username.toUpperCase(),
    email: `${username}@iaf.aero`,
    unit: 'Western Air Command',
  }

  // Create JWT-like token (header.payload.signature)
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url')
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      username: user.username,
      role: user.role,
      name: user.name,
      exp: Math.floor(Date.now() / 1000) + 86400 * 7,
    })
  ).toString('base64url')
  const signature = 'aerosync_mock_signature'
  const access_token = `${header}.${payload}.${signature}`

  return NextResponse.json({
    access_token,
    token_type: 'bearer',
    user,
  })
}
