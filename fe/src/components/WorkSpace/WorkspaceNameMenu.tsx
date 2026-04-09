"use client";

//KIH

import React, { useState } from "react";
import { useWorkspace } from "@/context/Workspacecontext";

// ===== TYPES =====
type Item =
  | "divider"
  | {
    label: string;
    icon?: string;
    onClick?: () => void;
    submenu?: ("divider" | { label: string; icon?: string; onClick?: () => void })[];
  };

// ===== DATA =====
const menuList: Item[] = [
  { label: "Invite people to STAR", onClick: () => alert("hello world") },
  "divider",
  { label: "Preferences" },
  {
    label: "Tools & settings",
    submenu: [
      { label: "Tools" },
      { label: "Customize workspace" },
      { label: "Workflow Builder" },
      { label: "Workspace analytics", icon: "/menu-item(dark).svg" },
      "divider",
      { label: "Administration" },
      { label: "Manage apps" },
    ],
  },
  "divider",
  { label: "Open the desktop app", icon: "/slack_hash_128-357251d.png" },
  { label: "Get the mobile app", icon: "/phone.svg" },
  "divider",
  { label: "Sign out" },
];

// ===== UI =====
export const WorkspaceNameMenu: React.FC = () => {

  const { workspace } = useWorkspace();
  const workspace_name = workspace?.name ?? null;
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="w-[344px] h-[455px] bg-[#faf8f8] text-[#4b4a4a] rounded-lg border border-[#e9e8e8d7] shadow-xl p-3">
      {/* Header */}
      <div className="flex items-center gap-3 px-2 py-2">
        <div className="w-[36px] h-[36px] rounded-md bg-[#8f8f8f] flex items-center justify-center text-[#dddbdb] text-sm font-semibold">
          <p className="text-[20px] ">{workspace_name ? workspace_name.charAt(0).toUpperCase() : "?"}</p>
        </div>
        <div>
          <div className="text-[15px] font-semibold">{workspace_name}</div>
          <div className="text-[13px] text-[#7a7979]">{workspace_name}.slack.com</div>
        </div>
      </div>

      <div className="border-t border-[#e6e1e1] my-2" />

      {/* Promo */}
      <div className="mb-2">
        <div className="pt-1.5 pl-3 cursor-pointer hover:bg-[#1381ffaf] hover:text-white">
          <p className="font-semibold text-[14px]">⏳ 5 days left on your Business+ Offer</p>
          <p className="text-[14px] mb-2 pt-1">Get 50% off Slack Business+ on your first 3 months.</p>
        </div>

        <div className="flex justify-center hover:bg-[#1381ffaf]">
          <button className="text-[13px] font-bold border border-[#b4b4b4] rounded-md py-[3px] bg-white flex w-[93%] justify-center">
            <img src="/roket-dark.svg" className="w-4" />
            <p className="pl-1">Upgrade Plan</p>
          </button>
        </div>
      </div>

      <div className="border-t border-[#e6e1e1] mt-[11px]" />

      {/* Menu */}
      <div className="mt-2">
        {menuList.map((item, i) =>
          item === "divider" ? (
            <div key={i} className="border-t border-[#e6e1e1] my-2" />
          ) : (
            <div
              key={i}
              className="flex pt-1 items-center justify-between hover:bg-[#1381ffaf] hover:text-white cursor-pointer relative"
              onMouseEnter={() => item.submenu && setOpen(item.label)}
              onMouseLeave={() => item.submenu && setOpen(null)}
              onClick={() => item.onClick?.()}
            >
              <p className="pl-3">{item.label}</p>

              {item.submenu ? (
                <img src="/right-arrow.svg" className="w-4" />
              ) : (
                item.icon && (
                  <span className="w-[26px] h-[26px] flex items-center justify-center mr-3">
                    <img src={item.icon} className="w-4 h-4" />
                  </span>
                )
              )}

              {item.submenu && open === item.label && (
                <div
                  className="absolute top-0 -right-75"
                  onMouseEnter={() => setOpen(item.label)}
                  onMouseLeave={() => setOpen(null)}
                >
                  <div className="w-[300px] h-[220px] bg-[#faf8f8] text-[#4b4a4a] rounded-lg border border-[#e9e8e8d7] shadow-xl p-3">
                    {item.submenu.map((sub, j) =>
                      sub === "divider" ? (
                        <div key={j} className="border-t border-[#e6e1e1] my-2" />
                      ) : (
                        <div
                          key={j}
                          className="flex mt-1.5 items-center justify-between hover:bg-[#1381ffaf] hover:text-white cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            sub.onClick?.();
                          }}
                        >
                          <p className="pl-3">{sub.label}</p>
                          {sub.icon && <img src={sub.icon} className="w-4" />}
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
};
