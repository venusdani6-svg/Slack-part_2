"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      setIsScrolling(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setIsScrolling(false);
      }, 800);
    };
    el.addEventListener("scroll", handleScroll);
    return () => {
      el.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative h-full">
      <div
        ref={ref}
        className="overflow-y-auto h-full pr-[6px]"
      >
        {children}
      </div>
      <div
        className={`absolute top-0 right-[2px] w-[4px] rounded-full bg-[#c1c1c1] transition-opacity duration-300 ${
          isScrolling ? "opacity-100" : "opacity-0"
        }`}
        style={{
          height: "40px",
        }}
      />
    </div>
  );
}