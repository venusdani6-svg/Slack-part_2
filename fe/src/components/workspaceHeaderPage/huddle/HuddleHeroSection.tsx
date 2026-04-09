import Image from "next/image";
import { HuddleCustomButton } from "./HuddleCustomButton";

type Props = {
  onClose: () => void;
};

export function HuddleHeroSection({ onClose }: Props) {
  return (
    <div className="relative w-full h-74 bg-[#cfe8d6] rounded-lg px-25 flex items-center justify-between">

      {/* CLOSE BUTTON */}
      <a
        onClick={onClose}
        className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center text-[#616061] hover:text-[#1d1c1d]"
      >
        ✕
      </a>

      {/* LEFT */}
      <div className="max-w-140 ml-43">
        <h2 className="text-[22px] leading-7 font-bold text-[#1d1c1d]">
          Instantly connect over audio or video
        </h2>

        <p className="text-[15px] leading-5.5 text-[#616061] mt-2">
          Talk it out in real time on a huddle, with screen-sharing, expressive reactions and a message thread that automatically saves for later reference.
        </p>

        <div className="mt-4">
          <HuddleCustomButton
            label="Start a Huddle"
            bgColor="#007a5a"
            textColor="#ffffff"
            hoverColor="#006c4f"
            height="36px"
            px="16px"
            border="none"
            rounded="6px"
            fontSize="14px"
          />
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="relative mr-40 w-76 h-55 bg-[#cfe8d6] flex items-center overflow-hidden justify-center rounded-lg">
        <Image 
            src="/Newimg/SVG/huddles_onboarding_tip_ia4-1ccf85d.gif"
            alt=""
            width={387}
            height={262}
            className="bg-[#cfe8d6] absolute w-98 h-67 left-0 object-cover
            opacity-[0.9]"
           />
      </div>
    </div>
  );
}