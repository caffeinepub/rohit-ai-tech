# Rohit AI Tech

## Current State
Full-featured social media PWA with Home Feed, Reels, Explore, Notifications, Profile, Admin Panel, Wallet, DMs, Stories, content moderation, and ad system. The Go Live button in Admin Panel currently shows a toast "coming soon" message. There is no live streaming UI.

## Requested Changes (Diff)

### Add
- `LiveStreamPage` component: full-screen live stream UI with simulated live feed, viewer count, live chat/comments, heart reactions, and end stream button
- Go Live button accessible from Profile page (for creators) -- opens the LiveStreamPage
- Live badge indicator on the Home Feed stories row when someone is live
- Viewer mode: other users can tap a live badge to watch the stream
- Admin Panel Go Live toggle: when enabled, creators can go live; when disabled, button is hidden

### Modify
- AdminPanel.tsx: wire the Go Live section so admin can toggle live streaming on/off for the app; when enabled, creators get access
- HomeFeed.tsx: add `live` as a NavTab, add live stream viewer overlay; show LIVE badge on stories row for active streams
- ProfilePage.tsx: add "Go Live" button below profile stats (only visible when admin has enabled live streaming)

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/LiveStreamPage.tsx` -- full-screen live UI with:
   - Simulated camera feed (dark gradient + animated pulse)
   - LIVE red badge + viewer count (auto-incrementing)
   - Floating live chat messages (auto-generated from fake viewers)
   - Heart reaction button with floating hearts animation
   - End Stream button with confirmation
   - Creator name and stream title overlay
2. Update `AdminContext.tsx` to add `liveStreamingEnabled` flag (default true now)
3. Update `AdminPanel.tsx`: Go Live section becomes a real toggle + shows active streams count
4. Update `HomeFeed.tsx`: add live viewer overlay when `activeTab === 'live'`; add LIVE pulse badge on one story circle
5. Update `ProfilePage.tsx`: add Go Live button that sets activeTab to 'live' (passed via callback)
