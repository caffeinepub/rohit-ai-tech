import { ArrowLeft, Edit, Search, Send } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

interface DirectMessagesPageProps {
  onClose: () => void;
}

interface Message {
  id: number;
  text: string;
  sent: boolean;
  time: string;
}

interface Conversation {
  id: number;
  username: string;
  initials: string;
  gradient: string;
  preview: string;
  time: string;
  unread: boolean;
  messages: Message[];
}

const DM_CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    username: "priya.sharma",
    initials: "PS",
    gradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    preview: "Loved your last post! 🔥",
    time: "2m",
    unread: true,
    messages: [
      {
        id: 1,
        text: "Hey! Love your content 🔥",
        sent: false,
        time: "10:12 AM",
      },
      {
        id: 2,
        text: "Thanks so much, means a lot!",
        sent: true,
        time: "10:13 AM",
      },
      {
        id: 3,
        text: "How do you come up with ideas for reels?",
        sent: false,
        time: "10:14 AM",
      },
      {
        id: 4,
        text: "Mostly from trending topics and my own experiments with AI tools",
        sent: true,
        time: "10:15 AM",
      },
      {
        id: 5,
        text: "That's so cool! I want to start creating too",
        sent: false,
        time: "10:16 AM",
      },
      {
        id: 6,
        text: "You should go for it! Start small, stay consistent 💪",
        sent: true,
        time: "10:17 AM",
      },
      {
        id: 7,
        text: "Loved your last post! 🔥",
        sent: false,
        time: "10:18 AM",
      },
    ],
  },
  {
    id: 2,
    username: "arjun.dev",
    initials: "AM",
    gradient: "from-cyan-400 via-teal-500 to-emerald-600",
    preview: "Are you joining the hackathon?",
    time: "15m",
    unread: false,
    messages: [
      {
        id: 1,
        text: "Bro, the AI hackathon is next weekend!",
        sent: false,
        time: "9:00 AM",
      },
      { id: 2, text: "Oh nice, which one?", sent: true, time: "9:01 AM" },
      {
        id: 3,
        text: "The one on Devfolio — 48 hours, top prize is 1 lakh",
        sent: false,
        time: "9:02 AM",
      },
      {
        id: 4,
        text: "Sounds intense 😅 What's the theme?",
        sent: true,
        time: "9:03 AM",
      },
      {
        id: 5,
        text: "AI for social good. Perfect for you tbh",
        sent: false,
        time: "9:04 AM",
      },
      {
        id: 6,
        text: "Are you joining the hackathon?",
        sent: false,
        time: "9:30 AM",
      },
    ],
  },
  {
    id: 3,
    username: "sneha.creates",
    initials: "SK",
    gradient: "from-orange-400 via-rose-500 to-pink-600",
    preview: "Check out this AI tool",
    time: "1h",
    unread: true,
    messages: [
      {
        id: 1,
        text: "You seen Runway Gen-3? The videos are insane",
        sent: false,
        time: "8:05 AM",
      },
      {
        id: 2,
        text: "Yeah I tried it last week! Output quality is 🤌",
        sent: true,
        time: "8:06 AM",
      },
      {
        id: 3,
        text: "We should collab on a reel using it",
        sent: false,
        time: "8:07 AM",
      },
      {
        id: 4,
        text: "100%, DM me your script idea",
        sent: true,
        time: "8:08 AM",
      },
      { id: 5, text: "Check out this AI tool", sent: false, time: "8:45 AM" },
    ],
  },
  {
    id: 4,
    username: "rahul.builds",
    initials: "RD",
    gradient: "from-emerald-400 via-green-500 to-teal-600",
    preview: "Thanks for the follow!",
    time: "3h",
    unread: false,
    messages: [
      {
        id: 1,
        text: "Just followed you, your content is top tier!",
        sent: false,
        time: "7:00 AM",
      },
      { id: 2, text: "Thanks! Following back 🙏", sent: true, time: "7:01 AM" },
      {
        id: 3,
        text: "Which AI tools do you use daily?",
        sent: false,
        time: "7:02 AM",
      },
      {
        id: 4,
        text: "ChatGPT, Midjourney, and Cursor for coding mostly",
        sent: true,
        time: "7:03 AM",
      },
      { id: 5, text: "Thanks for the follow!", sent: false, time: "7:10 AM" },
    ],
  },
  {
    id: 5,
    username: "kavya.ai",
    initials: "KN",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    preview: "Let's collab on something",
    time: "1d",
    unread: false,
    messages: [
      {
        id: 1,
        text: "Hey! I've been watching your journey — super inspiring",
        sent: false,
        time: "Yesterday",
      },
      {
        id: 2,
        text: "Thank you! What kind of content do you make?",
        sent: true,
        time: "Yesterday",
      },
      {
        id: 3,
        text: "AI explainers and tech reviews mostly",
        sent: false,
        time: "Yesterday",
      },
      {
        id: 4,
        text: "Oh that's super relevant, would love to crosspost something",
        sent: true,
        time: "Yesterday",
      },
      {
        id: 5,
        text: "Let's collab on something",
        sent: false,
        time: "Yesterday",
      },
    ],
  },
  {
    id: 6,
    username: "rohit.ai",
    initials: "RA",
    gradient: "from-yellow-400 via-amber-500 to-orange-600",
    preview: "Welcome to Rohit AI Tech 🎉",
    time: "2d",
    unread: false,
    messages: [
      {
        id: 1,
        text: "Welcome to Rohit AI Tech! 🎉",
        sent: false,
        time: "2 days ago",
      },
      {
        id: 2,
        text: "Explore the reels, discover new creators, and enjoy the community!",
        sent: false,
        time: "2 days ago",
      },
      {
        id: 3,
        text: "Thanks! This platform is amazing 🙌",
        sent: true,
        time: "2 days ago",
      },
    ],
  },
];

