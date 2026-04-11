$s = @'
"use client";

import { useState, useRef, useEffect } from "react";
import { PlusIcon } from "lucide-react";
import { Tooltip } from "./Tooltip";
import { HiOutlineStar, HiStar, HiCheck } from "react-icons/hi";

const BLUE = "#1E40AF";
const GOLD = "#FFD700";
const GRAY = "#433934";

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
      className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm text-left transition-colors duration-100 hover:bg-[#1266a9] hover:text-white ${selected ? "bg-blue-50" : ""}`}
    >
      <span className="w-4 shrink-0 flex items-center justify-center">
        {selected && <HiCheck size={14} color={BLUE} />}
      </span>
      {icon && <span className="shrink-0">{icon}</span>}
      <span className={`text-[15px] ${selected ? "text-[#1E40AF] font-medium" : "text-black"}`}>
        {label}
      </span>
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-gray-200 my-1" />;
}

export default function Starred() {
  const [open, setOpen] = useState(false);
  const [starred, setStarred] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, []);

  const toggleStarred = () => setStarred((prev) => !prev);

  return (
    <div className="relative" ref={ref}>
      <Tooltip text1="Move channel">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className={`p-1 border rounded-md cursor-pointer transition-colors duration-150 ${starred ? "border-yellow-300 bg-yellow-50 hover:bg-yellow-100" : "border-gray-300 hover:bg-gray-200"}`}
        >
          {starred
            ? <HiStar color={GOLD} size={20} />
            : <HiOutlineStar color={GRAY} size={20} />
          }
        </button>
      </Tooltip>

      {open && (
        <div className="absolute left-0 top-full mt-1 w-64 rounded-xl border border-gray-200 bg-white shadow-lg z-50">
          <p className="text-[15px] pl-5 text-gray-600 mt-3">Move to...</p>
          <div className="pt-2 space-y-0.5">
            <MenuItem
              icon={starred ? <HiStar size={20} color={BLUE} /> : <HiOutlineStar size={20} color={GRAY} />}
              label="Starred"
              selected={starred}
              onToggle={toggleStarred}
            />
          </div>
          <Divider />
          <div className="pb-3">
            <MenuItem icon={<PlusIcon size={20} color={GRAY} />} label="Create your first section" />
          </div>
        </div>
      )}
    </div>
  );
}
'@
Set-Content -Path "src/components/MainTopbar/Starred.tsx" -Value $s
Write-Host "done"
