"use client";

import { useState } from "react";
import ContentBlock from "./ContentBlock";
import HelpHeader from "./HelpHeader";
import { helpContent } from "./domi";
import FeedbackFooter from "./FeedBackFooter";


export default function HelpPage() {
  const [isVisible, setIsVisible] = useState(true);
  if (!isVisible) return null;
  return (
    <div className="w-[520px] bg-white border border-[#ddd] rounded-[6px] flex flex-col max-h-[100vh]">
      <HelpHeader onClose={() => setIsVisible(false)} />
      <div className="overflow-y-auto px-[20px] py-[16px]">
        {helpContent.map((block, i) => (
          <ContentBlock key={i} {...block} />
        ))}
         <FeedbackFooter />
      </div>
    </div>
  );
}