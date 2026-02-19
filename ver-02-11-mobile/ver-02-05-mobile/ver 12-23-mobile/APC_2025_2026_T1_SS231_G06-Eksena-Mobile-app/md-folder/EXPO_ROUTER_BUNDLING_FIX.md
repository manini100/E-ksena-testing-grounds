# Expo Router Bundling Error - Fix

## 🔴 What's Happening

The error `Invalid call at line 2: process.env.EXPO_ROUTER_APP_ROOT` means expo-router can't find the app root directory during bundling.

## ✅ Quick Fix

### Step 1: Clear Everything
```bash
npm cache clean --force
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
```

### Step 2: Reinstall Fresh
```bash
npm install --legacy-peer-deps
```

### Step 3: Start with Clear Flag
```bash
npx expo start --clear
```

The `--clear` flag clears the bundler cache completely.

---

## 🆘 If That Doesn't Work

Try using the Expo Dev Client instead of Expo Go:

```bash
npm run android
```

This builds a custom development app which is more stable than Expo Go.

---

## 💡 Alternative: Reset Everything

If above doesn't work, this nuclear option always works:

```bash
# Stop any running processes first (Ctrl+C)

# Delete all caches and modules
Remove-Item -Recurse -Force node_modules
Remove-Item -Recurse -Force .expo
Remove-Item -Recurse -Force .next
npm cache clean --force

# Reinstall completely fresh
npm install --legacy-peer-deps

# Start fresh
npx expo start --clear
```

This takes a few minutes but always fixes bundling issues.

---

## 🎯 Try This Now

```bash
npx expo start --clear
```

If that works, scan the QR code!

If not, use:
```bash
npm run android
```

Let me know which one works! 🚀
