import { useState } from "react";
import { ModerationProvider } from "./contexts/ModerationContext";
import HomeFeed from "./pages/HomeFeed";
import WelcomeScreen from "./pages/WelcomeScreen";

type Page = "welcome" | "feed";

export default function App() {
  const [page, setPage] = useState<Page>("welcome");

  return (
    <ModerationProvider>
      {page === "feed" ? (
        <HomeFeed />
      ) : (
        <WelcomeScreen onGetStarted={() => setPage("feed")} />
      )}
    </ModerationProvider>
  );
}
