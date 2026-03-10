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
  verifiedUsers: Set<string>;
  toggleVerified: (userId: string) => void;
  blockedUsers: Set<string>;
  toggleBlocked: (userId: string) => void;
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
  });

  const [pinnedAnnouncement, setPinnedAnnouncement] = useState("");
  const [themeColor, setThemeColor] = useState("oklch(0.62 0.22 300)");
  const [monetizationTargets, setMonetizationTargets] = useState({
    followers: 20000,
    views: 10000000,
  });
  const [verifiedUsers, setVerifiedUsers] = useState<Set<string>>(new Set());
  const [blockedUsers, setBlockedUsers] = useState<Set<string>>(new Set());

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
