"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { useThreadStore } from "@/store/thread-store";
import { getDmConversations, getDmMessages, getDmThread, DmConversationItem } from "@/lib/api/dm";
import { getAvatarUrl, getDisplayName, formatLastReply } from "@/lib/messageUtils";
import { api } from "@/api";
import { Thread } from "@/components/ThreadPage/ThreadPage";
import { useThreadResize } from "@/hooks/useThreadResize";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ThreadParent {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  lastReplyAt: string | null;
  sender: { id: string; dispname: string | null; avatar: string; email?: string } | null;
  reactions: any[];
  files: any[];
  parentId: string | null;
  threadRootId: string | null;
  kind: "dm" | "public" | "private";
  channelId?: string;
  channelName?: string;
  dmConversationId?: string;
  otherUserName?: string;
}

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export default function ThreadsPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const workspaceId = useWorkspaceId();

  const { openThread, setThreadMessages, closeThread, isOpen, selectedMessage } = useThreadStore();
  const { threadWidth, onDragStart, THREAD_MIN, THREAD_MAX } = useThreadResize();

  const [threads, setThreads] = useState<ThreadParent[]>([]);
  const [loading, setLoading] = useState(true);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [activeDmConvId, setActiveDmConvId] = useState<string | undefined>(undefined);
  const [activeChannelId, setActiveChannelId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user?.id || !workspaceId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const collected: ThreadParent[] = [];

      // 1. DM threads
      try {
        const convs = await getDmConversations(workspaceId, user.id);
        await Promise.all(
          safeArray<DmConversationItem>(convs).map(async (conv) => {
            try {
              const msgs = await getDmMessages(workspaceId, conv.id, user.id);
              safeArray(msgs)
                .filter((m: any) => !m.parentId && (m.replyCount ?? 0) > 0)
                .forEach((m: any) => {
                  collected.push({
                    id: m.id,
                    content: m.content ?? "",
                    createdAt: m.createdAt,
                    updatedAt: m.updatedAt,
                    replyCount: m.replyCount ?? 0,
                    lastReplyAt: m.lastReplyAt ?? null,
                    sender: m.sender ?? null,
                    reactions: safeArray(m.reactions),
                    files: safeArray(m.files),
                    parentId: null,
                    threadRootId: null,
                    kind: "dm",
                    dmConversationId: conv.id,
                    otherUserName: conv.otherUser?.dispname || conv.otherUser?.email || "Direct Message",
                  });
                });
            } catch { /* skip */ }
          }),
        );
      } catch { /* skip */ }

      // 2. Channel threads
      if (socket) {
        const channelList = await new Promise<any[]>((resolve) => {
          const timer = setTimeout(() => resolve([]), 3000);
          socket.once("channel:list", (data: any[]) => {
            clearTimeout(timer);
            resolve(safeArray(data));
          });
          socket.emit("channel:list", { workspaceId, userId: user.id });
        });

        await Promise.all(
          channelList.map(async (ch: any) => {
            try {
              const res = await api.get(`/api/channels/${ch.id}/messages`);
              safeArray<any>(res.data)
                .filter((m: any) => !m.parentId && (m.replyCount ?? 0) > 0)
                .forEach((m: any) => {
                  collected.push({
                    id: m.id,
                    content: m.content ?? "",
                    createdAt: m.createdAt,
                    updatedAt: m.updatedAt,
                    replyCount: m.replyCount ?? 0,
                    lastReplyAt: m.lastReplyAt ?? null,
                    sender: m.sender ?? null,
                    reactions: safeArray(m.reactions),
                    files: safeArray(m.files),
                    parentId: null,
                    threadRootId: null,
                    kind: ch.channelType === "private" ? "private" : "public",
                    channelId: ch.id,
                    channelName: ch.name ?? ch.id,
                  });
                });
            } catch { /* skip */ }
          }),
        );
      }

      if (!cancelled) {
        collected.sort((a, b) => {
          const at = a.lastReplyAt ?? a.createdAt;
          const bt = b.lastReplyAt ?? b.createdAt;
          return new Date(bt).getTime() - new Date(at).getTime();
        });
        setThreads(collected);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [user?.id, workspaceId, socket]);

  const dmThreads = useMemo(() => threads.filter((t) => t.kind === "dm"), [threads]);
  const publicThreads = useMemo(() => threads.filter((t) => t.kind === "public"), [threads]);
  const privateThreads = useMemo(() => threads.filter((t) => t.kind === "private"), [threads]);

  const handleOpenThread = async (t: ThreadParent) => {
    if (openingId === t.id) return;
    setOpeningId(t.id);
    setActiveDmConvId(t.dmConversationId);
    setActiveChannelId(t.channelId);

    const rootAsThreadMsg = {
      id: t.id,
      content: t.content,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
      parentId: null,
      threadRootId: null,
      replyCount: t.replyCount,
      lastReplyAt: t.lastReplyAt,
      reactions: t.reactions,
      files: t.files,
      sender: t.sender ?? { id: "", dispname: null, avatar: "/uploads/avatar.png" },
    };

    openThread(rootAsThreadMsg as any);

    try {
      let threadMsgs: any[] = [];
      if (t.kind === "dm" && t.dmConversationId && user?.id && workspaceId) {
        threadMsgs = await getDmThread(workspaceId, t.dmConversationId, t.id, user.id);
      } else if (t.channelId) {
        const res = await api.get(`/api/channels/${t.channelId}/messages/${t.id}/thread`);
        threadMsgs = safeArray(res.data);
      }
      setThreadMessages(safeArray(threadMsgs));
    } catch {
      setThreadMessages([rootAsThreadMsg as any]);
    } finally {
      setOpeningId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Loading threads…
      </div>
    );
  }

  if (threads.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <span className="text-4xl">💬</span>
        <p className="text-sm font-medium">No threads yet</p>
        <p className="text-xs text-gray-300">Reply to a message to start a thread</p>
      </div>
    );
  }

  return (
    <div className="flex h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6 min-w-0">
        <h2 className="text-xl font-bold text-gray-800">Threads</h2>

        {dmThreads.length > 0 && (
          <Section title="Direct Messages">
            {dmThreads.map((t) => (
              <ThreadCard
                key={t.id}
                thread={t}
                isOpening={openingId === t.id}
                isSelected={selectedMessage?.id === t.id}
                onOpen={handleOpenThread}
              />
            ))}
          </Section>
        )}

        {publicThreads.length > 0 && (
          <Section title="Public Channels">
            {publicThreads.map((t) => (
              <ThreadCard
                key={t.id}
                thread={t}
                isOpening={openingId === t.id}
                isSelected={selectedMessage?.id === t.id}
                onOpen={handleOpenThread}
              />
            ))}
          </Section>
        )}

        {privateThreads.length > 0 && (
          <Section title="Private Channels">
            {privateThreads.map((t) => (
              <ThreadCard
                key={t.id}
                thread={t}
                isOpening={openingId === t.id}
                isSelected={selectedMessage?.id === t.id}
                onOpen={handleOpenThread}
              />
            ))}
          </Section>
        )}
      </div>

      {isOpen && selectedMessage && (
        <div
          className="relative shrink-0"
          style={{ width: `${threadWidth}px`, minWidth: `${THREAD_MIN}px`, maxWidth: `${THREAD_MAX}px` }}
        >
          <div
            onMouseDown={onDragStart}
            className="absolute top-0 left-0 w-1 h-full cursor-col-resize hover:bg-gray-300/50 transition-colors z-10"
          />
          <Thread
            onCloseThread={closeThread}
            userData={user}
            channelId={activeChannelId}
            dmConversationId={activeDmConvId}
            workspaceId={workspaceId}
          />
        </div>
      )}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 px-1">
        {title}
      </h3>
      <div className="space-y-1">{children}</div>
    </div>
  );
}

