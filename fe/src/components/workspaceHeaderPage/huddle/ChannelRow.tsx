"use client";

import { useState } from "react";
import ChannelModal from "./ChannelModal";
import { HuddleCustomButton } from "./HuddleCustomButton";
import type { PickerItem } from "./useHuddleSearch";
import { FaLock } from "react-icons/fa";
type Channel = {
  id: string;
  name: string;
  isPrivate?: boolean;
};

type Props = {
  channels: Channel[];
};

export default function ChannelRow({ channels }: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [initialChannel, setInitialChannel] = useState<PickerItem | undefined>();

  const openModal = (channel: Channel) => {
    setInitialChannel({
      id: channel.id,
      type: "channel",
      label: channel.name,
      isPrivate: channel.isPrivate,
    });
    setModalOpen(true);
  };

  const handleStart = (selected: PickerItem[]) => {
    console.log("Starting huddle with:", selected);
    setModalOpen(false);
  };

  return (
    <div className="border border-[#aca8a8] rounded-md">
      {channels.map((channel) => (
        <div
          key={channel.id}
          onClick={() => openModal(channel)}
          className="group w-full h-15 flex items-center justify-between px-3 transition-all duration-120 cursor-pointer border-b border-[#aca8a8]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9.5 h-9.5 text-[#313131] text-[24px] flex justify-center items-center rounded-md bg-[#e1e1e1]">
             #
            </div>
            <div className="flex items-center text-[#313131] text-[16px] font-bold">{channel.isPrivate ?(<FaLock />) : "#"}{channel.name}</div>
          </div>

          <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <HuddleCustomButton
              label="Start Huddle"
              bgColor="#ffffff"
              textColor="#1d1c1d"
              hoverColor="#f4f4f4"
              border="1px solid #d1d2d3"
              height="28px"
              px="10px"
              rounded="6px"
              fontSize="12px"
              onClick={() => openModal(channel)}
            />
          </div>
        </div>
      ))}

      {modalOpen && (
        <ChannelModal
          initialChannel={initialChannel}
          onClose={() => setModalOpen(false)}
          onStart={handleStart}
        />
      )}
    </div>
  );
}
