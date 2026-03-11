import {
  Copy,
  Download,
  Eye,
  Heart,
  MessageCircle,
  Music2,
  PlusCircle,
  Send,
  Share2,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SiInstagram, SiWhatsapp } from "react-icons/si";
import { useAdmin } from "../contexts/AdminContext";
import { useModeration } from "../contexts/ModerationContext";

const REELS = [
  {
    id: 1,
    username: "rohit.ai",
    caption: "AI is changing everything 🤖✨ #RohitAITech",
    song: "AI Vibes — Rohit Beats",
    gradient: "from-[#0f0035] via-[#2d1b69] to-[#0a001f]",
    accent:
      "radial-gradient(ellipse 80% 70% at 60% 40%, oklch(0.55 0.28 300 / 0.6) 0%, transparent 70%)",
    shimmer: "oklch(0.55 0.28 300 / 0.15)",
    likes: 48200,
    comments: 1240,
    shares: 3800,
    views: 1_200_000,
  },
  {
    id: 2,
    username: "priya.sharma",
    caption: "Late night coding session 💻🔥 #Dev",
    song: "Night Coder — Lo-Fi Mix",
    gradient: "from-[#001a1a] via-[#00333a] to-[#001220]",
    accent:
      "radial-gradient(ellipse 70% 80% at 30% 60%, oklch(0.65 0.18 185 / 0.55) 0%, transparent 65%)",
    shimmer: "oklch(0.65 0.18 185 / 0.12)",
    likes: 29100,
    comments: 870,
    shares: 2100,
    views: 650_000,
  },
  {
    id: 3,
    username: "arjun.dev",
    caption: "When your model finally converges 🎉 #ML",
    song: "Neural Waves — SynthAI",
    gradient: "from-[#1f0010] via-[#3d0030] to-[#1a0020]",
    accent:
      "radial-gradient(ellipse 75% 65% at 50% 50%, oklch(0.6 0.25 350 / 0.6) 0%, transparent 68%)",
    shimmer: "oklch(0.6 0.25 350 / 0.14)",
    likes: 61400,
    comments: 2090,
    shares: 5600,
    views: 2_100_000,
  },
  {
    id: 4,
    username: "kavya.ai",
    caption: "Building the future one line at a time 🚀",
    song: "Future Bass — TechVibes",
    gradient: "from-[#0a1500] via-[#1a3300] to-[#0a1500]",
    accent:
      "radial-gradient(ellipse 80% 60% at 40% 45%, oklch(0.62 0.2 140 / 0.55) 0%, transparent 65%)",
    shimmer: "oklch(0.62 0.2 140 / 0.12)",
    likes: 34700,
    comments: 1100,
    shares: 2900,
    views: 890_000,
  },
  {
    id: 5,
    username: "sneha.creates",
    caption: "AI art is unreal 🎨✨ #AIArt #Creative",
    song: "Digital Dream — ArtBot",
    gradient: "from-[#00081f] via-[#001040] to-[#000d35]",
    accent:
      "radial-gradient(ellipse 70% 70% at 55% 45%, oklch(0.6 0.22 240 / 0.55) 0%, transparent 65%)",
    shimmer: "oklch(0.6 0.22 240 / 0.13)",
    likes: 52800,
    comments: 1780,
    shares: 4300,
    views: 1_750_000,
  },
];

