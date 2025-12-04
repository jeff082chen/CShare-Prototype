# CShare Testing Guide

This guide explains how to test the CShare rental marketplace application.

## Table of Contents

- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Manual Testing](#manual-testing)
- [Automated Testing Dashboard](#automated-testing-dashboard)
- [Test Data Generation](#test-data-generation)
- [Testing Workflows](#testing-workflows)
- [Analytics & Session Replay](#analytics--session-replay)
- [Common Issues](#common-issues)

## Overview

CShare is a Firebase-based web application for Cornell Tech students to share and rent household items. The testing infrastructure includes:

- Built-in testing dashboard with analytics
- Automated user journey testing
- Session replay and funnel analysis
- Test data generation tools

## Prerequisites

1. **Firebase Setup**: Ensure Firebase is configured correctly
   - See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for setup instructions
   - Verify [firebase-config.js](firebase-config.js) has your project credentials

2. **Web Server**: Run a local web server to avoid CORS issues
   ```bash
   # Using Python 3
   python3 -m http.server 8000

   # Using Node.js (if you have http-server installed)
   npx http-server -p 8000
   ```

3. **Browser**: Use a modern browser (Chrome, Firefox, Safari, Edge)

4. **Test Accounts**: Create 2+ test user accounts via [login.html](login.html) to test interactions

## Manual Testing

### Basic User Flows

1. **User Registration & Login**
   - Navigate to [login.html](login.html)
   - Create a new account with email/password
   - Verify logout and re-login works

2. **Creating a Listing**
   - Click "List an Item"
   - Fill out the form with item details
   - Verify the item appears in "My Items"

3. **Browsing Items**
   - Search for items using the search bar
   - Filter by category
   - View item details

4. **Booking Flow**
   - Click on an item (not your own)
   - Click "Request to Book"
   - Select start/end dates
   - Submit booking request

5. **Chat System**
   - Open chat from item detail page
   - Send messages
   - Verify real-time message delivery
   - Test typing indicators

6. **Booking Management**
   - As item owner: View "Owner Bookings"
   - Accept/decline booking requests
   - As renter: View "My Bookings"
   - Check booking status updates

## Automated Testing Dashboard

The app includes a comprehensive testing dashboard accessible from the home screen.

### Accessing the Dashboard

1. Log in to the app
2. Click "📊 Testing Dashboard" button on home screen
3. The dashboard shows real-time analytics

### Running Automated Tests

The automated test simulates a complete user journey:

```javascript
// Automated test flow:
1. View multiple random items
2. Open chat with item owner
3. Send a message
4. Submit a booking request
```

**To run:**
1. Go to Testing Dashboard
2. Click "Run Automated Test" under "🧪 Automated User Testing"
3. Watch the test log populate in real-time
4. Analytics will update automatically

## Test Data Generation

### Generate Test Listings

Two ways to create test listings:

**Option 1: From Home Screen**
- Click "🧪 Generate Test Listings" button
- Generates 10 random listings

**Option 2: Using seed-data.html**
- Open [seed-data.html](seed-data.html) in browser
- Follow on-screen instructions
- Creates diverse test data

### Clearing Test Data

To remove your test listings:
1. Click "🧪 Generate Test Listings"
2. Click "🗑️ Clear All My Listings"
3. Confirm deletion

## Testing Workflows

### End-to-End Rental Flow

Test the complete rental cycle with 2 users:

**User A (Item Owner):**
1. Create a listing (e.g., "Vacuum Cleaner")
2. Wait for booking request

**User B (Renter):**
1. Search for the item
2. View item details
3. Open chat and send a message
4. Submit booking request

**User A:**
1. Check "Owner Bookings" → "Pending" tab
2. Review booking details
3. Accept the booking

**User B:**
1. Check "My Bookings" → "Accepted" tab
2. Verify booking appears

**Both:**
1. Use chat to coordinate pickup
2. After rental: Archive the booking

### Preferences Testing

Test the recommendation algorithm:

1. Click "Preferences" button
2. Set preferred categories (e.g., Electronics, Kitchen)
3. Adjust importance sliders:
   - Price sensitivity
   - Category importance
   - Availability flexibility
   - Urgency sensitivity
4. Set max price and date range
5. Save preferences
6. Return to home and verify items are ranked accordingly

### Chat System Testing

Test real-time chat features:

1. **Basic messaging:**
   - Open chat between 2 users
   - Send messages from both sides
   - Verify real-time delivery

2. **Typing indicators:**
   - Type in chat input (don't send)
   - Other user should see "... is typing"

3. **Multiple chats:**
   - Open "💬 My Chats"
   - Verify all conversations listed
   - Check unread indicators

## Analytics & Session Replay

### Conversion Funnel

Track user journey metrics:

1. Go to Testing Dashboard
2. View "🔄 User Conversion Funnel"
3. Metrics tracked:
   - Item views
   - Chats opened
   - Booking requests
   - Accepted bookings
   - Conversion rate

### Session Replay

Replay user sessions step-by-step:

1. Generate activity (browse items, chat, book)
2. Go to Testing Dashboard → "🎬 Session Replay"
3. Select a session from dropdown
4. Click "▶️ Replay Session"
5. Watch actions replay in chronological order

### Detailed Session Playback

Advanced replay with timeline scrubbing:

1. Go to "🎥 Detailed Session Playback"
2. Select a recorded session
3. Click "Load Session"
4. Use playback controls:
   - Play/Pause/Reset
   - Adjust speed (1x, 2x, 4x)
   - Scrub timeline
5. View event timeline and UI state changes

### Top Items & Categories

Monitor popular content:

1. View "🏆 Top 5 Most Viewed Items"
2. Check "📁 Top 5 Categories"
3. Use for content strategy insights

## Common Issues

### Firebase Connection Errors

**Problem:** "Firebase not initialized" error

**Solution:**
- Check [firebase-config.js](firebase-config.js) has correct credentials
- Verify Firebase project is active in Firebase Console
- Check browser console for authentication errors

### CORS Errors

**Problem:** "Access to fetch blocked by CORS policy"

**Solution:**
- Don't open HTML files directly (`file://` protocol)
- Use a local web server (see Prerequisites)
- Access via `http://localhost:8000`

### Chat Not Working

**Problem:** Messages not appearing in real-time

**Solution:**
- Verify Firebase Realtime Database rules allow read/write
- Check both users are logged in
- Refresh the page
- Check browser console for errors

### Bookings Not Appearing

**Problem:** Booking requests not showing up

**Solution:**
- Verify you're checking the correct tab (Pending/Accepted/Declined)
- Check Firestore security rules
- Ensure both users are using the same Firebase project
- Check browser console for permission errors

### Analytics Not Recording

**Problem:** Dashboard shows zero metrics

**Solution:**
- Analytics are session-based (per user session)
- Generate activity by browsing items
- Click "Run Automated Test" to populate data
- Check browser console for logging errors

## Testing Checklist

Use this checklist for comprehensive testing:

- [ ] User can register and login
- [ ] User can create a listing
- [ ] Items appear in home feed
- [ ] Search functionality works
- [ ] Item detail page displays correctly
- [ ] Chat opens and messages send/receive
- [ ] Typing indicators appear
- [ ] Booking request submits successfully
- [ ] Owner receives booking notification
- [ ] Owner can accept/decline bookings
- [ ] Renter sees booking status updates
- [ ] Preferences save and affect item ranking
- [ ] Test data generation works
- [ ] Analytics dashboard populates
- [ ] Session replay functions
- [ ] Automated test completes successfully
- [ ] User can logout

## Browser DevTools

Use browser developer tools for debugging:

**Console Tab:**
- View app logs and errors
- Analytics events are logged here

**Network Tab:**
- Monitor Firebase API calls
- Check for failed requests

**Application Tab:**
- Inspect localStorage (user preferences)
- View IndexedDB (Firebase cache)

## Firebase Console Monitoring

Monitor backend data in Firebase Console:

1. **Authentication:** Check registered users
2. **Firestore Database:**
   - View `items` collection
   - View `bookings` collection
   - View `users` collection
3. **Realtime Database:** View `chats` structure
4. **Analytics:** Monitor app usage (if enabled)

## Notes

- This app uses Firebase Firestore for listings/bookings and Firebase Realtime Database for chat
- Analytics are stored in Firestore under the `analytics` collection
- Session data is stored per user and can be replayed from the Testing Dashboard
- All dates are stored in ISO format
- Test listings are tagged with the creating user's ID

## Support

For setup issues, see [FIREBASE_SETUP.md](FIREBASE_SETUP.md)

For code questions, check the inline comments in:
- [app.js](app.js) - Main application logic
- [firebase-config.js](firebase-config.js) - Firebase configuration
- [index.html](index.html) - Main app structure
