"use client";

import { useEffect, useState } from "react";
import HomeScreen from "@/components/HomeScreen";
import GameScreen from "@/components/GameScreen";
import UsernameModal from "@/components/UsernameModal";
import StatsModal from "@/components/StatsModal";
import { getUsername } from "@/lib/storage";
import { GameMode } from "@/lib/storage";

type Screen = "home" | "game";

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [gameMode, setGameMode] = useState<GameMode>("daily");
  const [categoryId, setCategoryId] = useState<string | undefined>();
  const [username, setUsername] = useState("");
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    const saved = getUsername();
    if (saved) setUsername(saved);
    else setShowUsernameModal(true);
  }, []);

  const handleStartDaily = () => {
    setGameMode("daily");
    setCategoryId(undefined);
    setScreen("game");
  };

  const handleStartEndless = (catId: string) => {
    setGameMode("endless");
    setCategoryId(catId);
    setScreen("game");
  };

  if (screen === "game") {
    return (
      <GameScreen
        mode={gameMode}
        categoryId={categoryId}
        username={username}
        onHome={() => setScreen("home")}
      />
    );
  }

  return (
    <>
      <HomeScreen
        username={username}
        onStartDaily={handleStartDaily}
        onStartEndless={handleStartEndless}
        onShowStats={() => setShowStats(true)}
      />
      {showUsernameModal && (
        <UsernameModal onSave={(name) => { setUsername(name); setShowUsernameModal(false); }} />
      )}
      {showStats && <StatsModal onClose={() => setShowStats(false)} />}
    </>
  );
}
