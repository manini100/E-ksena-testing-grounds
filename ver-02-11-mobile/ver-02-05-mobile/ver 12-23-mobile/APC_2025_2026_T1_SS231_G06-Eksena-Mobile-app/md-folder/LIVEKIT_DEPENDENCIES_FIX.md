# LiveKit Dependencies Installation Guide

## Problem
When installing `livekit-react-native`, npm tries to download dependencies from Git, but Git is not available on your system.

## Solution

### Option 1: Install Git (Recommended)

**Windows:**
1. Download Git from: https://git-scm.com/download/win
2. Run the installer
3. Accept all default options
4. Restart your terminal
5. Try installing again:
```bash
npm install livekit-client livekit-react-native
```

### Option 2: Use Alternative LiveKit Package

If you don't want to install Git, use the regular `livekit-client` only (without `livekit-react-native`):

```bash
npm install livekit-client
```

Then create your own wrapper to use LiveKit in React Native:

```typescript
// frontend/services/LiveKitClientService.ts
import { Room, RoomOptions } from 'livekit-client';

export const createLiveKitRoom = async (
  url: string,
  token: string,
  options?: RoomOptions
): Promise<Room> => {
  const room = new Room(options);
  await room.connect(url, token);
  return room;
};

export { Room } from 'livekit-client';
```

### Option 3: Use Native WebRTC Instead

For a lightweight solution, use React Native's built-in WebRTC:

```typescript
// frontend/services/WebRTCService.ts
import { RTCPeerConnection, RTCSessionDescription } from 'react-native-webrtc';

export const createPeerConnection = async (): Promise<RTCPeerConnection> => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [
      { urls: ['stun:stun.l.google.com:19302'] }
    ]
  });
  return peerConnection;
};
```

---

## Recommended: Install Git First

**Why?** 
- Most development workflows require Git
- You'll need it for version control anyway
- Future packages may also depend on Git

**Windows Installation Steps:**
1. Go to: https://git-scm.com/download/win
2. Download the latest version (currently 2.43+)
3. Run `Git-2.xx.x-64-bit.exe`
4. Choose defaults (click Next through all screens)
5. On "Adjusting PATH" screen: Select "Git from the command line and also from 3rd-party software"
6. Finish installation
7. **Restart your terminal completely** (close and reopen)
8. Verify Git is installed:
```bash
git --version
```

Should output something like: `git version 2.43.0.windows.1`

**Then install LiveKit:**
```bash
cd C:\Users\manip\Downloads\ver-02-11-mobile\ver-02-05-mobile\ver\ 12-23-mobile\APC_2025_2026_T1_SS231_G06-Eksena-Mobile-app\Mobile-App\frontend

npm install livekit-client livekit-react-native
```

---

## Quick Fix: Use Minimal Dependencies

If you want to proceed without Git right now, use this reduced setup:

```bash
# Install just the core LiveKit client (no Git required)
npm install livekit-client

# Optionally add WebRTC for React Native
npm install react-native-webrtc
```

Then in your code:
```typescript
import { Room } from 'livekit-client';

// Use Room directly without the wrapper
```

---

## Troubleshooting

### "git is not recognized"
- Git is installed but not in your PATH
- Restart your terminal completely
- Or reinstall Git and select "Add to PATH" option

### "Still getting Git error"
- Make sure you restarted your terminal **completely** (not just new tab)
- Try using PowerShell instead of CMD
- Check Git installation: `where git` (should show path to git.exe)

### "npm ERR! enoent git"
- This means npm can't find the git executable
- Verify Git is installed: `git --version`
- Restart terminal and try again

---

## Summary

| Option | Steps | Git Required | Notes |
|--------|-------|--------------|-------|
| **Option 1** | Install Git → npm install | ✅ Yes | Recommended, full support |
| **Option 2** | npm install livekit-client | ❌ No | Minimal, works but missing native bindings |
| **Option 3** | Manual WebRTC setup | ❌ No | Most control, but more complex |

Choose **Option 1** if possible - it's the proper way to set up development tools.

---

## Next Steps

1. Install Git (if using Option 1)
2. Restart terminal
3. Run: `npm install livekit-client livekit-react-native`
4. Verify with: `npm list livekit-client`
5. Continue with ExploreScreen integration

Once dependencies are installed, you can use the `getLiveKitToken()` function in your screens!
