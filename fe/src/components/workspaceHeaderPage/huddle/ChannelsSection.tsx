import { useSocket } from "@/providers/SocketProvider";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useAuth } from "@/context/Authcontext";
import ChannelRow from "./ChannelRow";

type RawChannel = {
  id?: string;
  name?: string;
  channelType?: string;
};

type NormalizedChannel = {
  id: string;
  name: string;
  isPrivate: boolean;
};

export function ChannelsSection() {
  const { socket } = useSocket();
  const [channels, setChannels] = useState<NormalizedChannel[]>([]);
  const workspaceId = useWorkspaceId();
  const { user } = useAuth();
  const userId = user?.id;

  const normalizeChannel = useCallback(
    (ch: RawChannel): NormalizedChannel => ({
      id: ch?.id ?? "",
      name: ch?.name ?? "Unnamed channel",
      isPrivate: ch?.channelType === "private",
    }),
    []
  );

  useEffect(() => {
    if (!socket || !workspaceId || !userId) return;
    socket.emit("join_workspace", { workspaceId });
    socket.emit("channel:list", { workspaceId, userId });
    const handleList = (data: RawChannel[]) => {
      setChannels(data.map(normalizeChannel));
    };
    socket.on("channel:list", handleList);
    return () => { socket.off("channel:list", handleList); };
  }, [socket, workspaceId, userId, normalizeChannel]);

  const filteredData = useMemo(() => channels, [channels]);

  return (
    <div>
      <h3 className="text-[15px] font-bold text-[#1d1c1d]">
        Channels
        <span className="text-[#616061] font-normal ml-1.5">
          — Meet with a whole team, or just let people drop in and out
        </span>
      </h3>
      <div className="mt-3 bg-white border border-[#e8e8e8] rounded-2 overflow-hidden">
        <ChannelRow channels={filteredData} />
      </div>
    </div>
  );
}
