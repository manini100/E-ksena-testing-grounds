// supabase/functions/get-livekit-token/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

// Create HMAC-SHA256 signature for JWT
async function createHMAC(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message))
  return btoa(String.fromCharCode(...new Uint8Array(signature)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
}

// Create JWT token
async function createJWT(header: object, payload: object, secret: string): Promise<string> {
  const headerEncoded = btoa(JSON.stringify(header))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
  
  const payloadEncoded = btoa(JSON.stringify(payload))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "")
  
  const message = `${headerEncoded}.${payloadEncoded}`
  const signature = await createHMAC(message, secret)
  
  return `${message}.${signature}`
}

serve(async (req: Request) => {
  try {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
      return new Response('ok', {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      })
    }

    const { roomName, participantName } = await req.json()

    // Validate required fields
    if (!roomName || !participantName) {
      return new Response(
        JSON.stringify({ error: 'Missing roomName or participantName' }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    // Get LiveKit credentials from environment variables
    const apiKey = Deno.env.get('LIVEKIT_API_KEY')
    const apiSecret = Deno.env.get('LIVEKIT_API_SECRET')

    if (!apiKey || !apiSecret) {
      console.error('[ERROR] Missing LIVEKIT_API_KEY or LIVEKIT_API_SECRET environment variables')
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      )
    }

    // Create JWT token for LiveKit
    const now = Math.floor(Date.now() / 1000)
    const header = { alg: "HS256", typ: "JWT" }
    const payload = {
      sub: participantName,
      iss: apiKey,
      iat: now,
      exp: now + 3600, // Token valid for 1 hour
      nbf: now - 5,
      grants: {
        identity: participantName,
        name: participantName,
        metadata: "",
        state: "active",
        grants: {
          roomJoin: true,
          room: roomName,
          canPublish: true,
          canPublishData: true,
          canSubscribe: true
        }
      }
    }

    const token = await createJWT(header, payload, apiSecret)

    console.log(`[LIVEKIT] Token generated for participant ${participantName} in room ${roomName}`)

    return new Response(
      JSON.stringify({ token: token }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      }
    )
  } catch (error) {
    console.error('[ERROR] Failed to generate LiveKit token:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate token', details: (error as Error).message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    )
  }
})
