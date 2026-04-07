/**
 * Normalization layer.
 * Maps ANY backend/archive user shape → canonical DirectoryUser.
 * Never throws. Always returns safe fallback values.
 */

export type DirectoryUser = {
    id: string;
    name: string;
    email: string;
    avatar: string;
    title: string;
    role: string;
    location: string;
    status: "online" | "offline" | "away";
};

export function mapArchiveUser(raw: Record<string, any>): DirectoryUser {
    const id: string =
        raw?.id ?? raw?.userId ?? raw?.user_id ?? crypto.randomUUID();

    const name: string =
        raw?.dispname ||
        raw?.name ||
        raw?.fullName ||
        raw?.full_name ||
        raw?.profile?.name ||
        raw?.username ||
        (raw?.email ? String(raw.email).split("@")[0] : "") ||
        "Unknown";

    const email: string = raw?.email ?? raw?.mail ?? "";

    const rawAvatar: string =
        raw?.avatar || raw?.profile?.image || raw?.profileImage || "";

    const avatar: string = rawAvatar || "/Untitled.png";

    const title: string =
        raw?.title || raw?.jobTitle || raw?.job_title || raw?.position || "Member";

    const role: string = raw?.role ?? raw?.userRole ?? "user";

    const location: string = raw?.location ?? raw?.city ?? "";

    const rawStatus = raw?.status ?? "offline";
    const status: DirectoryUser["status"] =
        rawStatus === "online" || rawStatus === "away" ? rawStatus : "offline";

    return { id, name, email, avatar, title, role, location, status };
}
