import { Grid3x3, Play, Tag } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

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

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("posts");

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
          {/* Glow backdrop */}
          <div
            className="absolute inset-0 rounded-full blur-xl opacity-50"
            style={{
              background:
                "radial-gradient(circle, oklch(0.72 0.18 70) 0%, oklch(0.65 0.22 45) 50%, oklch(0.58 0.24 25) 100%)",
              transform: "scale(1.3)",
            }}
          />
          {/* Gradient ring */}
          <div className="relative p-[3px] rounded-full bg-gradient-to-tr from-yellow-400 via-amber-500 to-orange-600">
            {/* White gap ring */}
            <div className="p-[3px] rounded-full bg-background">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center">
                <span className="text-[28px] font-black text-white tracking-tight select-none">
                  RA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Name + Username ── */}
        <div className="text-center flex flex-col gap-0.5">
          <h1 className="text-[18px] font-bold text-foreground leading-tight tracking-tight">
            Rohit AI Tech
          </h1>
          <p className="text-[13px] text-muted-foreground font-medium">
            @rohit.ai
          </p>
          <p className="text-[12px] text-foreground/70 mt-1 leading-snug max-w-[260px] mx-auto">
            Building the future with AI ✨ | Tech Creator | Innovator
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
          className="w-full max-w-[340px] py-2.5 rounded-xl border border-white/20 text-[13px] font-semibold text-foreground/90 bg-white/[0.05] hover:bg-white/[0.1] active:scale-[0.98] transition-all"
        >
          Edit Profile
        </button>
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
            {/* Gradient base */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${item.gradient}`}
            />
            {/* Accent glow */}
            <div
              className="absolute inset-0"
              style={{ background: item.accent }}
            />
            {/* Video play overlay */}
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
    </div>
  );
}
