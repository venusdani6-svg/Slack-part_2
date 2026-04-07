"use client";

import { FiEdit2 } from "react-icons/fi";

type Props = {
  head: string;
  text: string;
  avatar: string;
  onEdit?: () => void;
};

export default function Card({ head, text, avatar, onEdit }: Props) {
  return (
    <div className="group w-[180px] h-[265px] bg-[#f6f6f6] border border-[#e1e1e1] rounded-[16px] overflow-hidden relative transition-all duration-200 hover:scale-[1.03] hover:shadow-lg">
      <div className="w-[100%] h-[180px] relative">
        <img
          src={`http://localhost:5050${avatar}` || "/Untitled.png"}
          alt="user"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Untitled.png"; }}
          className="w-[100%] h-[100%] rounded-[5px] border-b-[1px] object-cover"
        />
        {/* Edit button — visible on hover */}
        <div className="absolute top-[10px] right-[10px]">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
            className="flex items-center gap-[6px] px-[10px] py-[4px] bg-[#ffffff] border-[1px] rounded-[10px] opacity-0 group-hover:opacity-100 transition-opacity duration-150 hover:bg-[#f3f4f6] shadow-sm"
          >
            <span className="text-[12px] p-[5px] text-[#313131]"><FiEdit2 size={12} /></span>
            <span className="text-[12px] font-[600] text-[#313131]">Edit</span>
          </button>
        </div>
      </div>
      <div className="px-[16px] py-[12px]">
        <div className="text-[14px] font-[600] text-[#313131]">{head}</div>
        <div className="text-[12px] text-[#9ca3af]">{text}</div>
      </div>
    </div>
  );
}
