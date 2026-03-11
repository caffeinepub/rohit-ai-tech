import { createContext, useContext } from "react";

// Watch-to-Earn is currently DISABLED.
// Users watch Reels for free. Rewards are paused by admin.

interface WatchEarnContextValue {
  reelsWatched: number;
  coinBalance: number;
  progressToNextCoin: number;
  incrementWatch: () => void;
  justEarned: boolean;
}

const WatchEarnContext = createContext<WatchEarnContextValue>({
  reelsWatched: 0,
  coinBalance: 0,
  progressToNextCoin: 0,
  incrementWatch: () => {},
  justEarned: false,
});

export function WatchEarnProvider({ children }: { children: React.ReactNode }) {
  // Rewards disabled - all values are inert stubs
  return (
    <WatchEarnContext.Provider
      value={{
        reelsWatched: 0,
        coinBalance: 0,
        progressToNextCoin: 0,
        incrementWatch: () => {},
        justEarned: false,
      }}
    >
      {children}
    </WatchEarnContext.Provider>
  );
}

export function useWatchEarn() {
  return useContext(WatchEarnContext);
}
