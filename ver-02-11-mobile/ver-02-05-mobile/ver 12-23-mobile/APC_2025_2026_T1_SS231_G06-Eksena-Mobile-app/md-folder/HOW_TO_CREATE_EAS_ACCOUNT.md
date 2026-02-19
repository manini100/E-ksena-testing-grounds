# How to Create EAS Account and Log In

## 📝 Step 1: Create Free EAS Account

### Go to Expo Website
1. Open browser: https://expo.dev
2. Click **"Sign up"** (top right)
3. Choose **"Sign up with email"**

### Enter Your Information
- **Email:** Use your email address
- **Password:** Create a strong password (at least 8 characters)
- **Username:** Create a username (will be shown in your apps)
  - Can be anything: `yourname`, `myproject`, `eksena-team`, etc.
- Check "I agree to the terms"
- Click **"Create account"**

### Verify Your Email
1. Check your email inbox
2. Click the verification link from Expo
3. Your account is now created! ✅

---

## 🔐 Step 2: Log In via Command Line

### When `npm start` Asks to Log In

You'll see something like:
```
✔ Logged in as ...
? Do you have an Expo account? › (y/N)
```

Choose:
```
y (yes, I have an account)
```

### Enter Your Credentials
You'll be prompted for:
1. **Email or username:** Enter the email or username you just created
2. **Password:** Enter the password you created

Example:
```
✔ Email or username: yourname@gmail.com
✔ Password: ••••••••••
✔ Logged in as yourname
```

### Success!
Once logged in, you'll see:
```
✔ Logged in as yourname
```

Then `npm start` will proceed to start your app! 🎉

---

## 🎯 Step 3: Start Your App

Once logged in:
1. You'll see the Metro bundler start
2. QR code will appear
3. Scan with your phone
4. App loads! ✅

---

## 📝 Quick Reference

| Step | What to Do |
|------|-----------|
| 1 | Go to https://expo.dev |
| 2 | Click "Sign up" |
| 3 | Enter email, password, username |
| 4 | Verify your email |
| 5 | Run `npm start` in frontend folder |
| 6 | When asked, answer `y` (yes I have account) |
| 7 | Enter email/username |
| 8 | Enter password |
| 9 | Logged in! App starts! |

---

## 🆘 Troubleshooting

### "Invalid credentials"
- Double-check spelling of email/username
- Make sure you verified your email
- Try logging in at https://expo.dev first to confirm account works

### "Account not found"
- You might not have created the account yet
- Go to https://expo.dev and sign up first

### Forgot Password?
- Go to https://expo.dev
- Click "Forgot password"
- Follow the email instructions

### Still Can't Log In?
1. Open https://expo.dev in browser
2. Try logging in there first
3. If it works in browser, use same credentials in terminal
4. If it fails in browser, reset password first

---

## 💾 Save Your Credentials!

Once logged in, Expo saves your credentials locally. You won't need to log in again on this computer!

Next time you run `npm start`, it will automatically use your saved login. ✅

---

## ✅ You're Ready!

Once you:
1. ✅ Create account at https://expo.dev
2. ✅ Verify email
3. ✅ Log in via `npm start`
4. ✅ Scan QR code on phone

Your app will be running on your phone! 🚀

---

## 📱 Full Testing Flow

```bash
# Terminal 1: Backend
cd Mobile-App/backend
npm start
# Should show: Server running at http://192.168.100.11:3000

# Terminal 2: Frontend
cd Mobile-App/frontend
npm start
# Should show: QR code to scan
# When asked about EAS: Say 'y' and log in with credentials above
# Scan QR with phone camera
# App loads on phone!
```

---

**Need help? The account creation is free and takes 5 minutes!** ✨