function ChatThread({
  convo,
  onBack,
}: {
  convo: Conversation;
  onBack: () => void;
}) {
  const storageKey = `rohit_dm_messages_${convo.username}`;
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : convo.messages;
    } catch {
      return convo.messages;
    }
  });
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "instant" });
  }, []);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setMessages((prev) => {
      const updated = [
        ...prev,
        { id: prev.length + 1, text, sent: true, time: timeStr },
      ];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      return updated;
    });
    setInput("");
    setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 50);
  };

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", stiffness: 320, damping: 35 }}
      className="fixed inset-0 z-60 bg-background flex flex-col"
      style={{ zIndex: 60 }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe pt-3 pb-3 border-b border-white/[0.06] flex-shrink-0">
        <button
          type="button"
          data-ocid="chat.back_button"
          onClick={onBack}
          className="p-2 -ml-1 rounded-full hover:bg-white/5 transition-colors text-foreground"
          aria-label="Back to messages"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex flex-col items-center flex-1">
          <div
            className={`h-9 w-9 rounded-full bg-gradient-to-br ${convo.gradient} flex items-center justify-center mb-0.5`}
          >
            <span className="text-[11px] font-bold text-white">
              {convo.initials}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[13px] font-semibold text-foreground">
              {convo.username}
            </span>
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]" />
          </div>
          <span className="text-[10px] text-emerald-400/80">Online</span>
        </div>
        <div className="w-9" />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            data-ocid={`chat.message.item.${i + 1}`}
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex ${msg.sent ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[72%] px-4 py-2.5 rounded-2xl text-[13px] leading-snug shadow-sm ${
                msg.sent
                  ? "bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-600 text-white rounded-br-sm"
                  : "bg-white/[0.08] border border-white/[0.07] text-foreground/90 rounded-bl-sm"
              }`}
            >
              <p>{msg.text}</p>
              <p
                className={`text-[9px] mt-1 ${msg.sent ? "text-white/50 text-right" : "text-muted-foreground/40"}`}
              >
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="flex-shrink-0 px-4 py-3 border-t border-white/[0.06] flex items-center gap-2 bg-background">
        <input
          type="text"
          data-ocid="chat.message_input"
          placeholder="Message…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 px-4 py-2.5 rounded-2xl bg-white/[0.06] border border-white/[0.08] text-foreground placeholder:text-muted-foreground/40 text-sm focus:outline-none focus:ring-1 focus:ring-fuchsia-500/50"
        />
        <button
          type="button"
          data-ocid="chat.send_button"
          onClick={handleSend}
          disabled={!input.trim()}
          className="h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 disabled:opacity-30 transition-all active:scale-95 shadow-[0_0_12px_oklch(0.55_0.28_300/0.4)]"
          aria-label="Send message"
        >
          <Send className="h-4 w-4 text-white" />
        </button>
      </div>
    </motion.div>
  );
}

export default function DirectMessagesPage({
  onClose,
}: DirectMessagesPageProps) {
  const [search, setSearch] = useState("");
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);

  const filtered = DM_CONVERSATIONS.filter(
    (c) =>
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.preview.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <AnimatePresence>
        <motion.div
          key="dm-list"
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
                  onClick={() => setSelectedConvo(convo)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.04] active:bg-white/[0.07] transition-colors text-left"
                  aria-label={`Open conversation with ${convo.username}`}
                >
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span
                        className={`text-sm leading-tight truncate ${
                          convo.unread
                            ? "font-bold text-foreground"
                            : "font-semibold text-foreground/90"
                        }`}
                      >
                        {convo.username}
                      </span>
                      <span className="text-[11px] text-muted-foreground/50 flex-shrink-0 ml-2">
                        {convo.time}
                      </span>
                    </div>
                    <p
                      className={`text-[12px] truncate leading-tight ${
                        convo.unread
                          ? "text-foreground/80"
                          : "text-muted-foreground/50"
                      }`}
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

      {/* Chat thread overlay */}
      <AnimatePresence>
        {selectedConvo && (
          <ChatThread
            key={selectedConvo.id}
            convo={selectedConvo}
            onBack={() => setSelectedConvo(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
