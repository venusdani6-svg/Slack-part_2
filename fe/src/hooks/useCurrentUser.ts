"use client";

import { useAuth } from "@/context/Authcontext";

/**
 * Returns the currently authenticated user's identity.
 * Reads from AuthContext which is populated by /api/auth/me on mount.
 */
export function useCurrentUser() {
    const { user } = useAuth();
    return {
        id: user?.id ?? null,
        email: user?.email ?? null,
        name: user?.dispname ?? user?.fullname ?? null,
        avatar: user?.avatar ?? null,
    };
}
