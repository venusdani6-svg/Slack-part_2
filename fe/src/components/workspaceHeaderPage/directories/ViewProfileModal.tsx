"use client";

import { FiX } from "react-icons/fi";
import type { DirectoryUser } from "@/lib/mapArchiveUser";

type Props = {
  user: DirectoryUser;
  onClose: () => void;
};

const STATUS_CONFIG = {
  online:  { dot: "bg-[#2bac76]", label: "Active" },
  away:    { dot: "bg-[#e8a838]", label: "Away" },
  offline: { dot: "bg-[#9ca3af]", label: "Offline" },
} as const;

export default function ViewProfileModal({ user, onClose }: Props) {
  const status = STATUS_CONFIG[user.status as keyof typeof STATUS_CONFIG] ?? STATUS_CONFIG.offline;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[12px] w-[360px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-[#e1e1e1]">
          <span className="text-[16px] font-[600] text-[#313131]">Profile</span>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#313131] p-[4px] rounded-[4px] hover:bg-[#f3f4f6] transition-colors">
            <FiX size={18} />
          </button>
        </div>
        <div className="flex flex-col items-center px-[24px] pt-[28px] pb-[24px] gap-[12px]">
          <div className="relative">
            <img
              src={user.avatar || "/Untitled.png"}
              alt={user.name}
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Untitled.png"; }}
              className="w-[80px] h-[80px] rounded-full object-cover border border-[#e1e1e1]"
            />
            <span className={`absolute bottom-[4px] right-[4px] w-[14px] h-[14px] rounded-full border-[2px] border-white ${status.dot}`} />
          </div>
          <div className="text-center">
            <div className="text-[18px] font-[700] text-[#313131]">{user.name}</div>
            <div className="text-[13px] text-[#9ca3af] mt-[2px]">{user.title || "Member"}</div>
          </div>
          <div className="w-full flex flex-col gap-[8px] mt-[4px]">
            {user.email && (
              <div className="flex items-center gap-[10px] text-[13px]">
                <span className="text-[#9ca3af] w-[64px] flex-shrink-0">Email</span>
                <span className="text-[#313131] truncate">{user.email}</span>
              </div>
            )}
            {user.location && (
              <div className="flex items-center gap-[10px] text-[13px]">
                <span className="text-[#9ca3af] w-[64px] flex-shrink-0">Location</span>
                <span className="text-[#313131]">{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-[10px] text-[13px]">
              <span className="text-[#9ca3af] w-[64px] flex-shrink-0">Status</span>
              <span className="flex items-center gap-[6px] text-[#313131]">
                <span className={`w-[8px] h-[8px] rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
            <div className="flex items-center gap-[10px] text-[13px]">
              <span className="text-[#9ca3af] w-[64px] flex-shrink-0">Role</span>
              <span className="text-[#313131] capitalize">{user.role}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
