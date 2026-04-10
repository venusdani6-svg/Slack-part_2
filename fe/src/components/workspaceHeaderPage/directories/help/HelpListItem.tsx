"use client";

import { IconType } from "react-icons";

type Props = {
  icon: IconType;
  image:string;
  label: string;
};

export default function HelpListItem({ icon: Icon,image, label }: Props) {
  return (
    <div className="flex items-center gap-[12px] border border-[#ddd] rounded-[8px] px-[12px] py-[10px] bg-white hover:bg-[#f8f8f8] cursor-pointer">
      
      {/* ICON */}
      <div className="w-[28px] h-[28px] rounded-[6px] p-[4px] bg-[#f1f1f1] flex items-center justify-center">
        {image?<img src={image} className="w-full h-full" alt=""/>:<Icon size={14} className="text-[#1d1c1d]" />}
      </div>

      {/* TEXT */}
      <div className="text-[13px] text-[#1d1c1d] font-medium">
        {label}
      </div>
    </div>
  );
}