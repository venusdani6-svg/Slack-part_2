"use client";
       
// auth : KCJ

import React from "react";

export default function MessageContextMenu() {
  return (
    <div className="w-[240px] bg-white rounded-md border border-[#e5e5e5] shadow-[0_4px_12px_rgba(0,0,0,0.15)] py-1 text-[13px] text-[#1d1c1d]">

      <MenuItem label="Edit message" shortcut="E">
        <EditIcon />      
      </MenuItem>

      <MenuItem label="Mark unread" shortcut="U">
        <UnreadIcon />
      </MenuItem>

      <MenuItem label="Remind me" right="›">
        <ClockIcon />
      </MenuItem>

      <MenuItem label="Turn off notifications for replies">
        <BellOffIcon />
      </MenuItem>

      <Divider />

      <MenuItem label="Copy link" shortcut="L">
        <LinkIcon />
      </MenuItem>

      <MenuItem label="Copy message" shortcut="Ctrl+C">
        <CopyIcon />
      </MenuItem>

      <Divider />

      <MenuItem label="Organize" right="›" />
      <MenuItem label="Connect to apps" right="›" />

      <Divider />

      {/* Delete */}
      <button className="group w-full flex items-center justify-between px-3 h-[32px] hover:bg-[#e01e5a]">
        <span className="text-[#e01e5a] group-hover:text-white font-medium">
          Delete message…
        </span>
        <span className="text-[12px] text-gray-400 group-hover:text-white">
          delete
        </span>
      </button>

    </div>
  );
}

/* ---------------- Menu Item ---------------- */

function MenuItem({
  children,
  label,
  shortcut,
  right,
}: {
  children?: React.ReactNode;
  label: string;
  shortcut?: string;
  right?: string;
}) {
  return (
    <button className="group w-full flex items-center justify-between px-3 h-[32px] hover:bg-[#1264a3]">
      <div className="flex items-center gap-2">
        {children && <IconWrapper>{children}</IconWrapper>}
        <span className="group-hover:text-white">{label}</span>
      </div>

      {shortcut && (
        <span className="text-[12px] text-gray-400 group-hover:text-white">
          {shortcut}
        </span>
      )}

      {!shortcut && right && (
        <span className="text-gray-400 group-hover:text-white">{right}</span>
      )}
    </button>
  );
}

/* ---------------- Divider ---------------- */

function Divider() {
  return <div className="my-1 border-t border-[#e5e5e5]" />;
}

/* ---------------- Icon Wrapper ---------------- */

function IconWrapper({ children }: { children: React.ReactNode }) {
  return (
    <span className="w-4 h-4 text-gray-500 group-hover:text-white flex items-center justify-center">
      {children}
    </span>
  );
}

/* ---------------- SVG Icons ---------------- */

/* Edit */
function EditIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
    </svg>
  );
}

/* FIXED Unread Icon (circle + line) */
function UnreadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="9" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  );
}

/* Clock */
function ClockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}

/* Bell Off */
function BellOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18" />
      <path d="M10 20a2 2 0 0 0 4 0" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

/* Link */
function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1" />
      <path d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1" />
    </svg>
  );
}

/* Copy */
function CopyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <rect x="2" y="2" width="13" height="13" rx="2" />
    </svg>
  );
}