//BannerSection.tsx
"use client";

import { useState } from "react";
import CustomButton from "../component/channel_button";

export default function BannerSection({
  handleOpenModal }: { handleOpenModal: () => void }
) {
  const [showBanner, setShowBanner] = useState(true);
  const [isFocused, setIsFocused] = useState(false);
  return (
    <>
      {showBanner && (
        <div
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)} 
          className={`w-full border-y border-[#e1e1e1] mb-[16px] px-4 sm:px-6 py-[24px] lg:px-8 bg-[#e3f8ff]  ${isFocused ? "border-[#1264a3] shadow-[0_0_0px_4px_#b2cbde]" : ""}`}>
          <div className="relative w-full  rounded-[12px]  px-4 sm:px-6 lg:px-8 py-[24px] flex flex-col md:flex-row justify-between gap-4">
            {/* Close Button */}
            <button
              onClick={() => setShowBanner(false)}
              className="absolute cursor-pointer  top-[-12px] right-[40px] text-[black] hover:text-[#717171] text-[34px]"
            >
              ×
            </button>

            {/* Content */}
            <div className="max-w-[600px]">
              <h2 className="text-[25px] font-b font-[600] text-[#212121] mb-[6px]">
                Organize your team’s conversations
              </h2>
              <p className="text-[15px] text-[#414141] mb-[14px] leading-[1.4]">
                Channels are spaces for gathering all the right people, messages,
                files and tools. Organize them by any project, group, initiative
                or topic of your choosing.
              </p>

              <CustomButton
                label="Create channel"
                showIcon={false}
                bgColor="bg-[#ffffff]"
                hoverColor="hover:bg-[#e1e1e1]"
                activeColor="active:bg-[#c1c11]"
                textColor="text-[#white]"
                onClick={handleOpenModal}
                height="h-[40px]"
                paddingX="px-[12px]"
                radius="rounded-[6px]"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}