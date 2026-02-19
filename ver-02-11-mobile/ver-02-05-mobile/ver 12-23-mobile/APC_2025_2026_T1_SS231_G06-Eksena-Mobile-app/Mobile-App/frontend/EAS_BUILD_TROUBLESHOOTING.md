# EAS Build Failed - Troubleshooting Guide

## What Happened

Your EAS build failed during the Gradle build phase. The error message was:
```
Gradle build failed with unknown error. See logs for the "Run gradlew" phase.
```

---

## Step 1: Check the Build Logs

**Your build logs are here:**
https://expo.dev/accounts/peterpeter101/projects/e-ksena-emergency/builds/1e22be7f-8e40-4c4c-9e99-980956fd1df9#run-gradlew

1. Open that URL in your browser
2. Scroll to the **"Run gradlew"** section
3. Look for **red error messages** - these will tell you what actually failed

**Common errors you might see:**
- Missing dependencies
- Gradle version conflicts
- Native module configuration issues
- Memory errors
- Missing files or assets

---

## Step 2: Fixes Applied

**Fix 1:** `newArchEnabled` mismatch — Set to `false` in `gradle.properties` to match `app.json`.

**Fix 2:** Kotlin / KSP version error
- Error: `Can't find KSP version for Kotlin version '1.9.25'. Supported versions are: 2.2.20, 2.2.10, ... 2.0.0`
- React Native supplies Kotlin 1.9.25; Expo's KSP only supports Kotlin 2.x
- **Fixed:** In `android/build.gradle`, set `ext.kotlinVersion = "2.0.21"` and use it for the Kotlin Gradle plugin so the build uses Kotlin 2.0.21

---

## Step 3: Common Fixes

### Fix 1: Check the Actual Error

**Most important:** Open the build logs URL above and find the actual error message. The fixes below depend on what error you see.

### Fix 2: Try Building Again

After fixing the `newArchEnabled` mismatch, try building again:

```powershell
npx eas build --profile development --platform android
```

### Fix 3: Clear Build Cache

If you see caching issues:

```powershell
npx eas build --profile development --platform android --clear-cache
```

### Fix 4: Check Native Module Compatibility

Your project uses:
- `@rnmapbox/maps` - Mapbox native SDK
- `livekit-react-native` - LiveKit native modules

These require proper native configuration. If the error mentions these modules:
- Check that they're compatible with Expo SDK 54
- Verify their installation in `package.json`

### Fix 5: Memory Issues

If you see "OutOfMemoryError" or "GC overhead limit exceeded":
- The build might need more memory
- Try building again (sometimes it's transient)
- Or contact Expo support if it persists

### Fix 6: Gradle Version Issues

If you see Gradle version errors:
- EAS uses compatible Gradle versions automatically
- But if there's a conflict, you might need to update `android/gradle/wrapper/gradle-wrapper.properties`

---

## Step 4: Share the Error Details

**To get more help, share:**
1. The **exact error message** from the build logs (the red text in "Run gradlew" section)
2. Any warnings that appear before the error
3. The full command you ran

---

## Alternative: Try Local Build

If EAS builds keep failing, you can try building locally:

1. **Install Android Studio** (if not already installed)
2. **Set ANDROID_HOME** environment variable
3. **Run:**
   ```powershell
   npx expo run:android
   ```

This builds on your machine and might give you more detailed error messages.

---

## Quick Checklist

- [ ] Checked the build logs URL for the actual error
- [ ] Fixed `newArchEnabled` mismatch (already done)
- [ ] Tried building again
- [ ] If still failing, shared the exact error message from logs

---

## Next Steps

1. **Open the build logs:** https://expo.dev/accounts/peterpeter101/projects/e-ksena-emergency/builds/1e22be7f-8e40-4c4c-9e99-980956fd1df9#run-gradlew
2. **Find the error** in the "Run gradlew" section
3. **Share the error** so we can fix it, or try the fixes above

The most common cause is a specific dependency or configuration issue that will be visible in the build logs.
