import React, { useRef } from "react";

type Props = {
    setIsHover: (value: boolean) => void;
};

const Trial = ({ setIsHover }: Props) => {
    const startTimeRef = useRef<number | null>(null);

    const handleMouseEnter = () => {
        startTimeRef.current = performance.now();

        const check = (time: number) => {
            if (!startTimeRef.current) return;

            if (time - startTimeRef.current >= 600) {
                setIsHover(true);
            } else {
                requestAnimationFrame(check);
            }
        };

        requestAnimationFrame(check);
    };

    const handleMouseLeave = () => {
        startTimeRef.current = null;
        setIsHover(false);
    };

    return (
        <div
            className="flex p-3 bg-[#7e5a81] rounded-xl border hover:bg-[#7e5a81a0] transition-all duration-300 ease-out hover:scale-[1.02] justify-between cursor-pointer"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            <div className="flex gap-2">
                <img src="/svg/clock.svg" alt="clock" width={20} />
                <b>9 days left in trial</b>
            </div>

            <div>
                <img src="/svg/rightArr.svg" alt="rightArr" width={20} />
            </div>
        </div>
    );
};

export default Trial;