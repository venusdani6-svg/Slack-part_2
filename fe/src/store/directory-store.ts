import { create } from "zustand";
import type { DirectoryUser } from "@/lib/mapArchiveUser";

type DirectoryStore = {
    /** userId → DirectoryUser */
    users: Record<string, DirectoryUser>;

    /** Seed from initial API fetch */
    setUsers: (list: DirectoryUser[]) => void;

    /** Patch a single user — used by socket updates and optimistic saves */
    patchUser: (id: string, patch: Partial<DirectoryUser>) => void;

    /** Ordered list of ids for the current workspace (preserves fetch order) */
    orderedIds: string[];
};

export const useDirectoryStore = create<DirectoryStore>((set) => ({
    users: {},
    orderedIds: [],

    setUsers: (list) =>
        set({
            users: Object.fromEntries(list.map((u) => [u.id, u])),
            orderedIds: list.map((u) => u.id),
        }),

    patchUser: (id, patch) =>
        set((state) => {
            const existing = state.users[id];
            if (!existing) return state;
            return {
                users: {
                    ...state.users,
                    [id]: { ...existing, ...patch },
                },
            };
        }),
}));