function ThreadCard({
  thread,
  isOpening,
  isSelected,
  onOpen,
}: {
  thread: ThreadParent;
  isOpening: boolean;
  isSelected: boolean;
  onOpen: (t: ThreadParent) => void;
}) {
  const preview = thread.content.replace(/<[^>]*>/g, "").trim() || "(attachment)";
  const truncated = preview.length > 120 ? preview.slice(0, 120) + "…" : preview;
  const contextLabel =
    thread.kind === "dm"
      ? `DM · ${thread.otherUserName ?? "Direct Message"}`
      : `#${thread.channelName ?? thread.channelId}`;

  return (
    <button
      onClick={() => onOpen(thread)}
      disabled={isOpening}
      className={`w-full text-left px-3 py-3 rounded-lg border transition-colors ${
        isSelected
          ? "border-[#007a5a]/40 bg-[#007a5a]/5"
          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
      } ${isOpening ? "opacity-60 cursor-wait" : ""}`}
    >
      <p className="text-xs text-gray-400 mb-1">{contextLabel}</p>
      <div className="flex items-start gap-2">
        <img
          src={getAvatarUrl(thread.sender?.avatar)}
          alt={getDisplayName(thread.sender)}
          className="w-7 h-7 rounded-md object-cover shrink-0 mt-0.5"
          onError={(e) => { (e.currentTarget as HTMLImageElement).src = getAvatarUrl(null); }}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {getDisplayName(thread.sender)}
            </span>
            <span className="text-xs text-gray-400 shrink-0">
              {formatLastReply(thread.lastReplyAt)}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-0.5 line-clamp-2">{truncated}</p>
        </div>
      </div>
      <p className="text-xs text-[#007a5a] font-medium mt-2">
        {thread.replyCount} {thread.replyCount === 1 ? "reply" : "replies"}
      </p>
    </button>
  );
}
