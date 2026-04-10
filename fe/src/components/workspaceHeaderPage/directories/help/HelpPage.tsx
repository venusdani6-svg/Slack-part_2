"use client";

import ContentBlock from "./ContentBlock";
import HelpHeader from "./HelpHeader";
import { helpContent } from "./domi";
import FeedbackFooter from "./FeedBackFooter";

type Props = {
  onClose: () => void;
};

export default function HelpPage({ onClose }: Props) {
  return (
    <div className="w-full h-full bg-white flex flex-col">
      <HelpHeader onClose={onClose} />
      <div className="flex-1 overflow-y-auto px-5 py-4 sidebar-scroll">
        {helpContent.map((block, i) => (
          <ContentBlock key={i} {...block} />
        ))}
        <FeedbackFooter />
      </div>
    </div>
  );
}
