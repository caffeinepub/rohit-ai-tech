import { motion } from "motion/react";
import { useState } from "react";

type NotifType = "like" | "follow" | "comment";

interface Notification {
  id: number;
  type: NotifType;
  username: string;
  initials: string;
  avatarGradient: string;
  action: string;
  time: string;
  postSwatch?: string;
  isNew: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: "follow",
    username: "priya.sharma",
    initials: "PS",
    avatarGradient: "from-violet-500 via-fuchsia-500 to-pink-500",
    action: "started following you",
    time: "2m ago",
    isNew: true,
  },
  {
    id: 2,
    type: "like",
    username: "arjun.dev",
    initials: "AM",
    avatarGradient: "from-cyan-400 via-teal-500 to-emerald-600",
    action: "liked your post",
    time: "8m ago",
    postSwatch: "from-[#0f0035] via-[#2d1b69] to-[#1a0050]",
    isNew: true,
  },
  {
    id: 3,
    type: "comment",
    username: "sneha.creates",
    initials: "SK",
    avatarGradient: "from-orange-400 via-rose-500 to-pink-600",
    action: 'commented: "This is so inspiring! 🔥"',
    time: "15m ago",
    postSwatch: "from-[#001a1a] via-[#003333] to-[#001f3f]",
    isNew: true,
  },
  {
    id: 4,
    type: "follow",
    username: "rahul.builds",
    initials: "RD",
    avatarGradient: "from-emerald-400 via-green-500 to-teal-600",
    action: "started following you",
    time: "32m ago",
    isNew: true,
  },
  {
    id: 5,
    type: "like",
    username: "kavya.ai",
    initials: "KN",
    avatarGradient: "from-sky-400 via-blue-500 to-indigo-600",
    action: "liked your post",
    time: "1h ago",
    postSwatch: "from-[#1f0a00] via-[#3d1500] to-[#2a0a0a]",
    isNew: false,
  },
  {
    id: 6,
    type: "follow",
    username: "rohit.ai",
    initials: "RA",
    avatarGradient: "from-yellow-400 via-amber-500 to-orange-600",
    action: "started following you",
    time: "3h ago",
    isNew: false,
  },
  {
    id: 7,
    type: "like",
    username: "meera.tech",
    initials: "MT",
    avatarGradient: "from-rose-400 via-pink-500 to-fuchsia-600",
    action: "liked your post",
    time: "5h ago",
    postSwatch: "from-[#00081f] via-[#001040] to-[#000d35]",
    isNew: false,
  },
  {
    id: 8,
    type: "follow",
    username: "vivek.codes",
    initials: "VC",
    avatarGradient: "from-indigo-400 via-purple-500 to-violet-600",
    action: "started following you",
    time: "Yesterday",
    isNew: false,
  },
  {
    id: 9,
    type: "comment",
    username: "aarav.ml",
    initials: "AL",
    avatarGradient: "from-teal-400 via-cyan-500 to-sky-600",
    action: 'commented: "AI + Social = 🚀"',
    time: "Yesterday",
    postSwatch: "from-[#001a0d] via-[#003320] to-[#001f15]",
    isNew: false,
  },
];

const newNotifs = NOTIFICATIONS.filter((n) => n.isNew);
const earlierNotifs = NOTIFICATIONS.filter((n) => !n.isNew);

function NotifRow({
  notif,
  index,
  followed,
  onFollow,
}: {
  notif: Notification;
  index: number;
  followed: boolean;
  onFollow: () => void;
}) {
  return (
    <motion.div
      data-ocid={`notifications.item.${index}`}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.045, duration: 0.32, ease: "easeOut" }}
      className={`flex items-center gap-3 px-4 py-3 relative ${
        notif.isNew ? "bg-white/[0.04]" : ""
      }`}
    >
      {/* Unread dot */}
      {notif.isNew && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
      )}

      {/* Avatar */}
      <div
        className={`p-[2px] rounded-full bg-gradient-to-tr ${notif.avatarGradient} flex-shrink-0`}
      >
        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
          <span className="text-[12px] font-bold text-white">
            {notif.initials}
          </span>
        </div>
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] leading-snug text-foreground/90">
          <span className="font-semibold text-foreground">
            {notif.username}
          </span>{" "}
          <span className="text-foreground/75">{notif.action}</span>
        </p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
          {notif.time}
        </p>
      </div>

      {/* Right side */}
      {notif.type === "follow" ? (
        <button
          type="button"
          data-ocid={`notifications.follow_button.${index}`}
          onClick={onFollow}
          className={`flex-shrink-0 text-[12px] font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
            followed
              ? "bg-white/10 border-white/20 text-foreground/60"
              : "bg-transparent border-primary text-primary hover:bg-primary/10 active:scale-95"
          }`}
        >
          {followed ? "Following" : "Follow Back"}
        </button>
      ) : notif.postSwatch ? (
        <div
          className={`flex-shrink-0 h-10 w-10 rounded-md bg-gradient-to-br ${notif.postSwatch} border border-white/10`}
        />
      ) : null}
    </motion.div>
  );
}

export default function NotificationsPage() {
  const [followed, setFollowed] = useState<Set<number>>(new Set());

  const toggleFollow = (id: number) => {
    setFollowed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  let globalIndex = 0;

  return (
    <div
      data-ocid="notifications.page"
      className="min-h-screen bg-background pt-[54px] pb-[60px]"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h1 className="font-display font-black text-[26px] tracking-tight text-foreground leading-none">
          Activity
        </h1>
      </div>

      {/* New section */}
      <section className="mt-3">
        <p className="px-4 pb-2 text-[12px] font-bold text-foreground/50 uppercase tracking-widest">
          New
        </p>
        <div data-ocid="notifications.list">
          {newNotifs.map((notif) => {
            globalIndex++;
            const idx = globalIndex;
            return (
              <NotifRow
                key={notif.id}
                notif={notif}
                index={idx}
                followed={followed.has(notif.id)}
                onFollow={() => toggleFollow(notif.id)}
              />
            );
          })}
        </div>
      </section>

      {/* Divider */}
      <div className="h-px bg-white/[0.06] mx-4 my-2" />

      {/* Earlier section */}
      <section>
        <p className="px-4 pb-2 text-[12px] font-bold text-foreground/50 uppercase tracking-widest">
          Earlier
        </p>
        <div>
          {earlierNotifs.map((notif) => {
            globalIndex++;
            const idx = globalIndex;
            return (
              <NotifRow
                key={notif.id}
                notif={notif}
                index={idx}
                followed={followed.has(notif.id)}
                onFollow={() => toggleFollow(notif.id)}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
