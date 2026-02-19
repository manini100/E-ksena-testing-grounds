# Mapbox Setup for EAS Builds

## Problem

The build fails because Mapbox Maps SDK dependencies can't be downloaded:
```
Could not find com.mapbox.maps:android:11.16.2
Could not find com.mapbox.mapboxsdk:mapbox-sdk-turf:6.11.0
```

Mapbox Maps SDK v11+ requires authentication to download from their Maven repository.

---

## Solution: Add Mapbox Downloads Token

### Step 1: Get Your Mapbox Downloads Token

1. Go to https://account.mapbox.com/access-tokens/
2. Sign in or create a Mapbox account
3. Create a new token with **Downloads:Read** scope
4. Copy the token

### Step 2: Add Token to EAS Build

**Option A: Via EAS Dashboard (Recommended)**

1. Go to https://expo.dev/accounts/peterpeter101/projects/e-ksena-emergency/settings
2. Click **"Secrets"** or **"Environment Variables"**
3. Add a new secret:
   - **Name:** `MAPBOX_DOWNLOADS_TOKEN`
   - **Value:** Your Mapbox downloads token
   - **Visibility:** Select for the environments you need (development, preview, production)
4. Save

**Option B: Via eas.json (Less Secure)**

Edit `eas.json` and add your token:

```json
{
  "build": {
    "development": {
      "env": {
        "MAPBOX_DOWNLOADS_TOKEN": "your-token-here"
      }
    }
  }
}
```

⚠️ **Warning:** Don't commit tokens to git! Use EAS Secrets instead.

### Step 3: Rebuild

After adding the token, rebuild:

```powershell
npx eas build --profile development --platform android
```

---

## What Was Fixed

1. ✅ Added Mapbox Maven repository to `android/build.gradle`
2. ✅ Configured repository to use `MAPBOX_DOWNLOADS_TOKEN` environment variable
3. ✅ Added token placeholder in `eas.json` (you need to set the actual token)

---

## Alternative: Use Public Mapbox Repository (If Available)

If Mapbox has a public repository for your SDK version, we can update the repository URL. Check Mapbox documentation for your SDK version.

---

## Quick Checklist

- [ ] Get Mapbox downloads token from https://account.mapbox.com/access-tokens/
- [ ] Add token as EAS secret: `MAPBOX_DOWNLOADS_TOKEN`
- [ ] Rebuild: `npx eas build --profile development --platform android`

After adding the token, the Mapbox dependencies should download successfully!
