import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import { AdminProvider } from "./contexts/AdminContext";
import { ModerationProvider } from "./contexts/ModerationContext";
import { WatchEarnProvider } from "./contexts/WatchEarnContext";
import AdminPanel from "./pages/AdminPanel";
import HomeFeed from "./pages/HomeFeed";
import WelcomeScreen from "./pages/WelcomeScreen";

type Page = "splash" | "welcome" | "feed";

export default function App() {
  const [page, setPage] = useState<Page>("splash");
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage("welcome");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (page === "splash") {
    return (
      <div
        style={{
          position: "fixed",
          inset: 0,
          background: "#000",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999,
        }}
      >
        {/* Glow orbs */}
        <div
          style={{
            position: "absolute",
            top: "15%",
            left: "20%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)",
            animation: "pulse 2s infinite",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "20%",
            right: "15%",
            width: 160,
            height: 160,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)",
            animation: "pulse 2.5s infinite",
            pointerEvents: "none",
          }}
        />

        {/* Logo icon */}
        <img
          src="/assets/generated/rohit-ai-tech-icon.dim_512x512.png"
          alt="Rohit AI Tech"
          style={{
            width: 120,
            height: 120,
            borderRadius: 28,
            boxShadow:
              "0 0 40px rgba(6,182,212,0.6), 0 0 80px rgba(6,182,212,0.3)",
            marginBottom: 24,
            animation: "splashPop 0.6s ease-out",
          }}
        />

        {/* App name */}
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: 1,
            fontFamily: "sans-serif",
            textShadow: "0 0 20px rgba(6,182,212,0.8)",
            animation: "splashFade 0.8s ease-out 0.3s both",
          }}
        >
          ROHIT AI TECH
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 14,
            color: "#06b6d4",
            letterSpacing: 3,
            marginTop: 8,
            fontFamily: "sans-serif",
            textTransform: "uppercase",
            animation: "splashFade 0.8s ease-out 0.5s both",
          }}
        >
          Powered by AI
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { opacity: 0.6; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
          @keyframes splashPop {
            0% { transform: scale(0.5); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes splashFade {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <AdminProvider>
      <ModerationProvider>
        <WatchEarnProvider>
          {showAdmin ? (
            <AdminPanel onBack={() => setShowAdmin(false)} />
          ) : page === "feed" ? (
            <HomeFeed onOpenAdmin={() => setShowAdmin(true)} />
          ) : (
            <WelcomeScreen onGetStarted={() => setPage("feed")} />
          )}
        </WatchEarnProvider>
      </ModerationProvider>
      <Toaster />
    </AdminProvider>
  );
}
