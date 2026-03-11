import { createContext, useContext, useEffect, useState } from "react";

export interface FeatureFlags {
  stories: boolean;
  dms: boolean;
  reels: boolean;
  explore: boolean;
  notifications: boolean;
  monetization: boolean;
  camera: boolean;
  contentModeration: boolean;
  liveStreamingEnabled: boolean;
}

const AD_REVENUE_KEY = "rohit_admin_ad_revenue";
const AD_IMPRESSION_KEY = "rohit_admin_ad_impressions";
const ADMIN_EXTRA_KEY = "rohit_admin_extra";

export interface UserReport {
  id: string;
  reportedUser: string;
  reportedBy: string;
  reason: string;
  timestamp: string;
  resolved: boolean;
}

interface AdminExtraStore {
  verifiedUsers: string[];
  blockedUserIds: string[];
  reports: UserReport[];
  totalViewRevenue: number;
}

interface AdminContextValue {
  featureFlags: FeatureFlags;
  toggleFeature: (key: keyof FeatureFlags) => void;
  pinnedAnnouncement: string;
  setPinnedAnnouncement: (text: string) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  monetizationTargets: { followers: number; views: number };
  setMonetizationTargets: (t: { followers: number; views: number }) => void;
  // Legacy sets (kept for backward compat)
  verifiedUsers: Set<string>;
  toggleVerified: (userId: string) => void;
  blockedUsers: Set<string>;
  toggleBlocked: (userId: string) => void;
  // Ad revenue
  adminAdRevenue: number;
  adminAdImpressions: number;
  recordAdImpression: (amount: number) => void;
  resetAdRevenue: () => void;
  // New: verified/blocked as arrays + reports + view revenue
  verifiedUsersList: string[];
  blockedUserIds: string[];
  reports: UserReport[];
  totalViewRevenue: number;
  verifyUser: (username: string) => void;
  unverifyUser: (username: string) => void;
  addViewRevenue: (amount: number) => void;
  submitReport: (
    reportedUser: string,
    reason: string,
    reportedBy?: string,
  ) => void;
  resolveReport: (id: string) => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    stories: true,
    dms: true,
    reels: true,
    explore: true,
    notifications: true,
    monetization: true,
    camera: true,
    contentModeration: true,
    liveStreamingEnabled: true,
  });

  const [pinnedAnnouncement, setPinnedAnnouncement] = useState("");
  const [themeColor, setThemeColor] = useState("oklch(0.62 0.22 300)");
  const [monetizationTargets, setMonetizationTargets] = useState({
    followers: 20000,
    views: 10000000,
  });
  const [verifiedUsers, setVerifiedUsers] = useState<Set<string>>(new Set());
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());

  const [adminAdRevenue, setAdminAdRevenue] = useState<number>(() => {
    const saved = localStorage.getItem(AD_REVENUE_KEY);
    return saved ? Number.parseFloat(saved) : 0;
  });
  const [adminAdImpressions, setAdminAdImpressions] = useState<number>(() => {
    const saved = localStorage.getItem(AD_IMPRESSION_KEY);
    return saved ? Number.parseInt(saved, 10) : 0;
  });

  // Extra admin store
  const [extraStore, setExtraStore] = useState<AdminExtraStore>(() => {
    try {
      const raw = localStorage.getItem(ADMIN_EXTRA_KEY);
      if (raw) return JSON.parse(raw) as AdminExtraStore;
    } catch {
      /* ignore */
    }
    return {
      verifiedUsers: [],
      blockedUserIds: [],
      reports: [],
      totalViewRevenue: 0,
    };
  });

  useEffect(() => {
    localStorage.setItem(AD_REVENUE_KEY, adminAdRevenue.toFixed(2));
    localStorage.setItem(AD_IMPRESSION_KEY, String(adminAdImpressions));
  }, [adminAdRevenue, adminAdImpressions]);

  useEffect(() => {
    localStorage.setItem(ADMIN_EXTRA_KEY, JSON.stringify(extraStore));
  }, [extraStore]);

  const recordAdImpression = (amount: number) => {
    setAdminAdRevenue((prev) => Number.parseFloat((prev + amount).toFixed(2)));
    setAdminAdImpressions((prev) => prev + 1);
  };

  const resetAdRevenue = () => {
    setAdminAdRevenue(0);
    setAdminAdImpressions(0);
    localStorage.removeItem(AD_REVENUE_KEY);
    localStorage.removeItem(AD_IMPRESSION_KEY);
  };

  const toggleFeature = (key: keyof FeatureFlags) => {
    setFeatureFlags((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleVerified = (userId: string) => {
    setVerifiedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const toggleBlocked = (userId: string) => {
    setBlockedUsers((prev) => {
      const next = new Set(prev);
      if (next.has(userId)) next.delete(userId);
      else next.add(userId);
      return next;
    });
  };

  const verifyUser = (username: string) => {
    setExtraStore((prev) => ({
      ...prev,
      verifiedUsers: [...new Set([...prev.verifiedUsers, username])],
    }));
  };

  const unverifyUser = (username: string) => {
    setExtraStore((prev) => ({
      ...prev,
      verifiedUsers: prev.verifiedUsers.filter((u) => u !== username),
    }));
  };

  const addViewRevenue = (amount: number) => {
    setExtraStore((prev) => ({
      ...prev,
      totalViewRevenue: Number.parseFloat(
        (prev.totalViewRevenue + amount).toFixed(2),
      ),
    }));
  };

  const submitReport = (
    reportedUser: string,
    reason: string,
    reportedBy = "user",
  ) => {
    const report: UserReport = {
      id: `rpt_${Date.now()}`,
      reportedUser,
      reportedBy,
      reason,
      timestamp: new Date().toISOString(),
      resolved: false,
    };
    setExtraStore((prev) => ({ ...prev, reports: [report, ...prev.reports] }));
  };

  const resolveReport = (id: string) => {
    setExtraStore((prev) => ({
      ...prev,
      reports: prev.reports.map((r) =>
        r.id === id ? { ...r, resolved: true } : r,
      ),
    }));
  };

  useEffect(() => {
    document.documentElement.style.setProperty("--admin-accent", themeColor);
  }, [themeColor]);

  return (
    <AdminContext.Provider
      value={{
        featureFlags,
        toggleFeature,
        pinnedAnnouncement,
        setPinnedAnnouncement,
        themeColor,
        setThemeColor,
        monetizationTargets,
        setMonetizationTargets,
        verifiedUsers,
        toggleVerified,
        blockedUsers,
        toggleBlocked,
        adminAdRevenue,
        adminAdImpressions,
        recordAdImpression,
        resetAdRevenue,
        verifiedUsersList: extraStore.verifiedUsers,
        blockedUserIds: extraStore.blockedUserIds,
        reports: extraStore.reports,
        totalViewRevenue: extraStore.totalViewRevenue,
        verifyUser,
        unverifyUser,
        addViewRevenue,
        submitReport,
        resolveReport,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}
