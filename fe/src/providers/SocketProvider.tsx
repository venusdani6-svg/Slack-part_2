"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { usePresenceStore } from "@/store/presence-store";
import { useActivityStore } from "@/store/activity-store";
import { useDirectoryStore } from "@/store/directory-store";
import { ActivityItem } from "@/lib/api/activity";

const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }: { children: React.ReactNode }) {
    const [socket, setSocket] = useState<Socket | null>(null);

    // Stable refs so the socket useEffect runs exactly once
    const setOnlineRef    = useRef(usePresenceStore.getState().setOnline);
    const setOfflineRef   = useRef(usePresenceStore.getState().setOffline);
    const setAllOnlineRef = useRef(usePresenceStore.getState().setAllOnline);
    const prependItemRef  = useRef(useActivityStore.getState().prependItem);
    const patchUserRef    = useRef(useDirectoryStore.getState().patchUser);

    useEffect(() => {
        return usePresenceStore.subscribe((state) => {
            setOnlineRef.current    = state.setOnline;
            setOfflineRef.current   = state.setOffline;
            setAllOnlineRef.current = state.setAllOnline;
        });
    }, []);
    useEffect(() => {
        return useActivityStore.subscribe((state) => {
            prependItemRef.current = state.prependItem;
        });
    }, []);
    useEffect(() => {
        return useDirectoryStore.subscribe((state) => {
            patchUserRef.current = state.patchUser;
        });
    }, []);

    useEffect(() => {
        const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
        if (!socketUrl) {
            console.error("NEXT_PUBLIC_SOCKET_URL is not set");
            return;
        }

        const userId = typeof window !== "undefined"
            ? localStorage.getItem("userId") ?? undefined
            : undefined;

        const socketInstance = io(socketUrl, {
            query: userId ? { userId } : {},
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        setSocket(socketInstance);

        socketInstance.on("connect", () => {
            const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
            if (uid) {
                socketInstance.emit("register_user", uid);
                socketInstance.emit("join_activity", uid);
                setOnlineRef.current(uid);
            }
        });

        socketInstance.on("presence:snapshot", (onlineIds: string[]) => {
            setAllOnlineRef.current(onlineIds);
            const uid = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
            if (uid) setOnlineRef.current(uid);
        });

        socketInstance.on("user_presence", (payload: { userId: string; isOnline: boolean }) => {
            if (payload.isOnline) setOnlineRef.current(payload.userId);
            else setOfflineRef.current(payload.userId);
        });

        socketInstance.on("new_activity", (item: ActivityItem) => {
            prependItemRef.current(item);
        });

        // Profile updates from ProfileSidebar -> instantly reflect in directory cards
        socketInstance.on("updated_profile", (payload: {
            id?: string;
            userId?: string;
            dispname?: string;
            avatar?: string;
        }) => {
            const uid = payload.id ?? payload.userId;
            if (!uid) return;
            patchUserRef.current(uid, {
                ...(payload.dispname !== undefined && { name: payload.dispname }),
                ...(payload.avatar   !== undefined && { avatar: payload.avatar }),
            });
        });

        socketInstance.on("channel:access_denied", ({ message }: { message: string }) => {
            if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("channel:access_denied", { detail: { message } }));
            }
        });

        return () => {
            socketInstance.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
}
