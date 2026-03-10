# Rohit AI Tech

## Current State
- App has Welcome, Home Feed, Reels, and Profile pages
- Bottom nav has 6 tabs: Home, Explore (Compass icon), Reels, Create, Alerts, Profile
- The Explore tab currently does nothing (activeTab="explore" but no page rendered)
- Navigation state is managed inside HomeFeed.tsx

## Requested Changes (Diff)

### Add
- `ExplorePage.tsx`: full Explore/Discover page with:
  - Sticky search bar at top with magnifying glass icon and placeholder
  - Instagram-style mosaic grid below: mix of tall (2-row span), wide (2-col span), and 1x1 cells
  - 12+ sample content tiles (photos and videos with gradient placeholders)
  - Video tiles show a Play icon overlay
  - Smooth entrance animations

### Modify
- `HomeFeed.tsx`: import and render `<ExplorePage />` when `activeTab === "explore"` (same pattern as ProfilePage and ReelsPage)

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/pages/ExplorePage.tsx` with search bar + mosaic grid
2. Update `HomeFeed.tsx` to import and render ExplorePage on the explore tab
