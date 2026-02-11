import { useState } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import AnalysisPage from "./components/AnalysisPage";

export default function App() {
  const [view, setView] = useState("home");

  return (
    <div className="min-h-screen bg-paper">
      <Header
        showBack={view === "analysis"}
        onBack={() => setView("home")}
      />
      {view === "home" ? (
        <Hero onStart={() => setView("analysis")} />
      ) : (
        <AnalysisPage />
      )}
    </div>
  );
}
