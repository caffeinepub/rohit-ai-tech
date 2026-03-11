import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  BadgeCheck,
  Ban,
  Bell,
  BookOpen,
  Camera,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Clock,
  Compass,
  DollarSign,
  Film,
  MessageCircle,
  Settings2,
  Shield,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type FeatureFlags, useAdmin } from "../contexts/AdminContext";
import { useAntiFraud } from "../contexts/AntiFraudContext";
import {
  calculateEarnings,
  getNextPayoutDate,
} from "../utils/monetizationEngine";

const FEATURE_LIST: {
  key: keyof FeatureFlags;
  label: string;
  icon: React.ReactNode;
}[] = [
  { key: "stories", label: "Stories", icon: <BookOpen className="h-5 w-5" /> },
  {
    key: "dms",
    label: "Direct Messages",
    icon: <MessageCircle className="h-5 w-5" />,
  },
  { key: "reels", label: "Reels", icon: <Film className="h-5 w-5" /> },
  { key: "explore", label: "Explore", icon: <Compass className="h-5 w-5" /> },
  {
    key: "notifications",
    label: "Notifications",
    icon: <Bell className="h-5 w-5" />,
  },
  {
    key: "monetization",
    label: "Monetization",
    icon: <DollarSign className="h-5 w-5" />,
  },
  { key: "camera", label: "Camera", icon: <Camera className="h-5 w-5" /> },
  {
    key: "contentModeration",
    label: "Content Moderation",
    icon: <Shield className="h-5 w-5" />,
  },
];

const THEME_COLORS = [
  { value: "oklch(0.62 0.22 300)", label: "Purple" },
  { value: "oklch(0.62 0.22 240)", label: "Blue" },
  { value: "oklch(0.62 0.22 155)", label: "Green" },
  { value: "oklch(0.72 0.18 70)", label: "Amber" },
  { value: "oklch(0.62 0.22 25)", label: "Red" },
  { value: "oklch(0.70 0.22 340)", label: "Pink" },
];

const MOCK_USERS = [
  { id: "@priya.sharma", name: "Priya Sharma" },
  { id: "@arjun.dev", name: "Arjun Dev" },
  { id: "@meera.k", name: "Meera K" },
  { id: "@vikas.r", name: "Vikas R" },
];

const MOCK_CREATORS = [
  {
    name: "Rahul Sharma",
    username: "@rahul.creates",
    followers: 1_200_000,
    views: 45_000_000,
  },
  {
    name: "Priya Nair",
    username: "@priya.viral",
    followers: 250_000,
    views: 18_000_000,
  },
  {
    name: "Arjun Singh",
    username: "@arjun.reels",
    followers: 85_000,
    views: 12_500_000,
  },
];

