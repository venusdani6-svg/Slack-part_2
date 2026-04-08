"use client";

import { useAuth } from "@/context/Authcontext";
import { getDmConversations, DmConversationItem } from "@/lib/api/dm";
import { usePresenceStore, presenceColor } from "@/store/presence-store";
import { useSocket } from "@/providers/SocketProvider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiPlus } from "react-icons/fi";
import NewDmModal from "../DmPage/NewDmModal";
import SidebarSection from "./SidebarSection";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useMessageStore } from "@/store/message-store";
import { getAvatarUrl, getDisplayName } from "@/lib/messageUtils";

export default function DMList() {
    const { user } = useAuth();
    const router = useRouter();
    const workspaceId = useWorkspaceId();
    const { socket } = useSocket();

    const [conversations, setConversations] = useState<DmConversationItem[]>([]);
    const [showModal, setShowModal] = useState(false);

    const { setFlag, flag } = useMessageStore();
    const { isOnline } = usePresenceStore();

    const loadConversations = () => {
        if (!workspaceId || !user?.id) return;
        getDmConversations(workspaceId, user.id)
            .then(setConversations)
            .catch(console.error);
    };

    useEffect(() => {
        loadConversations();
    }, [workspaceId, user?.id]);

    // Real-time avatar/dispname updates from profile changes
    useEffect(() => {
        if (!socket) return;

        const onProfileUpdated = (data: { userId?: string; id?: string; dispname?: string; avatar?: string }) => {
            const updatedUserId = data?.userId ?? data?.id;
            if (!updatedUserId || !data.avatar) return;

            setConversations((prev) =>
                prev.map((conv) => {
                    if (conv.otherUser?.id !== updatedUserId) return conv;
                    return {
                        ...conv,
                        otherUser: {
                            ...conv.otherUser,
                            avatar: data.avatar ?? conv.otherUser.avatar,
                            dispname: data.dispname ?? conv.otherUser.dispname,
                        },
                    };
                }),
            );
        };

        socket.on("updated_profile", onProfileUpdated);
        return () => {
            socket.off("updated_profile", onProfileUpdated);
        };
    }, [socket]);

    const getAvatarUrlForConv = (avatar: string | undefined) =>
        getAvatarUrl(avatar);

    const getDisplayNameForConv = (conv: DmConversationItem) =>
        getDisplayName(conv.otherUser);

    const handleModalClose = () => {
        setShowModal(false);
        loadConversations();
    };

    const pageNation = (id: string) => {
        router.push(`/${workspaceId}/dm/${id}`);
        setFlag("");
    };

    return (
        <>
            <SidebarSection title="Direct Messages" onAdd={() => setShowModal(true)}>
                {conversations.length === 0 ? (
                    <p className="px-7 text-xs text-white/50 py-1">No direct messages yet</p>
                ) : (
                    conversations.map((conv) => {
                        const isActive =
                            !flag &&
                            typeof window !== "undefined" &&
                            window.location.pathname.includes(conv.id);

                        const otherUserId = conv.otherUser?.id;
                        const online = otherUserId ? isOnline(otherUserId) : false;

                        return (
                            <button
                                key={conv.id}
                                onClick={() => pageNation(conv.id)}
                                className={`group w-full flex items-center gap-2 px-7 py-1 rounded cursor-pointer text-left ${
                                    isActive
                                        ? "bg-[#f9edff] text-[#39063a] font-medium"
                                        : "hover:bg-white/10 text-white/80"
                                }`}
                            >
                                {/* Avatar with presence dot */}
                                <div className="relative shrink-0">
                                    <img
                                        src={getAvatarUrlForConv(conv.otherUser?.avatar)}
                                        alt={getDisplayNameForConv(conv)}
                                        className="w-5 h-5 rounded"
                                    />
                                    {/* Presence dot */}
                                    <span
                                        className={`absolute bottom-[-1px] right-[-1px] w-2 h-2 rounded-full border border-[rgb(92,42,92)] ${presenceColor(online)}`}
                                    />
                                </div>
                                <span className="text-sm truncate">{getDisplayNameForConv(conv)}</span>
                            </button>
                        );
                    })
                )}

                <button
                    onClick={() => setShowModal(true)}
                    className="group flex items-center gap-2 px-7 py-1 rounded cursor-pointer hover:bg-white/10 text-white/80 w-full text-left"
                >
                    <FiPlus size={14} />
                    <span className="text-sm">New message</span>
                </button>
            </SidebarSection>

            {showModal && <NewDmModal onClose={handleModalClose} />}
        </>
    );
}
