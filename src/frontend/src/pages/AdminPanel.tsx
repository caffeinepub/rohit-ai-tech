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
  ChevronLeft,
  Clock,
  Compass,
  DollarSign,
  Film,
  MessageCircle,
  Settings2,
  Shield,
  XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { type FeatureFlags, useAdmin } from "../contexts/AdminContext";

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
  } = useAdmin();

  const [announcementDraft, setAnnouncementDraft] =
    useState(pinnedAnnouncement);
  const [followersDraft, setFollowersDraft] = useState(
    String(monetizationTargets.followers),
  );
  const [viewsDraft, setViewsDraft] = useState(
    String(monetizationTargets.views),
  );

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

  const handleGoLive = () => {
    toast.success("Go Live will be activated soon! Stay tuned.", {
      duration: 4000,
    });
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

        {/* Section 2: Go Live */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          data-ocid="admin.golive.section"
          className="rounded-2xl bg-white/[0.04] border border-white/[0.07] p-4"
        >
          <h2 className="text-[13px] font-bold uppercase tracking-widest text-white/50 mb-4">
            Live Broadcasting
          </h2>
          <button
            type="button"
            data-ocid="admin.go_live.button"
            onClick={handleGoLive}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-3 bg-gradient-to-r from-red-600/80 to-rose-500/80 border border-red-500/30 font-bold text-lg text-white shadow-lg shadow-red-900/30 active:scale-[0.98] transition-all"
          >
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-70" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
            </span>
            Go Live
          </button>
          <p className="text-center text-[11px] text-white/30 mt-2">
            Broadcasting will be activated in a future update
          </p>
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
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center text-[12px] font-bold text-white shrink-0">
                    {getInitials(user.name)}
                  </div>
                  {/* Info */}
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
                  {/* Actions */}
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

        {/* Footer */}
        <p className="text-center text-[11px] text-white/20 pb-4">
          Rohit AI Tech Admin · v1.0
        </p>
      </div>
    </div>
  );
}
