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
import { getQualityScore } from "../utils/monetizationEngine";

const BASE_REELS = [
  {
    id: 1,
    username: "mani.meraj.official",
    caption:
      "Jab school mein pehli baar teacher ne notice kiya 😂 #ManiMeraj #BhojpuriComedy",
    song: "Lahariya Loot - Bhojpuri Mix",
    gradient: "from-[#1a0a00] via-[#3d1a00] to-[#1a0800]",
    accent:
      "radial-gradient(ellipse 80% 70% at 60% 40%, oklch(0.65 0.22 55 / 0.6) 0%, transparent 70%)",
    shimmer: "oklch(0.65 0.22 55 / 0.15)",
    likes: 482000,
    comments: 38400,
    shares: 152000,
    views: 12_400_000,
  },
  {
    id: 2,
    username: "mani.meraj.official",
    caption:
      "Gaon wale bhaiya ka jugaad dekho 🤣🔧 #ManiMeraj #Jugaad #Bhojpuri",
    song: "Pawan Singh - Lollipop Lagelu",
    gradient: "from-[#200a00] via-[#4a1500] to-[#1a0800]",
    accent:
      "radial-gradient(ellipse 70% 65% at 40% 55%, oklch(0.6 0.25 40 / 0.55) 0%, transparent 65%)",
    shimmer: "oklch(0.6 0.25 40 / 0.14)",
    likes: 395000,
    comments: 29800,
    shares: 118000,
    views: 9_800_000,
  },
  {
    id: 3,
    username: "mani.meraj.comedy",
    caption: "Baap re baap! Ek number ka scene 😂😂 #ManiMeraj #Comedy #Viral",
    song: "Khesari Lal - Superhit Bhojpuri",
    gradient: "from-[#1a0500] via-[#3a1000] to-[#150600]",
    accent:
      "radial-gradient(ellipse 75% 70% at 55% 45%, oklch(0.68 0.20 50 / 0.58) 0%, transparent 68%)",
    shimmer: "oklch(0.68 0.20 50 / 0.13)",
    likes: 521000,
    comments: 44200,
    shares: 198000,
    views: 14_200_000,
  },
  {
    id: 4,
    username: "suraj.rokade",
    caption: "Aai cha raag... legendary 😂 #SurajRokade #MarathiComedy #Viral",
    song: "Zingaat Remix - Sairat",
    gradient: "from-[#0d0020] via-[#2d0050] to-[#0d0030]",
    accent:
      "radial-gradient(ellipse 80% 65% at 50% 45%, oklch(0.55 0.28 295 / 0.6) 0%, transparent 70%)",
    shimmer: "oklch(0.55 0.28 295 / 0.15)",
    likes: 312000,
    comments: 24600,
    shares: 89000,
    views: 7_600_000,
  },
  {
    id: 5,
    username: "suraj.rokade",
    caption:
      "Mumbai local mein ye scene nahi dekha hoga 😂🚂 #SurajRokade #Mumbai",
    song: "DJ Wale Babu - Marathi Tadka",
    gradient: "from-[#100025] via-[#250055] to-[#0f0035]",
    accent:
      "radial-gradient(ellipse 70% 70% at 45% 50%, oklch(0.58 0.26 300 / 0.55) 0%, transparent 65%)",
    shimmer: "oklch(0.58 0.26 300 / 0.14)",
    likes: 278000,
    comments: 19800,
    shares: 74000,
    views: 6_200_000,
  },
  {
    id: 6,
    username: "amit.bhadana",
    caption:
      "Delhi ke ladke ka swag alag hota hai 😎 #AmitBhadana #Dilli #Comedy",
    song: "Koi Kahe - Party Mix",
    gradient: "from-[#000d20] via-[#001a40] to-[#000d30]",
    accent:
      "radial-gradient(ellipse 75% 70% at 55% 40%, oklch(0.55 0.22 240 / 0.6) 0%, transparent 70%)",
    shimmer: "oklch(0.55 0.22 240 / 0.15)",
    likes: 612000,
    comments: 52000,
    shares: 215000,
    views: 15_600_000,
  },
  {
    id: 7,
    username: "amit.bhadana",
    caption:
      "Papa ke saath kya hota hai jab report card aata hai 🤣 #AmitBhadana #Relatable",
    song: "Badshah - DJ Waley Babu",
    gradient: "from-[#000a1f] via-[#00153a] to-[#000b28]",
    accent:
      "radial-gradient(ellipse 70% 60% at 40% 55%, oklch(0.6 0.20 235 / 0.55) 0%, transparent 65%)",
    shimmer: "oklch(0.6 0.20 235 / 0.13)",
    likes: 489000,
    comments: 41000,
    shares: 182000,
    views: 12_100_000,
  },
  {
    id: 8,
    username: "amit.bhadana",
    caption:
      "Bhai ka jugaad level: God mode activated 🔥 #AmitBhadana #Jugaad #Dilli",
    song: "Honey Singh - Blue Eyes Remix",
    gradient: "from-[#001030] via-[#002050] to-[#001038]",
    accent:
      "radial-gradient(ellipse 80% 65% at 60% 45%, oklch(0.52 0.24 245 / 0.58) 0%, transparent 68%)",
    shimmer: "oklch(0.52 0.24 245 / 0.14)",
    likes: 356000,
    comments: 28500,
    shares: 124000,
    views: 8_900_000,
  },
  {
    id: 9,
    username: "pushpa.fire",
    caption:
      "Pushpa: I am not a flower... I am fire 🔥 #Pushpa #AlluArjun #Viral",
    song: "Srivalli - Pushpa OST",
    gradient: "from-[#1a0000] via-[#3d0a00] to-[#1a0500]",
    accent:
      "radial-gradient(ellipse 80% 70% at 55% 40%, oklch(0.6 0.28 25 / 0.65) 0%, transparent 70%)",
    shimmer: "oklch(0.6 0.28 25 / 0.16)",
    likes: 728000,
    comments: 68000,
    shares: 298000,
    views: 18_400_000,
  },
  {
    id: 10,
    username: "pushpa.fire",
    caption:
      "Pushpa Rule no. 1: Jhukega nahi 😤🔥 #PushpaRules #AlluArjun #Action",
    song: "Oo Antava - Pushpa OST",
    gradient: "from-[#200000] via-[#450800] to-[#1e0300]",
    accent:
      "radial-gradient(ellipse 70% 65% at 45% 50%, oklch(0.62 0.26 20 / 0.60) 0%, transparent 65%)",
    shimmer: "oklch(0.62 0.26 20 / 0.15)",
    likes: 594000,
    comments: 51000,
    shares: 241000,
    views: 14_700_000,
  },
  {
    id: 11,
    username: "rrr.official.fan",
    caption:
      "RRR interval block - goosebumps every time 🎬 #RRR #Rajamouli #SS",
    song: "Naatu Naatu - RRR",
    gradient: "from-[#180000] via-[#380500] to-[#160200]",
    accent:
      "radial-gradient(ellipse 75% 70% at 50% 45%, oklch(0.58 0.28 15 / 0.62) 0%, transparent 68%)",
    shimmer: "oklch(0.58 0.28 15 / 0.15)",
    likes: 812000,
    comments: 75000,
    shares: 321000,
    views: 21_000_000,
  },
  {
    id: 12,
    username: "rrr.official.fan",
    caption:
      "Naatu Naatu - Oscar winning performance 🏆🎶 #NaatuNaatu #RRR #Oscar",
    song: "Naatu Naatu Full Song - RRR",
    gradient: "from-[#1a0500] via-[#3a0e00] to-[#180400]",
    accent:
      "radial-gradient(ellipse 72% 68% at 55% 42%, oklch(0.65 0.25 28 / 0.58) 0%, transparent 68%)",
    shimmer: "oklch(0.65 0.25 28 / 0.14)",
    likes: 698000,
    comments: 61000,
    shares: 276000,
    views: 16_800_000,
  },
  {
    id: 13,
    username: "thalapathy.vibes",
    caption: "Thalapathy entry BGM 🎶🔥 #Vijay #Leo #Thalapathy #Kollywood",
    song: "Whistle Podu - Thalapathy",
    gradient: "from-[#150000] via-[#350800] to-[#140200]",
    accent:
      "radial-gradient(ellipse 78% 68% at 48% 44%, oklch(0.62 0.27 22 / 0.62) 0%, transparent 70%)",
    shimmer: "oklch(0.62 0.27 22 / 0.15)",
    likes: 534000,
    comments: 47000,
    shares: 201000,
    views: 13_200_000,
  },
  {
    id: 14,
    username: "thalapathy.vibes",
    caption: "Leo climax scene - mass overload 💥 #Leo #Vijay #Tamil #Action",
    song: "Leo Theme - Anirudh",
    gradient: "from-[#1c0000] via-[#400a00] to-[#1a0400]",
    accent:
      "radial-gradient(ellipse 70% 70% at 52% 48%, oklch(0.60 0.26 18 / 0.60) 0%, transparent 66%)",
    shimmer: "oklch(0.60 0.26 18 / 0.14)",
    likes: 461000,
    comments: 39000,
    shares: 175000,
    views: 11_500_000,
  },
  {
    id: 15,
    username: "kgf.rockingstar",
    caption:
      "Rocky bhai dialogue delivery - unmatched swag 💎 #KGF #YashBoss #Rocky",
    song: "KGF Theme - Ravi Basrur",
    gradient: "from-[#0a0a00] via-[#1e1a00] to-[#0a0900]",
    accent:
      "radial-gradient(ellipse 80% 65% at 50% 40%, oklch(0.68 0.22 80 / 0.58) 0%, transparent 68%)",
    shimmer: "oklch(0.68 0.22 80 / 0.14)",
    likes: 678000,
    comments: 59000,
    shares: 268000,
    views: 17_300_000,
  },
  {
    id: 16,
    username: "bahubali.epic",
    caption:
      "Kattappa ne Baahubali ko kyun maara?! Still iconic 😱 #Baahubali #Prabhas",
    song: "Baahubali - The Beginning Theme",
    gradient: "from-[#060010] via-[#120025] to-[#060018]",
    accent:
      "radial-gradient(ellipse 75% 70% at 50% 45%, oklch(0.52 0.26 280 / 0.58) 0%, transparent 68%)",
    shimmer: "oklch(0.52 0.26 280 / 0.14)",
    likes: 892000,
    comments: 82000,
    shares: 348000,
    views: 23_600_000,
  },
  {
    id: 17,
    username: "suraj.rokade.official",
    caption:
      "Office mein boss ke saath jhagda - comedy gold 😂 #SurajRokade #Office",
    song: "Marathi DJ Beats 2024",
    gradient: "from-[#0e001e] via-[#260048] to-[#0e0028]",
    accent:
      "radial-gradient(ellipse 72% 66% at 46% 52%, oklch(0.56 0.27 290 / 0.56) 0%, transparent 66%)",
    shimmer: "oklch(0.56 0.27 290 / 0.13)",
    likes: 243000,
    comments: 18200,
    shares: 68000,
    views: 5_400_000,
  },
  {
    id: 18,
    username: "mani.meraj.official",
    caption:
      "Sasural ka scene dekho - pure comedy 😂🤣 #ManiMeraj #Sasural #Bhojpuri",
    song: "Ritesh Pandey - Hit Song Mix",
    gradient: "from-[#1e0800] via-[#421200] to-[#1c0600]",
    accent:
      "radial-gradient(ellipse 78% 68% at 58% 42%, oklch(0.66 0.21 48 / 0.56) 0%, transparent 68%)",
    shimmer: "oklch(0.66 0.21 48 / 0.13)",
    likes: 418000,
    comments: 34000,
    shares: 142000,
    views: 10_600_000,
  },
  {
    id: 19,
    username: "south.mass.edits",
    caption:
      "Mahesh Babu attitude scene 😎💥 #MaheshBabu #Pokiri #Telugu #Mass",
    song: "Pokiri Theme - Mani Sharma",
    gradient: "from-[#100010] via-[#280025] to-[#100018]",
    accent:
      "radial-gradient(ellipse 76% 68% at 52% 44%, oklch(0.54 0.27 310 / 0.58) 0%, transparent 68%)",
    shimmer: "oklch(0.54 0.27 310 / 0.14)",
    likes: 387000,
    comments: 32000,
    shares: 135000,
    views: 9_100_000,
  },
  {
    id: 20,
    username: "amit.bhadana",
    caption:
      "Rishtedar aate hain toh kya hota hai ghar mein 😂 #AmitBhadana #Family",
    song: "Yo Yo Honey Singh - Brown Rang",
    gradient: "from-[#000f25] via-[#001d45] to-[#000e32]",
    accent:
      "radial-gradient(ellipse 74% 66% at 44% 50%, oklch(0.58 0.21 242 / 0.56) 0%, transparent 66%)",
    shimmer: "oklch(0.58 0.21 242 / 0.13)",
    likes: 445000,
    comments: 37500,
    shares: 163000,
    views: 11_200_000,
  },
  {
    id: 21,
    username: "vijay.sethupathi.fans",
    caption:
      "Makkal Selvan dialogue punch - pure gold 🥊 #VijaySetupathi #Tamil",
    song: "Vikram Vedha Theme",
    gradient: "from-[#001a10] via-[#003320] to-[#001518]",
    accent:
      "radial-gradient(ellipse 76% 68% at 50% 45%, oklch(0.58 0.22 155 / 0.58) 0%, transparent 68%)",
    shimmer: "oklch(0.58 0.22 155 / 0.14)",
    likes: 328000,
    comments: 27000,
    shares: 112000,
    views: 8_200_000,
  },
  {
    id: 22,
    username: "rohit.shetty.action",
    caption:
      "Singham returns - gaadi ka scene legendary hai 🚗💥 #Singham #RohitShetty",
    song: "Aata Majhi Satakli - Remix",
    gradient: "from-[#1a1000] via-[#352000] to-[#181000]",
    accent:
      "radial-gradient(ellipse 74% 66% at 48% 42%, oklch(0.66 0.20 65 / 0.55) 0%, transparent 66%)",
    shimmer: "oklch(0.66 0.20 65 / 0.13)",
    likes: 267000,
    comments: 21000,
    shares: 92000,
    views: 6_800_000,
  },
];

