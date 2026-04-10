"use client";

import { useMemo, useState } from "react";
import { usePresenceStore } from "@/store/presence-store";
import { HuddleCustomButton } from "./HuddleCustomButton";
import ProfileSidebar from "@/components/WorkSpace/ProfileSidebar";
import type { DmUser } from "./useDmUsers";
import { resolveAvatar } from "./useDmUsers";

type Props = {
  user: DmUser;
  /** Called when "Huddle" button or card body is clicked — opens ChannelModal pre-filled */
  onStartHuddle?: (user: DmUser) => void;
};

const BG_IMAGES = [
  "/Newimg/JPG/LiskFeng-Star_Gazing.jpg",
  "/Newimg/JPG/JunCen-Birdsong.jpg",
  "/Newimg/JPG/LuisMendo-Garden_Office.jpg",
];

/**
 * Fine-grained presence subscription — only this card re-renders when
 * this specific user's online status changes.
 *
 * Click zones:
 *  - Avatar / name area  → opens ProfileSidebar (read-only view)
 *  - "Huddle" button     → calls onStartHuddle (opens ChannelModal pre-filled)
 *  - Card body           → calls onStartHuddle (opens ChannelModal)
 */
export function UserCard({ user, onStartHuddle }: Props) {
  const isOnline = usePresenceStore((s) => s.isOnline(user.id));
  const [hovered, setHovered] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Stable random background per card mount
  const bgImage = useMemo(
    () => BG_IMAGES[Math.floor(Math.random() * BG_IMAGES.length)],
    []
  );

  const statusDot   = isOnline ? "bg-[#2bac76]" : "bg-[#e8a838]";
  const statusLabel = isOnline ? "Active" : "Away";

  // ProfileSidebar expects the same shape as AuthContext user
  const sidebarUserdata = {
    id: user.id,
    email: user.email,
    fullname: user.name,
    dispname: user.name,
    avatar: user.avatar,
  };

  return (
    <>
      {/* Card — clicking the body opens ChannelModal */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onStartHuddle?.(user)}
        className="relative bg-white border border-[#e8e8e8] rounded-lg overflow-hidden w-full cursor-pointer transition-shadow duration-150 hover:shadow-md"
      >
        {/* Top visual — background image + avatar */}
        <div className="relative h-27.5 bg-[#1d1c1d] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-60" />

          {/* Avatar — clicking opens ProfileSidebar, not ChannelModal */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            onClick={(e) => { e.stopPropagation(); setSidebarOpen(true); }}
          >
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveAvatar(user.avatar)}
                alt={user.name}
                className="w-15.5 h-15.5 rounded-lg object-cover border-2 border-white shadow-md"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Untitled.png"; }}
              />
              <span
                className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${statusDot}`}
                title={statusLabel}
              />
            </div>
          </div>
        </div>

        {/* Bottom info row */}
        <div className="px-3 py-2.5 flex items-center justify-between min-h-14">
          {/* Name — clicking opens ProfileSidebar */}
          <div
            className="min-w-0"
            onClick={(e) => { e.stopPropagation(); setSidebarOpen(true); }}
          >
            <div className="flex items-center gap-1.5">
              <p className="text-[13px] font-semibold text-[#1d1c1d] truncate max-w-27.5">{user.name}</p>
              {isOnline && <span className="w-2 h-2 bg-[#2bac76] rounded-full shrink-0" />}
            </div>
            <p className="text-[11px] text-[#616061] mt-0.5 truncate max-w-30">
              {user.title || statusLabel}
            </p>
          </div>

          {/* Huddle button — visible on hover, opens ChannelModal */}
          <div
            className={`shrink-0 transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}
            onClick={(e) => { e.stopPropagation(); onStartHuddle?.(user); }}
          >
            <HuddleCustomButton
              label="Huddle"
              bgColor="#ffffff"
              textColor="#1d1c1d"
              hoverColor="#f4f4f4"
              border="1px solid #d1d2d3"
              height="26px"
              px="8px"
              rounded="6px"
              fontSize="11px"
            />
          </div>
        </div>
      </div>

      {/* ProfileSidebar — read-only view of this user */}
      <ProfileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        userdata={sidebarUserdata}
        readonly
      />
    </>
  );
}
