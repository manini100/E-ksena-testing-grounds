# LiveKit Edge Function - Error 800 Troubleshooting

## What Does Error 800 Mean?
Error 800 typically means:
- The Edge Function executed but returned an error
- It's usually a server-side error (not network related)
- Could be missing environment variables, invalid credentials, or code error

## Quick Debugging Steps

### Step 1: Check Function Logs
1. Go to **Supabase Dashboard** → **Functions**
2. Click on **get-livekit-token**
3. Click the **Logs** tab
4. Look for error messages in red
5. Copy the exact error message

**Common errors:**
```
Error: Cannot read property 'get' of undefined
Error: LIVEKIT_API_KEY is not defined
ReferenceError: AccessToken is not defined
```

### Step 2: Verify Environment Variables Are Set
1. In Supabase, go to **Project Settings**
2. Click **Edge Functions** (left sidebar)
3. Click **Manage secrets**
4. You should see:
   - ✅ `LIVEKIT_API_KEY` = (your key)
   - ✅ `LIVEKIT_API_SECRET` = (your secret)

If missing, add them again.

### Step 3: Check LiveKit Credentials Format
Make sure your credentials don't have:
- ❌ Extra spaces at start/end
- ❌ Newline characters
- ❌ Accidental quotes included

**Correct format:**
```
LIVEKIT_API_KEY: ABCDef123...
LIVEKIT_API_SECRET: xyz789...
```

**Wrong format:**
```
LIVEKIT_API_KEY: "ABCDef123..."  ❌ Has quotes
LIVEKIT_API_SECRET:  xyz789... ❌ Extra space
```

### Step 4: Test with Proper JSON
Make sure your test body is valid JSON:

```json
{
  "roomName": "test-room",
  "participantName": "test-user"
}
```

Not:
```
roomName: "test-room"
participantName: "test-user"
```

### Step 5: Redeploy the Function
Sometimes changes don't apply immediately:

1. In Supabase, click on **get-livekit-token** function
2. Make a tiny change (add a space, remove it)
3. Click **Deploy** again
4. Wait 30 seconds
5. Test again

---

## Most Common Causes & Fixes

### Cause 1: Missing Environment Variables ⚠️
**Error message:** `Cannot read property 'get' of undefined` or `env.get is not a function`

**Fix:**
1. Go to Supabase → Project Settings → Edge Functions
2. Click "Manage secrets"
3. Add:
   - `LIVEKIT_API_KEY` = your key (from LiveKit dashboard)
   - `LIVEKIT_API_SECRET` = your secret (from LiveKit dashboard)
4. Redeploy function
5. Test again

### Cause 2: Invalid LiveKit Credentials 🔑
**Error message:** `Failed to generate token` or `Invalid credentials`

**Fix:**
1. Go to LiveKit.io dashboard
2. Check your API Key and Secret
3. Copy them exactly (no extra spaces)
4. Update in Supabase secrets
5. Redeploy and test

### Cause 3: Wrong Import Statement
**Error message:** `ReferenceError: AccessToken is not defined`

**Fix:** The function needs to import AccessToken. Check your `supabase/functions/get-livekit-token/index.ts` has:
```typescript
import { AccessToken } from 'https://esm.sh/livekit-server-sdk@1.2.7'
```

### Cause 4: JSON Parse Error
**Error message:** `Unexpected token < in JSON at position 0`

**Fix:**
- Make sure you're sending valid JSON
- Use correct syntax: `{ "roomName": "test", "participantName": "user" }`
- No trailing commas or quotes

---

## Step-by-Step: Find & Share the Error

### To Get the Exact Error:

1. **Open Supabase Dashboard**
2. **Go to Functions**
3. **Click get-livekit-token**
4. **Click the Logs tab**
5. **Look for red error messages**
6. **Copy the error text**

### Error Message Format:
The log should show something like:
```
[14:32:15] get-livekit-token invoked
[14:32:15] request body: {"roomName":"test-room","participantName":"test-user"}
[14:32:15] ERROR: Cannot read property 'get' of undefined
```

**Please share:**
- The exact error message from the logs
- Any stack trace information
- When the error occurs (during deployment or testing)

---

## Quick Checklist Before Testing

- [ ] LiveKit account created at https://livekit.io
- [ ] API Key copied from LiveKit dashboard
- [ ] API Secret copied from LiveKit dashboard
- [ ] `LIVEKIT_API_KEY` secret added to Supabase
- [ ] `LIVEKIT_API_SECRET` secret added to Supabase
- [ ] Edge function code deployed (showing green status)
- [ ] Test request has valid JSON: `{"roomName":"test-room","participantName":"test-user"}`
- [ ] No extra spaces in credentials
- [ ] Function has been redeployed after adding secrets

---

## If You Still Get Error 800

**Please provide:**
1. The exact error from the **Logs** tab
2. Screenshot or copy the error message
3. Confirm you have:
   - LiveKit credentials (API Key + Secret)
   - Both secrets added to Supabase
   - Valid test JSON
   - Function shows "Active" status

With this info, we can identify the exact issue!

---

## Alternative: Test Without LiveKit Credentials

To test if the function works at all:

1. Edit `supabase/functions/get-livekit-token/index.ts`
2. Replace the entire code with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  return new Response(
    JSON.stringify({ 
      token: "test-token-12345",
      message: "Function is working!" 
    }),
    { headers: { "Content-Type": "application/json" } }
  )
})
```

3. Click Deploy
4. Test with: `{"roomName":"test","participantName":"user"}`
5. Should return success with test token

If this works, the issue is with LiveKit credentials. If this fails too, the issue is with the function itself.

---

## Next: Share the Error

Please run Step 5 again and **copy the exact error message from the Logs tab**.

The error message will tell us exactly what's wrong! 🔍
