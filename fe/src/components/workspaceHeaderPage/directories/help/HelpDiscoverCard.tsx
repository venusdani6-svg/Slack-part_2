"use client";

type Props = {
  title: string;
  description: string;
  image: string;
};

export default function HelpDiscoverCard({
  title,
  description,
  image,
}: Props) {
  return (
    <div className="w-[260px] relative border border-[#ddd] rounded-[8px] overflow-hidden bg-white">
      
      {/* TEXT AREA */}
      <div className="px-[12px] pt-[10px] pb-[6px]">
        <div className="text-[13px] font-semibold text-[#1d1c1d] leading-[18px]">
          {title}
        </div>
        <div className="text-[12px] text-[#616061] mt-[2px] leading-[16px]">
          {description}
        </div>
      </div>
       

      {/* IMAGE AREA */}
      <div className="relative h-[120px] flex bg-[#f4f4f4]">

          <div className="shadow-[0px_0px_4px_2px_black] absolute bottom-[10px] left-[10px] bg-[#f1f1f1] px-[6px] py-[2px] rounded-full">
          <span className=" text-[#1264a3] text-[11px] font-semibold">
          NEW
          </span>
        </div> 
        <img
          src={image}
          alt=""
          className="w-full h-full object-cover"
        />
        
      </div>
    
    </div>
  );
}