// High-paying Interstitial Ads — revenue goes 100% to Admin Wallet
const INTERSTITIAL_ADS = [
  {
    id: "int1",
    brand: "Samsung Galaxy",
    tagline: "Galaxy AI is here. The most powerful phone ever made.",
    cta: "Explore Now",
    emoji: "📱",
    revenue: 8.5,
    bg: "linear-gradient(160deg, #0a0a14 0%, #0d0d2e 50%, #050510 100%)",
    accent:
      "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(30,80,220,0.45) 0%, transparent 70%)",
    ctaStyle: { background: "linear-gradient(135deg, #1428A0, #2563EB)" },
  },
  {
    id: "int2",
    brand: "Swiggy Instamart",
    tagline: "Groceries in 10 minutes. No excuses.",
    cta: "Order Now",
    emoji: "🛒",
    revenue: 6.0,
    bg: "linear-gradient(160deg, #0f0800 0%, #1e0e00 50%, #0a0500 100%)",
    accent:
      "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(220,100,10,0.45) 0%, transparent 70%)",
    ctaStyle: { background: "linear-gradient(135deg, #FC8019, #e55a00)" },
  },
  {
    id: "int3",
    brand: "Byju's",
    tagline: "Learn anything. Anytime. Anywhere. Free trial today.",
    cta: "Start Free",
    emoji: "🎓",
    revenue: 7.5,
    bg: "linear-gradient(160deg, #00080a 0%, #001020 50%, #000810 100%)",
    accent:
      "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(10,140,220,0.45) 0%, transparent 70%)",
    ctaStyle: { background: "linear-gradient(135deg, #0078C8, #00A3FF)" },
  },
  {
    id: "int4",
    brand: "MakeMyTrip",
    tagline: "Flights at ₹999. Book before they're gone.",
    cta: "Book Now",
    emoji: "✈️",
    revenue: 9.0,
    bg: "linear-gradient(160deg, #060012 0%, #0d0025 50%, #06000f 100%)",
    accent:
      "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(180,40,220,0.4) 0%, transparent 70%)",
    ctaStyle: { background: "linear-gradient(135deg, #C4006A, #E0006A)" },
  },
];

const REELS_BEFORE_AD = 3; // show interstitial after every 3 reels
const SKIP_DELAY_MS = 5000; // 5s before skip button appears

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type ToastMsg = { id: number; text: string };

