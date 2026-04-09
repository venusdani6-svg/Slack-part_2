"use client";

import {
  FiEdit,
  FiHeadphones,
  FiMessageCircle,
  FiSettings,
  FiSend
} from "react-icons/fi";
import { TbAddressBook } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import { useMessageStore } from "@/store/message-store";
import ChannelOptionsMenu from "@/components/WorkSpace/ChannelOptionsMenu";
import { WorkspaceNameMenu } from "@/components/WorkSpace/WorkspaceNameMenu";

const items = [
  { label: "Threads", icon: FiMessageCircle },
  { label: "Huddles", icon: FiHeadphones },
  { label: "Drafts % Sent", icon: FiSend },
  { label: "Directories", icon: TbAddressBook },
];

export default function WorkspaceHeader() {
  const [workspaceName, setWorkspaceName] = useState<string | null>(null);
  const { setFlag, flag } = useMessageStore();

  // ── ChannelOptionsMenu (FiSettings) ──────────────────────────────────────
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // ── WorkspaceNameMenu (workspace name click) ──────────────────────────────
  const [isNameMenuOpen, setIsNameMenuOpen] = useState(false);
  const nameMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const name = localStorage.getItem("workspaceName");
    setWorkspaceName(name);
  }, []);

  // Close ChannelOptionsMenu on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMenuOpen]);

  // Close WorkspaceNameMenu on outside click
  useEffect(() => {
    if (!isNameMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (nameMenuRef.current && !nameMenuRef.current.contains(e.target as Node)) {
        setIsNameMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isNameMenuOpen]);

  return (
    <div className="py-3 border-b border-white/10">
      <div className="flex items-center justify-between ">
        {/* Workspace name — toggles WorkspaceNameMenu dropdown */}
        <div ref={nameMenuRef} className="relative">
          <div
            className="flex items-center hover:bg-white/10 rounded-md px-2 cursor-pointer"
            onClick={() => setIsNameMenuOpen((prev) => !prev)}
          >
            <h1 className="font-bold text-[25px] px-2 rounded">
              {workspaceName}
            </h1>
            <p>˅</p>
          </div>
          {isNameMenuOpen && (
            <div className="absolute top-full left-0 mt-1 z-50">
              <WorkspaceNameMenu />
            </div>
          )}
        </div>

        <div className="flex gap-2">
          {/* Settings button — toggles ChannelOptionsMenu dropdown */}
          <div ref={menuRef} className="relative">
            <button
              className="p-1 rounded-sm hover:bg-white/10 px-2 cursor-pointer"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label="Channel options"
            >
              <FiSettings />
            </button>
            {isMenuOpen && (
              <div className="absolute top-full left-[-40px] mt-1 z-50">
                <ChannelOptionsMenu />
              </div>
            )}
          </div>

          <button className="p-1 rounded-sm hover:bg-white/10 px-2 cursor-pointer">
            <FiEdit />
          </button>
        </div>
      </div>

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.label}
            onClick={() => setFlag(item.label)}
            className={`flex items-center gap-3 px-2 py-1.5 rounded-md cursor-pointer transition ${
              flag === item.label
                ? "bg-white text-[rgb(92,42,92)]"
                : "text-white/80 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={16} />
            <span className="text-sm">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}
