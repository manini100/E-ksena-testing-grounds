# QR Code Not Working - Troubleshooting Guide

## 🔍 First: Check If npm start is Actually Running

Look at your terminal. You should see:
```
✔ Metro bundler started

› Press 'a' to open Android Emulator
› Press 'i' to open iOS Simulator
› Press 's' to switch to LAN
› Press 'u' to disable USB
› Press 'w' to open web
› Press 'j' to open debugger
› Press '?' to show all commands

QR Code:
█████████████████████████████████
█       ██ ██ ██       ██ ██     █
█ █████ ██    ██ █████ ██ █████ █
█ █   █ ██ ██ ██ █     ██ █   █ █
█ █████ ██    ██ █████ ██ █████ █
█       ██ ██ ██       ██ ██     █
█████████████████████████████████
```

### If You DON'T See This:
npm start probably failed. Look for error messages in the terminal.

### If You DO See This:
Proceed to next steps.

---

## 📱 Step 1: Make Sure You're Using Expo Go App

### iPhone:
1. Open **Camera app** (not QR scanner)
2. Point at the QR code in your terminal
3. A notification should appear at top
4. Tap it to open in Expo Go

### Android:
1. Open **Expo Go app** (install from Google Play if needed)
2. Tap the **QR icon** at bottom right
3. Point phone camera at the QR code
4. Should connect automatically

---

## ✅ Step 2: Verify Your Phone is on Same WiFi

**Critical:** Your phone MUST be on the same WiFi as your computer!

1. Check computer WiFi: **Settings → WiFi** (look at current network name)
2. Check phone WiFi: **Settings → WiFi** (look at current network name)
3. **They must match exactly!**

If they don't match:
- ❌ Disconnect phone from old WiFi
- ✅ Connect to same WiFi as computer
- Then try QR code again

---

## 🔌 Step 3: Check Backend is Running

If your app tries to connect to backend and fails, it might hang silently.

**Open another terminal** and check if backend is running:
```bash
# Try to reach the backend
curl http://192.168.100.11:3000/api/health

# If you get a response, backend is running
# If timeout, backend is NOT running
```

**If backend is not running:**
```bash
cd Mobile-App/backend
npm start
```

---

## 🌐 Step 4: Check Network Connection

Your phone needs to reach your computer's IP address.

**On your phone's browser**, try going to:
```
http://192.168.100.11:3000/api/health
```

- ✅ If it loads = Network is working
- ❌ If timeout = Network problem

**If network doesn't work:**
1. Check Windows Firewall allows port 3000
2. Check phone is on same WiFi
3. Check computer IP is correct (should be 192.168.100.11)

---

## 🔄 Step 5: Try Different QR Code Methods

### Method 1: Use LAN Mode
In your terminal, press **'s'** to switch to LAN mode.
This generates a different QR code that might work better.

### Method 2: Manual Connection
Instead of scanning QR code:
1. Open Expo Go app on phone
2. Tap "Enter URL Manually"
3. Enter: `exp://192.168.100.11:8081`
4. Should connect!

### Method 3: Tunnel Mode
In your terminal, stop npm start (Ctrl+C) and run:
```bash
npx expo start --tunnel
```
This generates a tunnel URL that works over internet, not just local WiFi.

---

## 🆘 Common Issues & Fixes

### Issue 1: "Cannot Connect to Development Server"
**Cause:** Phone can't reach your computer

**Fix:**
1. Check phone is on same WiFi
2. Check backend is running on port 3000
3. Check Windows Firewall allows port 3000
4. Try Method 2 (Manual URL entry)

### Issue 2: "QR Scanner Not Working on Phone"
**Cause:** Expo Go app not installed or broken

**Fix:**
1. Install **Expo Go** from Google Play / App Store
2. Open Expo Go app
3. Use QR scanner in the app
4. Or use Manual URL method instead

### Issue 3: "App Loads But Then Shows White Screen"
**Cause:** App is loading but something broke

**Fix:**
1. Check terminal for error messages
2. Look for red error text
3. Copy the error and tell me

### Issue 4: "Metro Bundler Never Finishes Compiling"
**Cause:** TypeScript compilation stuck

**Fix:**
1. Stop npm start (Ctrl+C)
2. Delete node_modules folder
3. Run: `npm install --legacy-peer-deps`
4. Run: `npm start`

---

## 📋 Checklist Before Scanning

- [ ] npm start is running in terminal (see QR code)
- [ ] Phone is on same WiFi as computer
- [ ] Expo Go app is installed on phone
- [ ] Backend is running (npm start in Mobile-App/backend)
- [ ] Phone can reach http://192.168.100.11:3000 in browser
- [ ] No errors in terminal (look for red text)

---

## 🚀 If All Else Fails

Try this nuclear option:

**Terminal 1 (Backend):**
```bash
cd Mobile-App/backend
npm start
```

**Terminal 2 (Frontend):**
```bash
cd Mobile-App/frontend
rm -r node_modules
npm install --legacy-peer-deps
npx expo start --tunnel
```

Use `--tunnel` instead of local QR code. It's slower but more reliable.

---

## 💡 Pro Debugging Tips

### See What's Happening:
Look at your terminal when you scan QR code. You should see:
```
[your-phone-name] connected
```

If you don't see this message, phone never connected.

### Check Metro Bundler Status:
```
✔ Logs for ExpoProject
```

This means bundler is ready.

---

## Next Steps

1. Check your terminal - what do you see?
2. Is phone on same WiFi?
3. Can you reach backend in phone browser?
4. Any error messages?

Tell me these details and I can help more specifically! 🎯
