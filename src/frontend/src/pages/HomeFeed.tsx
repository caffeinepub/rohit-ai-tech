import {
  Bell,
  Bookmark,
  Camera,
  Compass,
  Film,
  Heart,
  Home,
  ImageIcon,
  MessageCircle,
  MoreHorizontal,
  Plus,
  PlusSquare,
  Search,
  Send,
  User,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAdmin } from "../contexts/AdminContext";
import { getQualityScore } from "../utils/monetizationEngine";
import CameraPage from "./CameraPage";
import DirectMessagesPage from "./DirectMessagesPage";
import ExplorePage from "./ExplorePage";
import LiveStreamPage from "./LiveStreamPage";
import NotificationsPage from "./NotificationsPage";
import ProfilePage from "./ProfilePage";
import ReelsPage from "./ReelsPage";

const STORIES = [
  {
    id: 0,
    username: "Your Story",
    initials: "Me",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    statusText: "Add your story...",
    isOwn: true,
  },
  {
    id: 1,
    username: "priya.s",
    initials: "PS",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    statusText: "Just shipped a new AI model 🚀 The future is NOW!",
    isOwn: false,
  },
  {
    id: 2,
    username: "arjun.dev",
    initials: "AM",
    avatarGradient: "from-cyan-400 via-teal-500 to-emerald-600",
    statusText: "Building something incredible ⚡ Stay tuned!",
    isOwn: false,
  },
  {
    id: 3,
    username: "sneha.c",
    initials: "SK",
    avatarGradient: "from-orange-400 via-rose-500 to-pink-600",
    statusText: "Feeling great today! 🌸 Good vibes only.",
    isOwn: false,
  },
  {
    id: 4,
    username: "rahul.b",
    initials: "RD",
    avatarGradient: "from-emerald-400 via-green-500 to-teal-600",
    statusText: "New blog post is live! 📝 Link in bio.",
    isOwn: false,
  },
  {
    id: 5,
    username: "kavya.ai",
    initials: "KN",
    avatarGradient: "from-sky-400 via-blue-500 to-indigo-600",
    statusText: "Exploring the frontiers of AI 🧠✨",
    isOwn: false,
  },
  {
    id: 6,
    username: "rohit.ai",
    initials: "RA",
    avatarGradient: "from-yellow-400 via-amber-500 to-orange-600",
    statusText: "Rohit AI Tech — innovation never sleeps 💡",
    isOwn: false,
  },
  {
    id: 7,
    username: "narendra.modi",
    initials: "NM",
    avatarGradient: "from-orange-500 via-amber-500 to-yellow-500",
    statusText: "Mann Ki Baat - Desh ke vikas ki baat 🇮🇳",
    isOwn: false,
  },
  {
    id: 8,
    username: "virat.kohli",
    initials: "VK",
    avatarGradient: "from-blue-600 via-blue-500 to-cyan-500",
    statusText: "Century mood on 💯🏏 #Kohli18",
    isOwn: false,
  },
  {
    id: 9,
    username: "rohit.sharma",
    initials: "RS",
    avatarGradient: "from-teal-600 via-cyan-500 to-blue-500",
    statusText: "Hitman is here 🏏🔥 #Mumbai",
    isOwn: false,
  },
  {
    id: 10,
    username: "ms.dhoni7",
    initials: "MS",
    avatarGradient: "from-yellow-500 via-amber-400 to-orange-400",
    statusText: "Whistle Podu! 💛 CSK forever 🏆",
    isOwn: false,
  },
  {
    id: 11,
    username: "pawan.singh",
    initials: "PS",
    avatarGradient: "from-green-600 via-emerald-500 to-teal-500",
    statusText: "Bhojpuri ka superstar 🎵👑 #PawanSingh",
    isOwn: false,
  },
  {
    id: 12,
    username: "nitish.kumar",
    initials: "NK",
    avatarGradient: "from-green-700 via-green-600 to-emerald-500",
    statusText: "Bihar ka vikas jaari hai 🙏 #Bihar",
    isOwn: false,
  },
  {
    id: 13,
    username: "srk.official",
    initials: "SRK",
    avatarGradient: "from-purple-700 via-violet-600 to-indigo-500",
    statusText: "Naam toh suna hoga 😎✨ #KingKhan",
    isOwn: false,
  },
  {
    id: 14,
    username: "salman.khan",
    initials: "SK",
    avatarGradient: "from-red-600 via-rose-500 to-pink-500",
    statusText: "Bhai ka swag alag hi hai 💪🔥",
    isOwn: false,
  },
  {
    id: 15,
    username: "akshay.kumar",
    initials: "AK",
    avatarGradient: "from-amber-600 via-orange-500 to-red-500",
    statusText: "Desh ke liye kuch bhi 🇮🇳❤️ #AkshayKumar",
    isOwn: false,
  },
  {
    id: 16,
    username: "hardik.pandya",
    initials: "HP",
    avatarGradient: "from-violet-600 via-purple-500 to-fuchsia-500",
    statusText: "All-rounder on fire 🏏🔥 #IPL",
    isOwn: false,
  },
  {
    id: 17,
    username: "khesari.lal",
    initials: "KL",
    avatarGradient: "from-lime-600 via-green-500 to-emerald-400",
    statusText: "Naya gaana aa gaya 🎤🎵 #Bhojpuri",
    isOwn: false,
  },
  {
    id: 18,
    username: "nirahua",
    initials: "NR",
    avatarGradient: "from-yellow-600 via-amber-500 to-orange-500",
    statusText: "Hasate hasate rula diya 😂❤️ #Comedy",
    isOwn: false,
  },
  {
    id: 19,
    username: "yogi.adityanath",
    initials: "YA",
    avatarGradient: "from-orange-600 via-red-500 to-rose-500",
    statusText: "Jai Shri Ram 🚩 UP ke vikas ki kahani",
    isOwn: false,
  },
  {
    id: 20,
    username: "shubman.gill",
    initials: "SG",
    avatarGradient: "from-sky-600 via-blue-500 to-indigo-500",
    statusText: "Cover drive practice 🏏⚡ #YoungStar",
    isOwn: false,
  },
  {
    id: 21,
    username: "jasprit.bumrah",
    initials: "JB",
    avatarGradient: "from-slate-600 via-gray-500 to-zinc-500",
    statusText: "Yorker ready 🎯🔥 #Bumrah",
    isOwn: false,
  },
  {
    id: 22,
    username: "deepika.padukone",
    initials: "DP",
    avatarGradient: "from-pink-600 via-rose-500 to-fuchsia-500",
    statusText: "Pathaan ki jaan 💖✨ #Deepika",
    isOwn: false,
  },
  {
    id: 23,
    username: "ranveer.singh",
    initials: "RV",
    avatarGradient: "from-yellow-500 via-orange-500 to-red-500",
    statusText: "Energy unlimited 🔥💥 #Ranveer",
    isOwn: false,
  },
  {
    id: 24,
    username: "amit.shah",
    initials: "AS",
    avatarGradient: "from-orange-700 via-orange-600 to-amber-500",
    statusText: "Desh ki seva hi mera dharm 🇮🇳 #BJP",
    isOwn: false,
  },
  {
    id: 25,
    username: "kapil.sharma",
    initials: "KS",
    avatarGradient: "from-cyan-600 via-sky-500 to-blue-500",
    statusText: "Aaj Comedy Nights mein milte hain 😂🎤",
    isOwn: false,
  },
  {
    id: 26,
    username: "sourav.ganguly",
    initials: "SG",
    avatarGradient: "from-blue-700 via-blue-600 to-cyan-500",
    statusText: "Dada ka josh - Cricket India 🏏👑 #Dada",
    isOwn: false,
  },
  {
    id: 27,
    username: "sachin.tendulkar",
    initials: "ST",
    avatarGradient: "from-blue-800 via-blue-700 to-blue-500",
    statusText: "Cricket is my religion 🏏🙏 #SachinTendulkar",
    isOwn: false,
  },
  {
    id: 28,
    username: "neha.kakkar",
    initials: "NK",
    avatarGradient: "from-fuchsia-600 via-pink-500 to-rose-400",
    statusText: "Naya gaana record kar rahi hoon 🎵❤️ #NehaKakkar",
    isOwn: false,
  },
  {
    id: 29,
    username: "yo.yo.honey.singh",
    initials: "YY",
    avatarGradient: "from-purple-800 via-violet-700 to-indigo-600",
    statusText: "Blue Eyes - ab wapas aa gaye 😎🎤 #HoneySingh",
    isOwn: false,
  },
  {
    id: 30,
    username: "badshah.rapper",
    initials: "BD",
    avatarGradient: "from-indigo-700 via-violet-600 to-purple-500",
    statusText: "Kanta Laga wala badshah 👑🎵 #Badshah",
    isOwn: false,
  },
  {
    id: 31,
    username: "dhanush.official",
    initials: "DH",
    avatarGradient: "from-emerald-700 via-teal-600 to-cyan-500",
    statusText: "Kolaveri Di - still viral 🎵🔥 #Dhanush",
    isOwn: false,
  },
];

