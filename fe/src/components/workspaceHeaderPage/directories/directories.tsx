"use client";
import { useState } from "react";
import { tabs } from "./domi";
import DirectoriesPeople from "./DirectoriesPeople";
import DirectoriesChannel from "./DirectoriesChannels";
import DirectoriesExternal from "./DirectoriesExternal";
import DirectoriesInvitation from "./DirectoriesInvitation";
import DirectoriesUserGroup from "./DirectoriesUserGroups";
import ChannelNavTabvar from "../component/channel_nav_tabvar";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useWorkspace } from "@/context/Workspacecontext";

export default function Directories() {
    const [page, setPage] = useState("people");

    const urlWorkspaceId = useWorkspaceId();
    const { workspace } = useWorkspace();
    const workspaceId = urlWorkspaceId ?? workspace?.id;

    return (
        <div className="flex flex-1 min-w-0 bg-[#ffffff] text-[#313131] overflow-hidden rounded-tr-[5px] rounded-br-[5px]">
            <div className="flex flex-col w-full h-full min-h-0 overflow-hidden">

                {/* HEADER */}
                <div className="flex items-center justify-between 
                    h-[49px] px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 border-[#e1e1e1]">
                    <span className="text-[#313131] font-bold font-400">Directories</span>
                </div>

                {/* CONTENT */}
                <div className="flex flex-col w-full h-full min-h-full">

                    {/* TABS */}
                    <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
                        <ChannelNavTabvar
                            setPage={setPage}
                            tabs={tabs}
                            px=""
                        />
                    </div>

                    {/* PAGE */}
                    <div className="flex-1 min-h-0">

                        {page === "people" && <DirectoriesPeople workspaceId={workspaceId} />}
                        {page === "Channels" && <DirectoriesChannel />}
                        {page === "External" && <DirectoriesExternal />}
                        {page === "Invitation" && <DirectoriesInvitation />}
                        {page === "User Groups" && <DirectoriesUserGroup />}

                    </div>
                </div>
            </div>
        </div>
    );
}