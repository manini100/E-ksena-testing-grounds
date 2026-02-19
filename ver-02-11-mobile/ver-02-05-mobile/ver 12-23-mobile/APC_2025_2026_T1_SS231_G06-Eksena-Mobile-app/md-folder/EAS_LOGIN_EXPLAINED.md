# Why Expo Wants You to Log In to EAS - And How to Skip It

## ❓ Why Is It Asking?

When you run `npm start` or `expo start`, Expo checks if you're logged in because:

1. **EAS Build** - For building your app for App Store/Google Play
2. **EAS Submit** - For submitting to app stores
3. **EAS Updates** - For pushing updates to already-installed apps

**But you DON'T need this for local testing!**

---

## ✅ For Local Testing (What You're Doing)

You can **skip the login** completely. Just press:

```
Press 's' to stop
Press 'q' to exit without logging in
```

Or simply close the terminal and start again without logging in.

---

## 🔧 How to Start Without EAS Login

### Option 1: Skip When Prompted
When you see the login prompt, just press **'q'** to quit/skip.

### Option 2: Start in Development Mode
```bash
npm start
```

Then press **'w'** for web or **'a'** for Android emulator (doesn't need EAS).

### Option 3: Start with Tunnel (if needed later)
```bash
npx expo start --tunnel
```

This doesn't require EAS login either.

---

## 📋 When You WOULD Need EAS Login

Only if you want to:
- ❌ Build the app for TestFlight (iOS)
- ❌ Build the app for Google Play (Android)
- ❌ Push updates to already-installed apps
- ❌ Use Expo's cloud build services

**For development/testing on your phone? You don't need any of this!**

---

## ✅ For Your Current Testing

**Important:** This project uses native modules (Mapbox, LiveKit) that **do not work in Expo Go**. Do not scan the QR code with the Expo Go app — you will see errors (e.g. PlatformConstants / TurboModule).

Use a **development build** instead:
1. **Once:** In `Mobile-App/frontend`, run `npx expo run:android` to build and install the dev client on your device/emulator.
2. **Every time:** Run `npm start`, then open the **E-KSENA (development)** app on your phone and connect using the same URL or QR code.

See **Mobile-App/frontend/EXPO_GO_VS_DEV_BUILD.md** for full steps.

**No EAS login needed for local testing!** 🎯

---

## 💡 TL;DR

| Action | Need EAS Login? |
|--------|-----------------|
| Test on phone (same WiFi) | ❌ NO |
| Test on phone (different network) | ❌ NO |
| Build for TestFlight | ✅ YES |
| Build for Google Play | ✅ YES |
| Push updates to installed apps | ✅ YES |

---

## 🚀 Just Skip It and Test!

For now, ignore the EAS login request and start testing your app on your mobile phone.

You only need EAS when you're ready to:
1. Submit to app stores
2. Deploy to real users
3. Push updates

That's months away! Focus on testing first. 🎯
