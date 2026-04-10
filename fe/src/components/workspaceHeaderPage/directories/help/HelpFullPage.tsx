"use client";

import HelpSearchSection from "./HelpSearchSection";
import HelpDiscoverCard from "./HelpDiscoverCard";
import HelpListItem from "./HelpListItem";
import HelpLink from "./HelpLink";

import { FiBell, FiSmile, FiClock, FiVideo } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi";
import HelpFullHeader from "./HelpFullHeader";
import ScrollContainer from "./SlimScroll";
import {  FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function HelpPageFull() {
  // 🔥 DATA LAYERS

  const discoverData = [
    {
      title: "Quick start guide",
      description: "Learn the basics and get to work in Slack",
      image: "/Helpimg/3472312402272_8d2332e68fa8a2955e51.png",
    },
    {
      title: "New layout for channels and DMs",
      description: "Add files, workflows, and more to tabs",
      image: "/Helpimg/7670958676850_f3e5c2b2c9e1c1931b27.png",
    },
    {
      title: "Create and share sidebar sections",
      description: "Organize channels for user groups",
      image: "/Helpimg/5150773988327_5d50f41c2a0ba4189687.png",
    },
  ];

  const helpListData = [
    { icon: FiBell, label: "Configure your Slack notifications", image: "/Helpimg/bell-cb0c35b.svg", },
    { icon: HiOutlineSparkles, label: "Set your Slack status and availability", image: "/Helpimg/profile-fdc0be3.svg", },
    { icon: FiClock, label: "Set a reminder", image: "/Helpimg/clock-706161b.svg",},
    { icon: FiSmile, label: "Use emoji reactions" , image: "/Helpimg/smile-star-638e676.svg",},
    { icon: FiVideo, label: "Slack video tutorials" , image: "/Helpimg/play-green-2c92a99.svg",},
  ];

  const helpLinks = [
    "Getting started →",
    "Using Slack →",
    "Your profile & preferences →",
    "Connect tools & automate tasks →",
  ];

 

return (
    <div
      className="
        max-w-[850px]
        h-full                 /* 🔥 MODIFIED: was NOT fixed height */
        bg-[#ffffff]
        border border-[#ddd]
        rounded-[8px]
        overflow-hidden
        flex flex-col          /* 🔥 IMPORTANT */
      "
    >

      {/* 🔝 FIXED AREA */}
      <HelpFullHeader />
      <HelpSearchSection />

      {/* 🔥 SCROLLABLE AREA ONLY */}
      <ScrollContainer>
        
        {/* DISCOVER */}
        <div className="px-[20px] mt-[6px]">
          <div className="flex justify-between mb-[8px] text-[13px] text-[#616061]">
            <span className="flex items-center gap-[6px]">
              <HiOutlineSparkles size={14} />
              Discover more
            </span>
            <span>1/3</span>
          </div>

          <div className="flex gap-[12px]">
            {discoverData.map((item, i) => (
              <HelpDiscoverCard key={i} {...item} />
            ))}
          </div>
        </div>

        {/* LIST */}
        <div className="px-[20px] mt-[16px]">
          <div className="text-[13px] text-[#616061] mb-[8px]">
            Explore help topics
          </div>

          <div className="flex flex-col gap-[5px]">
            {helpListData.map((item, i) => (
              <HelpListItem key={i} {...item} />
            ))}
          </div>
        </div>

        {/* LINKS */}
        <div className="px-[20px] mt-[16px] pb-[20px]">
          <div className="text-[13px] text-[#616061] mb-[8px]">
            Help categories
          </div>

          <div className="flex ml-[5px] flex-col gap-[6px]">
            {helpLinks.map((text, i) => (
              <HelpLink key={i} text={text} />
            ))}
          </div>
        </div>

      </ScrollContainer>

      {/* 🔽 FIXED FOOTER */}
      <div className="border-t border-[#ddd] px-[20px] py-[10px] flex justify-between bg-white">
        <div className="flex gap-2 text-[#1264a3]"><HelpLink text="Help requests" />
        <FaArrowUpRightFromSquare/>
<i className="fa-utility fa-semibold fa-arrow-up-right-from-square"></i></div>
        <button className="border border-[#ccc] rounded-[6px] px-[12px] py-[6px] text-[13px] bg-white hover:bg-[#f4f4f4]">
          Contact Us
        </button>
      </div>

    </div>
  );

}



  
