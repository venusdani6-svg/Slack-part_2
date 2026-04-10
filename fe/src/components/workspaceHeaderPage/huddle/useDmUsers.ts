"use client";

import { useEffect, useState } from "react";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useAuth } from "@/context/Authcontext";

export type DmUser = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
};

const BACKEND = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5050";

export function resolveAvatar(src?: string): string {
  if (!src) return "/Untitled.png";
  if (src.startsWith("http")) return src;
  return `${BACKEND}${src}`;
}

type RawUser = {
  id?: string;
  name?: string;
  email?: string;
  avatar?: string;
  title?: string;
};

/**
 * Fetches all workspace members for the DM section.
 * Excludes the current user. Presence is read per-card via usePresenceStore.
 */
export function useDmUsers() {
  const [users, setUsers] = useState<DmUser[]>([]);
  const [loading, setLoading] = useState(true);
  const workspaceId = useWorkspaceId();
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // All setState calls happen inside the async callback — never synchronously in the effect body
    let cancelled = false;

    const load = async () => {
      if (!workspaceId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch(`/api/workspaces/${workspaceId}/users`);
        const data: RawUser[] = res.ok ? await res.json() : [];
        if (cancelled) return;
        const mapped: DmUser[] = (Array.isArray(data) ? data : [])
          .filter((u) => u.id !== currentUser?.id)
          .map((u) => ({
            id: u.id ?? "",
            name: u.name ?? u.email ?? "Unknown",
            email: u.email ?? "",
            avatar: resolveAvatar(u.avatar),
            title: u.title ?? "",
          }));
        setUsers(mapped);
      } catch {
        if (!cancelled) setUsers([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [workspaceId, currentUser?.id]);

  return { users, loading };
}