export default function ReelsPage() {
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [playingIndex, setPlayingIndex] = useState<number | null>(0);
  const [showPlayIcon, setShowPlayIcon] = useState<number | null>(null);
  const [shareSheetIndex, setShareSheetIndex] = useState<number | null>(null);
  const [storyToastIndex, setStoryToastIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [_currentFeedIndex, setCurrentFeedIndex] = useState(0);

  // Interstitial ad state
  const [interstitialAd, setInterstitialAd] = useState<
    (typeof INTERSTITIAL_ADS)[0] | null
  >(null);
  const [canSkip, setCanSkip] = useState(false);
  const [skipCountdown, setSkipCountdown] = useState(5);
  const adIndexRef = useRef(0);
  const reelsViewedSinceAdRef = useRef(0);
  const watchedIndicesRef = useRef<Set<number>>(new Set());

  const playIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastCounterRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { getChannelStatus, getDeletionReason, getDeletionLabel } =
    useModeration();
  const { recordAdImpression } = useAdmin();

  const showToast = useCallback((text: string) => {
    const id = ++toastCounterRef.current;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2800);
  }, []);

  // Track scroll to detect new reel entering view
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const items = container.querySelectorAll<HTMLElement>("[data-feed-index]");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            const idx = Number.parseInt(
              (entry.target as HTMLElement).dataset.feedIndex || "0",
              10,
            );
            setCurrentFeedIndex(idx);
            // Track unique reel views and trigger interstitial
            if (!watchedIndicesRef.current.has(idx)) {
              watchedIndicesRef.current.add(idx);
              reelsViewedSinceAdRef.current += 1;
              if (reelsViewedSinceAdRef.current >= REELS_BEFORE_AD) {
                reelsViewedSinceAdRef.current = 0;
                const ad =
                  INTERSTITIAL_ADS[
                    adIndexRef.current % INTERSTITIAL_ADS.length
                  ];
                adIndexRef.current += 1;
                setInterstitialAd(ad);
                setCanSkip(false);
                setSkipCountdown(Math.ceil(SKIP_DELAY_MS / 1000));
              }
            }
          }
        }
      },
      { threshold: 0.5 },
    );

    for (const el of items) {
      observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  // Skip countdown timer when interstitial is showing
  useEffect(() => {
    if (!interstitialAd) return;
    const interval = setInterval(() => {
      setSkipCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [interstitialAd]);

  const closeInterstitial = useCallback(() => {
    if (interstitialAd) {
      recordAdImpression(interstitialAd.revenue);
    }
    setInterstitialAd(null);
    setCanSkip(false);
  }, [interstitialAd, recordAdImpression]);

  const toggleLike = useCallback((id: number) => {
    setLikedReels((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleReelTap = useCallback((index: number) => {
    setPlayingIndex((prev) => (prev === index ? null : index));
    setShowPlayIcon(index);
    if (playIconTimerRef.current) clearTimeout(playIconTimerRef.current);
    playIconTimerRef.current = setTimeout(() => setShowPlayIcon(null), 800);
  }, []);

  const openShareSheet = useCallback(
    (index: number) => setShareSheetIndex(index),
    [],
  );
  const closeShareSheet = useCallback(() => setShareSheetIndex(null), []);

  const handleCopyLink = useCallback(
    (reel: (typeof REELS)[0]) => {
      const url = `https://rohit-ai-tech.app/reel/${reel.id}`;
      navigator.clipboard
        .writeText(url)
        .then(() => showToast("Link copied!"))
        .catch(() => showToast("Copy failed"));
      closeShareSheet();
    },
    [showToast, closeShareSheet],
  );

  const handleShareWhatsApp = useCallback(
    (reel: (typeof REELS)[0]) => {
      const url = `https://rohit-ai-tech.app/reel/${reel.id}`;
      const msg = encodeURIComponent(
        `${reel.caption}\n\nWatch on Rohit AI Tech: ${url}`,
      );
      window.open(`https://wa.me/?text=${msg}`, "_blank");
      closeShareSheet();
    },
    [closeShareSheet],
  );

  const handleShareInstagram = useCallback(() => {
    showToast("Opening Instagram…");
    closeShareSheet();
  }, [showToast, closeShareSheet]);

  const handleMoreOptions = useCallback(
    (reel: (typeof REELS)[0]) => {
      const url = `https://rohit-ai-tech.app/reel/${reel.id}`;
      if (navigator.share) {
        navigator
          .share({ title: "Rohit AI Tech", text: reel.caption, url })
          .catch(() => {});
      } else {
        showToast("Sharing not supported on this device");
      }
      closeShareSheet();
    },
    [showToast, closeShareSheet],
  );

  const handleAddToStory = useCallback((index: number) => {
    setStoryToastIndex(index);
    if (storyTimerRef.current) clearTimeout(storyTimerRef.current);
    storyTimerRef.current = setTimeout(() => setStoryToastIndex(null), 2500);
  }, []);

  const downloadReel = useCallback((reel: (typeof REELS)[0]) => {
    const canvas = document.createElement("canvas");
    canvas.width = 720;
    canvas.height = 1280;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const hexMatches = reel.gradient.match(/#([0-9a-fA-F]{6})/g) || [
      "#0f0035",
      "#2d1b69",
      "#0a001f",
    ];
    const colors = hexMatches.slice(0, 3);

    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, colors[0]);
    if (colors[1]) {
      grad.addColorStop(0.5, colors[1]);
      grad.addColorStop(1, colors[2] || colors[1]);
    } else {
      grad.addColorStop(1, colors[0]);
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const radGrad = ctx.createRadialGradient(
      canvas.width * 0.5,
      canvas.height * 0.35,
      0,
      canvas.width * 0.5,
      canvas.height * 0.35,
      canvas.width * 0.6,
    );
    radGrad.addColorStop(0, "rgba(255,255,255,0.10)");
    radGrad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = radGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const botGrad = ctx.createLinearGradient(
      0,
      canvas.height * 0.55,
      0,
      canvas.height,
    );
    botGrad.addColorStop(0, "rgba(0,0,0,0)");
    botGrad.addColorStop(1, "rgba(0,0,0,0.85)");
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.globalAlpha = 0.22;
    ctx.font = "italic bold 26px 'Arial', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.letterSpacing = "0.18em";
    ctx.fillText("✦ ROHIT AI TECH", 32, 64);
    ctx.globalAlpha = 0.18;
    ctx.fillText("✦ ROHIT AI TECH", canvas.width - 280, canvas.height - 48);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.92;
    ctx.font = "bold 48px 'Arial', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("▶", canvas.width / 2, canvas.height / 2);
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.font = "bold 28px 'Arial', sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(`@${reel.username}`, 32, canvas.height - 120);
    ctx.font = "18px 'Arial', sans-serif";
    ctx.globalAlpha = 0.7;
    ctx.fillText(reel.caption.slice(0, 55), 32, canvas.height - 84);
    ctx.restore();

    const link = document.createElement("a");
    link.download = "reel-rohit-ai-tech.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  }, []);

  return (
    <div
      ref={scrollContainerRef}
      className="h-full w-full overflow-y-scroll snap-y snap-mandatory bg-black"
      style={
        {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties
      }
    >
      {/* ── INTERSTITIAL AD OVERLAY ── */}
      <AnimatePresence>
        {interstitialAd && (
          <motion.div
            key="interstitial"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            data-ocid="reels.interstitial_ad.modal"
            className="fixed inset-0 z-[200] flex flex-col"
            style={{ background: interstitialAd.bg }}
          >
            {/* Accent glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: interstitialAd.accent }}
            />

            {/* Top bar */}
            <div className="relative z-10 flex items-center justify-between px-5 pt-12 pb-3">
              <span
                className="text-[10px] font-bold tracking-[0.18em] uppercase px-3 py-1 rounded-full"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Ad · Rohit AI Tech
              </span>
              {/* Skip / countdown button */}
              {canSkip ? (
                <button
                  type="button"
                  data-ocid="reels.interstitial_ad.close_button"
                  onClick={closeInterstitial}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-white font-semibold text-[13px] active:scale-95 transition-transform"
                  style={{
                    background: "rgba(255,255,255,0.18)",
                    border: "1px solid rgba(255,255,255,0.3)",
                  }}
                >
                  <X className="h-3.5 w-3.5" />
                  Skip Ad
                </button>
              ) : (
                <span
                  className="px-4 py-1.5 rounded-full text-white/50 font-semibold text-[13px]"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.12)",
                  }}
                >
                  Skip in {skipCountdown}s
                </span>
              )}
            </div>

            {/* Main content */}
            <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 320,
                  damping: 20,
                  delay: 0.1,
                }}
                className="text-8xl mb-8"
              >
                {interstitialAd.emoji}
              </motion.div>
              <motion.h1
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.18 }}
                className="text-[32px] font-black mb-3 text-white"
                style={{
                  letterSpacing: "-0.025em",
                  fontFamily: "'Bricolage Grotesque', 'Outfit', sans-serif",
                }}
              >
                {interstitialAd.brand}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.24 }}
                className="text-[16px] text-white/65 leading-relaxed mb-10 max-w-[280px]"
              >
                {interstitialAd.tagline}
              </motion.p>
              <motion.button
                type="button"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                onClick={(e) => e.stopPropagation()}
                className="px-10 py-4 rounded-full font-bold text-[16px] text-white active:scale-95 transition-transform shadow-2xl"
                style={interstitialAd.ctaStyle as React.CSSProperties}
              >
                {interstitialAd.cta}
              </motion.button>
            </div>

            {/* Progress bar at bottom */}
            <div className="relative z-10 px-6 pb-12">
              <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  className="h-full bg-white/40 rounded-full"
                  initial={{ width: "0%" }}
                  animate={{
                    width: canSkip
                      ? "100%"
                      : `${((5 - skipCountdown) / 5) * 100}%`,
                  }}
                  transition={{ duration: 0.9, ease: "linear" }}
                />
              </div>
              <p className="text-center text-white/30 text-[11px] mt-2">
                Full-screen advertisement
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {REELS.map((reel, reelIndex) => {
        const feedIndex = reelIndex;
        const liked = likedReels.has(reel.id);
        const isPlaying = playingIndex === reelIndex;
        const likeCount = liked ? reel.likes + 1 : reel.likes;
        const channelStatus = getChannelStatus(reel.username);
        const deletionReason = getDeletionReason(reel.username);
        const isCopyrightViolation = deletionReason === "copyright";
        const badgeColor = isCopyrightViolation
          ? "bg-orange-500/20 border-orange-500/40 text-orange-300"
          : "bg-red-500/20 border-red-500/40 text-red-300";
        const isShareOpen = shareSheetIndex === reelIndex;
        const isStoryToast = storyToastIndex === reelIndex;
        // currentFeedIndex tracked for future use

        return (
          <div
            key={reel.id}
            data-feed-index={feedIndex}
            className="h-full w-full snap-start snap-always relative flex-shrink-0 overflow-hidden"
            style={{ minHeight: "100%" }}
          >
            {/* Gradient background */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${reel.gradient}`}
            />

            {/* Radial accent overlay */}
            <div
              className="absolute inset-0"
              style={{ background: reel.accent }}
            />

            {/* Pulsing shimmer */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${
                isPlaying ? "opacity-100" : "opacity-0"
              }`}
              style={{
                background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${reel.shimmer} 0%, transparent 70%)`,
                animation: isPlaying
                  ? "reelPulse 3s ease-in-out infinite"
                  : "none",
              }}
            />

            {/* Scan-line overlay */}
            {isPlaying && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
                }}
              />
            )}

            {/* Noise grain */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                backgroundSize: "128px 128px",
              }}
            />

            {/* ── STYLISH ON-SCREEN WATERMARK ── */}
            <div
              className="absolute top-[72px] right-4 z-20 pointer-events-none select-none"
              style={{
                opacity: 0.18,
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#ffffff",
                textShadow:
                  "0 0 12px rgba(255,255,255,0.5), 0 0 24px rgba(180,140,255,0.35)",
                fontFamily: "'Bricolage Grotesque', 'Sora', sans-serif",
                lineHeight: 1,
                whiteSpace: "nowrap",
              }}
            >
              ✦ Rohit AI Tech
            </div>

            {/* Tap target */}
            <button
              type="button"
              aria-label={isPlaying ? "Pause" : "Play"}
              className="absolute inset-0 z-10"
              onClick={() => handleReelTap(reelIndex)}
            />

            {/* Play/Pause flash icon */}
            <AnimatePresence>
              {showPlayIcon === reelIndex && (
                <motion.div
                  key="playicon"
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.4 }}
                  transition={{ duration: 0.25 }}
                  className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none"
                >
                  <div className="h-[72px] w-[72px] rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
                    {isPlaying ? (
                      <svg
                        role="img"
                        aria-label="Pause"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="h-8 w-8"
                      >
                        <rect x="6" y="5" width="4" height="14" rx="1" />
                        <rect x="14" y="5" width="4" height="14" rx="1" />
                      </svg>
                    ) : (
                      <svg
                        role="img"
                        aria-label="Play"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="h-8 w-8 ml-1"
                      >
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right vertical action bar */}
            <div className="absolute right-3 bottom-[120px] z-30 flex flex-col items-center gap-5">
              <div className="flex flex-col items-center gap-1">
                <div className="h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <Eye className="h-[22px] w-[22px] text-white/80" />
                </div>
                <span className="text-white text-[11px] font-semibold drop-shadow">
                  {formatCount(reel.views)}
                </span>
              </div>

              {/* Like */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  data-ocid={`reels.like_button.${reelIndex + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(reel.id);
                  }}
                  aria-label={liked ? "Unlike" : "Like"}
                  aria-pressed={liked}
                  className="h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
                >
                  <motion.div
                    animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
                    transition={{
                      duration: 0.3,
                      type: "spring",
                      stiffness: 400,
                      damping: 15,
                    }}
                  >
                    <Heart
                      className={`h-6 w-6 transition-colors duration-150 ${
                        liked ? "fill-red-500 text-red-500" : "text-white"
                      }`}
                    />
                  </motion.div>
                </button>
                <span className="text-white text-[11px] font-semibold drop-shadow">
                  {formatCount(likeCount)}
                </span>
              </div>

              {/* Comment */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  data-ocid={`reels.comment_button.${reelIndex + 1}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Comment"
                  className="h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
                >
                  <MessageCircle className="h-6 w-6 text-white" />
                </button>
                <span className="text-white text-[11px] font-semibold drop-shadow">
                  {formatCount(reel.comments)}
                </span>
              </div>

              {/* Add to Story */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  data-ocid="reels.add_to_story_button.1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAddToStory(reelIndex);
                  }}
                  aria-label="Add to Story"
                  className="h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
                >
                  <PlusCircle className="h-[22px] w-[22px] text-white" />
                </button>
                <span className="text-white text-[11px] font-semibold drop-shadow">
                  Story
                </span>
              </div>

              {/* Download */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  data-ocid={`reels.download_button.${reelIndex + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadReel(reel);
                  }}
                  aria-label="Download reel"
                  className="h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Download className="h-[22px] w-[22px] text-white" />
                </button>
                <span className="text-white text-[11px] font-semibold drop-shadow">
                  Save
                </span>
              </div>

              {/* Share */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  data-ocid={`reels.share_button.${reelIndex + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    openShareSheet(reelIndex);
                  }}
                  aria-label="Share"
                  className="h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Send className="h-[22px] w-[22px] text-white" />
                </button>
                <span className="text-white text-[11px] font-semibold drop-shadow">
                  {formatCount(reel.shares)}
                </span>
              </div>

              {/* Music disc */}
              <div
                className="h-11 w-11 rounded-full border-2 border-white/30 overflow-hidden flex items-center justify-center"
                style={{
                  background: reel.accent,
                  animation: isPlaying ? "spin 8s linear infinite" : "none",
                }}
              >
                <div className="h-3 w-3 rounded-full bg-white/80" />
              </div>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
              <div className="h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="bg-black/0 px-4 pb-5 -mt-4">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-white font-bold text-[15px] leading-tight drop-shadow">
                    @{reel.username}
                  </p>
                  {channelStatus === "deleted" && deletionReason && (
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-semibold ${badgeColor}`}
                    >
                      {isCopyrightViolation ? "©" : "⚠"}{" "}
                      {getDeletionLabel(deletionReason)}
                    </span>
                  )}
                </div>
                <p className="text-white/85 text-[13px] leading-snug drop-shadow mb-3">
                  {reel.caption}
                </p>
                <div className="flex items-center gap-2 overflow-hidden">
                  <Music2
                    className="h-[14px] w-[14px] text-white flex-shrink-0"
                    style={{
                      animation: isPlaying ? "spin 3s linear infinite" : "none",
                    }}
                  />
                  <div className="overflow-hidden flex-1">
                    <p
                      className="text-white/80 text-[12px] font-medium whitespace-nowrap"
                      style={{
                        animation: isPlaying
                          ? "marqueeScroll 8s linear infinite"
                          : "none",
                        display: "inline-block",
                      }}
                    >
                      {reel.song} &nbsp;&nbsp;&nbsp; {reel.song}{" "}
                      &nbsp;&nbsp;&nbsp;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning banner */}
            {channelStatus === "warned" && (
              <div className="absolute bottom-[70px] left-0 right-0 z-40 pointer-events-none px-3">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 backdrop-blur-sm">
                  <span className="text-[12px] text-amber-300 font-semibold">
                    ⚠️ Duplicate content warning issued
                  </span>
                </div>
              </div>
            )}

            {/* Suspended / Deleted overlay */}
            {(channelStatus === "suspended" || channelStatus === "deleted") && (
              <div
                data-ocid={`reels.panel.${reelIndex + 1}`}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-sm"
              >
                <div className="text-center px-8">
                  <div className="text-5xl mb-4">
                    {channelStatus === "deleted" ? "🗑️" : "🚫"}
                  </div>
                  <h3 className="text-white font-bold text-[18px] mb-2">
                    {channelStatus === "deleted"
                      ? "Channel Removed"
                      : "Channel Suspended"}
                  </h3>
                  <p className="text-white/60 text-[13px] leading-relaxed">
                    {channelStatus === "deleted" && deletionReason
                      ? getDeletionLabel(deletionReason)
                      : "This channel has been removed for policy violations."}
                  </p>
                  <div
                    className={`mt-4 px-4 py-2 rounded-full border ${
                      channelStatus === "deleted" && isCopyrightViolation
                        ? "border-orange-500/40 bg-orange-500/15"
                        : "border-red-500/40 bg-red-500/15"
                    }`}
                  >
                    <span
                      className={`text-[12px] font-semibold ${
                        channelStatus === "deleted" && isCopyrightViolation
                          ? "text-orange-400"
                          : "text-red-400"
                      }`}
                    >
                      @{reel.username}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ── ADD TO STORY TOAST ── */}
            <AnimatePresence>
              {isStoryToast && (
                <motion.div
                  key="story-toast"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 380, damping: 22 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none"
                >
                  <div className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-black/70 backdrop-blur-md border border-white/10">
                    <span className="text-2xl">✨</span>
                    <p className="text-white font-semibold text-[14px] text-center leading-tight">
                      Added to your Story!
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── SHARE SHEET ── */}
            <AnimatePresence>
              {isShareOpen && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    key="share-backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 z-[55] bg-black/60 backdrop-blur-[2px]"
                    onClick={closeShareSheet}
                  />

                  {/* Sheet */}
                  <motion.div
                    key="share-sheet"
                    data-ocid="reels.share_sheet.1"
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 340, damping: 30 }}
                    className="absolute bottom-0 left-0 right-0 z-[60] rounded-t-3xl bg-[#111] border-t border-white/10 pb-safe"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-1">
                      <div className="w-10 h-1 rounded-full bg-white/20" />
                    </div>

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-3">
                      <h3 className="text-white font-bold text-[16px] tracking-wide">
                        Share Reel
                      </h3>
                      <button
                        type="button"
                        data-ocid="reels.share_sheet_close_button"
                        onClick={closeShareSheet}
                        aria-label="Close share sheet"
                        className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
                      >
                        <X className="h-4 w-4 text-white/70" />
                      </button>
                    </div>

                    {/* Caption preview */}
                    <div className="mx-5 mb-4 px-3 py-2 rounded-xl bg-white/5 border border-white/8">
                      <p className="text-white/60 text-[12px] leading-snug line-clamp-2">
                        {reel.caption}
                      </p>
                    </div>

                    {/* Share options */}
                    <div className="px-4 pb-6 flex flex-col gap-2">
                      {/* Copy Link */}
                      <button
                        type="button"
                        data-ocid="reels.share_copy_link_button.1"
                        onClick={() => handleCopyLink(reel)}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/10 active:bg-white/15 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center flex-shrink-0">
                          <Copy className="h-[18px] w-[18px] text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-semibold text-[14px]">
                            Copy Link
                          </p>
                          <p className="text-white/45 text-[11px]">
                            Copy reel URL to clipboard
                          </p>
                        </div>
                      </button>

                      {/* WhatsApp */}
                      <button
                        type="button"
                        data-ocid="reels.share_whatsapp_button.1"
                        onClick={() => handleShareWhatsApp(reel)}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/10 active:bg-white/15 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                          <SiWhatsapp className="h-[20px] w-[20px] text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-semibold text-[14px]">
                            Share to WhatsApp
                          </p>
                          <p className="text-white/45 text-[11px]">
                            Send via WhatsApp
                          </p>
                        </div>
                      </button>

                      {/* Instagram Stories */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareInstagram();
                        }}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/10 active:bg-white/15 transition-colors"
                      >
                        <div
                          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
                          }}
                        >
                          <SiInstagram className="h-[20px] w-[20px] text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-semibold text-[14px]">
                            Add to Instagram Story
                          </p>
                          <p className="text-white/45 text-[11px]">
                            Share this reel to your story
                          </p>
                        </div>
                      </button>

                      {/* More Options */}
                      <button
                        type="button"
                        data-ocid="reels.share_more_button.1"
                        onClick={() => handleMoreOptions(reel)}
                        className="flex items-center gap-4 px-4 py-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/10 active:bg-white/15 transition-colors"
                      >
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center flex-shrink-0">
                          <Share2 className="h-[18px] w-[22px] text-white" />
                        </div>
                        <div className="text-left">
                          <p className="text-white font-semibold text-[14px]">
                            More Options
                          </p>
                          <p className="text-white/45 text-[11px]">
                            Share via system dialog
                          </p>
                        </div>
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Global toasts */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -12, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 26 }}
              className="px-4 py-2 rounded-full bg-black/80 border border-white/15 backdrop-blur-md"
            >
              <span className="text-white text-[13px] font-medium">
                {t.text}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <style>{`
        @keyframes reelPulse {
          0%, 100% { opacity: 0.6; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.08); }
        }
        @keyframes marqueeScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
