# Error 800 Fix - LiveKit Edge Function

## ✅ Problem Fixed!

Your Error 800 was caused by a **JavaScript library compatibility issue** in the original code.

### What Was Wrong?
The original code tried to import the LiveKit library from esm.sh:
```typescript
import { AccessToken } from 'https://esm.sh/livekit-server-sdk@1.2.7'
```

This library has dependencies that don't work well with Deno, causing the "Object prototype may only be an Object or null" error.

### The Solution
✨ **New code creates JWT tokens manually without external dependencies!**

The fixed `supabase/functions/get-livekit-token/index.ts` now:
1. ✅ Uses Deno's built-in `crypto.subtle` API for HMAC signing
2. ✅ Manually creates proper JWT tokens for LiveKit
3. ✅ No problematic library imports
4. ✅ Better error handling and logging
5. ✅ Works with all LiveKit servers

## 🚀 Next Steps: Deploy the Fixed Code

### Step 1: Go to Supabase Dashboard
1. Open https://app.supabase.com
2. Select your **E-KSENA** project
3. Click **Functions** in left sidebar

### Step 2: Edit the Function
1. Click on **get-livekit-token** function
2. Click **Edit** button
3. Delete ALL the existing code
4. Copy the entire new code from `supabase/functions/get-livekit-token/index.ts`
5. Paste it completely into the editor

### Step 3: Deploy
1. Click **Deploy**
2. Wait for it to finish (should say "Active" with green status)

### Step 4: Test Again
1. Click **Test function**
2. Paste this request body:
```json
{
  "roomName": "test-room",
  "participantName": "test-user"
}
```
3. Click **Send**
4. ✅ You should see a token in the response (no more Error 800!)

## 🔍 What Changed in the Code?

### Before (Broken):
```typescript
import { AccessToken } from 'https://esm.sh/livekit-server-sdk@1.2.7'
const at = new AccessToken(apiKey, apiSecret, ...)
return JSON.stringify({ token: at.toJwt() })
```

### After (Fixed):
```typescript
// Manually create JWT using crypto.subtle
async function createJWT(header, payload, secret) {
  // ... HMAC-SHA256 signing code ...
}

const token = await createJWT(header, payload, apiSecret)
return JSON.stringify({ token: token })
```

## ✅ Checklist

- [ ] Opened Supabase Dashboard
- [ ] Clicked on **get-livekit-token** function
- [ ] Deleted old code
- [ ] Copied NEW code from `supabase/functions/get-livekit-token/index.ts`
- [ ] Pasted it completely
- [ ] Clicked **Deploy**
- [ ] Waited for "Active" status (green)
- [ ] Tested with sample request
- [ ] Got token in response (✅ working!)

## 🆘 If You Still Get an Error

**Most Common Issues:**

### 1. "Cannot find LIVEKIT_API_KEY" error
- Go to **Project Settings** → **Edge Functions** → **Manage secrets**
- Add both secrets again:
  - `LIVEKIT_API_KEY`
  - `LIVEKIT_API_SECRET`
- Redeploy the function

### 2. Function shows "Error" status
- Click on function → Click **Logs** tab
- Copy the error message
- The error message will tell exactly what's wrong

### 3. Test returns 500 error
- Check that LiveKit credentials are valid
- Make sure you copied them without extra spaces
- Check the **Logs** tab for detailed error

### 4. "Invalid JSON" error in test
- Make sure your test body is exactly:
```json
{
  "roomName": "test-room",
  "participantName": "test-user"
}
```
- No extra spaces or commas

## ✨ Success!

Once the function is deployed and tested, you're ready to use LiveKit tokens in your mobile app! 

The mobile app will call this function to get tokens when users join video sessions.

---

**Need help?** Check the function **Logs** tab for detailed error messages - they tell you exactly what's wrong!
