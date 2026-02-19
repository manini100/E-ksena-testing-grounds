# LiveKit Integration - Quick Summary

## ✅ What Was Created

### 1. **Supabase Edge Function**
```
supabase/functions/get-livekit-token/
├── index.ts      - Main function that generates LiveKit tokens
└── config.json   - Function configuration
```

### 2. **Frontend Service**
```
frontend/services/LiveKitService.ts
- `getLiveKitToken(roomName, participantName)` - Get token from Supabase
- `generateRoomName(incidentId)` - Create room name from incident
- `validateLiveKitConfig()` - Check if LiveKit is configured
- `getLiveKitUrl()` - Get LiveKit server URL
```

### 3. **Documentation**
```
LIVEKIT_SETUP_GUIDE.md - Complete setup instructions
```

---

## 🚀 Next Steps to Complete Integration

### Step 1: Sign Up for LiveKit
1. Go to **https://livekit.io**
2. Create an account
3. Create a new project
4. Get your credentials:
   - **API Key**
   - **API Secret**
   - **LiveKit URL** (e.g., `wss://your-project.livekit.cloud`)

### Step 2: Add Environment Variables to Supabase
1. Go to **Supabase Dashboard**
2. Select your project
3. Go to **Project Settings → Edge Functions → Secrets**
4. Add:
   - `LIVEKIT_API_KEY` = Your API Key
   - `LIVEKIT_API_SECRET` = Your API Secret

### Step 3: Deploy Edge Function
```bash
# Option A: Using Supabase CLI
supabase functions deploy get-livekit-token

# Option B: Deploy from Supabase Dashboard
# Copy code from supabase/functions/get-livekit-token/index.ts
```

### Step 4: Update Frontend Configuration
Add to `frontend/app.json`:
```json
{
  "expo": {
    "extra": {
      "LIVEKIT_URL": "wss://your-project.livekit.cloud"
    }
  }
}
```

### Step 5: Install LiveKit Dependencies
```bash
cd Mobile-App/frontend
npm install livekit-client livekit-react-native
```

### Step 6: Use in Your Screens
Example in a video call component:
```typescript
import { getLiveKitToken, generateRoomName } from '../services/LiveKitService';

// Get token
const roomName = generateRoomName(incidentId);
const tokenResponse = await getLiveKitToken(roomName, userPhoneNumber);

// Use token to connect to LiveKit
if (tokenResponse.token) {
  // Connect to live video room
}
```

---

## 📁 File Locations

| File | Location |
|------|----------|
| Edge Function | `supabase/functions/get-livekit-token/index.ts` |
| Function Config | `supabase/functions/get-livekit-token/config.json` |
| Frontend Service | `Mobile-App/frontend/services/LiveKitService.ts` |
| Setup Guide | `LIVEKIT_SETUP_GUIDE.md` |

---

## 🔑 Key Concepts

### What is LiveKit?
- Real-time video/audio communication platform
- Runs on your own server or use hosted service
- Used for live incident video calls between responders and citizens

### Why Edge Function?
- Securely generates tokens on the server
- Never expose API credentials to client
- Tokens are short-lived and limited to specific rooms

### How It Works
1. Mobile app requests token from Supabase Edge Function
2. Function generates JWT token using LiveKit credentials
3. Mobile app uses token to connect to LiveKit room
4. Users can now see/hear each other in real-time

---

## ❓ Common Questions

**Q: Where do I put LiveKit in my incident flow?**
A: Typically when responders accept an incident, they can click "Start Video Call" to join the incident room.

**Q: Can I use it for live streaming?**
A: Yes! LiveKit supports broadcasting to multiple participants.

**Q: Is the token secure?**
A: Yes! Tokens are JWT signed and only valid for the specific room and participant.

**Q: What's the difference between this and video upload?**
A: This is **real-time video calling** (like Zoom). Video upload is **storing video files**.

---

## 🆘 Need Help?

1. Check `LIVEKIT_SETUP_GUIDE.md` for detailed instructions
2. See `supabase/functions/get-livekit-token/index.ts` for function code
3. Review `Mobile-App/frontend/services/LiveKitService.ts` for usage
4. Check LiveKit documentation: https://docs.livekit.io

Let your groupmate know the structure is ready! You just need to:
1. Get LiveKit credentials
2. Add them to Supabase
3. Deploy the function
4. Install dependencies
5. Integrate into your incident screens
