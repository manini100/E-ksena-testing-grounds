# Testing LiveKit on Mobile Phone - Complete Guide

## ✅ What You Can Test

1. ✅ Backend API (incident reporting)
2. ✅ LiveKit token generation (edge function)
3. ✅ SMS emergency reporting (ExploreScreen)
4. ✅ Real-time video (LiveKit connection)
5. ✅ Database integration (Supabase)

---

## 📱 Prerequisites

Make sure you have:
- [ ] Mobile phone on same WiFi as your development computer
- [ ] Backend running on Node.js (port 3000)
- [ ] Expo app running on your phone
- [ ] LiveKit credentials configured in Supabase
- [ ] ExploreScreen integrated in your app navigation

---

## 🚀 Step 1: Start Your Backend

Open terminal in `Mobile-App/backend` directory:

```bash
cd "path/to/Mobile-App/backend"
npm start
```

You should see:
```
Server running at http://192.168.100.11:3000
```

**Note your IP address:** (in this example: `192.168.100.11`)

---

## 🔧 Step 2: Make Sure app.json Has Correct IP

Edit `Mobile-App/frontend/app.json`:

```json
{
  "extra": {
    "API_BASE_URL": "http://YOUR_IP:3000/api",
    "SUPABASE_URL": "https://cwhduwianpugjbnqzmhs.supabase.co",
    "SUPABASE_ANON_KEY": "...",
    "MAPBOX_TOKEN": "...",
    "LIVEKIT_URL": "wss://your-livekit-server.livekit.cloud"
  }
}
```

**Replace `YOUR_IP`** with your actual IP (e.g., `192.168.100.11`)

---

## 📱 Step 3: Start Expo on Your Phone

In terminal in `Mobile-App/frontend` directory:

```bash
npm start
```

You'll see QR code. On your phone:
- **Android:** Use Expo Go app, scan QR code
- **iOS:** Use Camera app, scan QR code

App will load on your phone.

---

## 🧪 Step 4: Test the Flow

### Test 1: Backend Connectivity
1. Open your app on phone
2. Navigate to a screen that makes an API call
3. Check if it works (no timeout errors)
4. ✅ If working: Backend is reachable

### Test 2: ExploreScreen (SMS Emergency Reporting)
1. Navigate to **ExploreScreen** (add it to your navigation first)
2. Enter phone number: `+1234567890` (any valid format)
3. Enter emergency message: `Test emergency report`
4. Click "Send Emergency SMS"
5. Check Supabase:
   - Go to `conversations` table - should have new row
   - Go to `messages` table - should have new message
6. ✅ If working: Supabase integration works

### Test 3: LiveKit Token Generation
1. In ExploreScreen, after sending message, token should be generated
2. Check browser console for any errors
3. App should try to connect to LiveKit room
4. ✅ If working: Token generation works

### Test 4: Full End-to-End
1. Get token from edge function ✅
2. Save message to Supabase ✅
3. Connect to LiveKit video (requires second person for full test)
4. ✅ If all work: System is ready!

---

## 🔍 How to Debug Issues

### Check Phone Logs
```bash
# In terminal where you ran "npm start"
# Look for console.log messages from your app
```

### Check Backend Logs
```bash
# In terminal where you ran "npm start" in backend
# Look for API request logs
```

### Check Supabase Logs
1. Go to Supabase Dashboard
2. Click "Logs" → "Edge Functions"
3. Click `get-livekit-token`
4. See real-time logs of token generation

### Check Network Connection
```bash
# From your phone, try this URL in browser:
http://YOUR_IP:3000/api/health

# Should return something like:
# {"status": "ok"}
```

---

## ⚠️ Common Issues & Fixes

### Issue 1: "Cannot Connect to Server"
**Error:** Timeout or "Failed to fetch"

**Fix:**
1. Check backend is running: `npm start`
2. Check IP in app.json matches your computer's IP
3. Check phone is on same WiFi as computer
4. Check Windows firewall allows port 3000

**Test:**
```bash
# On your phone, open browser and go to:
http://YOUR_IP:3000/api/health
```

### Issue 2: "LIVEKIT_URL Not Configured"
**Error:** Can't generate LiveKit token

**Fix:**
1. Check app.json has `LIVEKIT_URL` set
2. Restart Expo app after changing app.json
3. Check Supabase secrets are set (LIVEKIT_API_KEY, LIVEKIT_API_SECRET)

