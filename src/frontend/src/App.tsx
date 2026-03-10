import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { AdminProvider } from "./contexts/AdminContext";
import { ModerationProvider } from "./contexts/ModerationContext";
import AdminPanel from "./pages/AdminPanel";
import HomeFeed from "./pages/HomeFeed";
import WelcomeScreen from "./pages/WelcomeScreen";

type Page = "welcome" | "feed";

export default function App() {
  const [page, setPage] = useState<Page>("welcome");
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <AdminProvider>
      <ModerationProvider>
        {showAdmin ? (
          <AdminPanel onBack={() => setShowAdmin(false)} />
        ) : page === "feed" ? (
          <HomeFeed onOpenAdmin={() => setShowAdmin(true)} />
        ) : (
          <WelcomeScreen onGetStarted={() => setPage("feed")} />
        )}
      </ModerationProvider>
      <Toaster />
    </AdminProvider>
  );
}
