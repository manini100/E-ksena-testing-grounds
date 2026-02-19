# Could the error be from node_modules?

## Short answer

The **PlatformConstants / TurboModule** error you see when scanning the QR is **mainly** because the app is opened in **Expo Go**. Expo Go doesn’t include the native modules this project needs, so it will keep failing there.

**node_modules** can sometimes make things worse (bad install, wrong versions, cache). It’s worth doing a **clean reinstall once** to rule that out, especially before testing with the **development build** (E-KSENA app).

---

## When to do a clean reinstall

- You still get odd errors **after** switching to the E-KSENA dev app (not Expo Go).
- You changed dependencies or upgraded Expo and things act weird.
- You want to rule out a corrupted or inconsistent install.

---

## Clean reinstall (Windows)

Run these in the **frontend** folder in order.

1. **Stop the dev server** (Ctrl+C in the terminal where `npm start` is running) and close any editor tabs that might be using files inside `node_modules`.
2. Run:

```powershell
cd Mobile-App\frontend

# Remove dependencies and caches
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# Clean npm cache and reinstall (uses legacy-peer-deps via .npmrc)
npm cache clean --force
npm install
```

3. If `npm install` still fails with **ERESOLVE** (peer dependency conflict), run:
   ```powershell
   npm install --legacy-peer-deps
   ```
   (The project has an `.npmrc` that enables `legacy-peer-deps` by default, so a normal `npm install` should already use it.)

4. Start with a clean Metro cache:
   ```powershell
   npx expo start --clear
   ```

Then **open the project in the E-KSENA development app** (not Expo Go) and scan the QR again.

---

## Summary

| Cause | What to do |
|--------|------------|
| **Using Expo Go** | Use the E-KSENA dev app to scan the QR (build once via EAS or `npx expo run:android`). |
| **Bad or inconsistent node_modules** | Do the clean reinstall above, then test again in the **E-KSENA** app. |

Doing both (clean install + use dev app) is the safest way to rule out node_modules and confirm the fix is “don’t use Expo Go.”
