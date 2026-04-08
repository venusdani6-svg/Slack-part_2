"use client";

import { useEffect, useCallback } from "react";
import { useDirectoryStore } from "@/store/directory-store";
import type { DirectoryUser } from "@/lib/mapArchiveUser";
import { useState } from "react";

export type { DirectoryUser };
export type UpdatePayload = Pick<DirectoryUser, "name" | "title" | "role" | "status">;

export function useWorkspaceUsers(workspaceId: string | undefined) {
    const { setUsers, patchUser, users, orderedIds } = useDirectoryStore();
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
                if (!cancelled) {
                    // Seed the global store — single source of truth
                    setUsers(Array.isArray(data) ? data : []);
                }
            })
            .catch((err: Error) => {
                if (!cancelled) setError(err.message ?? "Failed to load users");
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [workspaceId, setUsers]);

    /**
     * Optimistic update: patch store immediately, call API, reconcile or rollback.
     */
    const updateUser = useCallback(
        async (userId: string, patch: UpdatePayload) => {
            // 1. Snapshot for rollback
            const snapshot = useDirectoryStore.getState().users[userId];

            // 2. Optimistic — update store instantly
            patchUser(userId, patch);

            try {
                const res = await fetch(`/api/users/${userId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(patch),
                });

                if (!res.ok) throw new Error(`HTTP ${res.status}`);

                const updated: DirectoryUser = await res.json();
                // 3. Reconcile with server response
                patchUser(userId, updated);
            } catch {
                // 4. Rollback
                if (snapshot) patchUser(userId, snapshot);
            }
        },
        [patchUser]
    );

    // Derive ordered user list from store
    const userList = orderedIds.map((id) => users[id]).filter(Boolean) as DirectoryUser[];

    return { users: userList, loading, error, updateUser };
}
