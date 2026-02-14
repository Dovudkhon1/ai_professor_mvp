"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MainContent from "@/components/MainContent";
import SettingsSidebar from "@/components/SettingsSidebar";

export type Topic = {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  thumbnailUrl: string;
};

const TOPICS: Topic[] = [
  {
    id: "supply-demand",
    title: "Supply & Demand",
    subtitle: "Iqtisodiyot 101 • 1-ma'ruza",
    videoUrl: "/videos/supply-demand.mp4",
    thumbnailUrl: "/history_thumbnails/thumbnail-supply-demand.png",
  },
  {
    id: "stock-market",
    title: "Stock Market",
    subtitle: "Moliya 101 • 2-ma'ruza",
    videoUrl: "/videos/Stock-Market.mp4",
    thumbnailUrl: "/history_thumbnails/thumbnail-stock.png",
  },
  {
    id: "inflation",
    title: "Inflation",
    subtitle: "Makroiqtisodiyot • 3-ma'ruza",
    videoUrl: "/videos/inflation.mp4",
    thumbnailUrl: "/history_thumbnails/thumbnail-inflation.png",
  },
];

export default function Home() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [currentTopic, setCurrentTopic] = useState<Topic>(TOPICS[0]);

  return (
    <div className="h-screen bg-gray-50 flex flex-col font-sans overflow-hidden">
      <Header onMenuClick={() => setIsSettingsOpen(!isSettingsOpen)} />

      <div className="flex flex-1 overflow-hidden relative">
        {/* Settings Overlay Sidebar */}
        <SettingsSidebar
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />

        <Sidebar
          topics={TOPICS}
          activeTopic={currentTopic}
          onSelectTopic={setCurrentTopic}
        />
        <MainContent topic={currentTopic} />
      </div>
    </div>
  );
}
