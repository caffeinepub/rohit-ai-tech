import {
  FlipHorizontal,
  Gauge,
  Music2,
  Sparkles,
  Timer,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

interface CameraPageProps {
  onClose: () => void;
}

const SIDEBAR_TOOLS = [
  { id: "audio", icon: Music2, label: "Audio", ocid: "camera.audio_button" },
  { id: "speed", icon: Gauge, label: "Speed", ocid: "camera.speed_button" },
  {
    id: "effects",
    icon: Sparkles,
    label: "Effects",
    ocid: "camera.effects_button",
  },
  { id: "timer", icon: Timer, label: "Timer", ocid: "camera.timer_button" },
];

export default function CameraPage({ onClose }: CameraPageProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 300, damping: 35 }}
        className="fixed inset-0 z-50 bg-black flex flex-col"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-4 pt-safe pt-3 pb-3 z-10">
          <button
            type="button"
            data-ocid="camera.close_button"
            onClick={onClose}
            className="p-2 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 text-white"
            aria-label="Close camera"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="text-white font-semibold text-base tracking-wide">
            Camera
          </span>
          <div className="w-9" />
        </div>

        {/* Viewfinder area + sidebar */}
        <div className="flex-1 relative mx-3 mb-4 rounded-2xl overflow-hidden">
          {/* Viewfinder bg */}
          <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 to-black" />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "33.333% 33.333%",
            }}
          />

          {/* Subtle bokeh glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(99,102,241,0.08) 0%, transparent 70%)",
            }}
          />

          {/* Center placeholder text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-white/10 text-sm tracking-widest uppercase font-medium">
              Viewfinder
            </span>
          </div>

          {/* Right editing sidebar */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-4">
            {SIDEBAR_TOOLS.map((tool) => {
              const Icon = tool.icon;
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  data-ocid={tool.ocid}
                  onClick={() => setActiveTool(isActive ? null : tool.id)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl backdrop-blur-sm border transition-all ${
                    isActive
                      ? "bg-white/20 border-white/30"
                      : "bg-black/40 border-white/10 hover:bg-black/60"
                  }`}
                  aria-label={tool.label}
                  aria-pressed={isActive}
                >
                  <Icon className="h-5 w-5 text-white" />
                  <span className="text-[9px] text-white/80 font-medium tracking-wide">
                    {tool.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom controls */}
        <div className="flex items-center justify-around px-8 pb-safe pb-8">
          {/* Empty space left */}
          <div className="w-12" />

          {/* Record button */}
          <button
            type="button"
            data-ocid="camera.record_button"
            onClick={() => setIsRecording((v) => !v)}
            aria-label={isRecording ? "Stop recording" : "Start recording"}
            className="relative flex items-center justify-center"
          >
            <div className="h-[76px] w-[76px] rounded-full border-4 border-white flex items-center justify-center">
              <motion.div
                animate={
                  isRecording
                    ? { scale: [1, 0.85], borderRadius: ["50%", "20%"] }
                    : { scale: 1, borderRadius: "50%" }
                }
                transition={{ duration: 0.2 }}
                className="h-[54px] w-[54px] bg-red-500"
                style={{ borderRadius: "50%" }}
              />
            </div>
          </button>

          {/* Flip camera */}
          <button
            type="button"
            data-ocid="camera.toggle"
            aria-label="Flip camera"
            className="p-3 rounded-full bg-black/40 backdrop-blur-sm border border-white/10"
          >
            <FlipHorizontal className="h-6 w-6 text-white" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
