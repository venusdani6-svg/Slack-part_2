"use client";

import { useEffect } from "react";
import { usePresenceStore } from "@/store/presence-store";
import type { DmUser } from "./useDmUsers";
import { resolveAvatar } from "./useDmUsers";

type Props = {
  user: DmUser;
  onClose: () => void;
  onStartHuddle?: (user: DmUser) => void;
};

export function ProfileModal({ user, onClose, onStartHuddle }: Props) {
  const isOnline = usePresenceStore((s) => s.isOnline(user.id));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-xl w-[320px] shadow-2xl overflow-hidden">
        {/* Avatar banner */}
        <div className="relative h-[100px] bg-[#1d1c1d]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveAvatar(user.avatar)} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 blur-sm scale-110" />
          <div className="absolute inset-0 flex items-end px-5 pb-0 translate-y-8">
            <div className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={resolveAvatar(user.avatar)} alt={user.name}
                className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-lg"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Untitled.png"; }} />
              <span className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white ${isOnline ? "bg-[#2bac76]" : "bg-[#e8a838]"}`} />
            </div>
          </div>
          <button onClick={onClose}
            className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-md text-white/70 hover:text-white hover:bg-white/20 transition-colors text-lg"
            aria-label="Close">
            ✕
          </button>
        </div>

        {/* Info */}
        <div className="px-5 pt-10 pb-5">
          <div className="text-[16px] font-bold text-[#1d1c1d]">{user.name}</div>
          {user.title && <div className="text-[13px] text-[#616061] mt-0.5">{user.title}</div>}
          <div className="flex items-center gap-1.5 mt-2 text-[12px] text-[#616061]">
            <span className={`w-2 h-2 rounded-full ${isOnline ? "bg-[#2bac76]" : "bg-[#e8a838]"}`} />
            {isOnline ? "Active" : "Away"}
          </div>
          {user.email && (
            <div className="mt-3 text-[12px] text-[#616061]">
              <span className="font-semibold text-[#1d1c1d]">Email: </span>{user.email}
            </div>
          )}
          <button
            onClick={() => { onStartHuddle?.(user); onClose(); }}
            className="mt-4 w-full h-9 rounded-md bg-[#007a5a] hover:bg-[#006c4f] text-white text-[13px] font-medium transition-colors"
          >
            Start Huddle
          </button>
        </div>
      </div>
    </div>
  );
}
