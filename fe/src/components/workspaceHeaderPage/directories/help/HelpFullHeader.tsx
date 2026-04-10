"use client";

import { FaGift, FaKeyboard } from "react-icons/fa";


export default function HelpFullHeader() {
  return (
    <div className="flex items-center justify-between px-[20px] py-[12px] border-b border-[#ddd] bg-white">
      <span className="text-[14px] font-semibold text-[#1d1c1d]">
        Help
      </span>

      <div className="flex items-center gap-[12px] text-[#616061]">
        <button className="hover:text-[#1d1c1d]"><FaKeyboard size={14} color="#313131"/> </button>
        <button className="hover:text-[#1d1c1d]"><FaGift size={14} color="#313131"/></button>
        
      </div>
    </div>
  );
}