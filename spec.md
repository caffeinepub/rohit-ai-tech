# Rohit AI Tech

## Current State
- Creator Dashboard shows Monetization Tracker with followersGoal=2000 and viewsGoal=10M
- No Monetize status badge or wallet/bank details feature
- Reels have likes, comments, shares counts but no view counts

## Requested Changes (Diff)

### Add
- Monetize status badge (green, active) when both follower and view goals are met
- Wallet section on Profile page showing earnings balance and a Bank Details form (Account Number, IFSC, Bank Name) accessible via a button
- View count display on each Reel card (below or alongside existing stats)

### Modify
- followersGoal: 2000 → 20000 (20K)
- viewsGoal stays at 10,000,000 (10M) -- already correct
- Monetize activates only when BOTH goals are achieved
- REELS data: add viewCount field to each reel; show views count in the action bar or bottom info

### Remove
- Nothing removed

## Implementation Plan
1. ProfilePage.tsx: update followersGoal to 20000; derive monetizeActive = followersAchieved && viewsAchieved; show Monetize badge when active
2. ProfilePage.tsx: add Wallet card below Creator Dashboard with balance display and a Bank Details sheet (Account Number, IFSC, Bank Name fields + Save button)
3. ReelsPage.tsx: add views field to REELS data; display view count (Eye icon + formatted number) in the right action bar or bottom area