const TRENDING_CREATORS = [
  { name: "Mani Meraj", score: 9820, change: "+14%" },
  { name: "Amit Bhadana", score: 8450, change: "+9%" },
  { name: "Suraj Rokade", score: 7310, change: "+21%" },
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

interface AdminPanelProps {
  onBack: () => void;
}

interface WithdrawalRequest {
  id: number;
  amount: number;
  bankDetails: { accountNo: string; ifsc: string; bankName: string };
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  userName: string;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
  ocid,
  accent,
  badge,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  ocid: string;
  accent?: string;
  badge?: number;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div
      data-ocid={ocid}
      className="rounded-2xl overflow-hidden"
      style={{
        background: accent
          ? `linear-gradient(135deg, ${accent})`
          : "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full px-4 py-3 flex items-center gap-2 border-b border-white/[0.07] text-left"
      >
        <span className="text-cyan-400">{icon}</span>
        <span className="flex-1 text-[13px] font-bold uppercase tracking-widest text-white/60">
          {title}
        </span>
        {badge !== undefined && badge > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold rounded-full px-2 py-0.5 min-w-[22px] text-center">
            {badge}
          </span>
        )}
        {open ? (
          <ChevronUp className="h-4 w-4 text-white/30" />
        ) : (
          <ChevronDown className="h-4 w-4 text-white/30" />
        )}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function WithdrawalRequestsList() {
  const [requests, setRequests] = useState<WithdrawalRequest[]>([]);

  useEffect(() => {
    const load = () => {
      try {
        const saved = localStorage.getItem("rohit_withdrawal_requests");
        setRequests(saved ? JSON.parse(saved) : []);
      } catch {
        setRequests([]);
      }
    };
    load();
    window.addEventListener("storage", load);
    return () => window.removeEventListener("storage", load);
  }, []);

  const updateStatus = (id: number, status: "approved" | "rejected") => {
    const updated = requests.map((r) => (r.id === id ? { ...r, status } : r));
    setRequests(updated);
    localStorage.setItem("rohit_withdrawal_requests", JSON.stringify(updated));
    toast.success(
      status === "approved" ? "Payment approved ✓" : "Payment rejected",
    );
  };

  if (requests.length === 0) {
    return (
      <div
        data-ocid="admin.withdrawals.empty_state"
        className="px-4 py-8 flex flex-col items-center gap-2 text-center"
      >
        <Clock className="h-8 w-8 text-white/20" />
        <p className="text-[13px] text-white/30">No withdrawal requests yet</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-white/[0.05]">
      {requests.map((req, idx) => (
        <div
          key={req.id}
          data-ocid={`admin.withdrawals.item.${idx + 1}`}
          className="px-4 py-3.5 space-y-2"
        >
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-white">
                  ₹{req.amount.toLocaleString()}
                </span>
                <span
                  className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${
                    req.status === "approved"
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : req.status === "rejected"
                        ? "bg-red-500/15 border-red-500/30 text-red-400"
                        : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                  }`}
                >
                  {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                </span>
              </div>
              <p className="text-[11px] text-white/50 mt-0.5">{req.userName}</p>
              <p className="text-[11px] text-white/40">
                {req.bankDetails.bankName} · ···
                {req.bankDetails.accountNo.slice(-4)} · {req.bankDetails.ifsc}
              </p>
              <p className="text-[10px] text-white/30">
                {new Date(req.timestamp).toLocaleString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          {req.status === "pending" && (
            <div className="flex gap-2">
              <button
                type="button"
                data-ocid={`admin.withdrawals.confirm_button.${idx + 1}`}
                onClick={() => updateStatus(req.id, "approved")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors active:scale-95"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Approve
              </button>
              <button
                type="button"
                data-ocid={`admin.withdrawals.delete_button.${idx + 1}`}
                onClick={() => updateStatus(req.id, "rejected")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/25 transition-colors active:scale-95"
              >
                <XCircle className="h-3.5 w-3.5" />
                Reject
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const {
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
    resetAdRevenue,
    reports,
    totalViewRevenue,
    addViewRevenue,
    resolveReport,
  } = useAdmin();

  const {
    flaggedAccounts,
    clearAccount,
    deleteAccount,
    runFullScan,
    blockedDevices,
  } = useAntiFraud();

  const [announcementDraft, setAnnouncementDraft] =
    useState(pinnedAnnouncement);
  const [followersDraft, setFollowersDraft] = useState(
    String(monetizationTargets.followers),
  );
  const [viewsDraft, setViewsDraft] = useState(
    String(monetizationTargets.views),
  );
  const [autoPayout, setAutoPayout] = useState(true);
  const [standardSplit, setStandardSplit] = useState(50);
  const [bigCreatorSplit, setBigCreatorSplit] = useState(75);
  const [qualityBoost, setQualityBoost] = useState(true);
  const [paidCreators, setPaidCreators] = useState<Set<string>>(new Set());

  const nextPayoutDate = getNextPayoutDate();
  const pendingReports = reports.filter((r) => !r.resolved);
  const activeFlagged = flaggedAccounts.filter((a) => a.status === "flagged");

  const handlePinAnnouncement = () => {
    setPinnedAnnouncement(announcementDraft.trim());
    toast.success("Announcement pinned!");
  };

  const handleUnpin = () => {
    setPinnedAnnouncement("");
    setAnnouncementDraft("");
    toast.success("Announcement removed.");
  };

  const handleSaveTargets = () => {
    const followers = Number.parseInt(followersDraft, 10);
    const views = Number.parseInt(viewsDraft, 10);
    if (!Number.isNaN(followers) && !Number.isNaN(views)) {
      setMonetizationTargets({ followers, views });
      toast.success("Monetization targets updated!");
    } else {
      toast.error("Please enter valid numbers.");
    }
  };

  // Go Live handled via liveStreamingEnabled toggle

  const handleRunFraudScan = () => {
    runFullScan();
    toast.success("Fraud scan complete — flagged accounts updated.");
  };

  const handleProcessPayments = () => {
    const newPaid = new Set(paidCreators);
    for (const c of MOCK_CREATORS) {
      const earnings = calculateEarnings(c.views, c.followers);
      if (earnings.isEligible) newPaid.add(c.username);
    }
    setPaidCreators(newPaid);
    toast.success("All eligible payments processed! ✓");
  };

  return (
    <div
      data-ocid="admin.panel"
      className="min-h-screen bg-[#0a0a0f] text-foreground overflow-y-auto pb-10"
    >
      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.08] px-4 py-3 flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          data-ocid="admin.back.button"
          className="p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Settings2 className="h-5 w-5 text-[var(--admin-accent,oklch(0.62_0.22_300))]" />
          <h1 className="text-lg font-bold tracking-tight">Admin Panel</h1>
        </div>
      </div>

      <div className="px-4 pt-5 space-y-6">
        {/* Section 1: Feature Toggles */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          data-ocid="admin.features.section"
          className="rounded-2xl bg-white/[0.04] border border-white/[0.07] overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/50">
              Feature Toggles
            </h2>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {FEATURE_LIST.map(({ key, label, icon }, idx) => (
              <div
                key={key}
                className="flex items-center justify-between px-4 py-3.5"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`${
                      featureFlags[key]
                        ? "text-[var(--admin-accent,oklch(0.62_0.22_300))]"
                        : "text-white/30"
                    } transition-colors`}
                  >
                    {icon}
                  </span>
                  <Label
                    htmlFor={`toggle-${key}`}
                    className="text-[14px] font-medium cursor-pointer select-none"
                  >
                    {label}
                  </Label>
                </div>
                <Switch
                  id={`toggle-${key}`}
                  checked={featureFlags[key]}
                  onCheckedChange={() => toggleFeature(key)}
                  data-ocid={`admin.feature_toggle.${key}`}
                  aria-label={`Toggle ${label}`}
                  data-index={idx + 1}
                />
              </div>
            ))}
          </div>
        </motion.section>

        {/* Section 2: Live Broadcasting Toggle */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          data-ocid="admin.golive.section"
          className="rounded-2xl bg-white/[0.04] border border-white/[0.07] overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/50">
              Live Broadcasting
            </h2>
          </div>
          <div className="px-4 py-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className={
                  featureFlags.liveStreamingEnabled
                    ? "text-red-500"
                    : "text-white/30"
                }
              >
                <span className="relative flex h-3 w-3">
                  {featureFlags.liveStreamingEnabled && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${featureFlags.liveStreamingEnabled ? "bg-red-500" : "bg-white/20"}`}
                  />
                </span>
              </span>
              <div>
                <Label
                  htmlFor="toggle-liveStreamingEnabled"
                  className="text-[14px] font-medium cursor-pointer"
                >
                  Live Streaming
                </Label>
                <p
                  className={`text-[11px] mt-0.5 ${featureFlags.liveStreamingEnabled ? "text-green-400" : "text-white/30"}`}
                >
                  {featureFlags.liveStreamingEnabled
                    ? "Creators can now go live"
                    : "Live streaming is disabled"}
                </p>
              </div>
            </div>
            <Switch
              id="toggle-liveStreamingEnabled"
              data-ocid="admin.livestream.toggle"
              checked={featureFlags.liveStreamingEnabled}
              onCheckedChange={() => toggleFeature("liveStreamingEnabled")}
              aria-label="Toggle Live Streaming"
            />
          </div>
        </motion.section>

        {/* Section 3: Content Management */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          data-ocid="admin.content.section"
          className="rounded-2xl bg-white/[0.04] border border-white/[0.07] overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/50">
              Content Management
            </h2>
          </div>

          {/* Pin Announcement */}
          <div className="px-4 py-4 border-b border-white/[0.07] space-y-3">
            <p className="text-[13px] font-semibold text-white/70">
              📌 Pin Announcement
            </p>
            {pinnedAnnouncement ? (
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 flex items-start justify-between gap-2">
                <p className="text-[13px] text-amber-300 flex-1">
                  {pinnedAnnouncement}
                </p>
                <button
                  type="button"
                  data-ocid="admin.announcement.secondary_button"
                  onClick={handleUnpin}
                  className="text-[11px] text-amber-400 border border-amber-500/40 rounded-lg px-2 py-1 hover:bg-amber-500/10 transition-colors shrink-0"
                >
                  Unpin
                </button>
              </div>
            ) : null}
            <div className="flex gap-2">
              <Input
                data-ocid="admin.announcement.input"
                placeholder="Type announcement..."
                value={announcementDraft}
                onChange={(e) => setAnnouncementDraft(e.target.value)}
                className="flex-1 bg-white/[0.06] border-white/10 text-sm"
              />
              <Button
                data-ocid="admin.announcement.primary_button"
                onClick={handlePinAnnouncement}
                disabled={!announcementDraft.trim()}
                size="sm"
                className="shrink-0"
              >
                Pin
              </Button>
            </div>
          </div>

          {/* Theme Color */}
          <div className="px-4 py-4 border-b border-white/[0.07] space-y-3">
            <p className="text-[13px] font-semibold text-white/70">
              🎨 App Theme Color
            </p>
            <div className="flex gap-3 flex-wrap">
              {THEME_COLORS.map((c, idx) => (
                <button
                  key={c.value}
                  type="button"
                  data-ocid={`admin.theme_color.button.${idx + 1}`}
                  aria-label={`Theme color: ${c.label}`}
                  onClick={() => setThemeColor(c.value)}
                  style={{ background: c.value }}
                  className={`w-10 h-10 rounded-full transition-all active:scale-90 ${
                    themeColor === c.value
                      ? "ring-2 ring-white ring-offset-2 ring-offset-[#0a0a0f] scale-110"
                      : "opacity-70 hover:opacity-100"
                  }`}
                />
              ))}
            </div>
            <p className="text-[11px] text-white/30">
              Current:{" "}
              {THEME_COLORS.find((c) => c.value === themeColor)?.label ??
                "Custom"}
            </p>
          </div>

          {/* Monetization Targets */}
          <div className="px-4 py-4 space-y-3">
            <p className="text-[13px] font-semibold text-white/70">
              💰 Monetization Targets
            </p>
            <div className="space-y-2">
              <div>
                <Label className="text-[12px] text-white/50 mb-1 block">
                  Followers Goal
                </Label>
                <Input
                  data-ocid="admin.monetization_followers.input"
                  type="number"
                  value={followersDraft}
                  onChange={(e) => setFollowersDraft(e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-sm"
                  placeholder="e.g. 50000"
                />
              </div>
              <div>
                <Label className="text-[12px] text-white/50 mb-1 block">
                  Views Goal
                </Label>
                <Input
                  data-ocid="admin.monetization_views.input"
                  type="number"
                  value={viewsDraft}
                  onChange={(e) => setViewsDraft(e.target.value)}
                  className="bg-white/[0.06] border-white/10 text-sm"
                  placeholder="e.g. 10000000"
                />
              </div>
              <Button
                data-ocid="admin.monetization_targets.save_button"
                onClick={handleSaveTargets}
                className="w-full mt-1"
              >
                Save Targets
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Section 4: User Control */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
          data-ocid="admin.users.section"
          className="rounded-2xl bg-white/[0.04] border border-white/[0.07] overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/50">
              User Control
            </h2>
          </div>
          <div className="divide-y divide-white/[0.05]">
            {MOCK_USERS.map((user, idx) => {
              const isVerified = verifiedUsers.has(user.id);
              const isBlocked = blockedUsers.has(user.id);
              return (
                <div
                  key={user.id}
                  data-ocid={`admin.users.item.${idx + 1}`}
                  className={`px-4 py-3.5 flex items-center gap-3 transition-colors ${
                    isBlocked ? "bg-red-900/10" : ""
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                    {getInitials(user.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-semibold truncate">
                        {user.name}
                      </span>
                      {isVerified && (
                        <BadgeCheck className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                      )}
                    </div>
                    <span className="text-[11px] text-white/40">{user.id}</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      type="button"
                      data-ocid={`admin.user_verify.button.${idx + 1}`}
                      onClick={() => {
                        toggleVerified(user.id);
                        toast.success(
                          isVerified
                            ? `${user.name} unverified`
                            : `${user.name} verified ✓`,
                        );
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all active:scale-95 ${
                        isVerified
                          ? "bg-sky-500/20 border-sky-500/40 text-sky-300"
                          : "bg-white/[0.05] border-white/10 text-white/50 hover:border-sky-500/30 hover:text-sky-300"
                      }`}
                    >
                      <BadgeCheck className="h-3.5 w-3.5" />
                      {isVerified ? "Verified" : "Verify"}
                    </button>
                    <button
                      type="button"
                      data-ocid={`admin.user_block.button.${idx + 1}`}
                      onClick={() => {
                        toggleBlocked(user.id);
                        toast.success(
                          isBlocked
                            ? `${user.name} unblocked`
                            : `${user.name} blocked`,
                        );
                      }}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold border transition-all active:scale-95 ${
                        isBlocked
                          ? "bg-red-500/20 border-red-500/40 text-red-300"
                          : "bg-white/[0.05] border-white/10 text-white/50 hover:border-red-500/30 hover:text-red-300"
                      }`}
                    >
                      <Ban className="h-3.5 w-3.5" />
                      {isBlocked ? "Unblock" : "Block"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* Section 5: Withdrawal Requests */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.2 }}
          data-ocid="admin.withdrawals.section"
          className="rounded-2xl bg-white/[0.04] border border-white/[0.07] overflow-hidden"
        >
          <div className="px-4 py-3 border-b border-white/[0.07]">
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/50">
              Withdrawal Requests
            </h2>
          </div>
          <WithdrawalRequestsList />
        </motion.section>

        {/* Section 6: Ad Revenue Dashboard */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.25 }}
          data-ocid="admin.ad_revenue.section"
          className="rounded-2xl overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.14 0.06 140 / 0.6), oklch(0.12 0.04 160 / 0.5))",
            border: "1px solid oklch(0.55 0.2 140 / 0.25)",
          }}
        >
          <div className="px-4 py-3 border-b border-white/[0.07] flex items-center gap-2">
            <span className="text-[16px]">💰</span>
            <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/50">
              Admin Ad Revenue
            </h2>
          </div>
          <div className="px-4 py-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div
                className="rounded-xl px-4 py-3 text-center"
                style={{
                  background: "oklch(0.18 0.08 140 / 0.5)",
                  border: "1px solid oklch(0.55 0.2 140 / 0.2)",
                }}
              >
                <p className="text-[11px] text-white/45 uppercase tracking-wider mb-1">
                  Total Earned
                </p>
                <p
                  className="text-[24px] font-black"
                  style={{ color: "oklch(0.82 0.22 140)" }}
                >
                  ₹{adminAdRevenue.toFixed(2)}
                </p>
              </div>
              <div
                className="rounded-xl px-4 py-3 text-center"
                style={{
                  background: "oklch(0.18 0.08 140 / 0.5)",
                  border: "1px solid oklch(0.55 0.2 140 / 0.2)",
                }}
              >
                <p className="text-[11px] text-white/45 uppercase tracking-wider mb-1">
                  Ad Impressions
                </p>
                <p
                  className="text-[24px] font-black"
                  style={{ color: "oklch(0.82 0.22 140)" }}
                >
                  {adminAdImpressions.toLocaleString()}
                </p>
              </div>
            </div>
            <div
              className="rounded-xl px-4 py-3"
              style={{
                background: "oklch(0.14 0.04 140 / 0.4)",
                border: "1px solid oklch(0.55 0.2 140 / 0.15)",
              }}
            >
              <p className="text-[12px] text-white/50 leading-relaxed">
                💡 Interstitial ads appear every{" "}
                <strong className="text-white/70">3 Reels</strong>. 100% of ad
                revenue goes directly to your Admin Wallet. User rewards are
                currently <strong className="text-white/70">disabled</strong>.
              </p>
            </div>
            <button
              type="button"
              data-ocid="admin.ad_revenue.delete_button"
              onClick={() => {
                resetAdRevenue();
                toast.success("Ad revenue counter reset.");
              }}
              className="w-full py-2.5 rounded-xl text-[13px] font-semibold text-red-400/80 border border-red-500/20 bg-red-500/5 active:scale-[0.98] transition-transform"
            >
              Reset Revenue Counter
            </button>
          </div>
        </motion.section>

        {/* ─── NEW SECTIONS ─── */}

        {/* Section A: Anti-Fraud Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <CollapsibleSection
            title="Anti-Fraud Dashboard"
            icon={<ShieldAlert className="h-4 w-4" />}
            ocid="admin.antifraud.section"
            badge={activeFlagged.length}
          >
            <div className="px-4 py-4 space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[12px] text-white/50">
                    Blocked Devices:{" "}
                    <span className="text-red-400 font-bold">
                      {blockedDevices.length}
                    </span>
                  </p>
                  <p className="text-[12px] text-white/50">
                    Flagged Accounts:{" "}
                    <span className="text-orange-400 font-bold">
                      {flaggedAccounts.length}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  data-ocid="admin.antifraud.primary_button"
                  onClick={handleRunFraudScan}
                  className="px-4 py-2 rounded-xl text-[12px] font-bold bg-orange-500/15 border border-orange-500/30 text-orange-400 hover:bg-orange-500/25 transition-colors active:scale-95 shrink-0"
                >
                  🔍 Run Fraud Scan
                </button>
              </div>

              {flaggedAccounts.length === 0 ? (
                <div
                  data-ocid="admin.antifraud.empty_state"
                  className="py-6 text-center"
                >
                  <Shield className="h-8 w-8 text-white/15 mx-auto mb-2" />
                  <p className="text-[12px] text-white/30">
                    No flagged accounts. Run a scan to check.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {flaggedAccounts.map((acc, idx) => (
                    <div
                      key={acc.id}
                      data-ocid={`admin.antifraud.item.${idx + 1}`}
                      className="rounded-xl p-3 space-y-2"
                      style={{
                        background:
                          acc.status === "deleted"
                            ? "rgba(239,68,68,0.06)"
                            : acc.status === "cleared"
                              ? "rgba(34,197,94,0.06)"
                              : "rgba(251,146,60,0.08)",
                        border: `1px solid ${
                          acc.status === "deleted"
                            ? "rgba(239,68,68,0.2)"
                            : acc.status === "cleared"
                              ? "rgba(34,197,94,0.2)"
                              : "rgba(251,146,60,0.2)"
                        }`,
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <p className="text-[13px] font-bold text-white">
                            {acc.username}
                          </p>
                          <p className="text-[11px] text-orange-300/80 mt-0.5">
                            {acc.reason}
                          </p>
                          <p className="text-[10px] text-white/30 mt-0.5">
                            Flagged{" "}
                            {new Date(acc.flaggedAt).toLocaleDateString(
                              "en-IN",
                            )}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            acc.status === "deleted"
                              ? "bg-red-500/15 border-red-500/30 text-red-400"
                              : acc.status === "cleared"
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : "bg-orange-500/15 border-orange-500/30 text-orange-400"
                          }`}
                        >
                          {acc.status.charAt(0).toUpperCase() +
                            acc.status.slice(1)}
                        </span>
                      </div>
                      {acc.status === "flagged" && (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            data-ocid={`admin.antifraud.confirm_button.${idx + 1}`}
                            onClick={() => {
                              clearAccount(acc.id);
                              toast.success("Account cleared.");
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 active:scale-95 transition-all"
                          >
                            <CheckCircle2 className="h-3 w-3" /> Clear
                          </button>
                          <button
                            type="button"
                            data-ocid={`admin.antifraud.delete_button.${idx + 1}`}
                            onClick={() => {
                              deleteAccount(acc.id);
                              toast.success(
                                "Account deleted & device blocked.",
                              );
                            }}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-red-500/15 border border-red-500/30 text-red-400 active:scale-95 transition-all"
                          >
                            <XCircle className="h-3 w-3" /> Delete & Block
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CollapsibleSection>
        </motion.div>

        {/* Section B: Auto-Payment Manager */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.32 }}
        >
          <CollapsibleSection
            title="Auto-Payment Manager"
            icon={<DollarSign className="h-4 w-4" />}
            ocid="admin.payments.section"
          >
            <div className="px-4 py-4 space-y-4">
              {/* Next payout + auto toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[12px] text-white/50">Next Payout Date</p>
                  <p className="text-[14px] font-bold text-emerald-400">
                    {nextPayoutDate}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[12px] text-white/50">Auto-Payout</span>
                  <Switch
                    checked={autoPayout}
                    onCheckedChange={setAutoPayout}
                    data-ocid="admin.payments.auto_payout.switch"
                  />
                </div>
              </div>

              {/* Split settings */}
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "rgba(34,197,94,0.08)",
                    border: "1px solid rgba(34,197,94,0.2)",
                  }}
                >
                  <p className="text-[11px] text-white/50 mb-2">
                    Standard Split (%)
                  </p>
                  <p className="text-[10px] text-white/40 mb-1">
                    Creator gets:
                  </p>
                  <Input
                    data-ocid="admin.payments.standard_split.input"
                    type="number"
                    value={standardSplit}
                    onChange={(e) => setStandardSplit(Number(e.target.value))}
                    className="bg-white/[0.06] border-white/10 text-sm h-8"
                    min={1}
                    max={99}
                  />
                  <p className="text-[10px] text-emerald-400 mt-1">
                    {standardSplit}% / {100 - standardSplit}%
                  </p>
                </div>
                <div
                  className="rounded-xl p-3"
                  style={{
                    background: "rgba(168,85,247,0.08)",
                    border: "1px solid rgba(168,85,247,0.2)",
                  }}
                >
                  <p className="text-[11px] text-white/50 mb-2">
                    Big Creator Split (%)
                  </p>
                  <p className="text-[10px] text-white/40 mb-1">
                    Creator gets (1M+):
                  </p>
                  <Input
                    data-ocid="admin.payments.big_creator_split.input"
                    type="number"
                    value={bigCreatorSplit}
                    onChange={(e) => setBigCreatorSplit(Number(e.target.value))}
                    className="bg-white/[0.06] border-white/10 text-sm h-8"
                    min={1}
                    max={99}
                  />
                  <p className="text-[10px] text-purple-400 mt-1">
                    {bigCreatorSplit}% / {100 - bigCreatorSplit}%
                  </p>
                </div>
              </div>

              {/* Creators table */}
              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-white/60">
                  Eligible Creators
                </p>
                {MOCK_CREATORS.map((creator, idx) => {
                  const split =
                    creator.followers >= 1_000_000
                      ? bigCreatorSplit
                      : standardSplit;
                  const earnings = calculateEarnings(
                    creator.views,
                    creator.followers,
                  );
                  const isPaid = paidCreators.has(creator.username);
                  return (
                    <div
                      key={creator.username}
                      data-ocid={`admin.payments.item.${idx + 1}`}
                      className="rounded-xl p-3"
                      style={{
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div>
                          <p className="text-[13px] font-semibold text-white">
                            {creator.name}
                          </p>
                          <p className="text-[11px] text-white/40">
                            {creator.username}
                          </p>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isPaid
                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                              : earnings.isEligible
                                ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                                : "bg-white/5 border-white/10 text-white/30"
                          }`}
                        >
                          {isPaid
                            ? "Paid"
                            : earnings.isEligible
                              ? "Pending"
                              : "Not Eligible"}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-1 mt-2">
                        <div className="text-center">
                          <p className="text-[9px] text-white/35 uppercase">
                            Followers
                          </p>
                          <p className="text-[11px] font-bold text-white">
                            {(creator.followers / 1000).toFixed(0)}K
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-white/35 uppercase">
                            Creator ₹
                          </p>
                          <p className="text-[11px] font-bold text-emerald-400">
                            {earnings.creatorEarnings.toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-[9px] text-white/35 uppercase">
                            Admin ₹
                          </p>
                          <p className="text-[11px] font-bold text-cyan-400">
                            {earnings.adminEarnings.toLocaleString("en-IN", {
                              maximumFractionDigits: 0,
                            })}
                          </p>
                        </div>
                      </div>
                      <p className="text-[10px] text-white/30 mt-1">
                        {split}% creator / {100 - split}% admin
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                data-ocid="admin.payments.primary_button"
                onClick={handleProcessPayments}
                className="w-full py-3 rounded-xl text-[13px] font-bold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-colors active:scale-[0.98]"
              >
                ✅ Process All Payments
              </button>
            </div>
          </CollapsibleSection>
        </motion.div>

        {/* Section C: View Revenue Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.34 }}
        >
          <CollapsibleSection
            title="View Revenue Dashboard"
            icon={<DollarSign className="h-4 w-4" />}
            ocid="admin.view_revenue.section"
          >
            <div className="px-4 py-4 space-y-4">
              <div
                className="rounded-xl p-4 text-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(139,92,246,0.1))",
                  border: "1px solid rgba(6,182,212,0.25)",
                }}
              >
                <p className="text-[11px] text-white/40 uppercase tracking-wider mb-1">
                  Total View Revenue
                </p>
                <p
                  className="text-[32px] font-black"
                  style={{ color: "oklch(0.80 0.20 185)" }}
                >
                  ₹{totalViewRevenue.toFixed(2)}
                </p>
                <p className="text-[11px] text-white/35 mt-1">
                  Every real view = ₹0.001 revenue
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div
                  className="rounded-xl p-3 text-center"
                  style={{
                    background: "rgba(6,182,212,0.08)",
                    border: "1px solid rgba(6,182,212,0.2)",
                  }}
                >
                  <p className="text-[10px] text-white/40 mb-1">
                    Admin's Share
                  </p>
                  <p className="text-[16px] font-black text-cyan-400">
                    ₹{(totalViewRevenue * 0.5).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-white/30">50%</p>
                </div>
                <div
                  className="rounded-xl p-3 text-center"
                  style={{
                    background: "rgba(139,92,246,0.08)",
                    border: "1px solid rgba(139,92,246,0.2)",
                  }}
                >
                  <p className="text-[10px] text-white/40 mb-1">
                    Creators' Share
                  </p>
                  <p className="text-[16px] font-black text-purple-400">
                    ₹{(totalViewRevenue * 0.5).toFixed(2)}
                  </p>
                  <p className="text-[10px] text-white/30">50%</p>
                </div>
              </div>

              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <p className="text-[12px] text-white/50">
                  Total Real Views:{" "}
                  <span className="text-white font-bold">
                    {Math.round(totalViewRevenue * 1000).toLocaleString()}
                  </span>
                </p>
              </div>

              <button
                type="button"
                data-ocid="admin.view_revenue.primary_button"
                onClick={() => {
                  addViewRevenue(10);
                  toast.success("Added 10K test views (+₹10)");
                }}
                className="w-full py-2.5 rounded-xl text-[13px] font-semibold bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 active:scale-[0.98] transition-transform"
              >
                + Add 10K Test Views (₹10)
              </button>
            </div>
          </CollapsibleSection>
        </motion.div>

        {/* Section D: Reports Inbox */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.36 }}
        >
          <CollapsibleSection
            title="Reports Inbox"
            icon={<ShieldAlert className="h-4 w-4" />}
            ocid="admin.reports.section"
            badge={pendingReports.length}
          >
            {reports.length === 0 ? (
              <div
                data-ocid="admin.reports.empty_state"
                className="px-4 py-8 text-center"
              >
                <Shield className="h-8 w-8 text-white/15 mx-auto mb-2" />
                <p className="text-[12px] text-white/30">
                  No reports submitted yet
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.05]">
                {reports.map((report, idx) => (
                  <div
                    key={report.id}
                    data-ocid={`admin.reports.item.${idx + 1}`}
                    className="px-4 py-3 flex items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-white truncate">
                          {report.reportedUser}
                        </span>
                        {report.resolved && (
                          <span className="text-[10px] bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 rounded-full px-2 py-0.5">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-red-300/80 mt-0.5">
                        {report.reason}
                      </p>
                      <p className="text-[10px] text-white/30 mt-0.5">
                        By {report.reportedBy} ·{" "}
                        {new Date(report.timestamp).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    {!report.resolved && (
                      <button
                        type="button"
                        data-ocid={`admin.reports.confirm_button.${idx + 1}`}
                        onClick={() => {
                          resolveReport(report.id);
                          toast.success("Report resolved.");
                        }}
                        className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 active:scale-95 transition-all"
                      >
                        Resolve
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CollapsibleSection>
        </motion.div>

        {/* Section E: Viral Algorithm Settings */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.38 }}
        >
          <CollapsibleSection
            title="Viral Algorithm Settings"
            icon={<Shield className="h-4 w-4" />}
            ocid="admin.viral.section"
          >
            <div className="px-4 py-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-white">
                    Quality Boost
                  </p>
                  <p className="text-[11px] text-white/40">
                    High-quality posts ranked first
                  </p>
                </div>
                <Switch
                  checked={qualityBoost}
                  onCheckedChange={setQualityBoost}
                  data-ocid="admin.viral.quality_boost.switch"
                />
              </div>

              <div
                className="rounded-xl p-3"
                style={{
                  background: "rgba(6,182,212,0.06)",
                  border: "1px solid rgba(6,182,212,0.15)",
                }}
              >
                <p className="text-[11px] text-cyan-300/80">
                  📊 Ranking formula:{" "}
                  <strong className="text-cyan-400">
                    (Likes + Comments×2 + Shares×3) ÷ Age
                  </strong>
                </p>
              </div>

              <div className="space-y-2">
                <p className="text-[12px] font-semibold text-white/60">
                  🔥 Top Trending Creators
                </p>
                {TRENDING_CREATORS.map((creator, idx) => (
                  <div
                    key={creator.name}
                    data-ocid={`admin.viral.item.${idx + 1}`}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.07)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-black text-white/30">
                        #{idx + 1}
                      </span>
                      <span className="text-[13px] font-semibold text-white">
                        {creator.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[12px] font-bold"
                        style={{ color: "oklch(0.80 0.20 185)" }}
                      >
                        {creator.score.toLocaleString()}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {creator.change}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CollapsibleSection>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-[11px] text-white/20 pb-4">
          Rohit AI Tech Admin · v1.0
        </p>
      </div>
    </div>
  );
}
