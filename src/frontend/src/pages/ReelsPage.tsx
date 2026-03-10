import { Eye, Heart, MessageCircle, Music2, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";

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

function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

export default function ReelsPage() {
  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [playingIndex, setPlayingIndex] = useState<number | null>(0);
  const [showPlayIcon, setShowPlayIcon] = useState<number | null>(null);
  const playIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

  return (
    <div
      className="h-full w-full overflow-y-scroll snap-y snap-mandatory bg-black"
      style={
        {
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        } as React.CSSProperties
      }
    >
      {REELS.map((reel, index) => {
        const liked = likedReels.has(reel.id);
        const isPlaying = playingIndex === index;
        const likeCount = liked ? reel.likes + 1 : reel.likes;

        return (
          <div
            key={reel.id}
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

            {/* Pulsing shimmer simulate video motion */}
            <div
              className={`absolute inset-0 transition-opacity duration-700 ${isPlaying ? "opacity-100" : "opacity-0"}`}
              style={{
                background: `radial-gradient(ellipse 50% 40% at 50% 50%, ${reel.shimmer} 0%, transparent 70%)`,
                animation: isPlaying
                  ? "reelPulse 3s ease-in-out infinite"
                  : "none",
              }}
            />

            {/* Moving scan-line overlay for live feel */}
            {isPlaying && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
                }}
              />
            )}

            {/* Noise grain overlay */}
            <div
              className="absolute inset-0 opacity-[0.04] pointer-events-none"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                backgroundSize: "128px 128px",
              }}
            />

            {/* Tap target for play/pause */}
            <button
              type="button"
              aria-label={isPlaying ? "Pause" : "Play"}
              className="absolute inset-0 z-10"
              onClick={() => handleReelTap(index)}
            />

            {/* Play/Pause flash icon */}
            <AnimatePresence>
              {showPlayIcon === index && (
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

            {/* ── Right vertical action bar ── */}
            <div className="absolute right-3 bottom-[120px] z-30 flex flex-col items-center gap-5">
              {/* Views */}
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
                  data-ocid={`reels.like_button.${index + 1}`}
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
                  data-ocid={`reels.comment_button.${index + 1}`}
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

              {/* Share */}
              <div className="flex flex-col items-center gap-1">
                <button
                  type="button"
                  data-ocid={`reels.share_button.${index + 1}`}
                  onClick={(e) => e.stopPropagation()}
                  aria-label="Share"
                  className="h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center active:scale-90 transition-transform"
                >
                  <Send className="h-[22px] w-[22px] text-white" />
                </button>
                <span className="text-white text-[11px] font-semibold drop-shadow">
                  {formatCount(reel.shares)}
                </span>
              </div>

              {/* Album art disc */}
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

            {/* ── Bottom info bar ── */}
            <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
              {/* Gradient fade */}
              <div className="h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="bg-black/0 px-4 pb-5 -mt-4">
                <p className="text-white font-bold text-[15px] leading-tight drop-shadow mb-0.5">
                  @{reel.username}
                </p>
                <p className="text-white/85 text-[13px] leading-snug drop-shadow mb-3">
                  {reel.caption}
                </p>
                {/* Music row */}
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
          </div>
        );
      })}

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
