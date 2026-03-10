import { ArrowLeft, Edit, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface DirectMessagesPageProps {
  onClose: () => void;
}

const DM_CONVERSATIONS = [
  {
    id: 1,
    username: "priya.sharma",
    initials: "PS",
    gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    preview: "Loved your last post! 🔥",
    time: "2m",
    unread: true,
  },
  {
    id: 2,
    username: "arjun.dev",
    initials: "AM",
    gradient: "from-cyan-400 via-teal-500 to-emerald-600",
    preview: "Are you joining the hackathon?",
    time: "15m",
    unread: false,
  },
  {
    id: 3,
    username: "sneha.creates",
    initials: "SK",
    gradient: "from-orange-400 via-rose-500 to-pink-600",
    preview: "Check out this AI tool",
    time: "1h",
    unread: true,
  },
  {
    id: 4,
    username: "rahul.builds",
    initials: "RD",
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    preview: "Thanks for the follow!",
    time: "3h",
    unread: false,
  },
  {
    id: 5,
    username: "kavya.ai",
    initials: "KN",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    preview: "Let's collab on something",
    time: "1d",
    unread: false,
  },
  {
    id: 6,
    username: "rohit.ai",
    initials: "RA",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    preview: "Welcome to Rohit AI Tech 🎉",
    time: "2d",
    unread: false,
  },
];

export default function DirectMessagesPage({
  onClose,
}: DirectMessagesPageProps) {
  const [search, setSearch] = useState("");

  const filtered = DM_CONVERSATIONS.filter(
    (c) =>
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        className="fixed inset-0 z-50 bg-background flex flex-col"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 pt-safe pt-3 pb-3 border-b border-white/[0.06]">
          <button
            type="button"
            data-ocid="dms.close_button"
            onClick={onClose}
            className="p-2 -ml-1 rounded-full hover:bg-white/5 transition-colors text-foreground"
            aria-label="Back"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <span className="font-semibold text-base text-foreground">
            Messages
          </span>
          <button
            type="button"
            data-ocid="dms.compose_button"
            className="p-2 -mr-1 rounded-full hover:bg-white/5 transition-colors text-foreground"
            aria-label="Compose new message"
          >
            <Edit className="h-5 w-5" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
            <input
              type="text"
              data-ocid="dms.search_input"
              placeholder="Search messages…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div
              data-ocid="dms.empty_state"
              className="flex flex-col items-center justify-center h-48 text-muted-foreground/50 gap-2"
            >
              <Search className="h-8 w-8 opacity-40" />
              <p className="text-sm">No conversations found</p>
            </div>
          ) : (
            filtered.map((convo, index) => (
              <motion.button
                key={convo.id}
                type="button"
                data-ocid={`dms.item.${index + 1}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: index * 0.04,
                  duration: 0.25,
                  ease: "easeOut",
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors text-left"
                aria-label={`Open conversation with ${convo.username}`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div
                    className={`h-12 w-12 rounded-full bg-gradient-to-br ${convo.gradient} flex items-center justify-center`}
                  >
                    <span className="text-[13px] font-bold text-white">
                      {convo.initials}
                    </span>
                  </div>
                  {convo.unread && (
                    <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span
                      className={`text-sm leading-tight truncate ${convo.unread ? "font-bold text-foreground" : "font-semibold text-foreground/90"}`}
                    >
                      {convo.username}
                    </span>
                    <span className="text-[11px] text-muted-foreground/50 flex-shrink-0 ml-2">
                      {convo.time}
                    </span>
                  </div>
                  <p
                    className={`text-[12px] truncate leading-tight ${convo.unread ? "text-foreground/80" : "text-muted-foreground/50"}`}
                  >
                    {convo.preview}
                  </p>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
