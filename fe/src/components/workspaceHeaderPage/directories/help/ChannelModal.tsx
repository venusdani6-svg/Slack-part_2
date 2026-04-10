"use client";

import { useState } from "react";
import { FaBell, FaChevronDown, FaStar } from "react-icons/fa";
import { FiHeadphones } from "react-icons/fi";

import ChannelNavTabvar from "../../component/channel_nav_tabvar";
import FileSearch from "../../component/file_search";
import DirectoriesDropdownBtn from "../DirectoriesDropdownBtn";

export default function ChannelMembersModalPage() {
    const [page, setPage] = useState("Members");
    const [search, setSearch] = useState("");

    const members = [
        { name: "Alex", username: "alex", avatar: "/Untitled.png" },
        { name: "alex20021009", username: "alex20021009", avatar: "/Untitled.png" },
        { name: "Ari", username: "Aurora Kingsley", avatar: "/Untitled.png" },
        { name: "boko-punchi", username: "punchi0928", avatar: "/Untitled.png" },
        {
            name: "Dani",
            username: "Venus Dani",
            avatar: "/Untitled.png",
            role: "Channel Manager",
        },
        { name: "gemicob gelorich", username: "gemicob gelorich", avatar: "/Untitled.png" },
        { name: "kossza1030", username: "kossza1030", avatar: "/Untitled.png" },
    ];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40">
            <div className="w-[500px] h-[720px] bg-white rounded-[8px] shadow-xl flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="px-[20px] pt-[16px] pb-[12px] border-b border-[#a1a1a1]">

                    {/* Title Row */}
                    <div className="flex items-center justify-between">
                        <span className="text-[18px] font-semibold text-[#1d1c1d]">
                            # new-channel
                        </span>

                        <button className="w-[28px] h-[28px] flex items-center justify-center rounded hover:bg-[#f1f1f1] transition">
                            ✕
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-[8px] mt-[10px]">

                        {/* Star (RESTORED) */}
                        <button className="flex gap-2 items-center px-2 justify-center w-[40] h-[28px] border border-[#a1a1a1] rounded-[6px] text-[#1d1c1d] hover:bg-[#f8f8f8] transition">
                            <FaStar size={14} />
                            <FaChevronDown size={10} />
                        </button>

                        {/* Notifications */}
                        <button className="flex items-center gap-[6px] px-[10px] h-[28px] border border-[#a1a1a1] rounded-[6px] text-[13px] text-[#1d1c1d] hover:bg-[#f8f8f8] transition">
                            <FaBell size={12} />
                            <span>All new posts</span>
                            <FaChevronDown size={10} />
                        </button>

                        {/* Huddle */}
                        <button className="flex items-center gap-[6px] px-[10px] h-[28px] border border-[#a1a1a1] rounded-[6px] text-[13px] text-[#1d1c1d] hover:bg-[#f8f8f8] transition">
                            <FiHeadphones size={14} />
                            <span>Huddle</span>
                        </button>

                    </div>
                </div>

                {/* TABS */}
                <ChannelNavTabvar
                    px="0px"
                    tabs={[
                        { label: "About" },
                        { label: "Members" },
                        { label: "Tabs" },
                        { label: "Integrations" },
                        { label: "Settings" },
                    ]}
                    setPage={setPage}
                />

                {/* TOOLBAR */}
                <div className="flex items-center gap-[12px] px-[20px] py-[10px] border-b border-[#a1a1a1]">

                    <div className="flex-1">
                        <FileSearch
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Find members"
                        />
                    </div>

                    <DirectoriesDropdownBtn>
                        <DirectoriesDropdownBtn.Trigger placeholder="Everyone" />
                        <DirectoriesDropdownBtn.Content>
                            <DirectoriesDropdownBtn.Radio label="Everyone" />
                            <DirectoriesDropdownBtn.Radio label="Admins" />
                        </DirectoriesDropdownBtn.Content>
                    </DirectoriesDropdownBtn>

                </div>

                {/* MEMBER LIST */}
                <div className="flex-1 overflow-y-auto">
                    {members.map((m, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between px-[20px] py-[8px] hover:bg-[#f8f8f8] transition"
                        >

                            {/* LEFT */}
                            <div className="flex items-center gap-[10px]">
                                <img
                                    src={m.avatar}
                                    alt={m.name}
                                    className="w-[32px] h-[32px] rounded-[6px] object-cover bg-gray-200"
                                />

                                <div className="flex flex-col leading-tight">
                                    <span className="text-[14px] text-[#1d1c1d] font-medium">
                                        {m.name}
                                    </span>
                                    <span className="text-[13px] text-[#6f6f6f]">
                                        {m.username}
                                    </span>
                                </div>
                            </div>

                            {/* RIGHT */}
                            {m.role && (
                                <span className="text-[12px] px-[8px] py-[2px] bg-[#e8f5e9] text-[#1d7f3f] rounded-[12px] font-medium">
                                    {m.role}
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}