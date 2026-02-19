# LiveKit Integration Setup Guide

## Overview
LiveKit is integrated as a **Supabase Edge Function** that generates authentication tokens for real-time video/audio communication.

## Directory Structure
```
supabase/
└── functions/
    └── get-livekit-token/
        ├── index.ts          (Main function code)
        └── config.json       (Function configuration)
```

## Setup Steps

### Step 1: Get LiveKit Credentials
1. Sign up at **https://livekit.io**
2. Create a new project/room
3. Copy your:
   - **API Key** (LIVEKIT_API_KEY)
   - **API Secret** (LIVEKIT_API_SECRET)
   - **LiveKit URL** (e.g., `wss://your-livekit-server.livekit.cloud`)

### Step 2: Add Environment Variables to Supabase
1. Go to your **Supabase Dashboard**
2. Navigate to **Project Settings → Edge Functions**
3. Add these secrets:
   - Key: `LIVEKIT_API_KEY` → Value: Your API Key
   - Key: `LIVEKIT_API_SECRET` → Value: Your API Secret

### Step 3: Deploy the Edge Function

**Option A: Deploy from Supabase Dashboard (Recommended - No CLI needed)**
1. Go to your **Supabase Dashboard** (https://app.supabase.com)
2. Select your project
3. Go to **Functions** (left sidebar)
4. Click **Create a new function**
5. Name it: `get-livekit-token`
6. Copy the entire code from `supabase/functions/get-livekit-token/index.ts`
7. Paste it into the editor
8. Click **Deploy**

**Option B: Using Supabase CLI (If you prefer)**

If you want to use the CLI, install it using Homebrew (macOS), Scoop (Windows), or other supported package managers:

**Windows (using Scoop):**
```bash
scoop install supabase

supabase login

supabase functions deploy get-livekit-token
```

**macOS (using Homebrew):**
```bash
brew install supabase/tap/supabase

supabase login

supabase functions deploy get-livekit-token
```

**Linux:**
Follow instructions at: https://github.com/supabase/cli#install-the-cli

**Note:** NPM installation of Supabase CLI is no longer supported. Use one of the package managers above or deploy via Supabase Dashboard.

### Step 4: Use in Your Mobile App
Create a service to call the edge function:

```typescript
// frontend/services/LiveKitService.ts
import { supabase } from './supabaseClient';

export interface LiveKitTokenResponse {
  token: string;
  error?: string;
}

export const getLiveKitToken = async (
  roomName: string,
  participantName: string
): Promise<LiveKitTokenResponse> => {
  try {
    const { data, error } = await supabase.functions.invoke('get-livekit-token', {
      body: {
        roomName,
        participantName,
      },
    });

    if (error) {
      console.error('[LIVEKIT] Error getting token:', error);
      return { token: '', error: error.message };
    }

    return data as LiveKitTokenResponse;
  } catch (err) {
    console.error('[LIVEKIT] Exception getting token:', err);
    return { token: '', error: 'Failed to get token' };
  }
};
```

### Step 5: Install LiveKit Client in Frontend
```bash
cd frontend
npm install livekit-client livekit-react-native
```

### Step 6: Use LiveKit in Your Components
Example usage for a video call screen:

```typescript
// frontend/screens/VideoCallScreen.tsx
import { useEffect, useState } from 'react';
import { Room, Participant, VideoPreset } from 'livekit-client';
import { getLiveKitToken } from '../services/LiveKitService';

export const VideoCallScreen = ({ incidentId, userPhoneNumber }: Props) => {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const LIVEKIT_URL = 'wss://your-livekit-server.livekit.cloud'; // Get from environment

  useEffect(() => {
    const joinRoom = async () => {
      try {
        setLoading(true);
        
        // Get token from edge function
        const tokenResponse = await getLiveKitToken(
          `incident-${incidentId}`,
          userPhoneNumber
        );

        if (tokenResponse.error) {
          throw new Error(tokenResponse.error);
        }

        // Create and join room
        const newRoom = new Room({
          audio: true,
          video: { resolution: VideoPreset.h180 },
        });

        await newRoom.connect(LIVEKIT_URL, tokenResponse.token);
        setRoom(newRoom);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        console.error('[VIDEO CALL] Error joining room:', message);
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    joinRoom();

    return () => {
      room?.disconnect();
    };
  }, [incidentId, userPhoneNumber]);

  if (loading) return <Text>Connecting...</Text>;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <View>
      {/* Add LiveKit video components here */}
      <Text>Connected to incident {incidentId}</Text>
    </View>
  );
};
```

## API Endpoint
**Function Name:** `get-livekit-token`

**Request:**
```json
{
  "roomName": "incident-12345",
  "participantName": "+1234567890"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## Troubleshooting

### Edge Function Not Found
- Make sure function is deployed in Supabase
- Check function name is exactly `get-livekit-token`
- Verify authentication headers if needed

### Invalid Credentials Error
- Check `LIVEKIT_API_KEY` and `LIVEKIT_API_SECRET` are set correctly in Supabase
- Verify they're in the right environment (development vs production)

### Token Generation Fails
- Ensure `roomName` and `participantName` are provided
- Check LiveKit credentials are valid
- Review Supabase function logs for detailed errors

### Connection Issues
- Verify `LIVEKIT_URL` matches your LiveKit server address
- Check firewall/network allows WebSocket connections
- Ensure mobile device can reach LiveKit server

## Next Steps
1. ✅ Create the edge function (DONE)
2. Add environment variables to Supabase
3. Deploy the function
4. Create LiveKit service in frontend
5. Install LiveKit client libraries
6. Integrate video calling into your incident screens
