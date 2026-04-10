"use client";

import { FiSearch } from "react-icons/fi";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

type FileSearchProps = {
  value: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function FileSearch({ value,placeholder, onChange }: FileSearchProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full flex items-center mt-[20px] justify-center">
      <div
        className={`
          relative
          w-full
          h-[44px]
          rounded-[8px]
          border-none
          bg-white/10
          transition-all
          duration-[120ms]
        `}
      >
        {/* Search Icon */}
        <div className="absolute top-[14px] left-[10px]">
          <FaSearch size={14} className="absolute z-5  text-[#313131] text-[14px]" />
        </div>

        {/* Input */}
         <input
          type="text"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            border-solid border 
            absolute left-[0px] top-[0px] w-full h-full
            bg-[#ffffff] pl-[36px] pr-[12px]
            text-[14px] text-[#313131]
            placeholder:text-[#9ca3af]
            outline-none rounded-[8px]
            transition-all duration-[120ms]
            ${isFocused ? "border-[#1264a3] shadow-[0_0_0px_4px_#b2cbde]" : ""}
          `}
        />
      </div>
    </div>
  );
}