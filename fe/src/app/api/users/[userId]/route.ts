import { NextResponse } from "next/server";
import { mapArchiveUser } from "@/lib/mapArchiveUser";

const BACKEND = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5050";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ userId: string }> }
) {
    const { userId } = await params;

    try {
        const body = await req.json();

        const res = await fetch(
            `${BACKEND}/api/user/directory/${userId}`,
            {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { error: "Update failed" },
                { status: res.status }
            );
        }

        const raw = await res.json();
        return NextResponse.json(mapArchiveUser(raw));
    } catch (err) {
        console.error("[directory] PUT user failed:", err);
        return NextResponse.json({ error: "Internal error" }, { status: 500 });
    }
}
