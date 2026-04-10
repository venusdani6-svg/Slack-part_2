"use client";

import { useState } from "react";
import FileSearch from "../../component/file_search";

export default function HelpSearchSection() {
  const [value, setValue] = useState("");

  return (
    <div className="px-[20px] pt-[16px] pb-[12px] bg-white">
      <div className="text-[13px] text-[#616061] mb-[6px]">
        Find answers quickly
      </div>

      <FileSearch
        value={value}
        placeholder="How can we help?"
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}