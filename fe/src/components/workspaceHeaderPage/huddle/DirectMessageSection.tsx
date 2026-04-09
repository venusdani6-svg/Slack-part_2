import { UserCard } from "./UserCard";

export function DirectMessagesSection() {
  return (
    <div className=" h-72.5" >
      <h3 className="text-[15px] font-bold text-[#1d1c1d]">
        Direct messages
        <span className="text-[#616061] font-normal ml-1.5">
          — Talk privately 1:1 with someone
        </span>
      </h3>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <UserCard type="away" />
        <UserCard type="active" />
        <UserCard type="awayWithButton" />
      </div>
    </div>
  );
}