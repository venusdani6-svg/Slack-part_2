"use client";

import {
  useRef,
  useState,
  useEffect,
  useCallback,
  KeyboardEvent,
} from "react";
import { useHuddleSearch, type PickerItem } from "./useHuddleSearch";

function IconHash({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z" />
    </svg>
  );
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

function Tag({ item, onRemove }: { item: PickerItem; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-0.75 max-w-40 bg-[#1264a3] text-white text-[13px] font-medium rounded-sm pl-1.5 pr-0.5 py-0.5">
      {item.type === "user" && item.avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.avatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover shrink-0"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
      ) : item.type === "channel" && item.isPrivate ? (
        <IconLock className="w-2.75 h-2.75 shrink-0" />
      ) : item.type === "channel" ? (
        <IconHash className="w-2.75 h-2.75 shrink-0" />
      ) : null}
      <span className="truncate">{item.label}</span>
      <button type="button" onClick={onRemove}
        className="shrink-0 w-4.5 h-4.5 flex items-center justify-center rounded-xs hover:bg-white/20 transition-colors ml-px"
        aria-label={`Remove ${item.label}`}>
        <IconX className="w-2.5 h-2.5" />
      </button>
    </span>
  );
}

function DropdownItem({ item, active, onSelect }: { item: PickerItem; active: boolean; onSelect: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (active) ref.current?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div ref={ref} onMouseDown={(e) => { e.preventDefault(); onSelect(); }}
      className={`flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors ${active ? "bg-[#1264a3] text-white" : "hover:bg-[#f4f4f4] text-[#1d1c1d]"}`}>
      <div className="shrink-0 w-7 h-7 flex items-center justify-center">
        {item.type === "user" ? (
          item.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={item.avatar} alt="" className="w-7 h-7 rounded-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/Untitled.png"; }} />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#7B2B8F] flex items-center justify-center text-white text-[12px] font-semibold">
              {item.label.charAt(0).toUpperCase()}
            </div>
          )
        ) : (
          <div className={`w-7 h-7 rounded-md flex items-center justify-center ${active ? "bg-white/20" : "bg-[#e8e8e8]"}`}>
            {item.isPrivate
              ? <IconLock className={`w-3.5 h-3.5 ${active ? "text-white" : "text-[#616061]"}`} />
              : <IconHash className={`w-3.5 h-3.5 ${active ? "text-white" : "text-[#616061]"}`} />}
          </div>
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <span className="text-[14px] font-medium truncate">{item.label}</span>
        {item.sublabel && (
          <span className={`text-[12px] truncate ${active ? "text-white/70" : "text-[#616061]"}`}>{item.sublabel}</span>
        )}
      </div>
      <span className={`ml-auto text-[11px] shrink-0 ${active ? "text-white/60" : "text-[#9ca3af]"}`}>
        {item.type === "channel" ? (item.isPrivate ? "Private" : "Channel") : "Person"}
      </span>
    </div>
  );
}

export type HuddlePickerProps = {
  selected: PickerItem[];
  onChange: (items: PickerItem[]) => void;
  placeholder?: string;
  maxItems?: number;
};

export function HuddlePicker({ selected, onChange, placeholder = "Search by name", maxItems = 10 }: HuddlePickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  // activeIndex resets to 0 whenever query changes (via the onChange handler below)
  const [activeIndex, setActiveIndex] = useState(0);

  const { results, loading } = useHuddleSearch(query);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredResults = results.filter((r) => !selected.some((s) => s.id === r.id));
  // Clamp to valid range without reading a ref during render
  const safeActiveIndex = filteredResults.length > 0
    ? Math.min(activeIndex, filteredResults.length - 1)
    : 0;

  const select = useCallback(
    (item: PickerItem) => {
      if (selected.length >= maxItems) return;
      onChange([...selected, item]);
      setQuery("");
      setActiveIndex(0);
      inputRef.current?.focus();
    },
    [selected, onChange, maxItems]
  );

  const remove = useCallback(
    (id: string) => { onChange(selected.filter((s) => s.id !== id)); },
    [selected, onChange]
  );

  const handleQueryChange = (value: string) => {
    setQuery(value);
    setActiveIndex(0); // reset on every keystroke — safe because it's in an event handler
    setOpen(true);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!open || filteredResults.length === 0) {
      if (e.key === "Backspace" && query === "" && selected.length > 0) remove(selected[selected.length - 1].id);
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filteredResults.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredResults[safeActiveIndex]) select(filteredResults[safeActiveIndex]);
        break;
      case "Escape":
        setOpen(false);
        break;
      case "Backspace":
        if (query === "" && selected.length > 0) remove(selected[selected.length - 1].id);
        break;
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const showDropdown = open && query.trim().length > 0;
  const channelItems = filteredResults.filter((r) => r.type === "channel");
  const userItems = filteredResults.filter((r) => r.type === "user");

  return (
    <div ref={containerRef} className="relative w-full">
      <div onClick={() => inputRef.current?.focus()}
        className={`flex flex-wrap items-center gap-1 min-h-11 w-full px-2.5 py-1.5 rounded-md border transition-all cursor-text ${
          open ? "border-[#1264a3] shadow-[0_0_0_3px_rgba(18,100,163,0.2)]" : "border-[#d1d2d3] hover:border-[#9ca3af]"
        }`}>
        {selected.map((item) => (
          <Tag key={item.id} item={item} onRemove={() => remove(item.id)} />
        ))}
        {selected.length < maxItems && (
          <input ref={inputRef} type="text" value={query}
            placeholder={selected.length === 0 ? placeholder : ""}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="flex-1 min-w-30 bg-transparent outline-none text-[14px] text-[#1d1c1d] placeholder:text-[#9ca3af]"
          />
        )}
      </div>

      {showDropdown && (
        <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-9999 bg-white border border-[#d1d2d3] rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] overflow-hidden max-h-70 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-5 text-[13px] text-[#616061]">
              <span className="w-3.5 h-3.5 border-2 border-[#d1d2d3] border-t-[#1264a3] rounded-full animate-spin mr-2" />
              Searching...
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-5 text-center text-[13px] text-[#616061]">
              No results for <strong className="text-[#1d1c1d]">&ldquo;{query}&rdquo;</strong>
            </div>
          ) : (
            <>
              {channelItems.length > 0 && (
                <>
                  <div className="px-3 pt-2.5 pb-1 text-[11px] font-bold text-[#616061] uppercase tracking-wide">Channels</div>
                  {channelItems.map((item, idx) => (
                    <DropdownItem key={item.id} item={item} active={safeActiveIndex === idx} onSelect={() => select(item)} />
                  ))}
                </>
              )}
              {userItems.length > 0 && (
                <>
                  <div className="px-3 pt-2.5 pb-1 text-[11px] font-bold text-[#616061] uppercase tracking-wide">People</div>
                  {userItems.map((item, idx) => (
                    <DropdownItem key={item.id} item={item} active={safeActiveIndex === channelItems.length + idx} onSelect={() => select(item)} />
                  ))}
                </>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
