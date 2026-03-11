import { Heart, Users, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface Props {
  onClose: () => void;
  mode: "broadcaster" | "viewer";
  streamerName?: string;
}

const FAKE_NAMES = [
  "Priya",
  "Rahul",
  "Sneha",
  "Arjun",
  "Kavya",
  "Rohit",
  "Meena",
  "Vikram",
  "Ananya",
  "Suresh",
  "Pooja",
  "Amit",
  "Divya",
  "Karan",
];

const FAKE_COMMENTS = [
  "\u2764\ufe0f",
  "Amazing!",
  "\ud83d\udd25\ud83d\udd25",
  "Wahh!",
  "So good!",
  "Following now!",
  "Wow bhai!",
  "\ud83d\ude4c\ud83d\ude4c",
  "Best creator!",
  "Love this!",
  "Keep going \ud83d\udcaa",
  "Subscribed!",
  "\u2764\ufe0f\u2764\ufe0f\u2764\ufe0f",
  "Superb!",
  "Go Rohit!",
];

interface ChatMsg {
  id: number;
  name: string;
  text: string;
}

interface FloatingHeart {
  id: number;
  x: number;
}

export default function LiveStreamPage({
  onClose,
  mode,
  streamerName = "Rohit AI Tech",
}: Props) {
  const [viewerCount, setViewerCount] = useState(3);
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [streamTitle, setStreamTitle] = useState(
    "Live with Rohit AI Tech \ud83d\udd34",
  );
  const [editingTitle, setEditingTitle] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const msgCountRef = useRef(0);
  const msgIdRef = useRef(0);
  const heartIdRef = useRef(0);

  // Increment viewer count
  useEffect(() => {
    const interval = setInterval(
      () => {
        setViewerCount((prev) => {
          if (prev >= 200) return prev;
          const bump = Math.floor(Math.random() * 5) + 1;
          return Math.min(prev + bump, 200);
        });
      },
      Math.random() * 2000 + 3000,
    );
    return () => clearInterval(interval);
  }, []);

  // Auto-generate fake chat messages
  useEffect(() => {
    const schedule = () => {
      const delay = Math.random() * 2500 + 1500;
      const timer = setTimeout(() => {
        const name = FAKE_NAMES[Math.floor(Math.random() * FAKE_NAMES.length)];
        const text =
          FAKE_COMMENTS[Math.floor(Math.random() * FAKE_COMMENTS.length)];
        const id = ++msgIdRef.current;
        setChatMessages((prev) => [...prev.slice(-30), { id, name, text }]);
        schedule();
      }, delay);
      return timer;
    };
    const timer = schedule();
    return () => clearTimeout(timer);
  }, []);

  // Auto-scroll chat when message count changes
  useEffect(() => {
    msgCountRef.current = chatMessages.length;
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  });

  const sendHeart = () => {
    const id = ++heartIdRef.current;
    const x = Math.random() * 60 + 20;
    setFloatingHearts((prev) => [...prev, { id, x }]);
    setTimeout(() => {
      setFloatingHearts((prev) => prev.filter((h) => h.id !== id));
    }, 2000);
  };

  const handleEnd = () => {
    if (mode === "broadcaster") {
      setShowEndConfirm(true);
    } else {
      onClose();
    }
  };

  return (
    <div
      data-ocid="livestream.section"
      className="fixed inset-0 z-50 bg-black flex flex-col overflow-hidden"
    >
      {/* Background: animated gradient simulating camera */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 90% 70% at 50% 40%, oklch(0.18 0.05 15 / 0.9) 0%, oklch(0.06 0.02 260) 100%)",
          }}
        />
        {/* Simulated camera pulse */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          animate={{ opacity: [0.05, 0.12, 0.05] }}
          transition={{
            duration: 3,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 45%, oklch(0.55 0.18 10 / 0.3) 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Top Bar */}
      <div className="relative z-10 flex items-center justify-between px-4 pt-10 pb-3">
        {/* Left: LIVE badge + viewer count */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-red-600 rounded-full px-2.5 py-1">
            <motion.span
              className="h-2 w-2 rounded-full bg-white block"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
            />
            <span className="text-white text-[12px] font-black tracking-wider">
              LIVE
            </span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Users className="h-3.5 w-3.5 text-white/80" />
            <motion.span
              key={viewerCount}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-[12px] font-bold"
            >
              {viewerCount}
            </motion.span>
          </div>
        </div>

        {/* Center: streamer name / title */}
        <div className="flex flex-col items-center flex-1 mx-2">
          {mode === "broadcaster" ? (
            editingTitle ? (
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                onBlur={() => setEditingTitle(false)}
                className="bg-black/50 text-white text-[13px] font-semibold text-center rounded-lg px-2 py-1 border border-white/20 w-full max-w-[180px] outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setEditingTitle(true)}
                className="text-white text-[13px] font-semibold text-center truncate max-w-[180px]"
              >
                {streamTitle}
              </button>
            )
          ) : (
            <span className="text-white text-[13px] font-semibold">
              Watching {streamerName}
            </span>
          )}
        </div>

        {/* Right: close/leave button */}
        <button
          type="button"
          data-ocid="livestream.leave.button"
          onClick={handleEnd}
          className="p-2 rounded-full bg-black/40 backdrop-blur-sm"
          aria-label={mode === "broadcaster" ? "End stream" : "Leave stream"}
        >
          <X className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Center Area: Camera Simulation */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
        {mode === "broadcaster" ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-red-600/30"
                animate={{ scale: [1, 1.25, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              />
              <motion.div
                className="absolute inset-0 rounded-full bg-red-600/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: 0.3,
                }}
              />
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-red-700 via-red-600 to-rose-500 flex items-center justify-center shadow-2xl shadow-red-900/60">
                <div className="h-16 w-16 rounded-full bg-black/30 flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full bg-black/60 flex items-center justify-center">
                    <div className="h-5 w-5 rounded-full bg-red-600" />
                  </div>
                </div>
              </div>
            </div>
            <p className="text-white/60 text-[13px] font-medium">
              You are live \ud83d\udd34
            </p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-violet-600 via-fuchsia-500 to-pink-500 flex items-center justify-center shadow-2xl">
              <span className="text-white text-2xl font-black">
                {streamerName[0]}
              </span>
            </div>
            <p className="text-white/60 text-[13px]">{streamerName} is live</p>
          </div>
        )}
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <AnimatePresence>
          {floatingHearts.map((h) => (
            <motion.div
              key={h.id}
              initial={{ opacity: 1, y: 0, scale: 0.8 }}
              animate={{ opacity: 0, y: -260, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className="absolute bottom-[200px] text-2xl"
              style={{ left: `${h.x}%` }}
            >
              \u2764\ufe0f
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Chat + Heart Button */}
      <div className="relative z-10 px-3 pb-4 flex flex-col gap-2">
        <div
          className="h-[180px] overflow-y-auto flex flex-col justify-end gap-1 pr-1"
          style={{ scrollbarWidth: "none" }}
        >
          <AnimatePresence initial={false}>
            {chatMessages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-1.5"
              >
                <span className="text-[11px] font-bold text-fuchsia-400 shrink-0">
                  {msg.name}
                </span>
                <span className="text-[12px] text-white/85">{msg.text}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={chatEndRef} />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="livestream.heart.button"
            onClick={sendHeart}
            className="flex-shrink-0 h-12 w-12 rounded-full bg-gradient-to-br from-red-600 to-pink-500 flex items-center justify-center shadow-lg shadow-red-900/40 active:scale-90 transition-transform"
            aria-label="Send heart reaction"
          >
            <Heart className="h-5 w-5 text-white fill-white" />
          </button>

          <div className="flex-1 h-10 rounded-full bg-white/10 border border-white/15 flex items-center px-4">
            <span className="text-white/40 text-[13px]">Say something...</span>
          </div>

          {mode === "broadcaster" ? (
            <button
              type="button"
              data-ocid="livestream.end_stream.button"
              onClick={() => setShowEndConfirm(true)}
              className="flex-shrink-0 px-3 h-10 rounded-full bg-red-700 text-white text-[12px] font-bold active:scale-90 transition-transform"
            >
              End
            </button>
          ) : (
            <button
              type="button"
              data-ocid="livestream.leave.button"
              onClick={onClose}
              className="flex-shrink-0 px-3 h-10 rounded-full bg-white/15 text-white text-[12px] font-bold active:scale-90 transition-transform"
            >
              Leave
            </button>
          )}
        </div>
      </div>

      {/* End Stream Confirm Dialog */}
      <AnimatePresence>
        {showEndConfirm && (
          <motion.div
            data-ocid="livestream.dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/70 flex items-center justify-center px-6"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              className="w-full max-w-[300px] bg-[#1a1a1f] rounded-2xl border border-white/10 overflow-hidden"
            >
              <div className="px-5 pt-6 pb-2 text-center">
                <div className="text-3xl mb-3">\ud83d\udd34</div>
                <h2 className="text-[16px] font-bold text-white mb-1">
                  End Live Stream?
                </h2>
                <p className="text-[13px] text-white/50">
                  Your viewers will be notified that the stream has ended.
                </p>
              </div>
              <div className="flex border-t border-white/10">
                <button
                  type="button"
                  data-ocid="livestream.cancel_button"
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 py-3.5 text-[14px] font-semibold text-white/60 border-r border-white/10 hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  data-ocid="livestream.confirm_button"
                  onClick={onClose}
                  className="flex-1 py-3.5 text-[14px] font-bold text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  End Stream
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
