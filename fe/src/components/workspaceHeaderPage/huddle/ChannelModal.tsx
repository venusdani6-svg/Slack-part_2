"use client";

import { useState, useEffect } from "react";
import { HuddleCustomButton } from "./HuddleCustomButton";
import { HuddlePicker } from "./HuddlePicker";
import type { PickerItem } from "./useHuddleSearch";

type Props = {
  onClose: () => void;
  onStart: (selected: PickerItem[]) => void;
  /** Pre-select a channel when opened from a ChannelRow */
  initialChannel?: PickerItem;
};

export default function ChannelModal({ onClose, onStart, initialChannel }: Props) {
  const [selected, setSelected] = useState<PickerItem[]>(
    initialChannel ? [initialChannel] : []
  );

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[12px] w-[480px] shadow-2xl overflow-visible">

        {/* Header */}
        <div className="flex items-start justify-between px-[20px] py-[16px] border-b border-[#e8e8e8]">
          <div>
            <div className="text-[18px] font-[700] text-[#1d1c1d]">Start a Huddle</div>
            <div className="text-[13px] text-[#616061] mt-[2px]">
              Find a person or channel to huddle with
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-[28px] h-[28px] flex items-center justify-center rounded-[6px] text-[#616061] hover:bg-[#f4f4f4] hover:text-[#1d1c1d] transition-colors text-[18px] mt-[2px]"
          >
            ✕
          </button>
        </div>

        {/* Picker */}
        <div className="px-[20px] py-[16px]">
          <HuddlePicker
            selected={selected}
            onChange={setSelected}
            placeholder="Search by name"
          />
        </div>

        {/* Selected summary */}
        {selected.length > 0 && (
          <div className="px-[20px] pb-[4px] text-[12px] text-[#616061]">
            {selected.length} {selected.length === 1 ? "recipient" : "recipients"} selected
          </div>
        )}

        {/* Footer */}
        <div className="px-[20px] pb-[20px] pt-[12px] flex items-center justify-end gap-[8px]">
          <button
            onClick={onClose}
            className="h-[36px] px-[14px] rounded-[6px] border border-[#d1d2d3] text-[14px] text-[#1d1c1d] hover:bg-[#f4f4f4] transition-colors"
          >
            Cancel
          </button>
          <HuddleCustomButton
            label="Start Huddle"
            bgColor={selected.length > 0 ? "#007a5a" : "#d1d2d3"}
            textColor={selected.length > 0 ? "#ffffff" : "#9ca3af"}
            hoverColor={selected.length > 0 ? "#006c4f" : "#d1d2d3"}
            activeColor="#005c42"
            height="36px"
            px="16px"
            rounded="6px"
            fontSize="14px"
            onClick={() => { if (selected.length > 0) onStart(selected); }}
          />
        </div>
      </div>
    </div>
  );
}
