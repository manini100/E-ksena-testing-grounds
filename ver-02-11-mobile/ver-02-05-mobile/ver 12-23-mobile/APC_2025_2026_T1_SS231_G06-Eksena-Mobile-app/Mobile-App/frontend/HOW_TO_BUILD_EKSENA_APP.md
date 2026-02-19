# How to Build the E-KSENA Development App

You need to build your own development app because Expo Go doesn't have the native modules (Mapbox, LiveKit) your project needs.

---

## Option 1: Build in the Cloud (EAS) - **Recommended** ⭐

**Best for:** No Android SDK installation needed, works on any computer.

### Step 1: Install EAS CLI (one-time setup)

```powershell
npm install -g eas-cli
```

If that fails, use:
```powershell
npx eas-cli --version
```
(Just to verify it works - you can use `npx eas-cli` instead of `eas` for all commands)

### Step 2: Log in to EAS (one-time)

```powershell
npx eas-cli login
```

- If you don't have an Expo account, it will prompt you to create one (free).
- Enter your email and password when prompted.

### Step 3: Build the app

```powershell
cd Mobile-App\frontend
npx eas build --profile development --platform android
```

**What happens:**
- EAS uploads your code to their servers
- Builds the Android app in the cloud (takes 10-20 minutes)
- You'll see a build URL and QR code in the terminal

### Step 4: Install on your phone

When the build finishes:
1. **Option A:** Scan the QR code shown in the terminal with your phone's camera
2. **Option B:** Open the build URL from the terminal in your phone's browser
3. Download and install the APK file
4. The app will be installed as **"E-KSENA"** or **"E-KSENA (development)"**

### Step 5: Use the app

1. Run `npm start` in the frontend folder
2. On your phone, **open the E-KSENA app** (not Expo Go)
3. Scan the QR code shown in the terminal
4. Your app loads! ✅

---

## Option 2: Build Locally (Android SDK Required)

**Best for:** Faster builds, full control, but requires Android Studio installation.

### Prerequisites

1. **Install Android Studio**
   - Download: https://developer.android.com/studio
   - Install it (includes Android SDK)

2. **Set ANDROID_HOME environment variable**
   - Press **Win + R**, type `sysdm.cpl`, Enter
   - **Advanced** tab → **Environment Variables**
   - Under **User variables**, click **New**:
     - **Name:** `ANDROID_HOME`
     - **Value:** `C:\Users\manip\AppData\Local\Android\Sdk` (or wherever Android Studio installed the SDK)
   - Edit **Path** variable, add:
     - `%ANDROID_HOME%\platform-tools`
     - `%ANDROID_HOME%\emulator`
     - `%ANDROID_HOME%\tools`
   - Click **OK** on all dialogs
   - **Restart your terminal** (and Cursor/VS Code)

3. **Connect your Android device**
   - Enable **USB debugging** on your phone (Settings → Developer options)
   - Connect via USB
   - Or start an Android emulator from Android Studio

### Build the app

```powershell
cd Mobile-App\frontend
npx expo run:android
```

**What happens:**
- Builds the app locally (takes 5-15 minutes first time)
- Installs it automatically on your connected device/emulator
- The app appears as **"E-KSENA"** on your phone

### Use the app

1. Run `npm start` in the frontend folder
2. On your phone, **open the E-KSENA app** (not Expo Go)
3. Scan the QR code shown in the terminal
4. Your app loads! ✅

---

## Which Option Should You Choose?

| Option | Pros | Cons |
|--------|------|------|
| **EAS Cloud Build** | ✅ No Android SDK needed<br>✅ Works on any computer<br>✅ Easy setup | ❌ Requires Expo account<br>❌ Takes longer (10-20 min)<br>❌ Needs internet |
| **Local Build** | ✅ Faster builds<br>✅ No internet needed<br>✅ Full control | ❌ Requires Android Studio (large download)<br>❌ More setup steps<br>❌ Only works on your PC |

**Recommendation:** Use **EAS Cloud Build** (Option 1) if you don't want to install Android Studio. Use **Local Build** (Option 2) if you want faster builds and don't mind installing Android Studio.

---

## After Building

Once you have the E-KSENA app installed:

1. **Every time you develop:**
   ```powershell
   npm start
   ```
2. **On your phone:** Open **E-KSENA** app (not Expo Go)
3. **Scan the QR code** from the terminal
4. Your app loads with all native modules working! ✅

---

## Troubleshooting

### "Could not determine executable to run" when running `eas-cli`
- Use `npx eas-cli` instead of `eas` for all commands

### Build fails with "Android SDK not found"
- You're trying local build but SDK isn't set up → Use EAS cloud build instead, or set up ANDROID_HOME

### "Failed to resolve Android SDK path"
- ANDROID_HOME isn't set correctly → Check the path in Android Studio (File → Settings → Android SDK)

### App still crashes with PlatformConstants error
- Make sure you're opening **E-KSENA** app, not **Expo Go**
- Check that you built with `--profile development` (for EAS) or `npx expo run:android` (for local)

---

## Quick Reference

**EAS Cloud Build:**
```powershell
npm install -g eas-cli
npx eas-cli login
npx eas build --profile development --platform android
# Install APK from link/QR code
```

**Local Build:**
```powershell
# After installing Android Studio and setting ANDROID_HOME
npx expo run:android
```

**Daily use (after app is built):**
```powershell
npm start
# Open E-KSENA app on phone, scan QR
```
