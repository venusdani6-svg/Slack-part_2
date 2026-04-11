"use client";

import CustomButton from "../component/channel_button";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useAuth } from "@/context/Authcontext";
import { useState, useCallback } from "react";
import CreateChannelModal from "@/components/ui/modal/CreateChannelModal";
import NewDmModal from "@/components/DmPage/NewDmModal";

export default function ActionCardsSection() {
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
  return (
    <section className="w-full bg-[#f4ede4] py-[40px]">
      <div className="max-w-[1100px] mx-auto flex gap-[20px] px-[20px]">
        <div className="flex-1 bg-[#ffffff] shadow-[0px_0px_1px_0px_gray] rounded-[12px] p-[20px]">
          <h3 className="text-[14px] font-[600] text-[#313131] mb-[6px]">
            Create a channel with external people
          </h3>

          <p className="text-[13px] text-[#313131] mb-[16px]">
            Work with multiple people and organizations outside of 2-MS
          </p>
          <CustomButton
            label="Create Channel"
            showIcon={false}
            width="w-auto"
            height="h-[36px]"
            paddingX="px-[16px]"
            onClick={handleOpenModal}
          />
        </div>
        <div className="flex-1 bg-[#ffffff] shadow-[0px_0px_1px_0px_gray]  rounded-[12px] p-[20px]">
          <h3 className="text-[14px] font-[600] text-[#313131] mb-[6px]">
            Talk one-on-one
          </h3>

          <p className="text-[13px] text-[#313131] mb-[16px]">
            Talk one-on-one with anyone outside of 2-MS
          </p>
          <CustomButton
            label="Start a DM"
            showIcon={false}
            bgColor="bg-transparent"
            hoverColor="hover:bg-[#e1e1e1]"
            activeColor="active:bg-[#a1a1a1]"
            textColor="text-[#313131]"
            width="w-auto"
            height="h-[36px]"
            paddingX="px-[16px]"
            onClick={handleModalOpen}
          />
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
      {showModal && <NewDmModal onClose={handleModalClose} />}
    </section>
  );
}