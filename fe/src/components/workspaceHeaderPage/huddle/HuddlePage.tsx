"use client";

import { useState } from "react";
import { DirectMessagesSection } from "./DirectMessageSection";
import { HuddleHeroSection } from "./HuddleHeroSection";
import { ChannelsSection } from "./ChannelsSection";
import { FloatingActionButton } from "./FloatingActionButton";
import { HuddlesHeader } from "./HuddleHeader";
import ChannelModal from "./ChannelModal";

export default function HuddlePage() {
  const [showHero, setShowHero] = useState(true);
  const [channelModalOpen, setChannelModalOpen] = useState(false);

  const openChannelModal = () => setChannelModalOpen(true);
  const closeChannelModal = () => setChannelModalOpen(false);

  return (
    <div className="myHuddle h-full w-full sticky bg-[#ffffff]">
      <div className="max-w-266 mx-auto px-12 pt-4.5 h-10 mb-4">
        <HuddlesHeader onNewHuddle={openChannelModal} />
      </div>

      <div className="w-full max-h-218 overflow-y-auto scrollbar-hidden sidebar-scroll px-0 min-w-200 pb-25">
        {showHero && (
          <div className="mt-5">
            <HuddleHeroSection
              onClose={() => setShowHero(false)}
              onStartHuddle={openChannelModal}
            />
          </div>
        )}

        <div className="max-w-266 mx-auto px-12 pt-5">
          <div className={showHero ? "mt-3" : "mt-2"}>
            <DirectMessagesSection />
          </div>
          <div className="mt-1">
            <ChannelsSection />
          </div>
        </div>
      </div>

      <FloatingActionButton />

      {/* ChannelModal — always mounts fresh (key resets internal state on each open) */}
      {channelModalOpen && (
        <ChannelModal
          key={Date.now()}
          onClose={closeChannelModal}
          onStart={(selected) => {
            console.log("Starting huddle with:", selected);
            closeChannelModal();
          }}
        />
      )}
    </div>
  );
}
