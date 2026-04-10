"use client";

type Props = {
  text: string;
};

export default function HelpLink({ text }: Props) {
  return (
    <a
      href="#"
      className="text-[13px] text-[#1264a3] hover:underline"
    >
      {text}
    </a>
  );
}