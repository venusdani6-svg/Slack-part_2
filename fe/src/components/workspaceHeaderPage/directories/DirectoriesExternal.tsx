"use client";

import { useState, useMemo, useCallback } from "react";
import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import { Channel } from "./domi";
import ExternalChannelsSteps from "./ExternalChannelsStep";
import DirectoriesSideshow from "./DirectoriesSideshow";
import HeroSection from "./HeroSection";
import ActionCardsSection from "./ActionCardsSection";
import CreateChannelModal from "@/components/ui/modal/CreateChannelModal";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useAuth } from "@/context/Authcontext";
import NewDmModal from "@/components/DmPage/NewDmModal";

export default function DirectoriesExternal() {
    const [search, setSearch] = useState("");
    const { user } = useAuth();
    const userId = user?.id
        const workspaceId = useWorkspaceId();
    const [open, setOpen] = useState(false);
    const handleOpenModal = useCallback(() => {
        setOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setOpen(false);
    }, []);

    const [showModal, setShowModal] = useState(false);

    const handleModalClose = () => {
        setShowModal(false);
    }
    const handleModalOpen = () =>{
        setShowModal(true);
    }
    const filteredData = useMemo(() => {
        const q = search.toLowerCase();

        return Channel.data.filter((item) => {
            return Object.entries(item).some(([key, val]) => {
                let searchable = String(val).toLowerCase();
                if (key === "joined") {
                    searchable = val ? "joined true" : "not joined false";
                }
                return `${key} ${searchable}`.includes(q);
            });
        });
    }, [search]);
    return (
        <div className="w-full h-full overflow-y-scroll overflow-x-hidden sidebar-scroll  ">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 
                flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-[12px]">
                <FileSearch
                    value={search}
                    placeholder="Search for people"
                    onChange={(e) => setSearch(e.target.value)}
                />
                <div className="mt-2 sm:mt-[21px]">
                    <CustomButton
                        label="Create Channel"
                        showIcon={false}
                        bgColor="bg-transparent"
                        hoverColor="hover:bg-[#e1e1e1]"
                        height="h-[40px]"
                        activeColor="active:bg-[#c1c1c1]"
                        textColor="text-[#313131]"
                        paddingX="px-[12px]"
                        radius="rounded-[6px]"
                        onClick={handleOpenModal}
                        suffix={
                            <span className="text-[10px] px-[4px] py-[1px] rounded-[4px] bg-[#2a2d31] text-[#c084fc] ml-[6px]">
                                PRO
                            </span>
                        }
                    />
                </div>
                <div className="mt-2 sm:mt-[21px]">
                    <CustomButton
                        label="Start a DM"
                        showIcon={false}
                        bgColor="bg-transparent"
                        hoverColor="hover:bg-[#e1e1e1]"
                        height="h-[40px]"
                        activeColor="active:bg-[#c1c1c1]"
                        textColor="text-[#313131]"
                        paddingX="px-[10px]"
                        radius="rounded-[6px]"
                        onClick={handleModalOpen}
                    />
                </div>
            </div>
            <div className="h-[calc(100vh-250px)] flex flex-col items-center min-h-[60vh]">

                <>
                    <HeroSection />
                    <ActionCardsSection />
                </>
                <ExternalChannelsSteps />
                <DirectoriesSideshow />

            </div>
            {workspaceId && userId && (
                <CreateChannelModal
                    isOpen={open}
                    onClose={handleCloseModal}
                    workspaceId={workspaceId}
                    userId={userId}
                />
            )}
            {showModal && <NewDmModal onClose={handleModalClose} />}
        </div >
    );
}