const OTHER_STORIES = STORIES.filter((s) => !s.isOwn);

// Quality-scored posts (sorted by engagement / age)
const RAW_POSTS = [
  {
    id: 1,
    username: "priya.sharma",
    displayName: "Priya Sharma",
    initials: "PS",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    timestamp: "2 minutes ago",
    caption:
      "Just deployed my first AI model on the cloud ☁️✨ The future is here and it's incredible! #AITech #RohitAITech #MachineLearning",
    imageGradient: "from-[#0f0035] via-[#2d1b69] to-[#1a0050]",
    imageAccent:
      "radial-gradient(ellipse 70% 60% at 50% 40%, oklch(0.55 0.25 300 / 0.5) 0%, transparent 70%)",
    likes: 2481,
    comments: 34,
  },
  {
    id: 2,
    username: "arjun.dev",
    displayName: "Arjun Mehta",
    initials: "AM",
    avatarGradient: "from-cyan-400 via-teal-500 to-emerald-600",
    timestamp: "18 minutes ago",
    caption:
      "Building the next generation of smart apps 🚀 Who else is excited about the possibilities with AI? Drop a 🔥 below!",
    imageGradient: "from-[#001a1a] via-[#003333] to-[#001f3f]",
    imageAccent:
      "radial-gradient(ellipse 80% 50% at 30% 60%, oklch(0.65 0.18 185 / 0.55) 0%, transparent 65%)",
    likes: 5120,
    comments: 89,
  },
  {
    id: 3,
    username: "sneha.creates",
    displayName: "Sneha Kulkarni",
    initials: "SK",
    avatarGradient: "from-orange-400 via-rose-500 to-pink-600",
    timestamp: "1 hour ago",
    caption:
      "Machine learning workshop wrapped up — absolutely mind-blowing how fast this field is moving 🧠💡 #MachineLearning #Innovation",
    imageGradient: "from-[#1f0a00] via-[#3d1500] to-[#2a0a0a]",
    imageAccent:
      "radial-gradient(ellipse 60% 70% at 70% 30%, oklch(0.65 0.22 35 / 0.55) 0%, transparent 60%)",
    likes: 1930,
    comments: 27,
  },
  {
    id: 4,
    username: "rahul.builds",
    displayName: "Rahul Dev",
    initials: "RD",
    avatarGradient: "from-emerald-400 via-green-500 to-teal-600",
    timestamp: "3 hours ago",
    caption:
      "New blog post: 'Why AI is the backbone of tomorrow's internet' — link in bio! What do you think about AI-driven UX? 🤔",
    imageGradient: "from-[#001a0d] via-[#003320] to-[#001f15]",
    imageAccent:
      "radial-gradient(ellipse 75% 55% at 40% 55%, oklch(0.62 0.2 155 / 0.5) 0%, transparent 65%)",
    likes: 8760,
    comments: 142,
  },
  {
    id: 5,
    username: "kavya.ai",
    displayName: "Kavya Nair",
    initials: "KN",
    avatarGradient: "from-sky-400 via-blue-500 to-indigo-600",
    timestamp: "6 hours ago",
    caption:
      "Excited to join the Rohit AI Tech community! 🎉 This platform is exactly what I've been looking for — innovation meets social. #NewMember #RohitAITech",
    imageGradient: "from-[#00081f] via-[#001040] to-[#000d35]",
    imageAccent:
      "radial-gradient(ellipse 65% 65% at 55% 45%, oklch(0.6 0.22 240 / 0.5) 0%, transparent 65%)",
    likes: 3410,
    comments: 58,
  },
];