**Test:**
```bash
# In Supabase Dashboard, test the function directly
# Go to Functions → get-livekit-token → Test function
```

### Issue 3: "Message Not Saving"
**Error:** SMS message not appearing in Supabase

**Fix:**
1. Check `conversations` and `messages` tables exist
2. Check phone number format is correct
3. Check Supabase connection is working

**Test:**
```bash
# In Supabase SQL editor, run:
SELECT * FROM conversations;
SELECT * FROM messages;
```

### Issue 4: "ExploreScreen Not Showing"
**Error:** Can't find the SMS screen

**Fix:**
1. Make sure ExploreScreen is imported in your navigation
2. Make sure it's added to the navigation stack/tabs
3. Restart Expo app

---

## 📊 Testing Checklist

### Phase 1: Setup
- [ ] Backend running on port 3000
- [ ] IP address noted (e.g., 192.168.100.11)
- [ ] app.json updated with correct IP
- [ ] Phone on same WiFi as computer
- [ ] Expo running on phone

### Phase 2: Basic Connectivity
- [ ] Phone can reach backend (test URL in browser)
- [ ] App loads without crashing
- [ ] No timeout errors

### Phase 3: SMS Feature
- [ ] ExploreScreen visible in app
- [ ] Can enter phone number
- [ ] Can enter message
- [ ] Can click send button
- [ ] Message appears in Supabase `messages` table

### Phase 4: LiveKit Integration
- [ ] Token generated (check Supabase function logs)
- [ ] No token generation errors
- [ ] App attempts to connect to LiveKit

### Phase 5: Full System
- [ ] Backend → Supabase message saving ✅
- [ ] Supabase → Edge function token gen ✅
- [ ] Edge function → LiveKit token ✅
- [ ] Phone → Display video conference UI ✅

---

## 🎥 Advanced Testing: Video Call with Two Phones

Once basic testing works, try video:

1. **Phone A:** Send emergency SMS through ExploreScreen
2. **Phone A:** Should see LiveKit video UI
3. **Phone B:** (Different person/device) Get the same room name
4. **Phone B:** Connect to same room
5. **Both:** Should see video/audio from each other

---

## 📝 Testing Report Template

Copy this and fill it out:

```
# Testing Report - LiveKit Mobile Integration

Date: [TODAY]
Tester: [YOUR NAME]
Phone: [PHONE MODEL]
Network: [WiFi NAME]

## Connectivity Tests
- [ ] Backend reachable from phone
- [ ] Status: ✅ PASS / ❌ FAIL

## SMS Feature Tests
- [ ] Message saved to Supabase
- [ ] Status: ✅ PASS / ❌ FAIL

## Token Generation Tests
- [ ] Edge function returns token
- [ ] Status: ✅ PASS / ❌ FAIL

## Full End-to-End Tests
- [ ] Complete flow works
- [ ] Status: ✅ PASS / ❌ FAIL

## Issues Found
1. [Issue 1]
2. [Issue 2]

## Conclusion
Ready for: [ ] Testing / [ ] Beta / [ ] Production
```

---

## 🚀 Next Steps After Testing

Once everything works:

1. ✅ Add more test cases
2. ✅ Test with real phone numbers
3. ✅ Test with real emergency messages
4. ✅ Test with actual responders
5. ✅ Deploy to TestFlight/Google Play

---

## 💡 Pro Tips

### Tip 1: Hot Reload
Changes to TypeScript files reload automatically in Expo. No need to restart!

### Tip 2: Debugging
Use `console.log()` in your code. Output appears in the Expo terminal.

### Tip 3: Network Inspection
Use Supabase Dashboard to watch database changes in real-time as you test.

### Tip 4: Multiple Phones
You can run app on multiple phones at once (different QR code scans).

---

## Need Help?

If testing fails:

1. **Check backend logs** - Terminal where you ran `npm start` in backend
2. **Check app logs** - Terminal where you ran `npm start` in frontend  
3. **Check Supabase logs** - Supabase Dashboard → Logs
4. **Check phone console** - Expo shows console.log output

Copy the error message and we can fix it!

---

## ✅ You're Ready!

Your system is designed to work on mobile phones. Test it now and let me know if you hit any issues! 🎯

**Happy testing! 🚀**
