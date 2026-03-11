# Rohit AI Tech

## Current State
- Profile page has Wallet card with Bank Details form
- DM chat thread exists; persistence may be partial
- Admin Panel has feature toggles, announcements, theme, monetization targets

## Requested Changes (Diff)

### Add
- Wallet withdrawal screen with 3 tabs: Bank Details, Withdraw (amount + request), History
- Withdrawal locked behind 20K followers + 10M views gate
- Admin Panel: Withdrawal Requests section (approve/reject)
- DM message persistence via localStorage

### Modify
- ProfilePage Wallet: full withdrawal flow with tabs
- AdminPanel: add withdrawal requests management
- DirectMessagesPage: persist messages per conversation in localStorage

### Remove
- Nothing

## Implementation Plan
1. ProfilePage: Wallet tabs (Bank, Withdraw, History); store requests in localStorage
2. AdminPanel: Withdrawal Requests section reads localStorage, approve/reject
3. DirectMessagesPage: save/load messages from localStorage per conversation
