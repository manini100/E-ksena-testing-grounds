# Switching from Mapbox to Google Maps

## Why Switch?

**Mapbox** (`@rnmapbox/maps`) requires:
- Native modules not in Expo Go ❌
- Mapbox downloads token for builds ❌
- More complex setup ❌

**Google Maps** (`react-native-maps`) is:
- Already installed in your project ✅
- More compatible with Expo Go (though still needs dev build for full features) ✅
- Simpler setup ✅

**However:** You still can't use Expo Go because of `livekit-react-native` (also requires native modules).

---

## Steps to Switch

### Step 1: Remove Mapbox Package

```powershell
npm uninstall @rnmapbox/maps
```

### Step 2: Remove Mapbox from Android Build

Edit `android/build.gradle` and remove the Mapbox Maven repository:

```groovy
allprojects {
  repositories {
    google()
    mavenCentral()
    maven { url 'https://www.jitpack.io' }
    // Remove the Mapbox repository block
  }
}
```

### Step 3: Remove Mapbox Token from eas.json

Edit `eas.json` and remove the `MAPBOX_DOWNLOADS_TOKEN` from env sections (or leave empty if you want to keep the structure).

### Step 4: Update Your Code

Replace Mapbox imports and components with `react-native-maps`:

**Before (Mapbox):**
```tsx
import Mapbox from '@rnmapbox/maps';

<Mapbox.MapView style={{ flex: 1 }}>
  <Mapbox.Camera centerCoordinate={[longitude, latitude]} zoomLevel={12} />
</Mapbox.MapView>
```

**After (Google Maps):**
```tsx
import MapView, { Marker } from 'react-native-maps';

<MapView
  style={{ flex: 1 }}
  initialRegion={{
    latitude: latitude,
    longitude: longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
>
  <Marker coordinate={{ latitude, longitude }} />
</MapView>
```

### Step 5: Add Google Maps API Key (if needed)

If you want to use Google Maps features, you'll need a Google Maps API key:

1. Get API key from https://console.cloud.google.com/google/maps-apis
2. Add to `app.json`:
```json
{
  "expo": {
    "android": {
      "config": {
        "googleMaps": {
          "apiKey": "YOUR_API_KEY_HERE"
        }
      }
    }
  }
}
```

Or set it in code:
```tsx
import { PROVIDER_GOOGLE } from 'react-native-maps';

<MapView provider={PROVIDER_GOOGLE} ... />
```

### Step 6: Clean and Rebuild

```powershell
# Remove node_modules and reinstall
Remove-Item -Recurse -Force node_modules
npm install

# Rebuild
npx eas build --profile development --platform android
```

---

## Benefits

✅ **Simpler builds** - No Mapbox token needed  
✅ **Easier setup** - react-native-maps is more standard  
✅ **Better Expo Go compatibility** - Though you still need dev build for LiveKit  

---

## Important Note

**You still can't use Expo Go** because:
- `livekit-react-native` requires native modules not in Expo Go
- You'll still need to build a development app

But removing Mapbox will:
- Simplify your build process
- Remove the need for Mapbox token
- Make builds faster and more reliable

---

## Quick Reference

| Feature | Mapbox | Google Maps (react-native-maps) |
|---------|--------|--------------------------------|
| Native modules | ✅ Required | ✅ Required |
| Works in Expo Go | ❌ No | ⚠️ Limited |
| Needs dev build | ✅ Yes | ✅ Yes |
| Requires token/key | ✅ Mapbox token | ⚠️ Google API key (optional) |
| Build complexity | ❌ High | ✅ Lower |

---

## After Switching

1. Remove `@rnmapbox/maps` from package.json
2. Update all map components to use `react-native-maps`
3. Remove Mapbox repository from `android/build.gradle`
4. Rebuild your app

You'll still need a development build (not Expo Go) because of LiveKit, but the build process will be simpler!
