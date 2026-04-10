import React from "react";

type Props = {
    setIsHover: (value: boolean) => void;
};

const Trial = ({ setIsHover }: Props) => {
    return (
        <div
            className="flex p-3 bg-[#7e5a81] rounded-xl border hover:bg-[#7e5a81a0] justify-between cursor-pointer mt-2 mb-3"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
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