
export default function TopBarIcon() {
    return (
        <div className="mascot-container w-[30px] hover:bg-white/[0.10] h-[30px] flex items-center justify-center border-[1px] border-solid rounded-[6px] border-[#616161] ">
            <div className="w-[20px] h-[20px] cursor-pointer overflow-hidden inline-block rounded-[5px]">
                <div className="mascot-sprite w-[20px] h-[20px] bg-no-repeat bg-[url(/slackbot_heart_sprite-0c2245c.png)] bg-size-[120px_20px] bg-top-0 bg-left-0"></div>
            </div>
        </div>
    );
}