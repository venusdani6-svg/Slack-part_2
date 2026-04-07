"use client";

import SidebarSection from "./SidebarSection";
import ChannelItem from "./ChannelItem";
import { FiPlus } from "react-icons/fi";
import { useEffect, useState, useCallback, useMemo } from "react";
import CreateChannelModal from "../ui/modal/CreateChannelModal";
import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

export default function ChannelListComponent() {
  const { socket } = useSocket();
  const [open, setOpen] = useState(false);
  const [channels, setChannels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const workspaceId = useWorkspaceId();
  const { user } = useAuth();
  const userId = user?.id;

  // ✅ FIX 1: Add userId to dependency array — CRITICAL for channel sync
  useEffect(() => {
    if (!socket || !workspaceId || !userId) return;

    setLoading(true);

    // JOIN ROOM
    socket.emit("join_workspace", { workspaceId });

    // REQUEST CHANNEL LIST with userId for proper filtering
    socket.emit("channel:list", { workspaceId, userId });

    // LISTENER: LIST
    const handleList = (data: any[]) => {
      setChannels(data);
      setLoading(false);
    };

    // LISTENER: CREATE — immediately add new channel to state
    const handleCreated = (newChannel: any) => {
      setChannels((prev) => {
        // prevent duplicates
        if (prev.find((c) => c.id === newChannel.id)) return prev;
        return [...prev, newChannel];
      });
    };

    // LISTENER: DELETE
    const handleDeleted = ({ channelId }: { channelId: string }) => {
      setChannels((prev) =>
        prev.filter((c) => c.id !== channelId)
      );
    };

    // LISTENER: UPDATE
    const handleUpdated = (updatedChannel: any) => {
      setChannels((prev) =>
        prev.map((c) =>
          c.id === updatedChannel.id ? updatedChannel : c
        )
      );
    };

    socket.on("channel:list", handleList);
    socket.on("channel:created", handleCreated);
    socket.on("channel:deleted", handleDeleted);
    socket.on("channel:updated", handleUpdated);

    // ✅ CLEANUP (VERY IMPORTANT)
    return () => {
      socket.off("channel:list", handleList);
      socket.off("channel:created", handleCreated);
      socket.off("channel:deleted", handleDeleted);
      socket.off("channel:updated", handleUpdated);
    };
  }, [socket, workspaceId, userId]); // ✅ FIXED: Added userId

  // ✅ FIX 2: Memoize open handler to prevent unnecessary re-renders
  const handleOpenModal = useCallback(() => {
    setOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setOpen(false);
  }, []);

  // ✅ FIX 3: Memoize channel list to prevent unnecessary re-renders of ChannelItem
  const channelList = useMemo(
    () =>
      channels.map((c) => (
        <ChannelItem
          key={c.id}
          type={c.channelType}
          id={c.id}
          name={c.name}
          creatorId={c.creatorId ?? null}
          currentUserId={userId ?? null}
        />
      )),
    [channels, userId]
  );

  return (
    <>
      <SidebarSection title="Channels" onAdd={handleOpenModal}>
        {loading ? (
          <p className="px-7 text-sm text-gray-300">Loading...</p>
        ) : channels.length > 0 ? (
          channelList
        ) : (
          <p className="px-7 text-sm text-gray-300">No channels</p>
        )}

        <div
          className="group flex items-center justify-between px-7 py-1 rounded cursor-pointer hover:bg-white/10 text-white/80"
          onClick={handleOpenModal}
        >
          <div className="flex items-center gap-2">
            <FiPlus size={14} />
            Add Channel
          </div>
        </div>
      </SidebarSection>

      {workspaceId && userId && (
        <CreateChannelModal
          isOpen={open}
          onClose={handleCloseModal}
          workspaceId={workspaceId}
          userId={userId}
        />
      )}
    </>
  );
}