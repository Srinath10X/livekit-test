import { NextResponse } from 'next/server'
import { AccessToken } from 'livekit-server-sdk'
import { joinSchema } from '@/lib/schemas'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)

  const parsed = joinSchema.safeParse({
    room: searchParams.get('room') ?? undefined,
    username: searchParams.get('username') ?? undefined,
  })

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid input' },
      { status: 400 },
    )
  }

  const apiKey = process.env.LIVEKIT_API_KEY
  const apiSecret = process.env.LIVEKIT_API_SECRET
  const serverUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL

  if (!apiKey || !apiSecret || !serverUrl) {
    return NextResponse.json(
      { error: 'Server is missing LiveKit configuration' },
      { status: 500 },
    )
  }

  const { room, username } = parsed.data

  const at = new AccessToken(apiKey, apiSecret, {
    identity: username,
    name: username,
    ttl: '1h',
  })

  at.addGrant({
    room,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  })

  return NextResponse.json({ token: await at.toJwt(), serverUrl })
}
