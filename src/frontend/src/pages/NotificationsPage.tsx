import { motion } from "motion/react";
import { useState } from "react";
import { useModeration } from "../contexts/ModerationContext";
import type { DeletionReason } from "../contexts/ModerationContext";

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

const DEMO_CHANNELS = [
  { id: "rohit.ai", label: "@rohit.ai" },
  { id: "priya.sharma", label: "@priya.sharma" },
  { id: "arjun.dev", label: "@arjun.dev" },
];

const FIXED_VIDEO_ID = "video_demo_001";
const FIXED_THUMB_ID = "thumb_demo_001";

const REASON_COLORS: Record<
  DeletionReason,
  { border: string; bg: string; text: string; badge: string }
> = {
  duplicate_video: {
    border: "border-red-500/30",
    bg: "bg-red-500/[0.06]",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
  },
  spam_thumbnail: {
    border: "border-red-500/30",
    bg: "bg-red-500/[0.06]",
    text: "text-red-400",
    badge: "bg-red-500/20 text-red-400",
  },
  copyright: {
    border: "border-orange-500/30",
    bg: "bg-orange-500/[0.06]",
    text: "text-orange-400",
    badge: "bg-orange-500/20 text-orange-400",
  },
  nudity: {
    border: "border-red-600/40",
    bg: "bg-red-600/[0.08]",
    text: "text-red-300",
    badge: "bg-red-600/25 text-red-300",
  },
  violence: {
    border: "border-red-600/40",
    bg: "bg-red-600/[0.08]",
    text: "text-red-300",
    badge: "bg-red-600/25 text-red-300",
  },
};

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
      {notif.isNew && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
      )}
      <div
        className={`p-[2px] rounded-full bg-gradient-to-tr ${notif.avatarGradient} flex-shrink-0`}
      >
        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center">
          <span className="text-[12px] font-bold text-white">
            {notif.initials}
          </span>
        </div>
      </div>
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

