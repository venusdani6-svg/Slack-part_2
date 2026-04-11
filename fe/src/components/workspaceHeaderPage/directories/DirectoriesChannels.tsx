/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useParams } from "next/navigation";
import { FiLock } from "react-icons/fi";

import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import DirectoriesChannelsItem from "./DirectoriesChannelsItem";
import BannerSection from "./BannerSection";
import { Channel } from "./domi";

import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import CreateChannelModal from "@/components/ui/modal/CreateChannelModal";
import { api } from "@/api";

/* ================= TYPES ================= */

interface Member {
    id: string;
    dispname: string;
    email: string;
    avatar?: string;
}

interface ChannelDetail {
    id: string;
    name: string;
    channelType: "public" | "private";
    members: Member[];
}

interface ChannelItem {
    id: string;
    title: string;
    comment: "public" | "private";
    members: Member[]; // ✅ now array
    joined: boolean;
}

/* ================= COMPONENT ================= */

export default function DirectoriesChannel() {
    const { socket } = useSocket();
    const { user } = useAuth();
    const workspaceId = useWorkspaceId();
    const listRef = useRef<HTMLDivElement>(null);

    const userId = user?.id;
    const [memberCount, setMemberCount] = useState(0);
    const [channels, setChannels] = useState<any[]>([]);

    const [search, setSearch] = useState("");

    const [channelFilter, setChannelFilter] =
        useState<"all" | "joined" | "not_joined">("all");

    const [typeFilter, setTypeFilter] =
        useState<"all" | "public" | "private">("all");

    const [sortType, setSortType] =
        useState<"recommended" | "az" | "za" | "members_desc" | "members_asc">(
            "recommended"
        );

    const [open, setOpen] = useState(false);

    /* ================= HELPERS ================= */

    const normalizeChannel = useCallback(
        (ch: any) => ({
            id: ch.id,
            title: ch.name,
            label: ch.name,
            comment: ch.channelType,
            members: ch.members?.length || 0,
            joined: ch.members.some((m: any) => m.id === userId) ?? true,
        }),
        [userId, socket]
    );


    useEffect(() => {
        let active = true;

        api.get<{ count: number }>("/api/user/count")
            .then((res) => active && setMemberCount(res.data.count))
            .catch(() => active && setMemberCount(0));

        return () => { active = false; };
    }, []);

    /* ================= SOCKET ================= */


    useEffect(() => {
        if (!socket || !workspaceId || !userId) return;

        socket.emit("join_workspace", { workspaceId });
        socket.emit("channel:list", { workspaceId, userId });

        const onList = (data: any[]) =>
            setChannels(data.map(normalizeChannel));

        const onCreate = (ch: any) =>
            setChannels((prev) =>
                prev.some((c) => c.id === ch.id)
                    ? prev
                    : [...prev, normalizeChannel(ch)]
            );

        const onDelete = ({ channelId }: { channelId: string }) =>
            setChannels((prev) => prev.filter((c) => c.id !== channelId));

        const onUpdate = (ch: any) =>
            setChannels((prev) =>
                prev.map((c) =>
                    c.id === ch.id ? normalizeChannel(ch) : c
                )
            );

        socket.on("channel:list", onList);
        socket.on("channel:created", onCreate);
        socket.on("channel:deleted", onDelete);
        socket.on("channel:updated", onUpdate);

        return () => {
            socket.off("channel:list", onList);
            socket.off("channel:created", onCreate);
            socket.off("channel:deleted", onDelete);
            socket.off("channel:updated", onUpdate);
        };
    }, [socket, workspaceId, userId, normalizeChannel]);

    /* ================= AUTO SCROLL ================= */

    const prevLength = useRef(0);

    useEffect(() => {
        if (listRef.current && channels.length > prevLength.current) {
            listRef.current.scrollTop = listRef.current.scrollHeight;
        }
        prevLength.current = channels.length;
    }, [channels]);

    /* ================= FILTERING ================= */

    const filteredData = useMemo(() => {
        let data = [...channels];
        if (search) {
            const q = search.toLowerCase();
            data = data.filter((c) => c.title.toLowerCase().includes(q));
        }

        if (channelFilter !== "all") {
            data = data.filter((c) =>
                channelFilter === "joined" ? c.joined : !c.joined
            );
        }

        if (typeFilter !== "all") {
            data = data.filter((c) => c.comment === typeFilter);
        }

        if (sortType === "az") data.sort((a, b) => a.title.localeCompare(b.title));
        if (sortType === "za") data.sort((a, b) => b.title.localeCompare(a.title));
        if (sortType === "members_desc") data.sort((a, b) => b.members.length - a.members.length);
        if (sortType === "members_asc") data.sort((a, b) => a.members.length - b.members.length);

        return data;
    }, [channels, search, channelFilter, typeFilter, sortType]);

    /* ================= UI STATE ================= */

    const handleOpenModal = useCallback(() => setOpen(true), []);
    const handleCloseModal = useCallback(() => setOpen(false), []);

    /* ================= RETURN ================= */

    return (
        <div className="w-full h-full flex flex-col flex-1 min-h-0 ">
            {/* TOP */}
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 
                flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-[12px]">
                <FileSearch
                    value={search}
                    placeholder="Search channels"
                    onChange={(e) => setSearch(e.target.value)}
                />

                <div className="mt-2 sm:mt-[21px]">
                    <CustomButton
                        label="Create Channel"
                        showIcon={false}
                        width="w-auto"
                        height="h-[40px]"
                        paddingX="px-[16px]"
                        bgColor="bg-transparent"
                        hoverColor="hover:bg-[#e1e1e1]"
                        activeColor="active:bg-[#c1c11]"
                        textColor="text-[#313131]"
                        onClick={handleOpenModal}
                    />
                </div>
            </div>
            <div className="h-[calc(100vh-150px)] flex flex-col items-center min-h-[60vh] overflow-y-scroll overflow-x-hidden sidebar-scroll">
                {/* BANNER */}
                <div className="w-full">
                    <BannerSection handleOpenModal={handleOpenModal} />
                </div>

                {/* FILTERS */}
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 
                flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between mb-[12px]">
                    <div className="flex flex-wrap gap-[8px] ">
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

                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="Any channel type" />
                            <DirectoriesDropdownBtn.Content>
                                {Channel.anychanneltype.map((item, i) => (
                                    <DirectoriesDropdownBtn.Radio
                                        key={i}
                                        label={item.label}
                                        icon={item.icon}
                                        onClick={() =>
                                            setTypeFilter(
                                                item.label.toLowerCase() === "public"
                                                    ? "public"
                                                    : item.label.toLowerCase() === "private"
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
                            <span className="text-[#1d9bd1] font-400">Filters</span>
                        </div>
                    </div>

                    {/* SORT */}
                    <div className="flex justify-start lg:justify-end">
                        <DirectoriesDropdownBtn>
                            <DirectoriesDropdownBtn.Trigger placeholder="Most recommended" />
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
                </div>

                {/* LIST */}
                <div className="w-full  px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 flex-1 min-h-0 flex flex-col">

                    <div
                        ref={listRef}
                        className="w-full flex-1 min-h-[300px] py-[10px] border-t border-[#e1e1e1] rounded-[12px]"
                    >
                        {filteredData.map((item) => (
                            <DirectoriesChannelsItem
                                key={item.id}
                                id={item.id}
                                icon={item.comment === "public" ? FiLock : FiLock}
                                title={item.title}
                                comment={item.comment}
                                members={item.members}
                                joined={item.joined}
                                memberCount={memberCount}
                            />
                        ))}
                    </div>

                </div>

                {workspaceId && userId && (
                    <CreateChannelModal
                        isOpen={open}
                        onClose={handleCloseModal}
                        workspaceId={workspaceId}
                        userId={userId}
                    />
                )}
            </div>
        </div>
    );
}