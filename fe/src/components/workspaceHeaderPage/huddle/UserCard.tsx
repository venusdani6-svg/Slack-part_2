"use client";

import { useState } from "react";
import { useAuth } from "@/context/Authcontext";
import { usePresenceStore } from "@/store/presence-store";
import { HuddleCustomButton } from "./HuddleCustomButton";
import ProfileSidebar from "@/components/WorkSpace/ProfileSidebar";
import type { DmUser } from "./useDmUsers";
import { resolveAvatar } from "./useDmUsers";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserCardProps = {
  /** The DM peer (right side) */
  user: DmUser;
  /** Opens ChannelModal pre-filled with this user */
  onStartHuddle?: (user: DmUser) => void;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const BG_IMAGES = [
  "/Newimg/JPG/LiskFeng-Star_Gazing.jpg",
  "/Newimg/JPG/JunCen-Birdsong.jpg",
  "/Newimg/JPG/LuisMendo-Garden_Office.jpg",
];

// Module-level helper — called only by useState lazy initializer, never during render
function pickBg(): string {
  return BG_IMAGES[Math.floor(Math.random() * BG_IMAGES.length)];
}

const BACKEND = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5050";

function resolveCurrentUserAvatar(src?: string | null): string {
  if (!src) return "/Untitled.png";
  if (src.startsWith("http")) return src;
  return `${BACKEND}${src}`;
}

// ─── Avatar sub-component ─────────────────────────────────────────────────────

type AvatarProps = {
  src: string;
  name: string;
  isOnline: boolean;
  onClick: (e: React.MouseEvent) => void;
};

function Avatar({ src, name, isOnline, onClick }: AvatarProps) {
  const dot = isOnline ? "bg-[#2bac76]" : "bg-[#e8a838]";
  return (
    <div className="relative cursor-pointer" onClick={onClick}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={name}
        className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-md"
        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Untitled.png"; }}
      />
      <span
        className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${dot}`}
        title={isOnline ? "Active" : "Away"}
      />
    </div>
  );
}

export function UserCard({ user, onStartHuddle }: UserCardProps) {
  const { user: currentUser } = useAuth();

  // Fine-grained subscriptions — each card only re-renders for its own users
  const currentOnline = usePresenceStore((s) => s.isOnline(currentUser?.id ?? ""));
  const dmOnline      = usePresenceStore((s) => s.isOnline(user.id));

  const [hovered, setHovered] = useState(false);
  const [currentSidebarOpen, setCurrentSidebarOpen] = useState(false);
  const [dmSidebarOpen, setDmSidebarOpen] = useState(false);

  // useState lazy initializer: pickBg() runs once on mount, never on re-render
  const [bgImage] = useState<string>(pickBg);

  const currentName   = currentUser?.dispname ?? currentUser?.fullname ?? "You";
  const currentAvatar = resolveCurrentUserAvatar(currentUser?.avatar);
  const dmAvatar      = resolveAvatar(user.avatar);

  const currentSidebarData = currentUser
    ? { id: currentUser.id, email: currentUser.email, fullname: currentUser.fullname, dispname: currentUser.dispname, avatar: currentUser.avatar }
    : null;

  const dmSidebarData = {
    id: user.id,
    email: user.email,
    fullname: user.name,
    dispname: user.name,
    avatar: user.avatar,
  };

  return (
    <>
      {/* ── Card ── */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={() => onStartHuddle?.(user)}
        className="relative bg-white border border-[#e8e8e8] rounded-xl overflow-hidden w-full cursor-pointer transition-shadow duration-150 hover:shadow-md"
      >
        {/* Background image banner */}
        <div className="relative h-32 bg-[#1d1c1d] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-50" />

          {/* Two avatars side by side, centred */}
          <div className="absolute inset-0 flex items-center justify-center gap-3">
            {/* Current user avatar */}
            <Avatar
              src={currentAvatar}
              name={currentName}
              isOnline={currentOnline}
              onClick={(e) => { e.stopPropagation(); setCurrentSidebarOpen(true); }}
            />

            {/* Divider */}
            {/* <span className="text-white/60 text-lg font-light select-none">↔</span> */}

            {/* DM user avatar */}
            <Avatar
              src={dmAvatar}
              name={user.name}
              isOnline={dmOnline}
              onClick={(e) => { e.stopPropagation(); setDmSidebarOpen(true); }}
            />
          </div>
        </div>

        {/* Info row */}
        <div className="px-3 py-2.5 flex items-center justify-between min-h-14">
          <div className="flex items-center gap-3 min-w-0">
            {/* Current user info */}
            <div
              className="min-w-0 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setCurrentSidebarOpen(true); }}
            >
            </div>

            <span className="text-[#d1d2d3] text-xs shrink-0">·</span>

            {/* DM user info */}
            <div
              className="min-w-0 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); setDmSidebarOpen(true); }}
            >
              <div className="flex items-center gap-1">
                <p className="text-[16px] font-semibold text-[#1d1c1d] truncate max-w-40">{user.name}</p>
                {dmOnline && <span className="w-2.5 h-2.5 bg-[#2bac76] rounded-full shrink-0" />}
                {!dmOnline && <span className="w-2.5 h-2.5 bg-[#405050] rounded-full shrink-0" />}
              </div>
              <p className="text-[15px] text-[#616061] truncate max-w-24">{ dmOnline ? "Active" : "Away"}</p>
            </div>
          </div>
          <div
            className={`shrink-0 transition-opacity duration-150 ${hovered ? "opacity-100" : "opacity-0"}`}
            onClick={(e) => { e.stopPropagation(); onStartHuddle?.(user); }}
          >
            <HuddleCustomButton
              label="Start Huddle"
              bgColor="#ffffff"
              textColor="#1d1c1d"
              hoverColor="#f4f4f4"
              border="1px solid #d1d2d3"
              height="26px"
              px="8px"
              rounded="6px"
              fontSize="14px"
            />
          </div>
        </div>
      </div>

      {/* Current user sidebar (editable) */}
      {currentSidebarData && (
        <ProfileSidebar
          open={currentSidebarOpen}
          onClose={() => setCurrentSidebarOpen(false)}
          userdata={currentSidebarData}
        />
      )}

      {/* DM user sidebar (read-only) */}
      <ProfileSidebar
        open={dmSidebarOpen}
        onClose={() => setDmSidebarOpen(false)}
        userdata={dmSidebarData}
        readonly
      />
    </>
  );
}
