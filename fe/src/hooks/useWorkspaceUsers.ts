"use client";

import { useState, useEffect, useCallback } from "react";
import type { DirectoryUser } from "@/lib/mapArchiveUser";

export type { DirectoryUser };
export type UpdatePayload = Pick<DirectoryUser, "name" | "title" | "role" | "status">;

export function useWorkspaceUsers(workspaceId: string | undefined) {
    const [users, setUsers] = useState<DirectoryUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!workspaceId) {
            setLoading(false);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(`/api/workspaces/${workspaceId}/users`)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json() as Promise<DirectoryUser[]>;
            })
            .then((data) => {
                if (!cancelled) setUsers(Array.isArray(data) ? data : []);
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message ?? "Failed to load users");
                if (!cancelled) setUsers([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [workspaceId]);

    /**
     * Optimistic update: patch local state immediately,
     * call PUT /api/users/:id, reconcile or rollback.
     */
    const updateUser = useCallback(
        async (userId: string, patch: UpdatePayload) => {
            const snapshot = users;

            // 1. Optimistic
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, ...patch } : u))
            );

            try {
                const res = await fetch(`/api/users/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(patch),
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const updated: DirectoryUser = await res.json();
                // 2. Reconcile with server response
                setUsers((prev) =>
                    prev.map((u) => (u.id === userId ? updated : u))
                );
            } catch {
                // 3. Rollback
                setUsers(snapshot);
            }
        },
        [users]
    );

    return { users, loading, error, updateUser };
}