function ModerationPanel() {
  const {
    postVideo,
    postWithThumbnail,
    warnings,
    suspendedChannels,
    deletedChannels,
    videoCounts,
    thumbnailCounts,
    getChannelStatus,
    getDeletionReason,
    getDeletionLabel,
    reportCopyright,
    reportInappropriate,
  } = useModeration();

  const [selectedChannel, setSelectedChannel] = useState(DEMO_CHANNELS[0].id);

  const status = getChannelStatus(selectedChannel);
  const videoCount = videoCounts[selectedChannel]?.[FIXED_VIDEO_ID] ?? 0;
  const thumbCount = thumbnailCounts[selectedChannel]?.[FIXED_THUMB_ID] ?? 0;

  const warningEntries = Object.entries(warnings);
  const suspendedList = Array.from(suspendedChannels);
  const deletedList = Array.from(deletedChannels.entries());

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-4 mb-4 rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden"
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.07]">
        <h2 className="text-[15px] font-bold text-foreground tracking-tight">
          🛡️ Content Moderation
        </h2>
        <p className="text-[11px] text-foreground/50 mt-0.5">
          Automated policy enforcement · AI-powered detection
        </p>
      </div>

      {/* Active warnings */}
      {warningEntries.length > 0 && (
        <div className="px-4 pt-3 pb-2">
          <p className="text-[11px] font-bold text-amber-400/70 uppercase tracking-widest mb-2">
            Active Warnings
          </p>
          {warningEntries.map(([channelId, warn], i) => (
            <div
              key={channelId}
              data-ocid={`moderation.warning.item.${i + 1}`}
              className="mb-2 p-3 rounded-xl border border-amber-500/30 bg-amber-500/[0.06]"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-semibold text-amber-400">
                  @{channelId}
                </span>
                <span className="text-[10px] text-amber-400/60 bg-amber-500/20 px-2 py-0.5 rounded-full">
                  ⚠️ Warned
                </span>
              </div>
              <p className="text-[12px] text-foreground/70 leading-snug">
                {warn.message}
              </p>
              <p className="text-[11px] text-amber-400/70 mt-1.5 font-medium">
                ⏳ 2 days to delete or channel will be removed
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Suspended channels */}
      {suspendedList.length > 0 && (
        <div className="px-4 pt-2 pb-2">
          <p className="text-[11px] font-bold text-red-400/70 uppercase tracking-widest mb-2">
            Suspended Channels
          </p>
          {suspendedList.map((channelId, i) => (
            <div
              key={channelId}
              data-ocid={`moderation.suspended.item.${i + 1}`}
              className="mb-2 p-3 rounded-xl border border-red-500/30 bg-red-500/[0.06] flex items-center justify-between"
            >
              <span className="text-[13px] font-semibold text-red-400">
                @{channelId}
              </span>
              <span className="text-[11px] text-red-400 bg-red-500/20 px-2.5 py-1 rounded-full font-bold">
                🚫 Suspended
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Deleted channels with reasons */}
      {deletedList.length > 0 && (
        <div className="px-4 pt-2 pb-2">
          <p className="text-[11px] font-bold text-red-400/70 uppercase tracking-widest mb-2">
            Removed Channels
          </p>
          {deletedList.map(([channelId, reason], i) => {
            const c = REASON_COLORS[reason];
            const label = getDeletionLabel(reason);
            return (
              <div
                key={channelId}
                data-ocid={`moderation.deleted.item.${i + 1}`}
                className={`mb-2 p-3 rounded-xl border ${c.border} ${c.bg}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[13px] font-semibold ${c.text}`}>
                    @{channelId}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${c.badge}`}
                  >
                    🗑️ Deleted
                  </span>
                </div>
                <p className="text-[12px] text-foreground/60 leading-snug">
                  Reason:{" "}
                  <span className={`font-semibold ${c.text}`}>{label}</span>
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Demo controls */}
      <div className="px-4 pt-3 pb-4 border-t border-white/[0.07] mt-1">
        <p className="text-[11px] font-bold text-foreground/40 uppercase tracking-widest mb-3">
          Demo Controls
        </p>

        {/* Channel selector */}
        <div className="mb-3">
          <label
            htmlFor="channel-select"
            className="text-[11px] text-foreground/50 mb-1 block"
          >
            Select Channel
          </label>
          <select
            id="channel-select"
            data-ocid="moderation.channel_select"
            value={selectedChannel}
            onChange={(e) => setSelectedChannel(e.target.value)}
            className="w-full bg-white/[0.06] border border-white/15 text-foreground text-[13px] rounded-xl px-3 py-2.5 outline-none focus:border-primary/50 appearance-none"
          >
            {DEMO_CHANNELS.map((ch) => (
              <option
                key={ch.id}
                value={ch.id}
                className="bg-[#0a0a12] text-white"
              >
                {ch.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] text-foreground/50">Status:</span>
          {status === "active" && (
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded-full">
              ✅ Active
            </span>
          )}
          {status === "warned" && (
            <span className="text-[11px] font-bold text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded-full">
              ⚠️ Warned
            </span>
          )}
          {status === "suspended" && (
            <span className="text-[11px] font-bold text-red-400 bg-red-500/15 px-2 py-0.5 rounded-full">
              🚫 Suspended
            </span>
          )}
          {status === "deleted" && (
            <span className="text-[11px] font-bold text-red-300 bg-red-600/20 px-2 py-0.5 rounded-full">
              🗑️ Channel Deleted
            </span>
          )}
        </div>

        {/* Existing spam actions */}
        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">
          Spam Policies
        </p>
        <div className="flex flex-col gap-2 mb-4">
          <button
            type="button"
            data-ocid="moderation.post_duplicate_button"
            disabled={status === "suspended" || status === "deleted"}
            onClick={() => postVideo(selectedChannel, FIXED_VIDEO_ID)}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-amber-500/40 text-amber-400 bg-amber-500/[0.08] hover:bg-amber-500/[0.15] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            📹 Post Duplicate Video
            {videoCount > 0 ? ` (${videoCount}x posted)` : ""}
          </button>

          <button
            type="button"
            data-ocid="moderation.post_thumbnail_button"
            disabled={status === "suspended" || status === "deleted"}
            onClick={() => postWithThumbnail(selectedChannel, FIXED_THUMB_ID)}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-red-500/40 text-red-400 bg-red-500/[0.08] hover:bg-red-500/[0.15] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🖼️ Post Spam Thumbnail
            {thumbCount > 0 ? ` (${thumbCount}x posted)` : ""}
          </button>
        </div>

        {/* Copyright protection */}
        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">
          Copyright Protection
        </p>
        <div className="flex flex-col gap-2 mb-4">
          <button
            type="button"
            data-ocid="moderation.copyright_button"
            disabled={status === "deleted"}
            onClick={() => reportCopyright(selectedChannel)}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-orange-500/40 text-orange-400 bg-orange-500/[0.08] hover:bg-orange-500/[0.15] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ©️ Report Copyright Violation → Delete Channel
          </button>
          {status === "deleted" &&
            getDeletionReason(selectedChannel) === "copyright" && (
              <p className="text-[11px] text-orange-400 bg-orange-500/10 rounded-lg px-3 py-2 border border-orange-500/20">
                ©️ Channel deleted — uploaded copyrighted content belonging to
                another creator.
              </p>
            )}
        </div>

        {/* AI Community Standards filter */}
        <p className="text-[10px] font-bold text-foreground/30 uppercase tracking-widest mb-2">
          AI Community Standards Filter
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            data-ocid="moderation.ai_nudity_button"
            disabled={status === "deleted"}
            onClick={() => reportInappropriate(selectedChannel, "nudity")}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-red-600/40 text-red-300 bg-red-600/[0.08] hover:bg-red-600/[0.15] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            🔞 AI Detected: Nudity / Adult Content → Delete
          </button>
          <button
            type="button"
            data-ocid="moderation.ai_violence_button"
            disabled={status === "deleted"}
            onClick={() => reportInappropriate(selectedChannel, "violence")}
            className="w-full py-2.5 rounded-xl text-[13px] font-semibold border border-red-600/40 text-red-300 bg-red-600/[0.08] hover:bg-red-600/[0.15] active:scale-[0.98] transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            ⚠️ AI Detected: Violent Content → Delete
          </button>
          {status === "deleted" &&
            (getDeletionReason(selectedChannel) === "nudity" ||
              getDeletionReason(selectedChannel) === "violence") && (
              <p className="text-[11px] text-red-300 bg-red-600/10 rounded-lg px-3 py-2 border border-red-600/25">
                🤖 AI filter triggered — channel permanently removed for
                community standards violation.
              </p>
            )}
        </div>

        {/* General feedback */}
        {videoCount === 2 && status === "warned" && (
          <p className="mt-3 text-[11px] text-amber-400 bg-amber-500/10 rounded-lg px-3 py-2 border border-amber-500/20">
            ⚠️ Warning issued after 2 posts! Post once more to suspend.
          </p>
        )}
        {videoCount >= 3 && status === "suspended" && (
          <p className="mt-3 text-[11px] text-red-400 bg-red-500/10 rounded-lg px-3 py-2 border border-red-500/20">
            🚫 Channel suspended after 3 duplicate posts!
          </p>
        )}
        {thumbCount > 0 &&
          thumbCount < 4 &&
          status !== "suspended" &&
          status !== "deleted" && (
            <p className="mt-3 text-[11px] text-foreground/50 bg-white/[0.04] rounded-lg px-3 py-2">
              🖼️ Thumbnail used {thumbCount}x — will auto-delete channel at 4x.
            </p>
          )}
      </div>
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

      {/* Moderation Panel */}
      <div className="mt-3">
        <ModerationPanel />
      </div>

      {/* New section */}
      <section className="mt-1">
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
