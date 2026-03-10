# Rohit AI Tech

## Current State
Full social media app with HomeFeed, Reels, Explore, Profile, Notifications, DMs, Camera. ModerationContext handles channel status. No admin panel exists.

## Requested Changes (Diff)

### Add
- New `AdminPanel` page accessible from Profile page via an "Admin Panel" button
- **Feature Toggles section**: ON/OFF switches for Stories, DMs, Reels, Explore, Notifications, Monetization, Camera, Content Moderation
- **Go Live placeholder button**: Big "Go Live" button in the panel with a "Coming Soon" state — tappable but shows a toast/badge saying it will be activated later
- **Content Management section**:
  - Pin/unpin announcements (text input + pin button, shows pinned announcement banner on HomeFeed when active)
  - Theme color picker (preset swatches: purple, blue, green, amber, red — updates CSS accent color app-wide)
  - Monetization target editor (editable number fields for Followers goal and Views goal; saves and reflects in ProfilePage Creator Dashboard)
- **User Control section**:
  - User list (mock users: @priya.sharma, @arjun.dev, @meera.k, @vikas.r)
  - Verify user (Blue Tick toggle) per user
  - Block user per user (marks them blocked)
- `AdminContext` to store all admin state (feature flags, announcement, theme color, monetization targets, verified/blocked users) and provide it app-wide
- Feature flags consumed by HomeFeed (Stories, DMs visible/hidden), ReelsPage (Reels toggle), bottom nav (show/hide tabs)
- Pinned announcement shown as a dismissable banner at top of HomeFeed when set
- Verified (blue tick) badge shown on user entries in NotificationsPage and DMs

### Modify
- `App.tsx`: wrap with `AdminProvider`, add navigation to AdminPanel
- `HomeFeed.tsx`: read feature flags for Stories, camera swipe (DMs), show pinned announcement banner
- `ProfilePage.tsx`: read monetization targets from AdminContext; add "Admin Panel" button
- Bottom nav in HomeFeed: hide Reels/Explore tabs if those features are toggled off

### Remove
- Nothing removed

## Implementation Plan
1. Create `AdminContext.tsx` with all state: featureFlags, pinnedAnnouncement, themeColor, monetizationTargets, verifiedUsers Set, blockedUsers Set, and setters
2. Create `AdminPanel.tsx` page with four sections: Feature Toggles, Go Live, Content Management, User Control
3. Update `App.tsx` to wrap with AdminProvider
4. Update `HomeFeed.tsx` to consume feature flags (hide Stories, DMs swipe) and show pinned announcement banner
5. Update `ProfilePage.tsx` to consume monetization targets from context, add Admin Panel navigation button
6. Apply theme color from AdminContext to root CSS variable