// Assign mock ageHours for quality scoring
const REEL_AGE_HOURS = [
  2, 5, 12, 24, 3, 48, 8, 6, 36, 72, 4, 18, 10, 14, 96, 7, 20, 30, 48, 9, 15,
  25,
];

const SORTED_REELS = [...BASE_REELS]
  .map((r, i) => ({
    ...r,
    ageHours: REEL_AGE_HOURS[i % REEL_AGE_HOURS.length],
  }))
  .sort((a, b) => {
    const scoreA = getQualityScore(a.likes, a.comments, a.shares, a.ageHours);
    const scoreB = getQualityScore(b.likes, b.comments, b.shares, b.ageHours);
    return scoreB - scoreA;
  });

const TOP_REEL_IDS = new Set(SORTED_REELS.slice(0, 3).map((r) => r.id));

let reelIdCounter = BASE_REELS.length + 1;

function shuffleReels<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

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
type Reel = (typeof BASE_REELS)[0];

interface ReplyEntry {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
  liked: boolean;
}
interface CommentEntry {
  id: string;
  author: string;
  text: string;
  timestamp: number;
  likes: number;
  liked: boolean;
  replies: ReplyEntry[];
}

export default function ReelsPage() {
  const [reels, setReels] = useState<Reel[]>(() => {
    // Daily shuffle: check stored date
    const today = new Date().toDateString();
    const stored = localStorage.getItem("reels_shuffle_date");
    if (stored !== today) {
      localStorage.setItem("reels_shuffle_date", today);
    }
    const shuffled = shuffleReels(SORTED_REELS);
    return shuffled.length > 0 ? shuffled : [...SORTED_REELS];
  });

  const [likedReels, setLikedReels] = useState<Set<number>>(new Set());
  const [playingIndex, setPlayingIndex] = useState<number | null>(0);
  const [showPlayIcon, setShowPlayIcon] = useState<number | null>(null);
  const [shareSheetIndex, setShareSheetIndex] = useState<number | null>(null);
  const [audioSheetReel, setAudioSheetReel] = useState<Reel | null>(null);
  const [doubleTapHeart, setDoubleTapHeart] = useState<number | null>(null);
  const lastTapRef = useRef<{ index: number; time: number } | null>(null);
  const [storyToastIndex, setStoryToastIndex] = useState<number | null>(null);
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  const [_currentFeedIndex, setCurrentFeedIndex] = useState(0);

  // Interstitial ad state
  const [interstitialAd, setInterstitialAd] = useState<
    (typeof INTERSTITIAL_ADS)[0] | null
  >(null);
  const [canSkip, setCanSkip] = useState(false);
  const [commentSheetReelIndex, setCommentSheetReelIndex] = useState<
    number | null
  >(null);
  const [commentsByReel, setCommentsByReel] = useState<
    Record<string, CommentEntry[]>
  >(() => {
    try {
      return JSON.parse(localStorage.getItem("rohit_comments") || "{}");
    } catch {
      return {};
    }
  });
  const [commentText, setCommentText] = useState("");
  const [replyingTo, setReplyingTo] = useState<{
    commentId: string;
    author: string;
  } | null>(null);
  const commentInputRef = useRef<HTMLInputElement>(null);
  const [skipCountdown, setSkipCountdown] = useState(5);
  const adIndexRef = useRef(0);
  const reelsViewedSinceAdRef = useRef(0);
  const watchedIndicesRef = useRef<Set<number>>(new Set());

  const playIconTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const storyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastCounterRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
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

  // Append more reels for infinite scroll
  const appendMoreReels = useCallback(() => {
    const count = 8 + Math.floor(Math.random() * 3); // 8-10
    const shuffled = shuffleReels(SORTED_REELS).slice(0, count);
    const newReels = shuffled.map((r) => ({ ...r, id: reelIdCounter++ }));
    setReels((prev) => [...prev, ...newReels]);
  }, []);

  // Load user-uploaded reels from localStorage
  useEffect(() => {
    const loadUserReels = () => {
      try {
        const raw = localStorage.getItem("user_posts");
        if (!raw) return;
        const posts = JSON.parse(raw);
        const userReels = posts
          .filter(
            (item: Record<string, unknown>) =>
              item.type === "reel" ||
              item.type === "video" ||
              item.mediaType === "reel",
          )
          .map((item: Record<string, unknown>, index: number) => ({
            id: 900000 + index,
            username: (item.username as string) || "you",
            caption: (item.caption as string) || "",
            song: "Original Audio",
            gradient: "from-[#0a0a0a] via-[#111] to-[#0a0a0a]",
            accent: "linear-gradient(135deg,#6366f1,#ec4899)",
            shimmer: "rgba(255,255,255,0.05)",
            likes: 0,
            comments: 0,
            shares: 0,
            views: (item.views as number) || 0,
          }));
        if (userReels.length > 0) {
          setReels((prev) => {
            // Remove old user reels (id >= 900000), then prepend fresh ones
            const withoutOld = prev.filter((r) => r.id < 900000);
            return [...userReels, ...withoutOld];
          });
        }
      } catch {}
    };
    loadUserReels();
    window.addEventListener("userPostAdded", loadUserReels);
    window.addEventListener("storage", loadUserReels);
    return () => {
      window.removeEventListener("userPostAdded", loadUserReels);
      window.removeEventListener("storage", loadUserReels);
    };
  }, []);

  // Sentinel IntersectionObserver for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            appendMoreReels();
          }
        }
      },
      { threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [appendMoreReels]);

  // Track scroll to detect new reel entering view
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-observe when reels list grows
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
  }, [reels.length]);

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

  const handleReelTap = useCallback(
    (index: number) => {
      const now = Date.now();
      const last = lastTapRef.current;
      if (last && last.index === index && now - last.time < 300) {
        // Double tap detected
        lastTapRef.current = null;
        setDoubleTapHeart(index);
        // Also auto-like
        setLikedReels((prev) => {
          const next = new Set(prev);
          next.add(reels[index]?.id ?? index);
          return next;
        });
        setTimeout(() => setDoubleTapHeart(null), 900);
      } else {
        lastTapRef.current = { index, time: now };
        setPlayingIndex((prev) => (prev === index ? null : index));
        setShowPlayIcon(index);
        if (playIconTimerRef.current) clearTimeout(playIconTimerRef.current);
        playIconTimerRef.current = setTimeout(() => setShowPlayIcon(null), 800);
      }
    },
    [reels],
  );

  const openShareSheet = useCallback(
    (index: number) => setShareSheetIndex(index),
    [],
  );
  const closeShareSheet = useCallback(() => setShareSheetIndex(null), []);

  // ── COMMENT HELPERS ──
  const MOCK_NAMES = [
    "Priya",
    "Rahul",
    "Anjali",
    "Vikram",
    "Sneha",
    "Amit",
    "Neha",
    "Rohan",
  ];
  const MOCK_COMMENTS = [
    "Bhai yeh scene too good hai 😂🔥",
    "Ekdum mast content! Keep it up 🙌",
    "@priya.sharma dekh yaar kitna funny hai 😭",
    "Bhai teri comedy ne toh dil jeet liya ❤️",
    "Arey wah! Ek number tha yeh 🤣🤣",
    "Yeh toh pura viral hona chahiye! 🔥",
    "Ab aur kya chahiye zindagi se 😂",
    "Legend hai bhai tu 🫡",
  ];

  const seedComments = (reelId: number): CommentEntry[] => {
    const seed = reelId % 8;
    return Array.from({ length: 3 + (reelId % 3) }, (_, i) => {
      const nameIdx = (seed + i * 3) % MOCK_NAMES.length;
      const textIdx = (seed + i * 2) % MOCK_COMMENTS.length;
      return {
        id: `seed-${reelId}-${i}`,
        author: MOCK_NAMES[nameIdx],
        text: MOCK_COMMENTS[textIdx],
        timestamp: Date.now() - (i + 1) * 3600000,
        likes: 10 + ((reelId * 7 + i * 13) % 500),
        liked: false,
        replies:
          i === 0
            ? [
                {
                  id: `seed-${reelId}-r0`,
                  author: MOCK_NAMES[(nameIdx + 2) % MOCK_NAMES.length],
                  text: "Hahaha sahi bola yaar! 😂",
                  timestamp: Date.now() - i * 1800000,
                  likes: 5,
                  liked: false,
                },
              ]
            : [],
      };
    });
  };

  const getCommentsForReel = (reelId: number): CommentEntry[] => {
    const key = String(reelId);
    if (commentsByReel[key]) return commentsByReel[key];
    return seedComments(reelId);
  };

  const saveComments = (reelId: number, comments: CommentEntry[]) => {
    const updated = { ...commentsByReel, [String(reelId)]: comments };
    setCommentsByReel(updated);
    try {
      localStorage.setItem("rohit_comments", JSON.stringify(updated));
    } catch {}
  };

  const handleAddComment = (reelId: number) => {
    const text = commentText.trim();
    if (!text) return;
    const session = JSON.parse(localStorage.getItem("rohit_session") || "{}");
    const author = session.name || "You";
    const current = getCommentsForReel(reelId);
    if (replyingTo) {
      const updated = current.map((c) =>
        c.id === replyingTo.commentId
          ? {
              ...c,
              replies: [
                ...c.replies,
                {
                  id: `r-${Date.now()}`,
                  author,
                  text,
                  timestamp: Date.now(),
                  likes: 0,
                  liked: false,
                },
              ],
            }
          : c,
      );
      saveComments(reelId, updated);
    } else {
      const newComment: CommentEntry = {
        id: `c-${Date.now()}`,
        author,
        text,
        timestamp: Date.now(),
        likes: 0,
        liked: false,
        replies: [],
      };
      saveComments(reelId, [newComment, ...current]);
    }
    setCommentText("");
    setReplyingTo(null);
  };

  const handleLikeComment = (
    reelId: number,
    commentId: string,
    isReply?: boolean,
    parentId?: string,
  ) => {
    const current = getCommentsForReel(reelId);
    const updated = current.map((c) => {
      if (isReply && c.id === parentId) {
        return {
          ...c,
          replies: c.replies.map((r) =>
            r.id === commentId
              ? {
                  ...r,
                  liked: !r.liked,
                  likes: r.liked ? r.likes - 1 : r.likes + 1,
                }
              : r,
          ),
        };
      }
      if (!isReply && c.id === commentId)
        return {
          ...c,
          liked: !c.liked,
          likes: c.liked ? c.likes - 1 : c.likes + 1,
        };
      return c;
    });
    saveComments(reelId, updated);
  };

  const formatTimeAgo = (ts: number) => {
    const diff = (Date.now() - ts) / 1000;
    if (diff < 60) return "just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const renderMentions = (text: string) => {
    const parts = text.split(/(@\w+)/g);
    return parts.map((part, i) => {
      const k = `m-${part}-${i}`;
      return part.startsWith("@") ? (
        <span key={k} className="text-purple-400 font-semibold">
          {part}
        </span>
      ) : (
        <span key={k}>{part}</span>
      );
    });
  };

  const handleCopyLink = useCallback(
    (reel: Reel) => {
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
    (reel: Reel) => {
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
    (reel: Reel) => {
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

  const downloadReel = useCallback((reel: Reel) => {
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
          height: "calc(100svh - 60px)",
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

      {reels.map((reel, reelIndex) => {
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

        return (
          <div
            key={reel.id}
            data-feed-index={feedIndex}
            className="h-full w-full snap-start snap-always relative overflow-hidden"
            style={{ height: "calc(100svh - 60px)", flexShrink: 0 }}
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

            {/* 🔥 Trending Badge */}
            {TOP_REEL_IDS.has(reel.id) && (
              <div
                className="absolute top-[72px] left-4 z-20 flex items-center gap-1 px-2.5 py-1 rounded-full"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(251,146,60,0.9), rgba(234,88,12,0.9))",
                  border: "1px solid rgba(251,146,60,0.5)",
                  backdropFilter: "blur(8px)",
                }}
              >
                <span style={{ fontSize: "11px" }}>🔥</span>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 800,
                    color: "#fff",
                    letterSpacing: "0.05em",
                  }}
                >
                  TRENDING
                </span>
              </div>
            )}

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

            {/* Double-tap heart animation */}
            <AnimatePresence>
              {doubleTapHeart === reelIndex && (
                <motion.div
                  key="double-tap-heart"
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: [0, 1.3, 1, 0], opacity: [1, 1, 1, 0] }}
                  transition={{ duration: 0.8, times: [0, 0.3, 0.6, 1] }}
                  className="absolute inset-0 z-25 flex items-center justify-center pointer-events-none"
                >
                  <Heart className="h-24 w-24 fill-red-500 text-red-500 drop-shadow-2xl" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Right vertical action bar */}
            <div className="absolute right-3 bottom-[55px] z-30 flex flex-col items-center gap-5">
              <div className="flex flex-col items-center gap-1">
                <div className="h-11 w-11 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center">
                  <Eye className="h-[22px] w-[22px] text-white/80" />
                </div>
                <span className="text-white text-[11px] font-semibold drop-shadow">
                  {formatCount(reel.views)}
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setCommentSheetReelIndex(reelIndex);
                  }}
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
                  data-ocid={`reels.share_button.${reelIndex + 1}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    const shareUrl = `https://rohit-ai-tech.app/reel/${reel.id}`;
                    if (navigator.share) {
                      navigator
                        .share({
                          title: "Rohit AI Tech",
                          text: reel.caption,
                          url: shareUrl,
                        })
                        .catch(() => {});
                    } else {
                      openShareSheet(reelIndex);
                    }
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
            </div>

            {/* ── VINYL MUSIC BAR ── */}
            <button
              type="button"
              data-ocid={`reels.music_bar.${reelIndex + 1}`}
              onClick={(e) => {
                e.stopPropagation();
                setAudioSheetReel(reel);
              }}
              className="absolute bottom-[68px] left-3 right-3 z-30 flex items-center gap-2.5 pointer-events-auto"
              aria-label="Use this audio"
            >
              {/* Spinning vinyl disc */}
              <div
                className="h-8 w-8 rounded-full flex-shrink-0 relative overflow-hidden border border-white/20"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, #555 0%, #222 40%, #111 100%)",
                  animation: isPlaying ? "spin 4s linear infinite" : "none",
                }}
              >
                <div
                  className="absolute inset-[6px] rounded-full border border-white/10"
                  style={{ background: "#1a1a1a" }}
                />
                <div
                  className="absolute inset-[10px] rounded-full"
                  style={{ background: "#0a0a0a" }}
                />
                <div className="absolute inset-[12px] rounded-full bg-white/20" />
              </div>
              <div className="overflow-hidden flex-1">
                <p
                  className="text-white/85 text-[12px] font-medium whitespace-nowrap"
                  style={{
                    animation: isPlaying
                      ? "marqueeScroll 8s linear infinite"
                      : "none",
                    display: "inline-block",
                  }}
                >
                  🎵 {reel.song} &nbsp;&nbsp;&nbsp; {reel.song}{" "}
                  &nbsp;&nbsp;&nbsp;
                </p>
              </div>
            </button>

            {/* Creator profile + Follow */}
            <div className="absolute bottom-[140px] left-3 z-30 flex items-center gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  window.dispatchEvent(
                    new CustomEvent("navigateToProfile", {
                      detail: { username: reel.username },
                    }),
                  );
                }}
                className="h-10 w-10 rounded-full border-2 border-white overflow-hidden flex-shrink-0 active:scale-95 transition-transform"
                aria-label={`View ${reel.username}'s profile`}
              >
                <div
                  className="h-full w-full flex items-center justify-center text-white font-bold text-[14px]"
                  style={{
                    background:
                      reel.accent || "linear-gradient(135deg,#6366f1,#ec4899)",
                  }}
                >
                  {reel.username.charAt(0).toUpperCase()}
                </div>
              </button>
              <span className="text-white font-semibold text-[13px] drop-shadow">
                @{reel.username}
              </span>
              <button
                type="button"
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1 rounded-full bg-white text-black font-semibold text-[12px] active:scale-95 transition-transform"
              >
                Follow
              </button>
            </div>

            {/* Bottom info bar */}
            <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
              <div className="h-48 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
              <div className="bg-black/0 px-4 pb-5 -mt-4">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <p className="text-white font-bold text-[15px] leading-tight drop-shadow">
                    @{reel.username}
                  </p>
                  <span className="text-white/60 text-[11px] font-medium">
                    👁 {formatCount(reel.views)} views
                  </span>
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

                    {/* ── SEND TO USERS ── */}
                    <div className="px-5 mb-4">
                      <p className="text-white/60 text-[11px] font-semibold uppercase tracking-widest mb-3">
                        Send to
                      </p>
                      <div
                        className="flex gap-4 overflow-x-auto pb-1"
                        style={{ scrollbarWidth: "none" }}
                      >
                        {[
                          {
                            name: "Priya",
                            color: "linear-gradient(135deg,#ec4899,#a855f7)",
                          },
                          {
                            name: "Rahul",
                            color: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                          },
                          {
                            name: "Anjali",
                            color: "linear-gradient(135deg,#f59e0b,#ef4444)",
                          },
                          {
                            name: "Vikram",
                            color: "linear-gradient(135deg,#10b981,#059669)",
                          },
                          {
                            name: "Sneha",
                            color: "linear-gradient(135deg,#8b5cf6,#7c3aed)",
                          },
                          {
                            name: "Amit",
                            color: "linear-gradient(135deg,#f97316,#dc2626)",
                          },
                        ].map((user) => (
                          <button
                            key={user.name}
                            type="button"
                            data-ocid="reels.share_send_to.button"
                            onClick={() => {
                              showToast(`Reel sent to ${user.name}!`);
                              closeShareSheet();
                            }}
                            className="flex flex-col items-center gap-1.5 flex-shrink-0 active:scale-95 transition-transform"
                          >
                            <div
                              className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold text-[15px] border-2 border-white/15"
                              style={{ background: user.color }}
                            >
                              {user.name[0]}
                            </div>
                            <span className="text-white/70 text-[11px] font-medium">
                              {user.name}
                            </span>
                          </button>
                        ))}
                      </div>
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

      {/* ── COMMENT THREAD SHEET ── */}
      <AnimatePresence>
        {commentSheetReelIndex !== null &&
          (() => {
            const activeReel = reels[commentSheetReelIndex];
            if (!activeReel) return null;
            const comments = getCommentsForReel(activeReel.id);
            return (
              <>
                {/* Backdrop */}
                <motion.div
                  key="comment-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-[2px]"
                  onClick={() => {
                    setCommentSheetReelIndex(null);
                    setReplyingTo(null);
                  }}
                />
                {/* Sheet */}
                <motion.div
                  key="comment-sheet"
                  data-ocid="reels.comment_sheet.1"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", stiffness: 340, damping: 32 }}
                  className="fixed bottom-0 left-0 right-0 z-[80] flex flex-col rounded-t-3xl bg-[#111] border-t border-white/10"
                  style={{ height: "75svh", maxHeight: "75svh" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Handle bar */}
                  <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                    <div className="w-10 h-1 rounded-full bg-white/20" />
                  </div>

                  {/* Header */}
                  <div className="flex items-center justify-between px-5 py-3 flex-shrink-0 border-b border-white/8">
                    <div className="w-8" />
                    <h3 className="text-white font-bold text-[16px] tracking-wide">
                      Comments
                    </h3>
                    <button
                      type="button"
                      data-ocid="reels.comment_sheet_close_button"
                      onClick={() => {
                        setCommentSheetReelIndex(null);
                        setReplyingTo(null);
                        setCommentText("");
                      }}
                      aria-label="Close comments"
                      className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
                    >
                      <X className="h-4 w-4 text-white/70" />
                    </button>
                  </div>

                  {/* Comments List */}
                  <div
                    className="flex-1 overflow-y-auto px-4 py-3"
                    style={{ overscrollBehavior: "contain" }}
                  >
                    {comments.length === 0 && (
                      <div
                        data-ocid="reels.comments_empty_state"
                        className="flex flex-col items-center justify-center h-full gap-3 text-white/40"
                      >
                        <MessageCircle className="h-12 w-12 opacity-30" />
                        <p className="text-sm">No comments yet. Be first!</p>
                      </div>
                    )}
                    {comments.map((comment, ci) => (
                      <div
                        key={comment.id}
                        data-ocid={`reels.comment.item.${ci + 1}`}
                        className="mb-4"
                      >
                        {/* Comment row */}
                        <div className="flex items-start gap-3">
                          {/* Avatar */}
                          <div
                            className="h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-[13px] border border-white/10"
                            style={{
                              background: `linear-gradient(135deg, hsl(${(comment.author.charCodeAt(0) * 5) % 360},70%,45%), hsl(${(comment.author.charCodeAt(0) * 5 + 120) % 360},70%,35%))`,
                            }}
                          >
                            {comment.author[0]}
                          </div>
                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <span className="text-white font-semibold text-[13px] mr-1.5">
                                  {comment.author}
                                </span>
                                <span className="text-white/80 text-[13px] leading-snug">
                                  {renderMentions(comment.text)}
                                </span>
                              </div>
                              {/* Like */}
                              <button
                                type="button"
                                data-ocid={`reels.comment_like_button.${ci + 1}`}
                                onClick={() =>
                                  handleLikeComment(activeReel.id, comment.id)
                                }
                                className="flex flex-col items-center gap-0.5 ml-1 flex-shrink-0 active:scale-90 transition-transform"
                              >
                                <Heart
                                  className="h-4 w-4"
                                  style={{
                                    color: comment.liked
                                      ? "#ff3040"
                                      : "rgba(255,255,255,0.4)",
                                    fill: comment.liked ? "#ff3040" : "none",
                                  }}
                                />
                                {comment.likes > 0 && (
                                  <span className="text-white/40 text-[10px]">
                                    {comment.likes}
                                  </span>
                                )}
                              </button>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-white/35 text-[11px]">
                                {formatTimeAgo(comment.timestamp)}
                              </span>
                              <button
                                type="button"
                                data-ocid={`reels.comment_reply_button.${ci + 1}`}
                                onClick={() => {
                                  setReplyingTo({
                                    commentId: comment.id,
                                    author: comment.author,
                                  });
                                  setCommentText(`@${comment.author} `);
                                  commentInputRef.current?.focus();
                                }}
                                className="text-white/45 text-[11px] font-semibold hover:text-white/70 transition-colors"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Nested Replies */}
                        {comment.replies.length > 0 && (
                          <div className="ml-11 mt-2 flex flex-col gap-3">
                            {comment.replies.map((reply, ri) => (
                              <div
                                key={reply.id}
                                data-ocid={`reels.reply.item.${ri + 1}`}
                                className="flex items-start gap-2.5"
                              >
                                <div
                                  className="h-6 w-6 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-[10px] border border-white/10"
                                  style={{
                                    background: `linear-gradient(135deg, hsl(${(reply.author.charCodeAt(0) * 5) % 360},70%,45%), hsl(${(reply.author.charCodeAt(0) * 5 + 120) % 360},70%,35%))`,
                                  }}
                                >
                                  {reply.author[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                      <span className="text-white font-semibold text-[12px] mr-1.5">
                                        {reply.author}
                                      </span>
                                      <span className="text-white/75 text-[12px] leading-snug">
                                        {renderMentions(reply.text)}
                                      </span>
                                    </div>
                                    <button
                                      type="button"
                                      data-ocid={`reels.reply_like_button.${ri + 1}`}
                                      onClick={() =>
                                        handleLikeComment(
                                          activeReel.id,
                                          reply.id,
                                          true,
                                          comment.id,
                                        )
                                      }
                                      className="flex flex-col items-center gap-0.5 ml-1 flex-shrink-0 active:scale-90 transition-transform"
                                    >
                                      <Heart
                                        className="h-3 w-3"
                                        style={{
                                          color: reply.liked
                                            ? "#ff3040"
                                            : "rgba(255,255,255,0.4)",
                                          fill: reply.liked
                                            ? "#ff3040"
                                            : "none",
                                        }}
                                      />
                                      {reply.likes > 0 && (
                                        <span className="text-white/40 text-[10px]">
                                          {reply.likes}
                                        </span>
                                      )}
                                    </button>
                                  </div>
                                  <span className="text-white/35 text-[11px]">
                                    {formatTimeAgo(reply.timestamp)}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Input bar */}
                  <div className="flex-shrink-0 border-t border-white/8 px-4 py-3 pb-safe">
                    {replyingTo && (
                      <div className="flex items-center justify-between mb-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/8">
                        <span className="text-white/55 text-[12px]">
                          Replying to{" "}
                          <span className="text-purple-400 font-semibold">
                            @{replyingTo.author}
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setReplyingTo(null);
                            setCommentText("");
                          }}
                          className="text-white/40 hover:text-white/70"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <input
                        ref={commentInputRef}
                        type="text"
                        data-ocid="reels.comment_input"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter")
                            handleAddComment(activeReel.id);
                        }}
                        placeholder="Add a comment... @tag someone"
                        className="flex-1 bg-white/8 rounded-2xl px-4 py-2.5 text-white text-[14px] placeholder-white/35 outline-none border border-white/10 focus:border-white/25 transition-colors"
                      />
                      <button
                        type="button"
                        data-ocid="reels.comment_send_button"
                        onClick={() => handleAddComment(activeReel.id)}
                        disabled={!commentText.trim()}
                        className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-600 to-indigo-700 flex items-center justify-center active:scale-90 transition-transform disabled:opacity-40"
                        aria-label="Send comment"
                      >
                        <Send className="h-[18px] w-[18px] text-white" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              </>
            );
          })()}
      </AnimatePresence>

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="h-1 w-full" />

      {/* ── USE THIS AUDIO SHEET ── */}
      <AnimatePresence>
        {audioSheetReel && (
          <>
            <motion.div
              key="audio-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-[2px]"
              onClick={() => setAudioSheetReel(null)}
            />
            <motion.div
              key="audio-sheet"
              data-ocid="reels.audio_sheet.panel"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 30 }}
              className="fixed bottom-0 left-0 right-0 z-[160] rounded-t-3xl bg-[#111] border-t border-white/10 pb-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="w-10 h-1 rounded-full bg-white/20" />
              </div>
              <div className="flex items-center justify-between px-5 py-3">
                <h3 className="text-white font-bold text-[16px]">
                  Use this Audio
                </h3>
                <button
                  type="button"
                  data-ocid="reels.audio_sheet.close_button"
                  onClick={() => setAudioSheetReel(null)}
                  className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform"
                >
                  <X className="h-4 w-4 text-white/70" />
                </button>
              </div>
              {/* Song info */}
              <div className="mx-5 mb-6 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/[0.06] border border-white/10">
                <div
                  className="h-12 w-12 rounded-full flex-shrink-0 relative"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, #555 0%, #222 40%, #111 100%)",
                    animation: "spin 4s linear infinite",
                  }}
                >
                  <div
                    className="absolute inset-[5px] rounded-full border border-white/10"
                    style={{ background: "#1a1a1a" }}
                  />
                  <div className="absolute inset-[9px] rounded-full bg-white/20" />
                </div>
                <div>
                  <p className="text-white font-semibold text-[14px]">
                    {audioSheetReel.song}
                  </p>
                  <p className="text-white/50 text-[11px]">
                    Original Audio · @{audioSheetReel.username}
                  </p>
                </div>
              </div>
              {/* Action buttons */}
              <div className="px-5 flex flex-col gap-3">
                <button
                  type="button"
                  data-ocid="reels.audio_use_for_reel.button"
                  onClick={() => {
                    showToast("Audio added to your Reel!");
                    setAudioSheetReel(null);
                  }}
                  className="w-full py-4 rounded-2xl font-bold text-[15px] text-white active:scale-[0.98] transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                  }}
                >
                  🎬 Use for Reel
                </button>
                <button
                  type="button"
                  data-ocid="reels.audio_use_for_story.button"
                  onClick={() => {
                    showToast("Audio added to your Story!");
                    setAudioSheetReel(null);
                  }}
                  className="w-full py-4 rounded-2xl font-bold text-[15px] text-white active:scale-[0.98] transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #ec4899, #f97316)",
                  }}
                >
                  ✨ Use for Story
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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
