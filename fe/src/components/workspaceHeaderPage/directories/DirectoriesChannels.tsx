/* eslint-disable react-hooks/exhaustive-deps */
 
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import { Channel } from "./domi";
import { FiLock } from "react-icons/fi";
import DirectoriesChannelsItem from "./DirectoriesChannelsItem";
import BannerSection from "./BannerSection";
import { useEffect, useState, useCallback, useMemo, Key } from "react";
import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { IconType } from "react-icons";
export default function DirectoriesChannel() {
          const { socket } = useSocket();
  const [channels, setChannels] = useState<any[]>([]);

  const workspaceId = useWorkspaceId();
  const { user } = useAuth();
  const userId = user?.id;

    const normalizeChannel = (ch: any) => ({
    id: ch.id,
    title: ch.name,
    label: ch.name,
    comment: ch.channelType,
    members: ch.members?.length || 0,
    joined: ch.members?.some((m: any) => m.id === userId),
  });
   useEffect(() => {
      if (!socket || !workspaceId || !userId) return;
  
    //   setLoading(true);
    if (!socket.connected) socket.connect();
      // JOIN ROOM
      socket.emit("join_workspace", { workspaceId });
  
      // REQUEST CHANNEL LIST with userId for proper filtering
      socket.emit("channel:list", { workspaceId, userId });
  
      // LISTENER: LIST
      const handleList = (data: any[]) => {
        setChannels(data.map(normalizeChannel));
        // setLoading(false);
      };
  
      // LISTENER: CREATE — immediately add new channel to state
      const handleCreated = (newChannel: any) => {
        const normalized = normalizeChannel(newChannel);

        setChannels((prev) =>
        prev.find((c) => c.id === normalized.id)
          ? prev
          : [...prev, normalized]
      );
    };
  
      // LISTENER: DELETE
      const handleDeleted = ({ channelId }: { channelId: string }) => {
        setChannels((prev) =>
          prev.filter((c) => c.id !== channelId)
        );
      };
  
      // LISTENER: UPDATE
      const handleUpdated = (updatedChannel: any) => {
        const normalized = normalizeChannel(updatedChannel);

      setChannels((prev) =>
        prev.map((c) => (c.id === normalized.id ? normalized : c))
      );
    };
  
      socket.on("channel:list", handleList);
      socket.on("channel:created", handleCreated);
      socket.on("channel:deleted", handleDeleted);
      socket.on("channel:updated", handleUpdated);
  
      // ✅ CLEANUP (VERY IMPORTANT)
      return () => {
        socket.off("channel:list", handleList);
        socket.off("channel:created", handleCreated);
        socket.off("channel:deleted", handleDeleted);
        socket.off("channel:updated", handleUpdated);
      };
    }, [socket, workspaceId, userId]); // ✅ FIXED: Added userId
  

    const [search, setSearch] = useState("");

    const filteredData = useMemo(() => {
        const q = search.toLowerCase();

        return channels.filter((item) => {
            return Object.entries(item).some(([key, val]) => {
                let searchable = String(val).toLowerCase();
                if (key === "joined") {
                    searchable = val ? "joined true" : "not joined false";
                }
                return `${key} ${searchable}`.includes(q);
            });
        });
    }, [search, channels]);
    return (
        <div className="w-full h-full overflow-y-scroll">
            <div className="w-full px-[250px]  flex justify-between items-end mb-[20px]">
                <div className="w-[667px]">
                    <FileSearch
                        value={search}
                        placeholder="Search for people"
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <CustomButton
                    label="Create Channel"
                    showIcon={false}
                    bgColor="bg-transparent"
                    hoverColor="hover:bg-[#e1e1e1]"
                    activeColor="active:bg-[#c1c1c1]"
                    textColor="text-[#313131]"
                    height="h-[32px]"
                    paddingX="px-[12px]"
                    radius="rounded-[6px]"
                    suffix={
                        <span className="text-[10px] px-[4px] py-[1px] rounded-[4px] bg-[#2a2d31] text-[#313131] ml-[6px]">
                            PRO
                        </span>
                    }
                />
             
            </div>
            <BannerSection />
            <div className="h-[calc(100vh-250px)] flex flex-col items-center min-h-[60vh] sidebar-scroll">
                <div className="w-[100%] px-[250px] mb-[20px] border-[#e1e1e1] flex items-center justify-between">
                    <div className="flex items-center gap-[8px]">
                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="All channels" />
                            <DirectoriesDropdownBtn.Content>
                                {Channel.Allchannels.map((item, i) => (
                                    <DirectoriesDropdownBtn.Radio key={i} label={item.label} />
                                ))}
                            </DirectoriesDropdownBtn.Content>
                        </DirectoriesDropdownBtn>

                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="Any channel type" />
                            <DirectoriesDropdownBtn.Content>
                                {Channel.anychanneltype.map((item, i) => (
                                    <DirectoriesDropdownBtn.Radio
                                        key={i}
                                        label={item.label}
                                        icon={item.icon}
                                    />
                                ))}
                            </DirectoriesDropdownBtn.Content>
                        </DirectoriesDropdownBtn>

                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="Workspaces" />
                            <DirectoriesDropdownBtn.Content>
                                <DirectoriesDropdownBtn.Search placeholder="Search..." />
                                <DirectoriesDropdownBtn.Radio label="Workspaces" />
                            </DirectoriesDropdownBtn.Content>
                        </DirectoriesDropdownBtn>

                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="Organization" />
                            <DirectoriesDropdownBtn.Content>
                                <DirectoriesDropdownBtn.Search placeholder="Search..." />
                            </DirectoriesDropdownBtn.Content>
                        </DirectoriesDropdownBtn>

                        <div className="flex items-center gap-[6px] ml-[8px] text-[#313131] text-[14px] font-[500] cursor-pointer">
                            <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-[#38bdf8]">
                                <path d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z" />
                            </svg>
                            <span>Filters</span>
                        </div>
                    </div>

                    <DirectoriesDropdownBtn>
                        <DirectoriesDropdownBtn.Trigger placeholder="Most recommended" />
                        <DirectoriesDropdownBtn.Content>
                            {Channel.Mostrecommended.map((item, i) => (
                                <DirectoriesDropdownBtn.Radio key={i} label={item.label} />
                            ))}
                        </DirectoriesDropdownBtn.Content>
                    </DirectoriesDropdownBtn>
                </div>

                <div className="max-w-[100%]   w-[calc(100vw-950px)] overflow-hidden border-[1px] rounded-[15px]">
                    {filteredData.map((item, i) => (
                        <DirectoriesChannelsItem
                            key={i}
                            icon={FiLock}
                            title={item.title}
                            comment={item.comment}
                            members={item.members}
                            joined={item.joined}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}