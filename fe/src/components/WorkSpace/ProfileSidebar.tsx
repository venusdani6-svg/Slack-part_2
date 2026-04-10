"use client";

import EditProfileModal from "./EditProfileModal";
import { useEffect, useState } from "react";
import { getUserById } from "@/lib/api";
import { useSocket } from "@/providers/SocketProvider";
import { useMessageStore } from "@/store/message-store";
import { useDirectoryStore } from "@/store/directory-store";
import { useAuth } from "@/context/Authcontext";

type Presence = "online" | "idle" | "offline";

type SidebarUser = {
    id: string;
    name: string;
    email: string;
    dispname: string;
    avatar?: string | null;
    presence?: Presence;
};

type UserDataProp = {
    id: string;
    email?: string;
    fullname?: string;
    dispname?: string | null;
    avatar?: string | null;
};

type Props = {
    open: boolean;
    onClose: () => void;
    userdata: UserDataProp | null;
    readonly?: boolean;
};

export default function ProfileSidebar({ open, onClose, userdata, readonly = false }: Props) {
    const [editOpen, setEditOpen] = useState(false);
    const [user, setUser] = useState<SidebarUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [localTime, setLocalTime] = useState("");

    const { socket } = useSocket();
    const { messages, setMessages } = useMessageStore();
    const patchUser = useDirectoryStore((s) => s.patchUser);
    // updateCurrentUser keeps AuthContext (and UserCard) in sync instantly
    const { updateCurrentUser } = useAuth();
    // Fetch user
    const fetchUser = async (id: string) => {
        try {
            setLoading(true);
            setError(null);
            const data = await getUserById(id);
            setUser({ ...data, presence: "online" });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Failed to load user");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (open && userdata) fetchUser(userdata.id);
    }, [open, userdata]);

    useEffect(() => {
        const updateTime = () => {
            setLocalTime(new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }));
        };
        updateTime();
        const interval = setInterval(updateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (!socket) return;
        const handle = (payload: { id?: string; userId?: string; name?: string; dispname?: string; avatar?: string }) => {
            const uid = payload.id ?? payload.userId;
            setUser((prev) => {
                if (!prev || prev.id !== uid) return prev;
                return {
                    ...prev,
                    name: payload.name ?? prev.name,
                    dispname: payload.dispname ?? prev.dispname,
                    avatar: payload.avatar ?? prev.avatar,
                };
            });
        };
        socket.on("profile:updated", handle);
        socket.on("updated_profile", handle);
        return () => {
            socket.off("profile:updated", handle);
            socket.off("updated_profile", handle);
        };
    }, [socket]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    const handleSaveProfile = async (data: { name?: string; dispname?: string; avatar?: File | null }) => {
        if (!userdata?.id) return;
        try {
            let avatar = user?.avatar ?? null;

            const formData = new FormData();
            formData.append("name", data.name ?? "");
            formData.append("dispname", data.dispname ?? data.name ?? "");
            if (data.avatar instanceof File) {
                formData.append("avatar", data.avatar);
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/user/profile/${userdata.id}`,
                { method: "PUT", body: formData },
            );

            if (!res.ok) throw new Error("Profile update failed");

            const result = await res.json();
            avatar = result.avatar ?? avatar;

            // 1. Update AuthContext — UserCard reads currentUser from here, re-renders instantly
            if (!readonly) {
                updateCurrentUser({
                    dispname: result.dispname ?? data.dispname ?? data.name,
                    avatar: result.avatar ?? avatar ?? undefined,
                });
            }

            // 2. Update directory store — directory cards re-render without waiting for socket
            patchUser(userdata.id, {
                name: result.dispname ?? data.dispname ?? data.name,
                avatar: result.avatar ?? avatar ?? undefined,
            });

            // 3. Broadcast via socket so other clients update too
            socket?.emit("profile:update", {
                id: userdata.id,
                name: result.name,
                dispname: result.dispname,
                avatar: result.avatar,
            });

            // 4. Update message store
            setMessages(
                messages.map((m) =>
                    m.sender?.id === userdata.id
                        ? { ...m, sender: { ...m.sender, dispname: result.dispname ?? m.sender.dispname, avatar: result.avatar ?? m.sender.avatar } }
                        : m,
                ),
            );

            // 5. Update sidebar local state
            setUser((prev) =>
                prev ? { ...prev, name: result.name ?? data.name ?? prev.name, dispname: result.dispname ?? data.dispname ?? data.name ?? prev.dispname, avatar } : prev,
            );

            setEditOpen(false);
        } catch (err) {
            console.error(err);
        }
    };

    const getPresence = () => {
        switch (user?.presence) {
            case "online": return { color: "bg-green-500", text: "Active" };
            case "idle":   return { color: "bg-yellow-400", text: "Away" };
            default:       return { color: "bg-gray-400", text: "Offline" };
        }
    };
    const presence = getPresence();

    return (
        <>
            <div
                onClick={onClose}
                className={`fixed inset-0 z-40 bg-black/30 transition-opacity duration-300 ease-out ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
            />
            <div
                className={`fixed right-0 top-0 h-full w-[480px] bg-gray-50 z-50 shadow-[-8px_0_24px_rgba(0,0,0,0.12)] transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? "translate-x-0" : "translate-x-full"}`}
            >
                <div className="flex justify-between items-center px-5 py-4">
                    <h2 className="text-[18px] font-semibold text-[#1d1c1de3]">Profile</h2>
                    <button onClick={onClose} className="text-xl text-gray-500 hover:text-black transition">✕</button>
                </div>

                <div className="px-5 py-5">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}

                    {user && (
                        <>
                            <div className="flex flex-col items-center">
                                <div className="relative w-[280px] h-[280px] rounded-xl overflow-hidden bg-[#7B2B8F] group">
                                    {user.avatar ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={`${process.env.NEXT_PUBLIC_SOCKET_URL}${user.avatar}`} alt={user.dispname} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <div className="w-[100px] h-[100px] bg-white rounded-full" />
                                        </div>
                                    )}
                                    {!readonly && (
                                        <div
                                            onClick={() => setEditOpen(true)}
                                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 ease-out flex items-center justify-center cursor-pointer"
                                        >
                                            <span className="text-white text-sm font-medium">Change photo</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-start gap-70 mt-5">
                                    <div className="text-[23px] font-semibold">{user.dispname}</div>
                                    {!readonly && (
                                        <button onClick={() => setEditOpen(true)} className="text-[16px] font-bold text-[#1264A3] hover:underline mt-1">Edit</button>
                                    )}
                                </div>

                                <div>+ Add name pronunciation</div>
                                <div className="flex items-center gap-2 mt-3 text-[14px] text-gray-600">
                                    <div className={`w-[8px] h-[8px] rounded-full ${presence.color}`} />
                                    {presence.text}
                                </div>
                                <div className="flex items-center gap-2 mt-2 text-[13px] text-gray-500">
                                    🕒 {localTime} local time
                                </div>
                            </div>

                            {!readonly && (
                                <div className="flex gap-2 mt-5">
                                    <button className="flex-1 h-[36px] border rounded-md hover:bg-gray-100 transition">Set a status</button>
                                    <button className="flex-1 h-[36px] border rounded-md hover:bg-gray-100 transition">View as</button>
                                    <button className="w-[36px] border rounded-md hover:bg-gray-100 transition">⋮</button>
                                </div>
                            )}

                            <div className="mt-6 border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-[14px]">Contact information</span>
                                    {!readonly && <button className="text-[#1264A3] text-sm hover:underline">Edit</button>}
                                </div>
                                <div className="mt-3">
                                    <div className="text-xs text-gray-500">Email Address</div>
                                    <div className="text-sm text-[#1264A3]">{user.email}</div>
                                </div>
                            </div>

                            <div className="mt-6 border-t pt-4">
                                <div className="flex justify-between">
                                    <span className="font-semibold text-[14px]">About me</span>
                                    {!readonly && <button className="text-[#1264A3] text-sm hover:underline">Edit</button>}
                                </div>
                                <div className="mt-2 text-sm text-[#1264A3] cursor-pointer hover:underline">+ Add Start Date</div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <EditProfileModal
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSave={handleSaveProfile}
                userdata={user}
            />
        </>
    );
}
