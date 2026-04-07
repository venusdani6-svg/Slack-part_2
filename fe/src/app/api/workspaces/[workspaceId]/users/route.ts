import { NextResponse } from "next/server";
import { mapArchiveUser } from "@/lib/mapArchiveUser";

const BACKEND = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5050";

export async function GET(
    _req: Request,
    { params }: { params: Promise<{ workspaceId: string }> }
) {
    const { workspaceId } = await params;

    try {
        const res = await fetch(
            `${BACKEND}/api/user/workspace/${workspaceId}`,
            { cache: "no-store" }
        );

        if (!res.ok) {
            // Backend not ready or workspace not found — return empty list, never crash
            return NextResponse.json([]);
        }

        const raw: Record<string, any>[] = await res.json();
        const users = (Array.isArray(raw) ? raw : []).map(mapArchiveUser);
        return NextResponse.json(users);
    } catch (err) {
        console.error("[directory] GET workspace users failed:", err);
        return NextResponse.json([]);
    }
}
