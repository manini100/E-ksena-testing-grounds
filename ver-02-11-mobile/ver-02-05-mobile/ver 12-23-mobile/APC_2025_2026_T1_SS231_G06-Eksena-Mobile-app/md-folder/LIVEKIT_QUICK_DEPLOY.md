# Quick Deploy Guide - LiveKit Edge Function

## ⚡ Fastest Way to Deploy (2 minutes)

### Step 1: Open Supabase Dashboard
1. Go to **https://app.supabase.com**
2. Login with your account
3. Select your **E-KSENA project**

### Step 2: Create Function
1. Click **Functions** in the left sidebar
2. Click **Create a new function** button
3. Name: `get-livekit-token`
4. Click **Create**

### Step 3: Copy & Paste Code (UPDATED)
1. Open `supabase/functions/get-livekit-token/index.ts` in your editor
2. Copy **ALL the code** (the entire file)
3. Go back to Supabase Dashboard function editor
4. Delete any template code
5. Paste your code completely
6. **Important:** Wait for TypeScript to compile (ignore Deno linting warnings - they won't affect runtime)
7. Click **Deploy**

### Step 4: Add Environment Variables
1. In Supabase Dashboard, go to **Project Settings**
2. Click **Edge Functions** in left menu
3. Click **Manage secrets**
4. Add two secrets:
   - **Name:** `LIVEKIT_API_KEY`  
   - **Value:** *(paste your LiveKit API Key)*
5. Click **Add**
6. Add another:
   - **Name:** `LIVEKIT_API_SECRET`
   - **Value:** *(paste your LiveKit API Secret)*
7. Click **Add**

### Step 5: Test the Function
1. In Supabase Dashboard, go to **Functions**
2. Click **get-livekit-token**
3. Click **Test function**
4. Paste this in the request body:
```json
{
  "roomName": "test-room",
  "participantName": "test-user"
}
```
5. Click **Send**
6. You should get a response with a token

### Done! ✅

Your LiveKit edge function is now deployed and ready to use!

---

## 🆘 Troubleshooting Deployment

### Function shows "Error" status
- Check the **Logs** tab for detailed error messages
- Make sure you copied the entire code correctly
- Verify secrets are added (LIVEKIT_API_KEY and LIVEKIT_API_SECRET)

### "Cannot find LIVEKIT_API_KEY" error
- You didn't add the environment variables
- Go back to Step 4 and add the secrets

### Test returns "No token in response"
- Check that your LiveKit credentials are valid
- Verify API Key and Secret are correct
- Check function logs for detailed errors

### Still having issues?
1. Check the function **Logs** tab in Supabase
2. Copy the error message
3. Review the full `LIVEKIT_SETUP_GUIDE.md` for more details

---

## 📋 Checklist

- [ ] Opened Supabase Dashboard
- [ ] Navigated to Functions
- [ ] Created `get-livekit-token` function
- [ ] Copied code from `supabase/functions/get-livekit-token/index.ts`
- [ ] Pasted code into Supabase editor
- [ ] Clicked Deploy
- [ ] Added `LIVEKIT_API_KEY` secret
- [ ] Added `LIVEKIT_API_SECRET` secret
- [ ] Tested function with sample request
- [ ] Got token in response ✅

Once all checked, your function is ready to use in your mobile app!
