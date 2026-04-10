"use client";

import WorkspaceAvatar from "@/components/WorkSpace/WorkspaceAvatar";
import NavItem from "@/components/WorkSpace/NavItem";
import CreateMenu from "@/components/WorkSpace/CreateMenu";
import WorkspaceMenu from "@/components/WorkSpace/WorkspaceMenu";
import { useSocket } from "@/providers/SocketProvider";
import { useSidebarStore } from "@/store/sidebar-store";
import { useActivityStore } from "@/store/activity-store";
import { useAuth } from "@/context/Authcontext";
import type { User } from "@/context/Authcontext";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

type WorkSpaceProps = {
    userData: User | null;
};

export const WorkSpace = ({ userData }: WorkSpaceProps) => {
    const { socket } = useSocket();
    const { next, prev, incrementUnread, clearUnread, setUnread } = useSidebarStore();
    const { unreadCount: activityUnread } = useActivityStore();
    const { updateCurrentUser } = useAuth();
    const pathname = usePathname();

    // Sync activity unread count into the sidebar badge
    useEffect(() => {
        setUnread("activity", activityUnread);
    }, [activityUnread, setUnread]);

    // Clear unread for the currently active section
    useEffect(() => {
        if (pathname?.includes("/dm/")) {
            clearUnread("dms");
        } else if (pathname?.match(/\/[^/]+\/[^/]+/)) {
            clearUnread("home");
        }
    }, [pathname, clearUnread]);

    // Keyboard navigation
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") next();
            if (e.key === "ArrowUp") prev();
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [next, prev]);

    // Socket: profile updates + unread badge increments
    useEffect(() => {
        if (!socket) return;

        const handleProfileUpdate = (data: { userId?: string; id?: string; dispname?: string; avatar?: string }) => {
            const updatedId = data?.userId ?? data?.id;
            if (updatedId && userData?.id && updatedId === userData.id) {
                // Update AuthContext so UserCard and WorkspaceMenu re-render instantly
                updateCurrentUser({ dispname: data.dispname, avatar: data.avatar });
            }
        };

        socket.on("updated_profile", handleProfileUpdate);

        socket.on("new_message", () => {
            if (!pathname?.match(/\/[^/]+\/[^/]+/) || pathname?.includes("/dm/")) {
                incrementUnread("home");
            }
        });

        socket.on("new_dm_message", () => {
            if (!pathname?.includes("/dm/")) {
                incrementUnread("dms");
            }
        });

        return () => {
            socket.off("updated_profile", handleProfileUpdate);
            socket.off("new_message");
            socket.off("new_dm_message");
        };
    }, [socket, pathname, incrementUnread, userData?.id, updateCurrentUser]);

    return (
        <div className="w-[70px] min-w-[70px] bg-gradient-to-b from-[#3F0E40] to-[#4A154B] flex flex-col items-center py-2">
            <div className="mb-3">
                <WorkspaceAvatar userData={userData} />
            </div>

            <div className="flex flex-col items-center gap-4 mt-2">
                <NavItem id="home" label="Home" />
                <NavItem id="dms" label="DMs" />
                <NavItem id="activity" label="Activity" />
                <NavItem id="files" label="Files" />
                <NavItem id="more" label="More" />
            </div>

            <div className="mt-auto flex flex-col items-center gap-4">
                <CreateMenu />
                <WorkspaceMenu userData={userData} />
            </div>
        </div>
    );
};
