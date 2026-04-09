//DirectoriesChannels.tsx

/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import { Channel } from "./domi";
import { FiLock } from "react-icons/fi";
import DirectoriesChannelsItem from "./DirectoriesChannelsItem";
import BannerSection from "./BannerSection";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function DirectoriesChannel() {
    const { socket } = useSocket();
    const { user } = useAuth();
    const workspaceId = useWorkspaceId();

    const userId = user?.id;

    const [channels, setChannels] = useState<any[]>([]);
    const [search, setSearch] = useState("");

    const [channelFilter, setChannelFilter] = useState<"all" | "joined" | "not_joined">("all");
    const [typeFilter, setTypeFilter] = useState<"all" | "public" | "private">("all");
    const [sortType, setSortType] = useState<"recommended" | "az" | "za" | "members_desc" | "members_asc">("recommended");

    // ✅ NORMALIZER
    const normalizeChannel = useCallback(
        (ch: any) => ({
            id: ch.id,
            title: ch.name,
            comment: ch.channelType,
            members: ch.members?.length || 0,
            joined: ch.members?.some((m: any) => m.id === userId),
        }),
        [userId]
    );

    // ✅ SOCKET EFFECT
    useEffect(() => {
        if (!socket || !workspaceId || !userId) return;

        socket.emit("join_workspace", { workspaceId });
        socket.emit("channel:list", { workspaceId, userId });

        const handleList = (data: any[]) =>
            setChannels(data.map(normalizeChannel));

        const handleCreated = (ch: any) =>
            setChannels((prev) =>
                prev.some((c) => c.id === ch.id)
                    ? prev
                    : [...prev, normalizeChannel(ch)]
            );

        const handleDeleted = ({ channelId }: any) =>
            setChannels((prev) => prev.filter((c) => c.id !== channelId));

        const handleUpdated = (ch: any) =>
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === ch.id ? normalizeChannel(ch) : c
                )
            );

        socket.on("channel:list", handleList);
        socket.on("channel:created", handleCreated);
        socket.on("channel:deleted", handleDeleted);
        socket.on("channel:updated", handleUpdated);

        return () => {
            socket.off("channel:list", handleList);
            socket.off("channel:created", handleCreated);
            socket.off("channel:deleted", handleDeleted);
            socket.off("channel:updated", handleUpdated);
        };
    }, [socket, workspaceId, userId, normalizeChannel]);

    // ✅ FILTER CONFIG (NO MORE if-else)
    const filterMap = {
        joined: (c: any) => c.joined,
        not_joined: (c: any) => !c.joined,
    };

    const typeMap = {
        public: (c: any) => c.comment === "public",
        private: (c: any) => c.comment === "private",
    };

    const sortMap = {
        az: (a: any, b: any) => a.title.localeCompare(b.title),
        za: (a: any, b: any) => b.title.localeCompare(a.title),
        members_desc: (a: any, b: any) => b.members - a.members,
        members_asc: (a: any, b: any) => a.members - b.members,
    };

    // ✅ FINAL DATA PIPELINE
    const filteredData = useMemo(() => {
        let result = [...channels];

        // search
        if (search) {
            const q = search.toLowerCase();
            result = result.filter((c) =>
                c.title.toLowerCase().includes(q)
            );
        }

        // membership filter
        if (channelFilter !== "all") {
            result = result.filter(filterMap[channelFilter]);
        }

        // type filter
        if (typeFilter !== "all") {
            result = result.filter(typeMap[typeFilter]);
        }

        // sorting
        if (sortType !== "recommended") {
            result.sort(sortMap[sortType]);
        }

        return result;
    }, [channels, search, channelFilter, typeFilter, sortType]);

    return (
        <div className="w-full h-full overflow-y-scroll">
            {/* TOP */}
            <div className="w-full px-[250px] flex justify-between mb-[20px]">
                <FileSearch
                    value={search}
                    placeholder="Search channels"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="mt-[21px] ml-[5px]">
                    <CustomButton label="Create Channel"
                        showIcon={false}
                        width="w-auto"
                        height="h-[40px]"
                        paddingX="px-[16px]"
                        bgColor="bg-transparent"
                        hoverColor="hover:bg-[#e1e1e1]"
                        activeColor="active:bg-[#c1c11]"
                        textColor="text-[#white]" />
                </div>
            </div>

            <BannerSection />

            {/* FILTERS */}
            <div className="px-[250px] flex justify-between mb-[20px]">
                <div className="flex gap-[8px]">

                    {/* CHANNEL FILTER */}
                    <DirectoriesDropdownBtn>
                        <DirectoriesDropdownBtn.Trigger placeholder="All channels" />
                        <DirectoriesDropdownBtn.Content>
                            {Channel.Allchannels.map((item, i) => (
                                <DirectoriesDropdownBtn.Radio
                                    key={i}
                                    label={item.label}
                                    onClick={() =>
                                        setChannelFilter(
                                            item.label === "My channels"
                                                ? "joined"
                                                : item.label === "Other channels"
                                                    ? "not_joined"
                                                    : "all"
                                        )
                                    }
                                />
                            ))}
                        </DirectoriesDropdownBtn.Content>
                    </DirectoriesDropdownBtn>

                    {/* TYPE FILTER */}
                    <DirectoriesDropdownBtn>
                        <DirectoriesDropdownBtn.Trigger placeholder="Any type" />
                        <DirectoriesDropdownBtn.Content>
                            {Channel.anychanneltype.map((item, i) => (
                                <DirectoriesDropdownBtn.Radio
                                    key={i}
                                    label={item.label}
                                    icon={item.icon}
                                    onClick={() =>
                                        setTypeFilter(
                                            item.label === "public"
                                                ? "public"
                                                : item.label === "Private"
                                                    ? "private"
                                                    : "all"
                                        )
                                    }
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

                {/* SORT */}
                <DirectoriesDropdownBtn>
                    <DirectoriesDropdownBtn.Trigger placeholder="Sort" />
                    <DirectoriesDropdownBtn.Content>
                        {Channel.Mostrecommended.map((item, i) => (
                            <DirectoriesDropdownBtn.Radio
                                key={i}
                                label={item.label}
                                onClick={() =>
                                    setSortType(
                                        item.label === "A to Z"
                                            ? "az"
                                            : item.label === "Z to A"
                                                ? "za"
                                                : item.label === "Most members"
                                                    ? "members_desc"
                                                    : item.label === "Fewest member"
                                                        ? "members_asc"
                                                        : "recommended"
                                    )
                                }
                            />
                        ))}
                    </DirectoriesDropdownBtn.Content>
                </DirectoriesDropdownBtn>
            </div>

            {/* LIST */}
            <div className="w-full px-[250px]">
                <div className="w-full max-h-[60vh] min-h-[100px] overflow-y-auto">
                    {filteredData.map((item) => (
                        <DirectoriesChannelsItem
                            key={item.id}
                            id={item.id}
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