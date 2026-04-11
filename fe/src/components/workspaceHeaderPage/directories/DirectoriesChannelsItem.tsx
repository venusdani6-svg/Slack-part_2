//DirectoriesChannelsItem.tsx

/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { IconType } from "react-icons";
import { useState } from "react";
import CustomButton from "../component/channel_button";
import { FiHash } from "react-icons/fi";
import { FaLock } from "react-icons/fa";
import { useRouter, useParams } from "next/navigation";

type ChannelsItemProps = {
  title?: string;
  comment?: string;
  active?: boolean;
  icon?: IconType;
  members?: number;
  id: string;
  joined?: boolean;
  onClick?: () => void;
  memberCount:number;
};

export default function DirectoriesChannelsItem({
  title, comment, members, active, icon: Icon, memberCount, joined, onClick, id,
}: ChannelsItemProps) {
  const [hovered, setHovered] = useState(false);
  const params = useParams();
  // const workspaceID = params('workspaceId')
  const workspaceID = Array.isArray(params.workspaceId)
    ? params.workspaceId[0]
    : params.workspaceId;
  const router = useRouter();
  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {

      router.push(`/${workspaceID}/${id}`); // ✅ navigation  
      location.reload();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="w-full h-[72px] flex items-center relative px-[16px] transition-all duration-[120ms] cursor-pointer border-b border-r border-l border-[#e1e1e1] hover:bg-[#f8f8f8]">
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="flex items-center gap-[10px]">
            {comment === "public" ? <FiHash size={12} className="text-black" /> : <FaLock size={12} className="text-black" />}
            <div className="flex flex-col justify-center">
              <div className="text-[#313131] text-[14px] font-[500]">
                <span className="text-[18px] font-bold mr-[15px]">{title}</span>
                {hovered && "view channel"}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[100%] h-[40%]">
          <div className="text-[#9ca3af] mt-[20px] text-[12px]">
            {joined && <span className="text-[green]">√ Joined · </span>}
            {comment==="private" ? members : memberCount}
            {comment && comment}
          </div>
        </div>
      </div>

      <div className="flex absolute right-[10px] items-center gap-[12px] flex-wrap">
        {hovered && (
          <div className="flex items-center gap-[8px]">
            <CustomButton label="Open in Home" showIcon={false} bgColor="bg-transparent" hoverColor="hover:bg-[#e1e1e1]" activeColor="active:bg-[#a1a1a1]" textColor="text-[#313131]" paddingX="px-[12px]" height="h-[32px]" radius="rounded-[6px]" />
            <CustomButton label="Join" showIcon={false} bgColor="bg-transparent" hoverColor="hover:bg-[#e1e1e1]" activeColor="active:bg-[#a1a1a1]" textColor="text-[#313131]" paddingX="px-[12px]" height="h-[32px]" radius="rounded-[6px]" />
          </div>
        )}
      </div>
    </div>
  );
}
