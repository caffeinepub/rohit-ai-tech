import { createContext, useCallback, useContext, useState } from "react";

export type ChannelStatus = "active" | "warned" | "suspended" | "deleted";
export type DeletionReason =
  | "duplicate_video"
  | "spam_thumbnail"
  | "copyright"
  | "nudity"
  | "violence";

const DELETION_LABELS: Record<DeletionReason, string> = {
  duplicate_video: "Repeated duplicate content",
  spam_thumbnail: "Spam thumbnail abuse",
  copyright: "Copyright violation",
  nudity: "Nudity / Adult content",
  violence: "Violent content",
};

interface Warning {
  message: string;
  issuedAt: number;
  videoId: string;
}

interface ModerationState {
  videoCounts: Record<string, Record<string, number>>;
  thumbnailCounts: Record<string, Record<string, number>>;
  warnings: Record<string, Warning>;
  suspendedChannels: Set<string>;
  deletedChannels: Map<string, DeletionReason>;
}

interface ModerationContextValue extends ModerationState {
  postVideo: (channelId: string, videoId: string) => void;
  postWithThumbnail: (channelId: string, thumbnailId: string) => void;
  deleteVideo: (channelId: string, videoId: string) => void;
  dismissWarning: (channelId: string) => void;
  reportCopyright: (channelId: string) => void;
  reportInappropriate: (channelId: string, type: "nudity" | "violence") => void;
  getChannelStatus: (channelId: string) => ChannelStatus;
  getDeletionReason: (channelId: string) => DeletionReason | null;
  getDeletionLabel: (reason: DeletionReason) => string;
}

const ModerationContext = createContext<ModerationContextValue | null>(null);

export function ModerationProvider({
  children,
}: { children: React.ReactNode }) {
  const [state, setState] = useState<ModerationState>({
    videoCounts: {},
    thumbnailCounts: {},
    warnings: {},
    suspendedChannels: new Set(),
    deletedChannels: new Map(),
  });

  const postVideo = useCallback((channelId: string, videoId: string) => {
    setState((prev) => {
      if (
        prev.suspendedChannels.has(channelId) ||
        prev.deletedChannels.has(channelId)
      )
        return prev;

      const channelVideos = { ...(prev.videoCounts[channelId] ?? {}) };
      channelVideos[videoId] = (channelVideos[videoId] ?? 0) + 1;
      const count = channelVideos[videoId];

      let warnings = { ...prev.warnings };
      let suspendedChannels = new Set(prev.suspendedChannels);

      if (count >= 3) {
        if (prev.warnings[channelId]) {
          suspendedChannels.add(channelId);
          delete warnings[channelId];
        } else {
          warnings[channelId] = {
            message: `Duplicate content detected (posted ${count}x). Delete duplicates within 2 days or your channel will be removed.`,
            issuedAt: Date.now(),
            videoId,
          };
        }
      } else if (count >= 2) {
        warnings[channelId] = {
          message: `Duplicate content detected (posted ${count}x). Delete duplicates within 2 days or your channel will be removed.`,
          issuedAt: Date.now(),
          videoId,
        };
      }

      return {
        ...prev,
        videoCounts: { ...prev.videoCounts, [channelId]: channelVideos },
        warnings,
        suspendedChannels,
      };
    });
  }, []);

  const postWithThumbnail = useCallback(
    (channelId: string, thumbnailId: string) => {
      setState((prev) => {
        if (
          prev.suspendedChannels.has(channelId) ||
          prev.deletedChannels.has(channelId)
        )
          return prev;

        const channelThumbs = { ...(prev.thumbnailCounts[channelId] ?? {}) };
        channelThumbs[thumbnailId] = (channelThumbs[thumbnailId] ?? 0) + 1;
        const count = channelThumbs[thumbnailId];

        let suspendedChannels = new Set(prev.suspendedChannels);
        let warnings = { ...prev.warnings };
        const deletedChannels = new Map(prev.deletedChannels);

        if (count >= 4) {
          deletedChannels.set(channelId, "spam_thumbnail");
          suspendedChannels.delete(channelId);
          delete warnings[channelId];
        }

        return {
          ...prev,
          thumbnailCounts: {
            ...prev.thumbnailCounts,
            [channelId]: channelThumbs,
          },
          suspendedChannels,
          warnings,
          deletedChannels,
        };
      });
    },
    [],
  );

  const deleteVideo = useCallback((channelId: string, videoId: string) => {
    setState((prev) => {
      const channelVideos = { ...(prev.videoCounts[channelId] ?? {}) };
      delete channelVideos[videoId];
      const warnings = { ...prev.warnings };
      if (prev.warnings[channelId]?.videoId === videoId) {
        delete warnings[channelId];
      }
      return {
        ...prev,
        videoCounts: { ...prev.videoCounts, [channelId]: channelVideos },
        warnings,
      };
    });
  }, []);

  const dismissWarning = useCallback((channelId: string) => {
    setState((prev) => {
      const warnings = { ...prev.warnings };
      delete warnings[channelId];
      return { ...prev, warnings };
    });
  }, []);

  const reportCopyright = useCallback((channelId: string) => {
    setState((prev) => {
      if (prev.deletedChannels.has(channelId)) return prev;
      const deletedChannels = new Map(prev.deletedChannels);
      const suspendedChannels = new Set(prev.suspendedChannels);
      const warnings = { ...prev.warnings };
      deletedChannels.set(channelId, "copyright");
      suspendedChannels.delete(channelId);
      delete warnings[channelId];
      return { ...prev, deletedChannels, suspendedChannels, warnings };
    });
  }, []);

  const reportInappropriate = useCallback(
    (channelId: string, type: "nudity" | "violence") => {
      setState((prev) => {
        if (prev.deletedChannels.has(channelId)) return prev;
        const deletedChannels = new Map(prev.deletedChannels);
        const suspendedChannels = new Set(prev.suspendedChannels);
        const warnings = { ...prev.warnings };
        deletedChannels.set(channelId, type);
        suspendedChannels.delete(channelId);
        delete warnings[channelId];
        return { ...prev, deletedChannels, suspendedChannels, warnings };
      });
    },
    [],
  );

  const getChannelStatus = useCallback(
    (channelId: string): ChannelStatus => {
      if (state.deletedChannels.has(channelId)) return "deleted";
      if (state.suspendedChannels.has(channelId)) return "suspended";
      if (state.warnings[channelId]) return "warned";
      return "active";
    },
    [state.deletedChannels, state.suspendedChannels, state.warnings],
  );

  const getDeletionReason = useCallback(
    (channelId: string): DeletionReason | null => {
      return state.deletedChannels.get(channelId) ?? null;
    },
    [state.deletedChannels],
  );

  const getDeletionLabel = useCallback(
    (reason: DeletionReason): string => DELETION_LABELS[reason],
    [],
  );

  return (
    <ModerationContext.Provider
      value={{
        ...state,
        postVideo,
        postWithThumbnail,
        deleteVideo,
        dismissWarning,
        reportCopyright,
        reportInappropriate,
        getChannelStatus,
        getDeletionReason,
        getDeletionLabel,
      }}
    >
      {children}
    </ModerationContext.Provider>
  );
}

export function useModeration() {
  const ctx = useContext(ModerationContext);
  if (!ctx)
    throw new Error("useModeration must be used within ModerationProvider");
  return ctx;
}
