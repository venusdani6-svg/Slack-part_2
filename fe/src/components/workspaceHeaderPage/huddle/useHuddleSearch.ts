"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useSocket } from "@/providers/SocketProvider";
import { useAuth } from "@/context/Authcontext";

export type PickerItemType = "channel" | "user";

export type PickerItem = {
  id: string;
  type: PickerItemType;
  label: string;
  sublabel?: string;
  avatar?: string;
  isPrivate?: boolean;
};

type RawChannel = {
  id?: string;
  name?: string;
  channelType?: string;
  members?: unknown[];
};

type RawUser = {
  id?: string;
  name?: string;
  email?: string;
  title?: string;
  avatar?: string;
};

const BACKEND = process.env.NEXT_PUBLIC_SOCKET_URL ?? "http://localhost:5050";

function resolveAvatar(src?: string): string | undefined {
  if (!src) return undefined;
  if (src.startsWith("http")) return src;
  return `${BACKEND}${src}`;
}

export function useHuddleSearch(query: string) {
  const [results, setResults] = useState<PickerItem[]>([]);
  const [loading, setLoading] = useState(false);
  const workspaceId = useWorkspaceId();
  const { socket } = useSocket();
  const { user } = useAuth();

  // Channels cached from socket — stored in a ref so runSearch always sees latest
  const channelsRef = useRef<PickerItem[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!socket || !workspaceId || !user?.id) return;
    socket.emit("channel:list", { workspaceId, userId: user.id });
    const handler = (data: RawChannel[]) => {
      channelsRef.current = data.map((ch) => ({
        id: ch.id ?? "",
        type: "channel" as PickerItemType,
        label: ch.name ?? "Unnamed",
        sublabel: `${ch.members?.length ?? 0} members`,
        isPrivate: ch.channelType === "private",
      }));
    };
    socket.on("channel:list", handler);
    return () => { socket.off("channel:list", handler); };
  }, [socket, workspaceId, user?.id]);

  const runSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      const lower = q.toLowerCase();
      const matchedChannels = channelsRef.current.filter((c) =>
        c.label.toLowerCase().includes(lower)
      );

      let matchedUsers: PickerItem[] = [];
      if (workspaceId) {
        try {
          const res = await fetch(`/api/workspaces/${workspaceId}/users`);
          if (res.ok) {
            const data: RawUser[] = await res.json();
            matchedUsers = data
              .filter(
                (u) =>
                  (u.name ?? "").toLowerCase().includes(lower) ||
                  (u.email ?? "").toLowerCase().includes(lower) ||
                  (u.title ?? "").toLowerCase().includes(lower)
              )
              .map((u) => ({
                id: u.id ?? "",
                type: "user" as PickerItemType,
                label: u.name ?? u.email ?? "Unknown",
                sublabel: u.title || u.email,
                avatar: resolveAvatar(u.avatar),
              }));
          }
        } catch {
          // silently ignore
        }
      }

      setResults([...matchedChannels, ...matchedUsers]);
      setLoading(false);
    },
    [workspaceId]
  );

  // Debounce — setState only happens inside the async runSearch callback, never synchronously
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => { runSearch(query); }, 250);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [query, runSearch]);

  return { results, loading };
}
