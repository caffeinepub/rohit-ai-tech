import { useState } from "react";
import HomeFeed from "./pages/HomeFeed";
import WelcomeScreen from "./pages/WelcomeScreen";

type Page = "welcome" | "feed";

export default function App() {
  const [page, setPage] = useState<Page>("welcome");

  if (page === "feed") {
    return <HomeFeed />;
  }

  return <WelcomeScreen onGetStarted={() => setPage("feed")} />;
}