const POST_AGE_HOURS = [0.5, 0.3, 1, 3, 6];
const POSTS = [...RAW_POSTS]
  .map((p, i) => ({
    ...p,
    shares: Math.floor(p.likes * 0.05),
    ageHours: POST_AGE_HOURS[i],
  }))
  .sort((a, b) => {
    const sa = getQualityScore(a.likes, a.comments, a.shares, a.ageHours);
    const sb = getQualityScore(b.likes, b.comments, b.shares, b.ageHours);
    return sb - sa;
  });
const TOP_POST_ID = POSTS[0]?.id;

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

type NavTab =
  | "home"
  | "explore"
  | "reels"
  | "create"
  | "notifications"
  | "profile"
  | "camera"
  | "dms"
  | "live";

// ── Story Viewer ──────────────────────────────────────────────────────────────
const STORY_DURATION = 5000; // ms per story

interface StoryViewerProps {
  stories: typeof OTHER_STORIES;
  startIndex: number;
  viewedStories: Set<number>;
  onClose: (viewedIds: number[]) => void;
}

function StoryViewer({
  stories,
  startIndex,
  viewedStories,
  onClose,
}: StoryViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seenRef = useRef<Set<number>>(new Set(viewedStories));
  const progressRef = useRef(0);

  const story = stories[currentIndex];

  const goNext = useCallback(() => {
    seenRef.current.add(stories[currentIndex].id);
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1);
      setProgress(0);
      progressRef.current = 0;
    } else {
      onClose(Array.from(seenRef.current));
    }
  }, [currentIndex, stories, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setProgress(0);
      progressRef.current = 0;
    }
  }, [currentIndex]);

  // Tick the progress bar
  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    const TICK = 50;
    intervalRef.current = setInterval(() => {
      progressRef.current += (TICK / STORY_DURATION) * 100;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        setProgress(100);
        if (intervalRef.current) clearInterval(intervalRef.current);
        goNext();
      } else {
        setProgress(progressRef.current);
      }
    }, TICK);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paused, goNext]);

  // Mark current story viewed on mount/change
  useEffect(() => {
    seenRef.current.add(story.id);
  }, [story.id]);

  const handleClose = () => {
    seenRef.current.add(story.id);
    onClose(Array.from(seenRef.current));
  };

  return (
    <motion.div
      data-ocid="story.viewer.section"
      className="fixed inset-0 z-50 flex flex-col"
      initial={{ opacity: 0, scale: 1.04 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
      style={{ touchAction: "none" }}
    >
      {/* Background: gradient from story avatar */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${story.avatarGradient} opacity-25`}
      />
      <div className="absolute inset-0 bg-black/80" />

      {/* Content glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.45 0.2 300 / 0.18) 0%, transparent 70%)",
        }}
      />

      {/* ── Progress bars ── */}
      <div className="relative z-10 flex gap-1 px-3 pt-10 pb-0">
        {stories.map((s, i) => (
          <div
            key={s.id}
            data-ocid={`story.progress.item.${i + 1}`}
            className="flex-1 h-[2.5px] rounded-full bg-white/25 overflow-hidden"
          >
            <div
              className="h-full bg-white rounded-full transition-none"
              style={{
                width:
                  i < currentIndex
                    ? "100%"
                    : i === currentIndex
                      ? `${progress}%`
                      : "0%",
              }}
            />
          </div>
        ))}
      </div>

      {/* ── Header row ── */}
      <div className="relative z-10 flex items-center justify-between px-3 pt-3 pb-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`p-[2px] rounded-full bg-gradient-to-br ${story.avatarGradient} flex-shrink-0`}
          >
            <div className="h-9 w-9 rounded-full bg-black/60 flex items-center justify-center">
              <span className="text-[12px] font-bold text-white">
                {story.initials}
              </span>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="text-[14px] font-semibold text-white leading-tight">
              {story.username}
            </span>
            <span className="text-[11px] text-white/60 leading-tight">
              Just now
            </span>
          </div>
        </div>
        <button
          type="button"
          data-ocid="story.viewer.close_button"
          onClick={handleClose}
          className="p-2 -mr-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close story viewer"
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* ── Story card content ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[340px] flex flex-col items-center"
        >
          {/* Large avatar circle */}
          <div
            className={`relative h-32 w-32 rounded-full bg-gradient-to-br ${story.avatarGradient} flex items-center justify-center mb-6 shadow-2xl`}
            style={{
              boxShadow:
                "0 0 60px oklch(0.6 0.25 300 / 0.4), 0 0 100px oklch(0.5 0.2 300 / 0.2)",
            }}
          >
            <span className="text-4xl font-black text-white tracking-tight">
              {story.initials}
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">
            {story.username}
          </h2>

          <p className="text-[15px] text-white/85 text-center leading-relaxed px-4">
            {story.statusText}
          </p>
        </motion.div>
      </div>

      {/* ── Tap zones: left = prev, right = next ── */}
      <div
        className="absolute inset-0 z-20 flex"
        style={{ top: "80px", bottom: "80px" }}
      >
        <button
          type="button"
          className="flex-1 h-full"
          aria-label="Previous story"
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          onClick={goPrev}
        />
        <button
          type="button"
          className="flex-1 h-full"
          aria-label="Next story"
          onPointerDown={() => setPaused(true)}
          onPointerUp={() => setPaused(false)}
          onPointerLeave={() => setPaused(false)}
          onClick={goNext}
        />
      </div>
    </motion.div>
  );
}

// ── Search Modal ──────────────────────────────────────────────────────────────
const SEARCH_PROFILES = STORIES.filter((s) => !s.isOwn);

interface SearchModalProps {
  onClose: () => void;
}

function SearchModal({ onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = SEARCH_PROFILES.filter((p) =>
    p.username.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <motion.div
      data-ocid="search.modal"
      className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-xl"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      {/* Search header */}
      <div className="flex items-center gap-3 px-4 pt-12 pb-3 border-b border-white/10">
        <Search className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        <input
          ref={inputRef}
          data-ocid="search.search_input"
          type="text"
          placeholder="Search profiles..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent text-[16px] text-white placeholder:text-white/30 outline-none"
        />
        <button
          type="button"
          data-ocid="search.close_button"
          onClick={onClose}
          className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          aria-label="Close search"
        >
          <X className="h-4 w-4 text-white" />
        </button>
      </div>

      {/* Profile suggestions */}
      <div className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 ? (
          <p className="text-center text-white/30 text-sm mt-12">
            No profiles found
          </p>
        ) : (
          filtered.map((profile, i) => (
            <button
              key={profile.id}
              type="button"
              data-ocid={`search.item.${i + 1}`}
              onClick={onClose}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors"
            >
              <div
                className={`h-11 w-11 rounded-full bg-gradient-to-br ${profile.avatarGradient} flex items-center justify-center flex-shrink-0`}
              >
                <span className="text-[13px] font-bold text-white">
                  {profile.initials}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[14px] font-semibold text-white">
                  {profile.username}
                </span>
                <span className="text-[12px] text-white/40">Rohit AI Tech</span>
              </div>
            </button>
          ))
        )}
      </div>
    </motion.div>
  );
}

// ── Main HomeFeed ─────────────────────────────────────────────────────────────
export default function HomeFeed({ onOpenAdmin }: { onOpenAdmin: () => void }) {
  const { featureFlags, pinnedAnnouncement } = useAdmin();
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);
  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [liveStreamMode, setLiveStreamMode] = useState<
    "broadcaster" | "viewer"
  >("broadcaster");
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());
  const [savedPosts, setSavedPosts] = useState<Set<number>>(new Set());
  const [viewedStories, setViewedStories] = useState<Set<number>>(new Set());

  // Story viewer state
  const [storyViewerOpen, setStoryViewerOpen] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  // User profile state (lifted to top level for cross-app sharing)
  const [userDisplayName, setUserDisplayName] = useState("Rohit Mehra");
  const [userProfilePhoto, setUserProfilePhoto] = useState<string | null>(null);

  const getInitials = (name: string) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();

  // Search modal state
  const [searchOpen, setSearchOpen] = useState(false);

  // User-uploaded posts from localStorage
  const [userPosts, setUserPosts] = useState<typeof POSTS>(() => {
    try {
      const raw = localStorage.getItem("user_posts");
      if (raw) return JSON.parse(raw);
    } catch {}
    return [];
  });

  // Create sheet state
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [createType, setCreateType] = useState<"post" | "reel">("post");
  const [uploadToast, setUploadToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const storyFileInputRef = useRef<HTMLInputElement>(null);

  // Swipe gesture tracking
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchStartTime = useRef(0);
  // Whether the touch started in the valid swipe zone (middle feed area)
  const swipeAllowed = useRef(false);

  const HEADER_HEIGHT = 54; // px — fixed top bar
  const BOTTOM_NAV_HEIGHT = 60; // px — fixed bottom nav

  const handleTouchStart = (e: React.TouchEvent) => {
    const y = e.touches[0].clientY;
    const screenH = window.innerHeight;
    // Only allow swipe if touch starts in the middle feed area
    swipeAllowed.current = y > HEADER_HEIGHT && y < screenH - BOTTOM_NAV_HEIGHT;
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = y;
    touchStartTime.current = Date.now();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!swipeAllowed.current) return;
    if (activeTab === "camera" || activeTab === "dms") return;
    if (storyViewerOpen || searchOpen) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    const deltaTime = Date.now() - touchStartTime.current;

    // Only fire horizontal swipe if it's clearly more horizontal than vertical
    if (
      Math.abs(deltaX) > 60 &&
      Math.abs(deltaX) > Math.abs(deltaY) * 1.5 &&
      deltaTime < 350
    ) {
      if (deltaX > 0) {
        if (featureFlags.camera) setActiveTab("camera");
      } else {
        if (featureFlags.dms) setActiveTab("dms");
      }
    }
  };

  const toggleLike = (id: number) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSave = (id: number) => {
    setSavedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStoryTap = (storyId: number) => {
    // "Your Story" (id=0) - open file picker to add story
    if (storyId === 0) {
      storyFileInputRef.current?.click();
      return;
    }
    const idx = OTHER_STORIES.findIndex((s) => s.id === storyId);
    if (idx === -1) return;
    setActiveStoryIndex(idx);
    setStoryViewerOpen(true);
  };

  const handleStoryViewerClose = (viewedIds: number[]) => {
    setViewedStories((prev) => {
      const next = new Set(prev);
      for (const id of viewedIds) next.add(id);
      return next;
    });
    setStoryViewerOpen(false);
  };

  // Listen for reels nav switch events
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent<{ tab: string }>).detail?.tab;
      if (tab) setActiveTab(tab as NavTab);
    };
    window.addEventListener("reels-nav-switch", handler);
    return () => window.removeEventListener("reels-nav-switch", handler);
  }, []);

  const isFullscreenOverlay =
    activeTab === "camera" ||
    activeTab === "dms" ||
    activeTab === "live" ||
    activeTab === "reels";

  return (
    <div
      className="min-h-screen bg-background flex flex-col items-center"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Full-screen overlays */}
      {activeTab === "camera" && (
        <CameraPage onClose={() => setActiveTab("home")} />
      )}
      {activeTab === "dms" && (
        <DirectMessagesPage onClose={() => setActiveTab("home")} />
      )}
      {activeTab === "live" && (
        <LiveStreamPage
          mode={liveStreamMode}
          onClose={() => setActiveTab("home")}
          streamerName="Rohit AI Tech"
        />
      )}

      {/* Story viewer + Search modal (portal-like, cover full screen) */}
      <AnimatePresence>
        {storyViewerOpen && (
          <StoryViewer
            stories={OTHER_STORIES}
            startIndex={activeStoryIndex}
            viewedStories={viewedStories}
            onClose={handleStoryViewerClose}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {searchOpen && <SearchModal onClose={() => setSearchOpen(false)} />}
      </AnimatePresence>

      {/* Hidden file input for gallery upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = async (ev) => {
              const rawDataUrl = ev.target?.result as string;
              const isReel =
                createType === "reel" || file.type.startsWith("video/");
              // Compress images to avoid localStorage quota issues
              let dataUrl = rawDataUrl;
              if (!isReel) {
                dataUrl = await new Promise<string>((resolve) => {
                  const img = new Image();
                  img.onload = () => {
                    const canvas = document.createElement("canvas");
                    let w = img.width;
                    let h = img.height;
                    const maxSize = 800;
                    if (w > maxSize || h > maxSize) {
                      if (w > h) {
                        h = Math.round((h * maxSize) / w);
                        w = maxSize;
                      } else {
                        w = Math.round((w * maxSize) / h);
                        h = maxSize;
                      }
                    }
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext("2d")!;
                    ctx.drawImage(img, 0, 0, w, h);
                    resolve(canvas.toDataURL("image/jpeg", 0.75));
                  };
                  img.src = rawDataUrl;
                });
              }
              const newPost = {
                id: Date.now(),
                username: "you",
                displayName: "You",
                initials: "ME",
                avatarGradient: "from-cyan-400 via-teal-500 to-emerald-600",
                timestamp: "Just now",
                caption: isReel ? "New Reel 🎬" : "New Post 📸",
                image: dataUrl,
                imageGradient: "from-[#001a2c] via-[#003366] to-[#001f3f]",
                imageAccent:
                  "radial-gradient(ellipse 80% 50% at 50% 50%, oklch(0.65 0.18 220 / 0.5) 0%, transparent 70%)",
                likes: 0,
                comments: 0,
                shares: 0,
                ageHours: 0,
                type: isReel ? "reel" : "post",
                isVideo: isReel,
              };
              setUserPosts((prev) => {
                const updated = [newPost, ...prev];
                try {
                  localStorage.setItem("user_posts", JSON.stringify(updated));
                  window.dispatchEvent(new CustomEvent("userPostAdded"));
                } catch {
                  // Quota exceeded - remove oldest and retry
                  const trimmed = updated.slice(0, updated.length - 1);
                  try {
                    localStorage.setItem("user_posts", JSON.stringify(trimmed));
                  } catch {}
                }
                return updated;
              });
              setCreateSheetOpen(false);
              setUploadToast(true);
              setTimeout(() => setUploadToast(false), 3000);
            };
            reader.readAsDataURL(file);
          } else {
            setCreateSheetOpen(false);
          }
          if (e.target) e.target.value = "";
        }}
      />

      {/* Hidden file input for story upload */}
      <input
        ref={storyFileInputRef}
        type="file"
        accept="image/*,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => {
              const dataUrl = ev.target?.result as string;
              const story = {
                id: Date.now(),
                username: "me",
                initials: "ME",
                avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
                statusText: "My Story",
                isOwn: true,
                imageUrl: dataUrl,
                timestamp: Date.now(),
              };
              try {
                const existing = JSON.parse(
                  localStorage.getItem("rohit_stories") || "[]",
                );
                localStorage.setItem(
                  "rohit_stories",
                  JSON.stringify([story, ...existing]),
                );
              } catch {}
              setUploadToast(true);
              setTimeout(() => setUploadToast(false), 3000);
            };
            reader.readAsDataURL(file);
          }
          if (e.target) e.target.value = "";
        }}
      />

      {/* Upload success toast */}
      <AnimatePresence>
        {uploadToast && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-[76px] left-1/2 -translate-x-1/2 z-[200] bg-green-500/90 backdrop-blur-sm text-white text-[13px] font-semibold px-5 py-2.5 rounded-full shadow-lg"
          >
            ✓ Uploaded successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Create Bottom Sheet */}
      <AnimatePresence>
        {createSheetOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm"
              onClick={() => setCreateSheetOpen(false)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="fixed bottom-0 left-0 right-0 z-[160] max-w-[480px] mx-auto bg-[#111] border-t border-white/10 rounded-t-[24px] px-5 pt-5 pb-8"
            >
              {/* Handle */}
              <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-5" />
              <h2 className="text-white font-bold text-[18px] mb-5 text-center">
                Create New
              </h2>

              {/* Camera / Gallery buttons */}
              <div className="flex gap-3 mb-5">
                <button
                  type="button"
                  data-ocid="create.camera.button"
                  onClick={() => {
                    setCreateSheetOpen(false);
                    setActiveTab("camera");
                  }}
                  className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95"
                >
                  <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-white text-[13px] font-semibold">
                    Camera
                  </span>
                  <span className="text-white/40 text-[11px]">Record live</span>
                </button>

                <button
                  type="button"
                  data-ocid="create.upload_button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex flex-col items-center gap-2 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-95"
                >
                  <div className="h-12 w-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <ImageIcon className="h-6 w-6 text-violet-400" />
                  </div>
                  <span className="text-white text-[13px] font-semibold">
                    Gallery
                  </span>
                  <span className="text-white/40 text-[11px]">
                    Choose from files
                  </span>
                </button>
              </div>

              {/* Post / Reel toggle */}
              <p className="text-white/50 text-[11px] uppercase tracking-widest font-semibold mb-2 text-center">
                Type
              </p>
              <div className="flex gap-2 mb-5 p-1 bg-white/5 rounded-xl">
                <button
                  type="button"
                  data-ocid="create.post.toggle"
                  onClick={() => setCreateType("post")}
                  className={`flex-1 py-2 rounded-[10px] text-[13px] font-semibold transition-all ${
                    createType === "post"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  Post
                </button>
                <button
                  type="button"
                  data-ocid="create.reel.toggle"
                  onClick={() => setCreateType("reel")}
                  className={`flex-1 py-2 rounded-[10px] text-[13px] font-semibold transition-all ${
                    createType === "reel"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  Reel
                </button>
              </div>

              {/* Close button */}
              <button
                type="button"
                data-ocid="create.cancel_button"
                onClick={() => setCreateSheetOpen(false)}
                className="w-full py-3 rounded-xl border border-white/10 text-white/50 text-[13px] font-semibold hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="w-full max-w-[480px] mx-auto relative min-h-screen flex flex-col">
        {/* ── Top Bar ── */}
        {!isFullscreenOverlay &&
          activeTab !== "profile" &&
          activeTab !== "explore" &&
          activeTab !== "notifications" && (
            <header
              data-ocid="topbar.section"
              className="fixed top-0 z-40 w-full max-w-[480px] flex items-center justify-between px-4 h-[54px] border-b border-white/[0.06] bg-background/85 backdrop-blur-xl"
            >
              <span className="font-display font-black text-[22px] tracking-tight shimmer-text leading-none">
                Rohit AI Tech
              </span>
              <div className="flex items-center gap-1">
                {/* Search icon */}
                <button
                  type="button"
                  data-ocid="topbar.search_button"
                  onClick={() => setSearchOpen(true)}
                  className="relative p-2 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="Search profiles"
                >
                  <Search className="h-[22px] w-[22px] text-foreground" />
                </button>
                {/* Bell icon */}
                <button
                  type="button"
                  data-ocid="topbar.button"
                  onClick={() => setActiveTab("notifications")}
                  className="relative p-2 -mr-1 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-[22px] w-[22px] text-foreground" />
                  <span
                    className="absolute top-1.5 right-1.5 h-[14px] w-[14px] rounded-full bg-red-500 text-[9px] font-bold text-white flex items-center justify-center leading-none"
                    aria-hidden="true"
                  >
                    3
                  </span>
                </button>
              </div>
            </header>
          )}

        {/* ── Notifications Top Bar ── */}
        {!isFullscreenOverlay && activeTab === "notifications" && (
          <header
            data-ocid="topbar.section"
            className="fixed top-0 z-40 w-full max-w-[480px] flex items-center justify-between px-4 h-[54px] border-b border-white/[0.06] bg-background/85 backdrop-blur-xl"
          >
            <span className="font-display font-black text-[22px] tracking-tight shimmer-text leading-none">
              Rohit AI Tech
            </span>
            <div className="w-8" />
          </header>
        )}

        {/* ── Main Content ── */}
        {!isFullscreenOverlay &&
          (activeTab === "profile" ? (
            <main
              className="flex-1 overflow-y-auto"
              style={{
                paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
              }}
            >
              <ProfilePage
                displayName={userDisplayName}
                profilePhoto={userProfilePhoto}
                onUpdateProfile={(name, photo) => {
                  setUserDisplayName(name);
                  if (photo !== undefined) setUserProfilePhoto(photo);
                }}
                onOpenAdmin={onOpenAdmin}
                onGoLive={() => {
                  setLiveStreamMode("broadcaster");
                  setActiveTab("live");
                }}
              />
            </main>
          ) : activeTab === "explore" ? (
            <main
              className="flex-1 overflow-y-auto"
              style={{
                paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
              }}
            >
              <ExplorePage />
            </main>
          ) : activeTab === "notifications" ? (
            <main
              className="flex-1 overflow-y-auto"
              style={{
                paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
              }}
            >
              <NotificationsPage />
            </main>
          ) : (
            <main
              className="flex-1 pt-[54px]"
              style={{
                paddingBottom: "calc(60px + env(safe-area-inset-bottom, 0px))",
              }}
            >
              {/* ── Pinned Announcement ── */}
              {pinnedAnnouncement && !announcementDismissed && (
                <div
                  data-ocid="admin.pinned_announcement.section"
                  className="mx-3 mt-2 mb-1 px-3 py-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-start gap-2"
                >
                  <span className="text-amber-400 text-base leading-none mt-0.5">
                    📌
                  </span>
                  <p className="flex-1 text-[12px] text-amber-200 leading-snug">
                    {pinnedAnnouncement}
                  </p>
                  <button
                    type="button"
                    onClick={() => setAnnouncementDismissed(true)}
                    className="text-amber-400/60 hover:text-amber-400 transition-colors ml-1"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
              {/* ── Stories Strip ── */}
              {featureFlags.stories && (
                <section
                  data-ocid="stories.section"
                  className="border-b border-white/[0.06] py-3"
                >
                  <div
                    className="flex gap-3 px-3 overflow-x-auto"
                    style={{
                      scrollbarWidth: "none",
                      msOverflowStyle: "none",
                    }}
                  >
                    {STORIES.map((story, index) => {
                      const isViewed = viewedStories.has(story.id);

                      return (
                        <motion.button
                          key={story.id}
                          type="button"
                          data-ocid={
                            story.isOwn
                              ? "stories.add_button"
                              : `stories.item.${index}`
                          }
                          onClick={() => {
                            if (
                              story.id === 6 &&
                              featureFlags.liveStreamingEnabled
                            ) {
                              setLiveStreamMode("viewer");
                              setActiveTab("live");
                            } else {
                              handleStoryTap(story.id);
                            }
                          }}
                          initial={{ opacity: 0, scale: 0.85 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            delay: index * 0.05,
                            duration: 0.3,
                            ease: "easeOut",
                          }}
                          className="flex flex-col items-center gap-1.5 flex-shrink-0 w-[62px]"
                          aria-label={
                            story.isOwn
                              ? "Add your story"
                              : `View ${story.username}'s story`
                          }
                        >
                          {/* Ring + Avatar */}
                          <div className="relative">
                            <div
                              className={`p-[2.5px] rounded-full transition-all duration-300 ${
                                story.id === 6
                                  ? "bg-red-600 animate-pulse"
                                  : story.isOwn
                                    ? `bg-gradient-to-tr ${story.avatarGradient}`
                                    : isViewed
                                      ? "bg-white/20"
                                      : `bg-gradient-to-tr ${story.avatarGradient}`
                              }`}
                              style={{
                                filter:
                                  isViewed && !story.isOwn
                                    ? "saturate(0) brightness(0.5)"
                                    : undefined,
                              }}
                            >
                              <div className="p-[2px] rounded-full bg-background">
                                <div className="h-[52px] w-[52px] rounded-full bg-background flex items-center justify-center overflow-hidden">
                                  <div
                                    className={`h-full w-full rounded-full bg-gradient-to-br ${story.avatarGradient} flex items-center justify-center`}
                                    style={{
                                      filter:
                                        isViewed && !story.isOwn
                                          ? "saturate(0) brightness(0.5)"
                                          : undefined,
                                    }}
                                  >
                                    {story.isOwn && userProfilePhoto ? (
                                      <img
                                        src={userProfilePhoto}
                                        alt="Your story"
                                        className="h-full w-full rounded-full object-cover"
                                      />
                                    ) : (
                                      <span className="text-[13px] font-bold text-white tracking-tight">
                                        {story.isOwn
                                          ? getInitials(userDisplayName)
                                          : story.initials}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {story.isOwn && (
                              <div className="absolute -bottom-0.5 -right-0.5 h-[20px] w-[20px] rounded-full bg-primary border-2 border-background flex items-center justify-center z-10">
                                <Plus
                                  className="h-[10px] w-[10px] text-primary-foreground"
                                  strokeWidth={3}
                                />
                              </div>
                            )}
                          </div>

                          <span
                            className={`text-[10px] font-medium leading-tight text-center truncate w-full transition-colors ${
                              story.isOwn
                                ? "text-foreground"
                                : isViewed
                                  ? "text-muted-foreground/40"
                                  : "text-foreground/80"
                            }`}
                          >
                            {story.username}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── Feed Posts ── */}
              <div data-ocid="feed.list">
                {[...userPosts, ...POSTS].map((post, index) => {
                  const liked = likedPosts.has(post.id);
                  const saved = savedPosts.has(post.id);
                  const likeCount = liked ? post.likes + 1 : post.likes;

                  return (
                    <motion.article
                      key={post.id}
                      data-ocid={`feed.item.${index + 1}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: index * 0.07,
                        duration: 0.38,
                        ease: "easeOut",
                      }}
                      className="border-b border-white/[0.05]"
                    >
                      {/* Post header */}
                      <div className="flex items-center justify-between px-3 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`p-[2px] rounded-full bg-gradient-to-tr ${post.avatarGradient} flex-shrink-0`}
                          >
                            <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
                              <span className="text-[11px] font-bold text-foreground">
                                {post.initials}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[13px] font-semibold text-foreground leading-tight">
                              {post.username}
                            </span>
                            <span className="text-[11px] text-muted-foreground/70 leading-tight">
                              {post.timestamp}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="p-1.5 -mr-1 text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="More options"
                        >
                          <MoreHorizontal className="h-[18px] w-[18px]" />
                        </button>
                      </div>

                      {/* Full-bleed image (4:5 aspect) - click to open Reels */}
                      {/* biome-ignore lint/a11y/useKeyWithClickEvents: mobile tap-first interaction */}
                      <div
                        className="w-full relative overflow-hidden cursor-pointer"
                        style={{ aspectRatio: "4/5" }}
                        data-ocid={`post.item.${index + 1}`}
                        onClick={() => setActiveTab("reels")}
                      >
                        {(post as Record<string, unknown>).image ? (
                          <img
                            src={
                              (post as Record<string, unknown>).image as string
                            }
                            alt="Post"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        ) : (
                          <>
                            <div
                              className={`absolute inset-0 bg-gradient-to-br ${post.imageGradient}`}
                            />
                            <div
                              className="absolute inset-0"
                              style={{ background: post.imageAccent }}
                            />
                          </>
                        )}
                        <div
                          className="absolute inset-0 opacity-[0.03]"
                          style={{
                            backgroundImage:
                              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
                            backgroundSize: "128px 128px",
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/30 to-transparent" />
                        {/* 🔥 Trending Badge */}
                        {post.id === TOP_POST_ID && (
                          <div
                            className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(251,146,60,0.92), rgba(234,88,12,0.92))",
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
                              }}
                            >
                              Trending
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action bar */}
                      <div className="px-3 pt-2 pb-1">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-3.5">
                            <button
                              type="button"
                              data-ocid={`post.like_button.${index + 1}`}
                              onClick={() => toggleLike(post.id)}
                              aria-label={liked ? "Unlike" : "Like"}
                              aria-pressed={liked}
                              className="flex items-center -ml-0.5 transition-transform active:scale-90"
                            >
                              <motion.div
                                animate={
                                  liked ? { scale: [1, 1.35, 1] } : { scale: 1 }
                                }
                                transition={{ duration: 0.3 }}
                              >
                                <Heart
                                  className={`h-[26px] w-[26px] transition-colors duration-150 ${
                                    liked
                                      ? "fill-red-500 text-red-500"
                                      : "text-foreground hover:text-white/70"
                                  }`}
                                />
                              </motion.div>
                            </button>
                            <button
                              type="button"
                              aria-label="Comment"
                              className="text-foreground hover:text-white/70 transition-colors"
                            >
                              <MessageCircle className="h-[26px] w-[26px]" />
                            </button>
                            <button
                              type="button"
                              aria-label="Share"
                              className="text-foreground hover:text-white/70 transition-colors"
                            >
                              <Send className="h-[24px] w-[24px]" />
                            </button>
                          </div>
                          <button
                            type="button"
                            data-ocid={`post.save_button.${index + 1}`}
                            onClick={() => toggleSave(post.id)}
                            aria-label={saved ? "Unsave" : "Save"}
                            aria-pressed={saved}
                            className="-mr-0.5 transition-transform active:scale-90"
                          >
                            <Bookmark
                              className={`h-[25px] w-[25px] transition-colors duration-150 ${
                                saved
                                  ? "fill-foreground text-foreground"
                                  : "text-foreground hover:text-white/70"
                              }`}
                            />
                          </button>
                        </div>

                        <p className="text-[13px] font-semibold text-foreground mb-1">
                          {formatCount(likeCount)} likes
                        </p>

                        <p className="text-[13px] text-foreground leading-snug mb-1">
                          <span className="font-semibold mr-1">
                            {post.username}
                          </span>
                          <span className="text-foreground/80">
                            {post.caption}
                          </span>
                        </p>

                        <button
                          type="button"
                          className="text-[12px] text-muted-foreground/60 hover:text-muted-foreground transition-colors mb-2.5"
                          aria-label={`View all ${post.comments} comments`}
                        >
                          View all {post.comments} comments
                        </button>
                      </div>
                    </motion.article>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="px-4 py-8 text-center">
                <p className="text-[11px] text-muted-foreground/30">
                  &copy; {new Date().getFullYear()}{" "}
                  <a
                    href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-muted-foreground/50 transition-colors"
                  >
                    Built with ♥ using caffeine.ai
                  </a>
                </p>
              </div>
            </main>
          ))}

        {/* ── Reels Fullscreen Overlay ── */}
        {activeTab === "reels" && (
          <div className="fixed inset-0 z-[45]">
            <ReelsPage />
          </div>
        )}
        {/* ── Bottom Navigation ── */}
        {!isFullscreenOverlay && (
          <nav
            data-ocid="bottomnav.section"
            className="fixed bottom-0 z-40 w-full max-w-[480px] flex items-center justify-around border-t border-white/[0.06] bg-background/90 backdrop-blur-xl h-[60px]"
            style={{
              paddingBottom: "env(safe-area-inset-bottom, 0px)",
              height: "calc(60px + env(safe-area-inset-bottom, 0px))",
            }}
          >
            <button
              type="button"
              data-ocid="nav.home.tab"
              onClick={() => setActiveTab("home")}
              aria-label="Home"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                activeTab === "home"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Home
                className={`h-[22px] w-[22px] ${
                  activeTab === "home" ? "fill-primary/15 stroke-primary" : ""
                }`}
              />
              <span className="text-[9px] font-medium tracking-wide uppercase">
                Home
              </span>
            </button>

            {featureFlags.explore && (
              <button
                type="button"
                data-ocid="nav.explore.tab"
                onClick={() => setActiveTab("explore")}
                aria-label="Explore"
                className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                  activeTab === "explore"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Compass
                  className={`h-[22px] w-[22px] ${
                    activeTab === "explore"
                      ? "fill-primary/15 stroke-primary"
                      : ""
                  }`}
                />
                <span className="text-[9px] font-medium tracking-wide uppercase">
                  Explore
                </span>
              </button>
            )}

            {featureFlags.reels && (
              <button
                type="button"
                data-ocid="nav.reels.tab"
                onClick={() => setActiveTab("reels")}
                aria-label="Reels"
                className={
                  "flex flex-col items-center gap-0.5 px-3 py-1 transition-colors text-muted-foreground hover:text-foreground"
                }
              >
                <Film className={`h-[22px] w-[22px] ${""}`} />
                <span className="text-[9px] font-medium tracking-wide uppercase">
                  Reels
                </span>
              </button>
            )}

            <button
              type="button"
              data-ocid="nav.create.tab"
              onClick={() => setCreateSheetOpen(true)}
              aria-label="Create post"
              className="flex flex-col items-center px-3 py-1"
            >
              <div className="h-10 w-10 rounded-[14px] flex items-center justify-center transition-all shadow-teal bg-primary/90 hover:bg-primary">
                <PlusSquare className="h-5 w-5 text-primary-foreground" />
              </div>
            </button>

            {featureFlags.notifications && (
              <button
                type="button"
                data-ocid="nav.notifications.tab"
                onClick={() => setActiveTab("notifications")}
                aria-label="Activity"
                className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors relative ${
                  activeTab === "notifications"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="relative">
                  <Heart
                    className={`h-[22px] w-[22px] ${
                      activeTab === "notifications"
                        ? "fill-primary/20 stroke-primary"
                        : ""
                    }`}
                  />
                  {activeTab !== "notifications" && (
                    <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </div>
                <span className="text-[9px] font-medium tracking-wide uppercase">
                  Activity
                </span>
              </button>
            )}

            <button
              type="button"
              data-ocid="nav.profile.tab"
              onClick={() => setActiveTab("profile")}
              aria-label="Profile"
              className={`flex flex-col items-center gap-0.5 px-3 py-1 transition-colors ${
                activeTab === "profile"
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {userProfilePhoto ? (
                <img
                  src={userProfilePhoto}
                  alt="Profile"
                  className="h-[24px] w-[24px] rounded-full object-cover border border-white/20"
                />
              ) : (
                <div className="h-[24px] w-[24px] rounded-full bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-600 flex items-center justify-center">
                  <span className="text-[9px] font-bold text-white">
                    {getInitials(userDisplayName)}
                  </span>
                </div>
              )}
              <span className="text-[9px] font-medium tracking-wide uppercase">
                Profile
              </span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
