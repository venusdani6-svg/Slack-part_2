"use client";

import { useState, useRef, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { HiOutlineStar, HiStar, HiCheck } from "react-icons/hi";

const STAR_DEFAULT  = "#433934";
const STAR_SELECTED = "#FFD700";
const ITEM_SELECTED = "#3E40AF";

export default function Starred() {
  const [open,    setOpen]    = useState(false);
  const [starred, setStarred] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <Tooltip text1="Move channel">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`p-1 border rounded-md cursor-pointer transition-colors duration-150 ${
            starred
              ? "border-yellow-300 bg-yellow-200 hover:bg-yellow-100"
              : "border-gray-300 bg-white hover:bg-gray-200"
          }`}
        >
          {starred
            ? <HiStar       color={STAR_SELECTED} size={20} />
            : <HiOutlineStar color={STAR_DEFAULT}  size={20} />
          }
        </button>
      </Tooltip>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
          <p className="text-[15px] pl-5 text-gray-600 mt-3">Move to...</p>

          <div className="pt-2 space-y-0.5">
            <MenuItem
              label="Starred"
              selected={starred}
              onToggle={() => setStarred((prev) => !prev)}
              icon={
                starred
                  ? <HiStar       color={ITEM_SELECTED} size={18} />
                  : <HiOutlineStar color={STAR_DEFAULT}  size={18} />
              }
            />
          </div>

          <Divider />

          <div className="pb-3">
            <MenuItem label="Create your first section" icon={<PlusIcon size={18} />} />
          </div>
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  selected = false,
  onToggle,
}: {
  icon?: React.ReactNode;
  label: string;
  selected?: boolean;
  onToggle?: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className={`group w-full flex items-center justify-between pl-5 pr-3 py-1.5 text-sm text-left transition-colors duration-100 hover:bg-[#1266a9] hover:text-white ${selected ? "bg-blue-50" : ""}`}
    >
      <div className="flex items-center gap-2">
        <span className="w-4 shrink-0 flex items-center justify-center">
          {selected && <HiCheck size={14} color={ITEM_SELECTED} />}
        </span>
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="text-[14px] text-black group-hover:text-white">{label}</span>
      </div>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200 my-1" />;
}
