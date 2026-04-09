"use client";

// RJC

import React, { useState } from "react";
import Image from "next/image";

export default function ChannelOptionsMenu() {
  const filterOptions = [
    { label: "Active only", sublabel: "New activity within the last 30 days" },
    { label: "Unreads" },
    { label: "Mentions" },
    { label: "All" },
  ];

  const sortOptions = [
    { label: "A-Z" },
    { label: "Recency" },
    { label: "Priority" },
  ];

  const [isHover, setIsHover] = useState<boolean>(false);
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [selectedSort, setSelectedSort] = useState<string>("A-Z");

  return (
    <div className="inline-block">
      {/* FIRST MENU */}
      <div
        className="w-[303px] overflow-hidden rounded-[6px] border border-[#cfcfcf] bg-white"
        style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
      >
        <div
          className="mt-3 flex cursor-pointer items-center justify-between border-b border-[#d8d8d8] pl-[24px] pr-[22px] text-[#222] hover:bg-[#1f5f93] hover:text-white"
          onMouseEnter={() => setIsHover(true)}
        >
          <span className="text-[14px]">Filter and sort</span>
          <div className="flex items-center gap-[8px] opacity-80">
            <span className="text-[14px]">{selectedFilter}</span>
            <span className="translate-y-[-1px] text-[17px]">›</span>
          </div>
        </div>

        <div
          className="mt-3 border-b border-[#d8d8d8]"
          onMouseEnter={() => setIsHover(false)}
        >
          <div className="flex cursor-pointer items-start pl-[25px] pr-[18px] pt-[14px] pb-[10px] hover:bg-[#1f5f93] hover:text-white">
            <div className="mr-[11px] mt-[4px] w-[19px] text-[#535353]">
              <Image
                src="/create_section.svg"
                alt="create_section"
                width={20}
                height={20}
              />
            </div>
            <div className="text-[#222]">
              <div className="text-[14px]">Create a section</div>
              <div className="text-[13px] opacity-80">
                Organize conversations by topic
              </div>
            </div>
          </div>

          <div className="mb-3 cursor-pointer pl-[28px] pr-[18px] pb-[12px] hover:bg-[#1f5f93] text-[#222] hover:text-white">
            <div className="pt-3 text-[14px]">Manage channel list</div>
            <div className="text-[13px] opacity-80">
              Reorder, add sections, and leave channels
            </div>
          </div>
        </div>

        <div className="pt-[12px] pl-[24px] pb-[6px] text-[13px] text-[#7b7b7b]">
          Quick tips
        </div>

        <div className="border-b border-[#d8d8d8]">
          <div className="flex items-start pl-[25px] pr-[18px] pt-[8px] pb-[12px]">
            <div className="mr-[11px] mt-[4px] w-[19px] text-[#626262]">
              <Image src="/cleanup.svg" alt="cleanup" width={20} height={20} />
            </div>
            <div className="text-[#222]">
              <div className="text-[14px]">Clean up your channel list</div>
              <div className="text-[13px]">
                Looking fresh! No new recommendati...
              </div>
            </div>
          </div>
        </div>

        <div
          className="mt-2 mb-2 flex cursor-pointer items-center pl-[24px] pt-1 pb-1 text-[14px] text-[#2d2d2d] hover:bg-[#1f5f93] hover:text-white"
          onMouseEnter={() => setIsHover(false)}
        >
          Edit defaults
        </div>
      </div>

      {/* SECOND MENU */}
      {isHover && (
        <div
          className="absolute top-0 left-[calc(100%+2px)] z-20"
          onMouseLeave={() => setIsHover(false)}
        >
          <div
            className="w-[302px] overflow-hidden rounded-[6px] border border-[#cfcfcf] bg-white"
            style={{ fontFamily: '"Segoe UI", Arial, sans-serif' }}
          >
            <div className="pt-[16px] pl-[24px] pb-[8px] text-[13px] text-[#6f6f6f]">
              Filter conversations by:
            </div>

            {filterOptions.map((item) => {
              const isSelected = selectedFilter === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedFilter(item.label)}
                  className="group relative block w-full cursor-pointer pl-[40px] pr-[20px] py-[6px] text-left hover:bg-[#1f5f93]"
                >
                  {isSelected && (
                    <span className="absolute left-[20px] top-[7px] text-[#0f6cbd] group-hover:text-white">
                      ✓
                    </span>
                  )}

                  <div
                    className={`text-[15px] ${isSelected ? "text-[#0f6cbd]" : "text-[#222]"
                      } group-hover:text-white`}
                  >
                    {item.label}
                  </div>

                  {item.sublabel && (
                    <div
                      className={`text-[13px] ${isSelected ? "text-[#0f6cbd]" : "text-[#666]"
                        } group-hover:text-white`}
                    >
                      {item.sublabel}
                    </div>
                  )}
                </button>
              );
            })}

            <div className="border-t border-[#d2d2d2] pt-[12px] pl-[24px] pb-[8px] text-[13px] text-[#6f6f6f]">
              Sort conversations by:
            </div>

            {sortOptions.map((item) => {
              const isSelected = selectedSort === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setSelectedSort(item.label)}
                  className="group relative block w-full cursor-pointer pl-[40px] pr-[20px] py-[6px] text-left hover:bg-[#1f5f93]"
                >
                  {isSelected && (
                    <span className="absolute left-[20px] top-[7px] text-[#0f6cbd] group-hover:text-white">
                      ✓
                    </span>
                  )}

                  <div
                    className={`text-[15px] ${isSelected ? "text-[#0f6cbd]" : "text-[#222]"
                      } group-hover:text-white`}
                  >
                    {item.label}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Latest commit 10:44