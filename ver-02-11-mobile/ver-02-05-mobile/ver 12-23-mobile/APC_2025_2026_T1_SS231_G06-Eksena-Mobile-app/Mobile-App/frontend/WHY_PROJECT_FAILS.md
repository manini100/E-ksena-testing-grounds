# Why the Project Fails to Open - The Real Cause

## ❌ EAS is NOT the Problem

**EAS (Expo Application Services) is just a build service.** It's not causing your app to fail. You can completely ignore EAS and still fix the issue.

---

## ✅ The Real Problem: Expo Go App

When you run `npm start` and scan the QR code with the **Expo Go** app on your phone, the app crashes because:

1. **Expo Go** is a generic app that only includes a limited set of native modules
2. Your project uses native modules that **are NOT included** in Expo Go:
   - `@rnmapbox/maps` (Mapbox maps)
   - `livekit-react-native` (LiveKit video/audio)
   - These require custom native code that Expo Go doesn't have

3. When Expo Go tries to load your app, it can't find these modules → **crash with PlatformConstants error**

---

## ✅ The Solution: Build Your Own App (No EAS Needed)

Instead of using Expo Go, you need to **build your own development app** that includes all your native modules.

### Option 1: Build Locally (Recommended - No EAS)

1. **Install Android Studio** (if you haven't)
   - Download from: https://developer.android.com/studio
   - This installs the Android SDK

2. **Set ANDROID_HOME** environment variable
   - See `EXPO_GO_VS_DEV_BUILD.md` for detailed steps

3. **Build and install your app**:
   ```bash
   cd Mobile-App/frontend
   npx expo run:android
   ```
   This builds your app with all native modules included and installs it on your device/emulator.

4. **Use your app instead of Expo Go**:
   - Run `npm start`
   - Open the **E-KSENA (development)** app on your phone (not Expo Go)
   - Scan the QR code or enter the URL in your app
   - It works! ✅

**No EAS account, no EAS login, no cloud builds needed!**

---

## 📊 What's Happening

| What You're Doing | What Happens | Result |
|-------------------|--------------|--------|
| `npm start` → Scan QR with **Expo Go** | Expo Go tries to load your app but doesn't have Mapbox/LiveKit native code | ❌ **CRASH** (PlatformConstants error) |
| `npm start` → Open **your built app** | Your app has all native modules built in | ✅ **WORKS** |

---

## 🎯 Quick Answer

**Q: Is EAS causing the project to fail?**  
**A: No.** EAS is unrelated. The problem is using Expo Go instead of building your own app.

**Q: Do I need EAS to fix this?**  
**A: No.** Just install Android Studio, set ANDROID_HOME, and run `npx expo run:android` once. Then use your own app instead of Expo Go.

**Q: Can I ignore EAS completely?**  
**A: Yes!** For local development and testing, you never need EAS. Only use EAS if you want to build in the cloud (optional).

---

## ✅ Summary

- ❌ **Not the problem:** EAS, login prompts, cloud builds
- ✅ **The problem:** Using Expo Go app (which doesn't have your native modules)
- ✅ **The fix:** Build your own app with `npx expo run:android` and use that instead of Expo Go

**You can completely ignore EAS and still fix everything!** 🎯

