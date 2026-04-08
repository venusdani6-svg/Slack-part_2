"use client";

import { useState, useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";
import type { DirectoryUser, UpdatePayload } from "@/hooks/useWorkspaceUsers";

type Props = {
  user: DirectoryUser;
  onSave: (id: string, patch: UpdatePayload) => Promise<void>;
  onClose: () => void;
};

export default function EditUserModal({ user, onSave, onClose }: Props) {
  const [name, setName] = useState(user.name);
  const [title, setTitle] = useState(user.title);
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState<DirectoryUser["status"]>(user.status ?? "online");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleSave = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await onSave(user.id, { name: name.trim(), title: title.trim(), role, status });
    setSaving(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-[12px] w-[440px] shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-[24px] py-[16px] border-b border-[#e1e1e1]">
          <span className="text-[16px] font-[600] text-[#313131]">Edit profile</span>
          <button onClick={onClose} className="text-[#9ca3af] hover:text-[#313131] p-[4px] rounded-[4px] hover:bg-[#f3f4f6] transition-colors">
            <FiX size={18} />
          </button>
        </div>
        <div className="flex items-center gap-[14px] px-[24px] pt-[20px] pb-[4px]">
          <img
            src={user.avatar || "/Untitled.png"}
            alt={user.name}
            onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Untitled.png"; }}
            className="w-[52px] h-[52px] rounded-full object-cover border border-[#e1e1e1] flex-shrink-0"
          />
          <div className="min-w-0">
            <div className="text-[14px] font-[600] text-[#313131] truncate">{user.email || user.name}</div>
            {user.location && <div className="text-[12px] text-[#9ca3af]">{user.location}</div>}
          </div>
        </div>
        <div className="px-[24px] py-[16px] flex flex-col gap-[14px]">
          <label className="flex flex-col gap-[5px]">
            <span className="text-[12px] font-[600] text-[#313131]">Display name</span>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              className="h-[36px] px-[10px] rounded-[6px] border border-[#d1d5db] text-[14px] text-[#313131] outline-none focus:border-[#1264a3] focus:ring-[2px] focus:ring-[#b2cbde] transition-all"
            />
          </label>
          <label className="flex flex-col gap-[5px]">
            <span className="text-[12px] font-[600] text-[#313131]">Title</span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSave(); }}
              placeholder="e.g. Frontend Engineer"
              className="h-[36px] px-[10px] rounded-[6px] border border-[#d1d5db] text-[14px] text-[#313131] outline-none focus:border-[#1264a3] focus:ring-[2px] focus:ring-[#b2cbde] transition-all placeholder:text-[#c4c4c4]"
            />
          </label>
          <label className="flex flex-col gap-[5px]">
            <span className="text-[12px] font-[600] text-[#313131]">Role</span>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="h-[36px] px-[10px] rounded-[6px] border border-[#d1d5db] text-[14px] text-[#313131] outline-none focus:border-[#1264a3] bg-white cursor-pointer"
            >
              {["admin", "user", "guest"].map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-[5px]">
            <span className="text-[12px] font-[600] text-[#313131]">Status</span>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as DirectoryUser["status"])}
              className="h-[36px] px-[10px] rounded-[6px] border border-[#d1d5db] text-[14px] text-[#313131] outline-none focus:border-[#1264a3] bg-white cursor-pointer"
            >
              <option value="online">Active</option>
              <option value="away">Away</option>
              <option value="offline">Offline</option>
            </select>
          </label>
        </div>
        <div className="flex justify-end gap-[8px] px-[24px] pb-[20px]">
          <button
            onClick={onClose}
            disabled={saving}
            className="h-[36px] px-[16px] rounded-[6px] border border-[#d1d5db] text-[14px] text-[#313131] hover:bg-[#f3f4f6] transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !name.trim()}
            className="h-[36px] px-[16px] rounded-[6px] bg-[#007a5a] hover:bg-[#148567] text-white text-[14px] font-[500] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-[6px]"
          >
            {saving && (
              <span className="w-[12px] h-[12px] border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
}
