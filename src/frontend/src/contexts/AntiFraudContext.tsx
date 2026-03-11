import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "rohit_antifraud";

export interface FlaggedAccount {
  id: string;
  username: string;
  reason: string;
  flaggedAt: string;
  status: "flagged" | "deleted" | "cleared";
}

interface AntiFraudStore {
  blockedDevices: string[];
  flaggedAccounts: FlaggedAccount[];
}

interface AntiFraudContextValue {
  blockedDevices: string[];
  flaggedAccounts: FlaggedAccount[];
  deviceFingerprint: string;
  scanAccount: (
    accountId: string,
    username: string,
    followers: number,
    views: number,
    likesRate: number,
  ) => void;
  blockDevice: (fingerprint: string) => void;
  clearAccount: (id: string) => void;
  deleteAccount: (id: string) => void;
  runFullScan: () => void;
}

const AntiFraudContext = createContext<AntiFraudContextValue | null>(null);

function getFingerprint(): string {
  try {
    return btoa(navigator.userAgent + screen.width);
  } catch {
    return "unknown";
  }
}

const MOCK_ACCOUNTS = [
  {
    id: "acc_bot1",
    username: "@insta_booster99",
    followers: 120000,
    views: 800,
    likesRate: 0.00005,
  },
  {
    id: "acc_spike2",
    username: "@viral_fake_views",
    followers: 5000,
    views: 90000000,
    likesRate: 0.002,
  },
  {
    id: "acc_legit3",
    username: "@real.creator.india",
    followers: 50000,
    views: 4000000,
    likesRate: 0.04,
  },
];

export function AntiFraudProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<AntiFraudStore>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw) as AntiFraudStore;
    } catch {
      /* ignore */
    }
    return { blockedDevices: [], flaggedAccounts: [] };
  });

  const deviceFingerprint = getFingerprint();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  }, [store]);

  const scanAccount = (
    accountId: string,
    username: string,
    followers: number,
    views: number,
    likesRate: number,
  ) => {
    let reason = "";
    if (followers > 50000 && likesRate < 0.001) {
      reason = `Bot-like engagement: ${(likesRate * 100).toFixed(4)}% like rate`;
    } else if (views > followers * 10) {
      const ratio = Math.round(views / Math.max(followers, 1));
      reason = `View spike: ${ratio}x follower count`;
    }
    if (!reason) return;

    setStore((prev) => {
      const existing = prev.flaggedAccounts.find((a) => a.id === accountId);
      if (existing) return prev; // already flagged
      return {
        ...prev,
        flaggedAccounts: [
          ...prev.flaggedAccounts,
          {
            id: accountId,
            username,
            reason,
            flaggedAt: new Date().toISOString(),
            status: "flagged",
          },
        ],
      };
    });
  };

  const blockDevice = (fingerprint: string) => {
    setStore((prev) => ({
      ...prev,
      blockedDevices: [...new Set([...prev.blockedDevices, fingerprint])],
    }));
  };

  const clearAccount = (id: string) => {
    setStore((prev) => ({
      ...prev,
      flaggedAccounts: prev.flaggedAccounts.map((a) =>
        a.id === id ? { ...a, status: "cleared" } : a,
      ),
    }));
  };

  const deleteAccount = (id: string) => {
    setStore((prev) => ({
      ...prev,
      blockedDevices: [...new Set([...prev.blockedDevices, deviceFingerprint])],
      flaggedAccounts: prev.flaggedAccounts.map((a) =>
        a.id === id ? { ...a, status: "deleted" } : a,
      ),
    }));
  };

  const runFullScan = () => {
    for (const acc of MOCK_ACCOUNTS) {
      scanAccount(
        acc.id,
        acc.username,
        acc.followers,
        acc.views,
        acc.likesRate,
      );
    }
  };

  return (
    <AntiFraudContext.Provider
      value={{
        blockedDevices: store.blockedDevices,
        flaggedAccounts: store.flaggedAccounts,
        deviceFingerprint,
        scanAccount,
        blockDevice,
        clearAccount,
        deleteAccount,
        runFullScan,
      }}
    >
      {children}
    </AntiFraudContext.Provider>
  );
}

export function useAntiFraud() {
  const ctx = useContext(AntiFraudContext);
  if (!ctx)
    throw new Error("useAntiFraud must be used within AntiFraudProvider");
  return ctx;
}
