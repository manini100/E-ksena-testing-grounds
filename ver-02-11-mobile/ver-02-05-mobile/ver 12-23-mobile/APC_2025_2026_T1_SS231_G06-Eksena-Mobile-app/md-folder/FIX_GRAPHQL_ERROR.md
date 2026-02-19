# Fix for GraphQL Entity Not Authorized Error

## 🔧 Solution: Clear Expo Cache

Your error is caused by Expo caching an old project reference. Here's how to fix it:

### Step 1: Stop the Server
If `npm start` is running, press **Ctrl+C** to stop it.

### Step 2: Delete the Cache Folder

Open Command Prompt and run:

```bash
cd "c:\Users\manip\Downloads\ver-02-11-mobile\ver-02-05-mobile\ver 12-23-mobile\APC_2025_2026_T1_SS231_G06-Eksena-Mobile-app\Mobile-App\frontend"
```

Then delete the `.expo` folder:

```bash
rmdir /s /q .expo
```

Or if that doesn't work, delete it manually:
1. Open the `frontend` folder
2. Show hidden files (Ctrl+H or View → Hidden items)
3. Delete the `.expo` folder if you see it

### Step 3: Clear Node Modules Cache

```bash
npm cache clean --force
```

### Step 4: Reinstall Dependencies

```bash
npm install
```

### Step 5: Start Again

```bash
npm start
```

---

## ✅ What This Does

- ✅ Removes old Expo project cache
- ✅ Clears npm cache
- ✅ Reinstalls dependencies
- ✅ Starts fresh with no old references

---

## 📝 Quick Command Summary

```bash
# Navigate to frontend
cd "Mobile-App/frontend"

# Remove Expo cache
rmdir /s /q .expo

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
npm install

# Start app
npm start
```

Copy and paste these commands one by one.

---

## 🎯 After Running These Steps

When you run `npm start`:
- ✅ Should NOT ask about EAS login
- ✅ Should generate fresh QR code
- ✅ Scanning should work without errors

---

## 🆘 If You Still Get the Error

Try this alternative:

```bash
npx expo start --clear
```

The `--clear` flag tells Expo to clear its cache and start fresh.

---

## 💡 Why This Happens

When you clone a project from GitHub or share files, Expo caches metadata about the project. That cache can point to:
- Old Expo accounts
- Old project owners
- Invalid project references

Clearing the cache forces Expo to treat this as a fresh project!

---

**Try these steps and let me know if the error goes away!** 🚀
