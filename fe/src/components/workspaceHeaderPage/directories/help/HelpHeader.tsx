"use client";

type Props = {
  onClose: () => void;
};

export default function HelpHeader({ onClose }: Props) {
  return (
    <div className="flex items-center justify-between px-[16px] py-[10px] border-b border-[#ddd]">
      
      <span className="text-[13px] font-semibold text-[#1d1c1d]">
        Help
      </span>

      <button
        onClick={onClose}
        className="text-[#616061] hover:text-[#1d1c1d] text-[16px]"
        aria-label="Close"
      >
        ×
      </button>
    </div>
  );
}