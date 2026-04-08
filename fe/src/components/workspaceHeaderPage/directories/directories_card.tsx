"use client";

import { FiEdit2 } from "react-icons/fi";

type Status = "online" | "away" | "offline";

type Props = {
  head: string;
  text: string;
  avatar: string;
  isCurrentUser?: boolean;
  status?: Status;
  onClick?: () => void;
  onEdit?: (e: React.MouseEvent) => void;
};

const STATUS_DOT: Record<Status, string> = {
  online:  "bg-[#2bac76]",
  away:    "bg-[#e8a838]",
  offline: "bg-[#9ca3af]",
};

const BACKEND = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5050";

function resolveAvatar(src: string): string {
  if (!src || src === "/Untitled.png") return "/Untitled.png";
  if (src.startsWith("http")) return src;
  return `${BACKEND}${src}`;
}

export default function Card({
  head,
  text,
  avatar,
  isCurrentUser = false,
  status = "online",
  onClick,
  onEdit,
}: Props) {
  const dotColor = STATUS_DOT[status] ?? STATUS_DOT.offline;

  return (
    <div
      onClick={onClick}
      className="group w-[180px] h-[265px] bg-[#f6f6f6] border border-[#e1e1e1] rounded-[16px] overflow-hidden relative transition-all duration-200 hover:scale-[1.03] hover:shadow-lg cursor-pointer"
    >
      <div className="w-[100%] h-[180px] relative">
        <img
          src={resolveAvatar(avatar)}
          alt={head}
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Untitled.png"; }}
          className="w-[100%] h-[100%] rounded-[5px] border-b-[1px] object-cover"
        />
        <span
          title={status}
          className={`absolute bottom-[10px] left-[10px] w-[10px] h-[10px] rounded-full border-[2px] border-white ${dotColor}`}
        />
        {isCurrentUser && (
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(e); }}
            className="absolute top-[10px] right-[10px] flex items-center gap-[6px] px-[10px] py-[4px] bg-[#ffffff] border-[1px] rounded-[10px] hover:bg-[#f3f4f6] shadow-sm transition-colors"
          >
            <span className="text-[12px] text-[#313131]"><FiEdit2 size={12} /></span>
            <span className="text-[12px] font-[600] text-[#313131]">Edit</span>
          </button>
        )}
      </div>
      <div className="px-[16px] py-[12px]">
        <div className="text-[14px] font-[600] text-[#313131] truncate">{head}</div>
        <div className="text-[12px] text-[#9ca3af] truncate">{text}</div>
        {isCurrentUser && (
          <div className="mt-[4px] text-[11px] font-[500] text-[#1264a3]">{"That's you"}</div>
        )}
      </div>
    </div>
  );
}
