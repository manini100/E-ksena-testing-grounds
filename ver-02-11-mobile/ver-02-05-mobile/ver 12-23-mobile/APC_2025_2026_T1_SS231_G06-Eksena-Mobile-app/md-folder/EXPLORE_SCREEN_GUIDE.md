# ExploreScreen - SMS Emergency Reporting Integration

## Overview
The `ExploreScreen` is a new screen that allows citizens to report emergencies via SMS and automatically initiate a LiveKit session for real-time communication with responders.

## File Location
```
Mobile-App/frontend/screens/main/ExploreScreen.tsx
```

## Features

### 1. **SMS Emergency Report**
- Citizens enter their phone number and emergency description
- Location is captured automatically using `expo-location`
- Report is saved to Supabase `conversations` and `messages` tables

### 2. **Automatic LiveKit Session**
- Once report is submitted, a LiveKit token is generated
- Session is created for responders to connect
- Real-time video/audio communication enabled

### 3. **User-Friendly Interface**
- Clean, intuitive form layout
- Input validation
- Loading states and error handling
- Informative UI with step-by-step guide
- Character counter for message input

## Data Flow

```
User Input (Phone + Message)
    ↓
Request Location Permission
    ↓
Get Current Location (Lat/Lng)
    ↓
Upsert Conversation in Supabase
    ↓
Insert Message with Location
    ↓
Request LiveKit Token from Edge Function
    ↓
Success Alert + Ready for Live Session
```

## Required Database Tables

Your Supabase database needs these tables:

### 1. **conversations** table
```sql
CREATE TABLE conversations (
  id SERIAL PRIMARY KEY,
  phone_number TEXT UNIQUE NOT NULL,
  last_message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 2. **messages** table
```sql
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  conversation_id INTEGER REFERENCES conversations(id),
  content TEXT,
  sender TEXT, -- 'incoming' or 'outgoing'
  latitude NUMERIC,
  longitude NUMERIC,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Dependencies Required

Make sure these are installed in your `frontend/package.json`:

```bash
npm install expo-location livekit-client livekit-react-native
```

## Integration with Navigation

To add this screen to your navigation, update your navigator:

```typescript
// navigation/MainStack.tsx
import ExploreScreen from '../screens/main/ExploreScreen';

// Add to your Tab or Stack navigator:
<Stack.Screen 
  name="Explore" 
  component={ExploreScreen}
  options={{
    title: 'Emergency SMS',
    headerStyle: { backgroundColor: '#f5f5f5' },
    headerTitleStyle: { fontWeight: 'bold' }
  }}
/>
```

## How It Works

### Step 1: User Input
- User enters phone number and emergency description
- Form validates input before submission

### Step 2: Location Capture
- App requests foreground location permission
- Uses `expo-location` to get precise coordinates
- If permission denied, alert shown and operation cancelled

### Step 3: Conversation Management
- Checks if conversation exists for this phone number
- If exists: updates `last_message`
- If not: creates new conversation record

### Step 4: Message Storage
- Message is saved with:
  - Associated conversation ID
  - Message content
  - Location coordinates
  - Sender = "incoming"
  - Timestamp

### Step 5: LiveKit Integration
- Calls `getLiveKitToken()` from LiveKitService
- Generates room name: `emergency-{conversation_id}`
- Room is ready for responders to join

### Step 6: Confirmation
- User sees success alert with conversation ID
- Form is cleared for next use
- Ready to navigate to live stream (if implemented)

## Component Props & State

```typescript
// State
phone: string              // User's phone number
message: string            // Emergency description
loading: boolean           // Loading state during submission

// Functions
handleSaveSMS()           // Main submission handler
clearForm()               // Clears input fields
```

## Error Handling

The component handles these error scenarios:

1. **Empty Fields** → Alert: "Please fill in all fields"
2. **Invalid Phone** → Alert: "Please enter a valid phone number"
3. **Location Permission** → Alert: "Location permission required"
4. **Supabase Errors** → Alert with specific error message
5. **LiveKit Token Error** → Alert: "Failed to generate live session"

## Styling

The component uses React Native StyleSheet with:
- **Colors**: Red (#dc2626) for emergency branding
- **Layout**: Flexbox for responsive design
- **Typography**: Clear hierarchy with sizes and weights
- **Spacing**: Consistent padding and margins
- **Elevation**: Shadow effects for visual depth

## Next Steps to Complete Integration

### 1. Create Database Tables
Run this SQL in your Supabase dashboard:
```sql
-- Run both CREATE TABLE statements above
```

### 2. Add to Navigation
Integrate ExploreScreen into your app's navigation stack

### 3. Add to Tab Navigator
If using bottom tabs, add this as one of the main screens

### 4. Test Functionality
- Test SMS submission
- Verify location capture
- Check Supabase inserts
- Confirm LiveKit token generation

### 5. Optional: Create LiveStream Screen
Create a screen to display the video call:
```typescript
// frontend/screens/main/LiveStreamScreen.tsx
// Uses token from ExploreScreen to connect to LiveKit room
```

## Troubleshooting

### "Could not retrieve conversation data"
- Check if `conversations` table exists
- Verify Supabase permissions allow insert/upsert

### "Location permission denied"
- Ensure app has location permission in manifest
- Test on actual device (emulator may not have location)

### "Failed to generate LiveKit token"
- Verify Edge Function `get-livekit-token` is deployed
- Check LIVEKIT_API_KEY and LIVEKIT_API_SECRET in Supabase secrets
- Check function logs in Supabase dashboard

### Phone number validation fails
- Ensure phone input includes country code (e.g., +1234567890)
- Minimum 7 characters after removing non-digits

## Security Considerations

1. **Phone Numbers**: Stored in plain text - consider encryption for production
2. **Messages**: Stored in plain text - consider encryption
3. **Location**: Stored with message - review privacy implications
4. **LiveKit Tokens**: Short-lived JWT - good security practice

## Future Enhancements

- [ ] SMS history/conversations list
- [ ] Read receipts for messages
- [ ] Map view of incident locations
- [ ] Escalation to voice/video call
- [ ] Responder assignment feedback
- [ ] Chat history with responders
- [ ] File/image attachments

## Support

For issues or questions:
1. Check Supabase logs for database errors
2. Check Edge Function logs for token generation errors
3. Review console.log statements (all prefixed with [EXPLORE])
4. Check mobile app LogBox for React Native errors
