"use client";

import { ContentBlockProps } from "./domi";


export default function ContentBlock(props: ContentBlockProps) {
  switch (props.type) {
    case "text":
      return (
        <div className="mb-[18px]">
          <h2
            className={
              props.variant === "header"
                ? "text-[16px] font-semibold text-[#1d1c1d] mb-[6px]"
                : "text-[14px] font-semibold text-[#1d1c1d] mb-[4px]"
            }
          >
            {props.title}
          </h2>

          <p className="text-[13px] leading-[20px] text-[#616061]">
            {props.description}
          </p>
        </div>
      );

    case "tree":
      return (
        <div className="mb-[20px]">
          <h3 className="text-[14px] font-semibold text-[#1d1c1d] mb-[6px]">
            {props.header}
          </h3>

          {props.comment && (
            <p className="text-[13px] leading-[20px] text-[#616061] mb-[8px]">
              {props.comment}
            </p>
          )}

          {props.members && (
            <ul className="pl-[18px] space-y-[4px]">
              {props.members.map((item, i) => (
                <li
                  key={i}
                  className="text-[13px] leading-[20px] text-[#1d1c1d] list-disc"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      );

    case "banner":
      return (
        <div className="bg-[#e7f3ec] border border-[#c6e0d4] rounded-[6px] px-[12px] py-[10px] mb-[12px] text-[13px] text-[#1d1c1d]">
          <span className="font-semibold">Learn more:</span>{" "}
          {props.text}
        </div>
      );

    case "link":
      return (
        <div className="mb-[16px]">
          <a className="text-[13px] text-[#1264a3] hover:underline cursor-pointer">
            {props.text}
          </a>
        </div>
      );

    default:
      return null;
  }
}