# Rohit AI Tech

## Current State
A full-featured Instagram-inspired PWA with Reels, Stories, HomeFeed, Profile, DMs, Admin Panel, and monetization. Posts are stored in localStorage. Reels section has WhatsApp share button in the action bar. Interstitial ads (including Samsung Galaxy brand) appear after every 3 reels. Login exists but session check may not force login on first open. HomeFeed posts are not clickable to open full-screen reel player.

## Requested Changes (Diff)

### Add
- Forced mandatory login: If no valid session exists, ALWAYS show the Login/Welcome screen. User cannot see the feed without logging in.
- Instagram-style navigation: Clicking any photo or reel post in HomeFeed opens the ReelsPage in full-screen player mode, starting at that content.

### Modify
- Fix post persistence: Ensure uploaded reels and stories are saved to localStorage correctly and never disappear. On every app load, merge user posts from localStorage into the feed and profile grid.
- Celebrity content: Ensure the default reels feed is always pre-populated with 22+ viral celebrity reels (Mani Meraj, Amit Bhadana, Suraj Rokade, South Indian movies) so new users never see an empty feed.
- Remove WhatsApp button: Remove the WhatsApp share button (green WA icon) from the reels action bar. Only show Like, Comment, and Share buttons.
- Remove Samsung Galaxy ad and ALL interstitial ads: Completely disable interstitial ads. Remove the INTERSTITIAL_ADS array usage and the interstitial ad modal. Also remove sponsored ad banners between reels.
- Hide system/status bar UI: Ensure the app is truly full-screen with no system UI visible. Meta tags for `apple-mobile-web-app-status-bar-style: black-translucent` should be confirmed. Add CSS to hide any in-app elements that simulate a signal/status bar.

### Remove
- WhatsApp button from Reels action bar (the green WA button and label)
- Interstitial ad modal and all ad-related code triggering it
- Samsung Galaxy and all other interstitial ad definitions
- Sponsored ad cards between reels in the feed

## Implementation Plan
1. In ReelsPage.tsx: Remove WhatsApp button section from action bar. Remove INTERSTITIAL_ADS array, interstitialAd state, skip countdown, and the interstitial ad modal JSX. Remove sponsored ad cards.
2. In ReelsPage.tsx: Fix user post loading — ensure `user_posts` from localStorage always loads as reels at the top, with correct mediaUrl/thumbnail fields preserved.
3. In HomeFeed.tsx: Make feed post cards clickable — clicking opens ReelsPage with that post as the active reel (pass an `initialReel` prop or switch active tab to Reels).
4. In App.tsx: Enforce mandatory login — if no session found after splash, always go to `welcome` page; never go to `feed` without a valid session.
5. Ensure celebrity reels are always present in initial state and not lost on re-renders.
6. Add `<meta name="theme-color" content="#000000">` to ensure status bar is black/hidden.
