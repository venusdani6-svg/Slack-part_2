"use client";

import { useState } from "react";
import { UserCard } from "./UserCard";
import { useDmUsers, type DmUser } from "./useDmUsers";
import ChannelModal from "./ChannelModal";
import type { PickerItem } from "./useHuddleSearch";

function SkeletonCard() {
  return (
    <div className="bg-white border border-[#e8e8e8] rounded-lg overflow-hidden animate-pulse">
      <div className="h-[110px] bg-[#e1e1e1]" />
      <div className="px-3 py-2.5 flex flex-col gap-1.5">
        <div className="h-3 bg-[#e1e1e1] rounded w-[60%]" />
        <div className="h-2.5 bg-[#e1e1e1] rounded w-[40%]" />
      </div>
    </div>
  );
}

export function DirectMessagesSection() {
  const { users, loading } = useDmUsers();

  // ChannelModal state — pre-filled with the selected user
  const [huddleTarget, setHuddleTarget] = useState<PickerItem | undefined>();
  const [huddleOpen, setHuddleOpen] = useState(false);

  const openHuddle = (user: DmUser) => {
    setHuddleTarget({
      id: user.id,
      type: "user",
      label: user.name,
      sublabel: user.title || user.email,
      avatar: user.avatar,
    });
    setHuddleOpen(true);
  };

  return (
    <>
      <div>
        <h3 className="text-[15px] font-bold text-[#1d1c1d]">
          Direct messages
          <span className="text-[#616061] font-normal ml-1.5">
            — Talk privately 1:1 with someone
          </span>
        </h3>

        <div className="mt-4 grid grid-cols-3 gap-3">
          {loading && Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}

          {!loading && users.length === 0 && (
            <div className="col-span-3 py-8 text-center text-[13px] text-[#616061]">
              No direct messages yet
            </div>
          )}

          {!loading && users.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onStartHuddle={openHuddle}
            />
          ))}
        </div>
      </div>

      {/* ChannelModal opens with the user's name pre-filled in the picker */}
      {huddleOpen && (
        <ChannelModal
          initialChannel={huddleTarget}
          onClose={() => { setHuddleOpen(false); setHuddleTarget(undefined); }}
          onStart={(selected) => {
            console.log("Starting huddle with:", selected);
            setHuddleOpen(false);
            setHuddleTarget(undefined);
          }}
        />
      )}
    </>
  );
}
