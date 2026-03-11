import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertCircle,
  Camera,
  CheckCircle2,
  Clock,
  Grid3x3,
  Lock,
  Play,
  Settings2,
  Shield,
  Tag,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useAdmin } from "../contexts/AdminContext";
import { useWatchEarn } from "../contexts/WatchEarnContext";

type ProfileTab = "posts" | "reels" | "tagged";

const GRID_ITEMS = [
  {
    id: 1,
    isVideo: false,
    gradient: "from-[#0f0035] via-[#2d1b69] to-[#1a0050]",
    accent:
      "radial-gradient(ellipse 70% 60% at 50% 40%, oklch(0.55 0.25 300 / 0.55) 0%, transparent 70%)",
  },
  {
    id: 2,
    isVideo: true,
    gradient: "from-[#001a1a] via-[#003333] to-[#001f3f]",
    accent:
      "radial-gradient(ellipse 80% 50% at 30% 60%, oklch(0.65 0.18 185 / 0.6) 0%, transparent 65%)",
  },
  {
    id: 3,
    isVideo: false,
    gradient: "from-[#1f0a00] via-[#3d1500] to-[#2a0a0a]",
    accent:
      "radial-gradient(ellipse 60% 70% at 70% 30%, oklch(0.65 0.22 35 / 0.55) 0%, transparent 60%)",
  },
  {
    id: 4,
    isVideo: true,
    gradient: "from-[#001a0d] via-[#003320] to-[#001f15]",
    accent:
      "radial-gradient(ellipse 75% 55% at 40% 55%, oklch(0.62 0.2 155 / 0.5) 0%, transparent 65%)",
  },
  {
    id: 5,
    isVideo: false,
    gradient: "from-[#00081f] via-[#001040] to-[#000d35]",
    accent:
      "radial-gradient(ellipse 65% 65% at 55% 45%, oklch(0.6 0.22 240 / 0.5) 0%, transparent 65%)",
  },
  {
    id: 6,
    isVideo: false,
    gradient: "from-[#1a0020] via-[#350050] to-[#1f0035]",
    accent:
      "radial-gradient(ellipse 70% 60% at 60% 35%, oklch(0.58 0.28 310 / 0.55) 0%, transparent 65%)",
  },
  {
    id: 7,
    isVideo: true,
    gradient: "from-[#1f1500] via-[#3d2d00] to-[#2a1f00]",
    accent:
      "radial-gradient(ellipse 65% 70% at 45% 50%, oklch(0.7 0.2 70 / 0.5) 0%, transparent 65%)",
  },
  {
    id: 8,
    isVideo: false,
    gradient: "from-[#0d0020] via-[#1a0040] to-[#0a0025]",
    accent:
      "radial-gradient(ellipse 80% 55% at 35% 60%, oklch(0.52 0.3 280 / 0.55) 0%, transparent 60%)",
  },
  {
    id: 9,
    isVideo: false,
    gradient: "from-[#001510] via-[#002a20] to-[#001a15]",
    accent:
      "radial-gradient(ellipse 70% 60% at 65% 40%, oklch(0.65 0.2 160 / 0.55) 0%, transparent 65%)",
  },
  {
    id: 10,
    isVideo: true,
    gradient: "from-[#200010] via-[#400020] to-[#2a0015]",
    accent:
      "radial-gradient(ellipse 75% 65% at 50% 45%, oklch(0.6 0.28 10 / 0.5) 0%, transparent 65%)",
  },
  {
    id: 11,
    isVideo: false,
    gradient: "from-[#001f1f] via-[#003d3d] to-[#002525]",
    accent:
      "radial-gradient(ellipse 60% 75% at 40% 55%, oklch(0.68 0.18 200 / 0.55) 0%, transparent 60%)",
  },
  {
    id: 12,
    isVideo: true,
    gradient: "from-[#150020] via-[#2a0040] to-[#1a0028]",
    accent:
      "radial-gradient(ellipse 70% 60% at 55% 40%, oklch(0.55 0.3 295 / 0.55) 0%, transparent 65%)",
  },
];

const PROFILE_TAB_ICONS = [
  { key: "posts" as ProfileTab, icon: Grid3x3, label: "Posts" },
  { key: "reels" as ProfileTab, icon: Play, label: "Reels" },
  { key: "tagged" as ProfileTab, icon: Tag, label: "Tagged" },
];

function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

