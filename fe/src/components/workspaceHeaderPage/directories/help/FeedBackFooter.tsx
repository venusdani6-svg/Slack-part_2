"use client";

import { useState } from "react";
import CustomButton from "../../component/channel_button";

export default function FeedbackFooter() {
  const [done, setDone] = useState(false);

  return (
    <div className="border-t border-[#ddd] px-[20px] py-[14px]">
      {done ? (
        <p className="text-[13px]  text-[#616061]">
          Thanks for your feedback!
        </p>
      ) : (
        <div className="flex h-[150px] flex-col items-center ">
          <span className="text-[13px] mb-[30px] mt-[40px] font-semibold text-[#1d1c1d]">
            Was this article helpful?
          </span>

          <div className="flex gap-[8px]">
            <CustomButton
              label="Yes, Thanks!"
              // onClick={() => setDone(true)}
              showIcon={false}
              bgColor="bg-[#007a5a]"
              hoverColor="hover:bg-[#148567]"
              activeColor="active:bg-[#006644]"
              textColor="text-white"
              height="h-[28px]"
              paddingX="px-[12px]"
            />

            {/* ✅ Secondary Button */}
            <CustomButton
              label="Not Really"
              // onClick={() => setDone(true)}
              showIcon={false}
              bgColor="bg-[#e8e8e8]"
              hoverColor="hover:bg-[#d6d6d6]"
              activeColor="active:bg-[#c2c2c2]"
              textColor="text-[#1d1c1d]"
              height="h-[28px]"
              paddingX="px-[12px]"
            />
          </div>
        </div>
      )}
    </div>
  );
}