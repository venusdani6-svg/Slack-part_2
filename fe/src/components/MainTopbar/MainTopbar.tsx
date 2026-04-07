"use client"

import { ChevronDown } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BsPerson, BsThreeDotsVertical } from "react-icons/bs";
import { CiHeadphones } from "react-icons/ci";
import { FiSearch } from "react-icons/fi";
import { LuBell } from "react-icons/lu";
import { api } from "@/api";
import { Tooltip } from "./Tooltip";
import Starred from "./Starred";
import { useSocket } from "@/providers/SocketProvider";

interface ChannelDetail {
  id: string;
  name: string;
  channelType: 'public' | 'private';
  members: { id: string; dispname: string; email: string; avatar?: string }[];
}

export default function MainTopBar() {
  const params = useParams();
  const channelId = Array.isArray(params.channelId)
    ? params.channelId[0]
    : params.channelId;

  const [channel, setChannel] = useState<ChannelDetail | null>(null);
  const [memberCount, setMemberCount] = useState<number>(0);
  const { socket } = useSocket();

  useEffect(() => {
    if (!channelId) {
      setChannel(null);
      return;
    }
    api
      .get<ChannelDetail>(`/api/channels/${channelId}`)
      .then((res) => setChannel(res.data))
      .catch(() => setChannel(null));
  }, [channelId]);

  useEffect(() => {
    api
      .get<{ count: number }>('/api/user/count')
      .then((res) => setMemberCount(res.data.count))
      .catch(() => setMemberCount(0));
  }, []);

  // Task 9.3 — real-time member list updates via channel:updated
  useEffect(() => {
    if (!socket || !channelId) return;
    const handler = (updated: ChannelDetail) => {
      if (updated.id === channelId) setChannel(updated);
    };
    socket.on('channel:updated', handler);
    return () => { socket.off('channel:updated', handler); };
  }, [socket, channelId]);

  const activeChannel = channel?.name ?? "";
  const isPrivate = channel?.channelType === 'private';
  const members = channel?.members ?? [];
  const visibleMembers = members.slice(0, 5);
  const extraCount = members.length - visibleMembers.length;

  return (
    <div className="flex justify-between items-center h-[49px] px-4 py-2 ">

      {/* LEFT */}
      <div className="flex items-center gap-2">
        <Starred />
        <Tooltip
          children={
            <span className="font-semibold text-x text-gray-700 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded">
              #{activeChannel}
            </span>
          }
          text1="Get channel details"
        />
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-2">

        {/* Private channel member avatars row */}
        {isPrivate && members.length > 0 && (
          <div className="flex items-center">
            <div className="flex -space-x-1">
              {visibleMembers.map((m) => (
                <Tooltip key={m.id} text1={m.dispname} children={
                  <div className="w-6 h-6 rounded-full bg-black border-2 border-white flex items-center justify-center overflow-hidden shrink-0">
                    {m.avatar ? (
                      <img src={m.avatar} alt={m.dispname} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-white text-[10px] font-semibold leading-none">
                        {m.dispname.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                } />
              ))}
            </div>
            {extraCount > 0 && (
              <span className="ml-1 text-xs text-gray-500">+{extraCount} more</span>
            )}
          </div>
        )}

        {/* Members count */}
        <Tooltip
          children={
            <button className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded cursor-pointer hover:bg-gray-100">
              <BsPerson color="#5d524c" size={20} />
              <span className="text-sm text-[#5d524c]">
                {isPrivate ? members.length : memberCount}
              </span>
            </button>
          }
          text1="View all members of this channel"
        />

        {/* Huddle */}
        <div className="flex items-center border border-gray-300 rounded-md bg-white transition">
          <Tooltip
            children={
              <button className="flex items-center gap-1 p-1 text-sm hover:bg-gray-200 cursor-pointer">
                <CiHeadphones color="#5d524c" size={20} className="text-[15px]" />
                <span className="text-[#5d524c]">Huddle</span>
              </button>
            }
            text1={`Start Huddle in #${activeChannel}`}
            shortcut={["Ctrl", "Alt", "Shift", "H"]}
          />

          {/* Divider */}
          <div className="w-px h-5 bg-gray-300" />

          {/* Dropdown */}
          <Tooltip
            children={
              <button className="p-1.5 hover:bg-gray-200 cursor-pointer">
                <ChevronDown color="#5d524c" size={15} />
              </button>
            }
            text1="More Huddles options"
          />
        </div>

        {/* Bell */}
        <Tooltip
          children={
            <button className="p-1 border border-gray-300 rounded-md hover:bg-gray-200 cursor-pointer">
              <LuBell color="#5d524c" size={20} />
            </button>
          }
          text1="Edit notifications"
          text2="Current: All new posts"
        />

        {/* Search */}
        <Tooltip
          children={
            <button className="p-1 border border-gray-300 rounded-md hover:bg-gray-100 cursor-pointer">
              <FiSearch color="#5d524c" size={20} />
            </button>
          }
          text1="Search in channel(Ctrl+F)"
        />

        {/* More */}
        <Tooltip
          children={
            <button className="p-2 border border-white rounded-md hover:bg-gray-100 cursor-pointer">
              <BsThreeDotsVertical color="#5d524c" size={20} />
            </button>
          }
          text1="More actions"
        />

      </div>
    </div>
  );
}