interface WithdrawalRequest {
  id: number;
  amount: number;
  bankDetails: { accountNo: string; ifsc: string; bankName: string };
  status: "pending" | "approved" | "rejected";
  timestamp: string;
  userName: string;
}

interface ProfilePageProps {
  displayName: string;
  profilePhoto: string | null;
  onUpdateProfile: (name: string, photo?: string) => void;
  onOpenAdmin: () => void;
}

export default function ProfilePage({
  displayName,
  profilePhoto,
  onUpdateProfile,
  onOpenAdmin,
}: ProfilePageProps) {
  const { monetizationTargets } = useAdmin();
  const { coinBalance } = useWatchEarn();
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");
  const [editOpen, setEditOpen] = useState(false);

  // Profile state
  const [localPhoto, setLocalPhoto] = useState<string | null>(profilePhoto);
  const [username, setUsername] = useState("@rohit.ai");
  const [bio, setBio] = useState(
    "Building the future with AI ✨ | Tech Creator | Innovator",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  // Edit form state
  const [draftName, setDraftName] = useState(displayName);
  const [draftUsername, setDraftUsername] = useState(username);
  const [draftBio, setDraftBio] = useState(bio);

  // Wallet state - localStorage backed
  const loadBankDetails = () => {
    try {
      const saved = localStorage.getItem("rohit_bank_details");
      return saved
        ? JSON.parse(saved)
        : { accountNumber: "", ifscCode: "", bankName: "" };
    } catch {
      return { accountNumber: "", ifscCode: "", bankName: "" };
    }
  };
  const initBank = loadBankDetails();
  const [accountNumber, setAccountNumber] = useState<string>(
    initBank.accountNumber,
  );
  const [ifscCode, setIfscCode] = useState<string>(initBank.ifscCode);
  const [bankName, setBankName] = useState<string>(initBank.bankName);
  const [savedBank, setSavedBank] = useState<boolean>(!!initBank.accountNumber);
  const [walletTab, setWalletTab] = useState("bank");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawRequests, setWithdrawRequests] = useState<WithdrawalRequest[]>(
    () => {
      try {
        const saved = localStorage.getItem("rohit_withdrawal_requests");
        return saved ? JSON.parse(saved) : [];
      } catch {
        return [];
      }
    },
  );

  const openEdit = () => {
    setDraftName(displayName);
    setDraftUsername(username);
    setDraftBio(bio);
    setEditOpen(true);
  };

  const handleSave = () => {
    onUpdateProfile(draftName);
    setUsername(draftUsername);
    setBio(draftBio);
    setEditOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setLocalPhoto(url);
    onUpdateProfile(displayName, url);
  };

  const handleBankSave = () => {
    if (!accountNumber.trim() || !ifscCode.trim() || !bankName.trim()) {
      toast.error("Please fill all bank details");
      return;
    }
    const details = {
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim(),
      bankName: bankName.trim(),
    };
    localStorage.setItem("rohit_bank_details", JSON.stringify(details));
    setSavedBank(true);
    toast.success("Bank details saved ✓");
  };

  const handleWithdraw = () => {
    if (!savedBank) {
      toast.error("Please add bank details first");
      setWalletTab("bank");
      return;
    }
    const amount = Number.parseFloat(withdrawAmount);
    if (!amount || amount < 100) {
      toast.error("Minimum withdrawal is ₹100");
      return;
    }
    const req: WithdrawalRequest = {
      id: Date.now(),
      amount,
      bankDetails: { accountNo: accountNumber, ifsc: ifscCode, bankName },
      status: "pending",
      timestamp: new Date().toISOString(),
      userName: "Rohit Mehra",
    };
    const updated = [...withdrawRequests, req];
    setWithdrawRequests(updated);
    localStorage.setItem("rohit_withdrawal_requests", JSON.stringify(updated));
    setWithdrawAmount("");
    toast.success("Payout request submitted! ✓");
  };

  // Creator Dashboard data
  const followersGoal = monetizationTargets.followers;
  const followersCount = 12400;
  const followersProgress = Math.min(
    (followersCount / followersGoal) * 100,
    100,
  );
  const followersAchieved = followersCount >= followersGoal;

  const viewsGoal = monetizationTargets.views;
  const viewsCount = 847_000;
  const viewsProgress = Math.min((viewsCount / viewsGoal) * 100, 100);
  const viewsAchieved = viewsCount >= viewsGoal;

  const monetizeActive = followersAchieved && viewsAchieved;

  return (
    <div
      data-ocid="profile.section"
      className="min-h-screen bg-background text-foreground overflow-y-auto pb-4"
    >
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="px-4 pt-6 pb-4 flex flex-col items-center gap-4"
      >
        {/* ── Circular Profile Picture ── */}
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-50"
            style={{
              background:
                "radial-gradient(circle, oklch(0.72 0.18 70) 0%, oklch(0.65 0.22 45) 50%, oklch(0.58 0.24 25) 100%)",
              transform: "scale(1.3)",
            }}
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            data-ocid="profile.upload_button"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            type="button"
            aria-label="Change profile photo"
            onClick={() => fileInputRef.current?.click()}
            className="relative p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-600 group cursor-pointer"
          >
            <div className="p-[3px] rounded-full bg-background">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center overflow-hidden relative">
                {localPhoto ? (
                  <img
                    src={localPhoto}
                    alt="Profile"
                    className="h-full w-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-[28px] font-black text-white tracking-tight select-none">
                    {getInitials(displayName)}
                  </span>
                )}
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Camera className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* ── Name + Username ── */}
        <div className="text-center flex flex-col gap-0.5">
          <h1 className="text-[18px] font-bold text-foreground leading-tight tracking-tight">
            {displayName}
          </h1>
          <p className="text-[13px] text-muted-foreground font-medium">
            {username}
          </p>
          <p className="text-[12px] text-foreground/70 mt-1 leading-snug max-w-[260px] mx-auto">
            {bio}
          </p>
        </div>

        {/* ── Stats Row ── */}
        <div className="w-full flex items-center justify-around mt-1">
          {[
            { label: "Posts", value: "42" },
            { label: "Followers", value: "12.4k" },
            { label: "Following", value: "389" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center gap-0.5"
            >
              <span className="text-[20px] font-black text-foreground leading-tight tracking-tight">
                {stat.value}
              </span>
              <span className="text-[11px] text-muted-foreground font-medium tracking-wide">
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── Edit Profile Button ── */}
        <button
          type="button"
          data-ocid="profile.edit_button"
          onClick={openEdit}
          className="w-full max-w-[340px] py-2.5 rounded-xl border border-white/20 text-[13px] font-semibold text-foreground/90 bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.98] transition-all"
        >
          Edit Profile
        </button>

        {/* ── Admin Panel Button ── */}
        <button
          type="button"
          data-ocid="profile.admin_panel.button"
          onClick={onOpenAdmin}
          className="w-full max-w-[340px] py-2.5 rounded-xl flex items-center justify-center gap-2 text-[13px] font-semibold text-white bg-gradient-to-r from-purple-700/80 to-indigo-600/80 border border-purple-500/30 hover:from-purple-600/90 hover:to-indigo-500/90 active:scale-[0.98] transition-all shadow-md"
        >
          <Shield className="h-4 w-4" />
          Admin Panel
          <Settings2 className="h-3.5 w-3.5 opacity-70" />
        </button>

        {/* ── Creator Dashboard ── */}
        <motion.div
          data-ocid="profile.creator_dashboard.section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-full max-w-[340px]"
        >
          {/* Gradient border wrapper */}
          <div
            className="p-[1.5px] rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.62 0.22 300), oklch(0.75 0.18 55))",
            }}
          >
            <div className="rounded-2xl bg-[oklch(0.10_0.01_270)] p-4 space-y-4">
              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[15px]">✦</span>
                  <h2 className="text-[14px] font-bold text-foreground">
                    Creator Dashboard
                  </h2>
                </div>
                <p className="text-[11px] text-muted-foreground/60 pl-6">
                  Monetization Tracker
                </p>
              </div>

              {/* Followers Milestone */}
              <div
                data-ocid="profile.followers_milestone.card"
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold text-foreground/90">
                      Followers Milestone
                    </p>
                    <p className="text-[10px] text-muted-foreground/50">
                      Goal: {formatNumber(followersGoal)} followers
                    </p>
                  </div>
                  {followersAchieved && (
                    <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 rounded-full px-2.5 py-1">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400">
                        Achieved
                      </span>
                    </div>
                  )}
                </div>
                <div className="relative h-2 rounded-full overflow-hidden bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${followersProgress}%` }}
                    transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.65 0.2 155), oklch(0.75 0.22 165))",
                      boxShadow: "0 0 8px oklch(0.65 0.2 155 / 0.5)",
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/50 text-right">
                  {formatNumber(followersCount)} / {formatNumber(followersGoal)}
                </p>
              </div>

              {/* Views Milestone */}
              <div
                data-ocid="profile.views_milestone.card"
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-semibold text-foreground/90">
                      Views Milestone
                    </p>
                    <p className="text-[10px] text-muted-foreground/50">
                      Goal: {formatNumber(viewsGoal)} views
                    </p>
                  </div>
                  <span className="text-[10px] text-amber-400/80 font-medium">
                    {viewsProgress.toFixed(1)}%
                  </span>
                </div>
                <div className="relative h-2 rounded-full overflow-hidden bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${viewsProgress}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="absolute left-0 top-0 h-full rounded-full"
                    style={{
                      background:
                        "linear-gradient(90deg, oklch(0.72 0.18 55), oklch(0.75 0.22 70))",
                      boxShadow: "0 0 8px oklch(0.72 0.18 55 / 0.5)",
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/50 text-right">
                  {formatNumber(viewsCount)} / {formatNumber(viewsGoal)}
                </p>
              </div>

              {/* Monetize Status */}
              <div
                data-ocid="profile.monetize_status.card"
                className="pt-1 border-t border-white/[0.07]"
              >
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-foreground/90">
                    Monetize Status
                  </p>
                  {monetizeActive ? (
                    <div
                      className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/40 rounded-full px-3 py-1"
                      style={{
                        boxShadow: "0 0 12px oklch(0.72 0.18 155 / 0.35)",
                      }}
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-[11px] font-bold text-emerald-400">
                        Monetize Active
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-end gap-0.5">
                      <div className="flex items-center gap-1.5 bg-white/[0.05] border border-white/10 rounded-full px-3 py-1">
                        <Lock className="h-3 w-3 text-muted-foreground/50" />
                        <span className="text-[11px] font-medium text-muted-foreground/50">
                          Monetize Locked
                        </span>
                      </div>
                      <p className="text-[9px] text-muted-foreground/35 text-right">
                        Reach both goals to unlock
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Wallet Section ── */}
        <motion.div
          data-ocid="profile.wallet.section"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="w-full max-w-[340px]"
        >
          <div
            className="p-[1.5px] rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.72 0.18 55), oklch(0.62 0.22 300))",
            }}
          >
            <div className="rounded-2xl bg-[oklch(0.10_0.01_270)] p-4 space-y-3">
              {/* Title + Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[15px]">💰</span>
                  <h2 className="text-[14px] font-bold text-foreground">
                    Wallet
                  </h2>
                </div>
                {savedBank && (
                  <Badge className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    <CheckCircle2 className="h-2.5 w-2.5 mr-1" />
                    Bank Linked
                  </Badge>
                )}
              </div>

              {/* Balance */}
              <div className="flex flex-col items-center py-2">
                <p className="text-[11px] text-muted-foreground/50 mb-1">
                  Available Balance
                </p>
                <p
                  className="text-[30px] font-black tracking-tight"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.85 0.18 70), oklch(0.75 0.22 55))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹ {coinBalance.toFixed(2)}
                </p>
                {/* Watch Earnings */}
                {coinBalance > 0 && (
                  <div
                    data-ocid="wallet.watch_earnings"
                    className="flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: "oklch(0.72 0.18 55 / 0.12)",
                      border: "1px solid oklch(0.72 0.18 55 / 0.3)",
                    }}
                  >
                    <span className="text-[12px]">🪙</span>
                    <span
                      className="text-[11px] font-semibold"
                      style={{ color: "oklch(0.85 0.18 70)" }}
                    >
                      Watch Earnings: ₹{coinBalance.toFixed(2)}
                    </span>
                  </div>
                )}
                {coinBalance === 0 && (
                  <div
                    data-ocid="wallet.watch_earnings"
                    className="flex items-center gap-1.5 mt-1.5 px-3 py-1 rounded-full"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <span className="text-[11px]">🪙</span>
                    <span className="text-[11px] text-muted-foreground/50">
                      Watch Reels to earn coins
                    </span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <Tabs value={walletTab} onValueChange={setWalletTab}>
                <TabsList className="w-full bg-white/[0.06] rounded-xl h-9">
                  <TabsTrigger
                    data-ocid="wallet.bank.tab"
                    value="bank"
                    className="flex-1 text-[12px] data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 rounded-lg"
                  >
                    Bank
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="wallet.withdraw.tab"
                    value="withdraw"
                    className="flex-1 text-[12px] data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 rounded-lg"
                  >
                    Withdraw
                  </TabsTrigger>
                  <TabsTrigger
                    data-ocid="wallet.history.tab"
                    value="history"
                    className="flex-1 text-[12px] data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-300 rounded-lg"
                  >
                    History
                  </TabsTrigger>
                </TabsList>

                {/* Tab 1: Bank Details */}
                <TabsContent value="bank" className="mt-3 space-y-3">
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground font-medium">
                      Account Number
                    </Label>
                    <input
                      data-ocid="wallet.account_number.input"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 text-foreground text-[13px] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-white/20"
                      placeholder="Enter account number"
                      inputMode="numeric"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground font-medium">
                      IFSC Code
                    </Label>
                    <input
                      data-ocid="wallet.ifsc.input"
                      value={ifscCode}
                      onChange={(e) =>
                        setIfscCode(e.target.value.toUpperCase())
                      }
                      className="w-full bg-white/[0.06] border border-white/10 text-foreground text-[13px] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-white/20 uppercase"
                      placeholder="e.g. SBIN0001234"
                      maxLength={11}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[11px] text-muted-foreground font-medium">
                      Bank Name
                    </Label>
                    <input
                      data-ocid="wallet.bank_name.input"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-white/[0.06] border border-white/10 text-foreground text-[13px] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-white/20"
                      placeholder="e.g. State Bank of India"
                    />
                  </div>
                  <Button
                    type="button"
                    data-ocid="wallet.save_button"
                    onClick={handleBankSave}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white border-0 rounded-xl hover:opacity-90 text-[13px] font-semibold h-9"
                  >
                    {savedBank ? "Update Bank Details" : "Save Bank Details"}
                  </Button>
                </TabsContent>

                {/* Tab 2: Withdraw */}
                <TabsContent value="withdraw" className="mt-3">
                  {!monetizeActive ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-xl p-3">
                        <Lock className="h-4 w-4 text-amber-400 shrink-0" />
                        <p className="text-[12px] text-amber-300/80">
                          Unlock withdrawals by hitting 20K followers &amp; 10M
                          views
                        </p>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-[11px] text-muted-foreground/60 mb-1">
                            <span>Followers</span>
                            <span>
                              {formatNumber(followersCount)} /{" "}
                              {formatNumber(followersGoal)}
                            </span>
                          </div>
                          <Progress
                            value={followersProgress}
                            className="h-1.5 bg-white/10"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[11px] text-muted-foreground/60 mb-1">
                            <span>Views</span>
                            <span>
                              {formatNumber(viewsCount)} /{" "}
                              {formatNumber(viewsGoal)}
                            </span>
                          </div>
                          <Progress
                            value={viewsProgress}
                            className="h-1.5 bg-white/10"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {!savedBank && (
                        <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                          <p className="text-[12px] text-red-300/80">
                            Add bank details in the Bank tab first
                          </p>
                        </div>
                      )}
                      <div className="space-y-1.5">
                        <Label className="text-[11px] text-muted-foreground font-medium">
                          Amount (₹)
                        </Label>
                        <input
                          data-ocid="wallet.withdraw_amount.input"
                          type="number"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="w-full bg-white/[0.06] border border-white/10 text-foreground text-[13px] rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-500/50 placeholder:text-white/20"
                          placeholder="Min ₹100"
                          min={100}
                          inputMode="numeric"
                        />
                      </div>
                      <Button
                        type="button"
                        data-ocid="wallet.withdraw.primary_button"
                        onClick={handleWithdraw}
                        disabled={!savedBank}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 rounded-xl hover:opacity-90 text-[13px] font-semibold h-9 disabled:opacity-40"
                      >
                        Request Payout
                      </Button>
                    </div>
                  )}
                </TabsContent>

                {/* Tab 3: History */}
                <TabsContent value="history" className="mt-3">
                  {withdrawRequests.length === 0 ? (
                    <div
                      data-ocid="wallet.history.empty_state"
                      className="flex flex-col items-center gap-2 py-4 text-center"
                    >
                      <Clock className="h-8 w-8 text-white/20" />
                      <p className="text-[12px] text-muted-foreground/50">
                        No withdrawal requests yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {withdrawRequests.map((req, idx) => (
                        <div
                          key={req.id}
                          data-ocid={`wallet.history.item.${idx + 1}`}
                          className="flex items-center justify-between bg-white/[0.04] border border-white/[0.07] rounded-xl p-3"
                        >
                          <div>
                            <p className="text-[13px] font-bold text-foreground">
                              ₹{req.amount.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-muted-foreground/50">
                              {new Date(req.timestamp).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                          <Badge
                            className={`text-[10px] font-bold rounded-full px-2 py-0.5 border ${
                              req.status === "approved"
                                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                : req.status === "rejected"
                                  ? "bg-red-500/15 border-red-500/30 text-red-400"
                                  : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                            }`}
                          >
                            {req.status.charAt(0).toUpperCase() +
                              req.status.slice(1)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* ── Tab Bar ── */}
      <div className="flex items-center border-b border-white/[0.08]">
        {PROFILE_TAB_ICONS.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            type="button"
            data-ocid="profile.tab"
            onClick={() => setActiveTab(key)}
            aria-label={label}
            className={`flex-1 flex flex-col items-center gap-1 py-2.5 relative transition-colors ${
              activeTab === key
                ? "text-foreground"
                : "text-muted-foreground/50 hover:text-muted-foreground"
            }`}
          >
            <Icon className="h-[20px] w-[20px]" />
            {activeTab === key && (
              <motion.div
                layoutId="profileTabIndicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-8 rounded-full bg-foreground"
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Photo/Video Grid ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.1 }}
        className="grid grid-cols-3 gap-[2px] mt-[2px]"
      >
        {GRID_ITEMS.map((item, index) => (
          <motion.div
            key={item.id}
            data-ocid={`profile.item.${index + 1}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: index * 0.04,
              duration: 0.28,
              ease: "easeOut",
            }}
            className="relative overflow-hidden cursor-pointer active:opacity-80 transition-opacity"
            style={{ aspectRatio: "1/1" }}
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
            />
            <div
              className="absolute inset-0"
              style={{ background: item.accent }}
            />
            {item.isVideo && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                  <Play className="h-4 w-4 text-white fill-white translate-x-0.5" />
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </motion.div>

      {/* ── Edit Profile Sheet ── */}
      <Sheet open={editOpen} onOpenChange={setEditOpen}>
        <SheetContent
          data-ocid="profile.edit.sheet"
          side="bottom"
          className="bg-[oklch(0.11_0.01_270)] border-t border-white/10 rounded-t-2xl px-5 py-6"
        >
          <SheetHeader className="mb-5">
            <SheetTitle className="text-foreground text-[16px] font-bold">
              Edit Profile
            </SheetTitle>
          </SheetHeader>

          <div className="space-y-4">
            {/* Display Name */}
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground font-medium">
                Display Name
              </Label>
              <Input
                data-ocid="profile.edit.name_input"
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="bg-white/[0.06] border-white/10 text-foreground focus:ring-fuchsia-500/50 rounded-xl"
                placeholder="Your display name"
              />
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground font-medium">
                Username
              </Label>
              <Input
                data-ocid="profile.edit.username_input"
                value={draftUsername}
                onChange={(e) => setDraftUsername(e.target.value)}
                className="bg-white/[0.06] border-white/10 text-foreground focus:ring-fuchsia-500/50 rounded-xl"
                placeholder="@username"
              />
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <Label className="text-[12px] text-muted-foreground font-medium">
                Bio
              </Label>
              <Textarea
                data-ocid="profile.edit.bio_textarea"
                value={draftBio}
                onChange={(e) => setDraftBio(e.target.value)}
                rows={3}
                className="bg-white/[0.06] border-white/10 text-foreground focus:ring-fuchsia-500/50 rounded-xl resize-none"
                placeholder="Tell the world about yourself"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
              <Button
                type="button"
                data-ocid="profile.edit.cancel_button"
                variant="outline"
                onClick={() => setEditOpen(false)}
                className="flex-1 border-white/15 bg-white/[0.04] text-foreground/80 hover:bg-white/[0.08] rounded-xl"
              >
                Cancel
              </Button>
              <Button
                type="button"
                data-ocid="profile.edit.save_button"
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white border-0 rounded-xl hover:opacity-90"
              >
                Save Changes
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
