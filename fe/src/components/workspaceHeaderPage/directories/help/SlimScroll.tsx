"use client";

/* =========================
   🔥 FINAL: Scoped Scrollbar
   - No global CSS
   - No arrows
   - Fully encapsulated
========================= */

type Props = {
  children: React.ReactNode;
};

export default function ScrollContainer({ children }: Props) {
  return (
    <div className="relative flex-1 overflow-y-auto custom-scroll">
      
      {/* 🔥 SCOPED STYLE ONLY FOR THIS COMPONENT */}
      <style jsx>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #c4c4c4;
          border-radius: 9999px;
        }

        /* 🔥 REMOVE ARROWS (LOCAL ONLY) */
        .custom-scroll::-webkit-scrollbar-button {
          display: none;
          width: 0;
          height: 0;
        }

        /* Firefox */
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: #c4c4c4 transparent;
        }
      `}</style>

      {children}
    </div>
  );
}