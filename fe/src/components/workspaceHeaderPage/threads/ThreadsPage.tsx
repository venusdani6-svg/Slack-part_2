"use client";

import React, { useCallback, useEffect, useMemo, useState, memo } from "react";
import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";
import { getDmConversations, getDmMessages, getDmThread, DmConversationItem } from "@/lib/api/dm";
import { getAvatarUrl, getDisplayName } from "@/lib/messageUtils";
import { api } from "@/api";
import SlackMessage from "@/components/ui/message/Message";
import MessageEditor from "@/components/ui/messageEditor/MessageEditor";
import { ReactionView } from "@/lib/api/reactions";

// ── Types ─────────────────────────────────────────────────────────────────────

interface RawMessage {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  replyCount: number;
  lastReplyAt: string | null;
  parentId: string | null;
  threadRootId: string | null;
  sender: { id: string; dispname: string | null; avatar: string; email?: string } | null;
  reactions: ReactionView[];
  files: { id: string; name: string; type: string; path: string; size: number }[];
  senderId?: string;
  conversationId?: string;
}

interface ThreadEntry {
  parent: RawMessage;
  replies: RawMessage[];
  kind: "dm" | "public" | "private";
  channelId?: string;
  channelName?: string;
  dmConversationId?: string;
  otherUserName?: string;
}

function safeArray<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

// ── Section header ─────────────────────────────────────────────────────────────

const Section = memo(function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 px-6 py-2 border-b border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          {title}
        </h3>
      </div>
      {children}
    </div>
  );
});

// ── Single thread block ────────────────────────────────────────────────────────

const ThreadBlock = memo(function ThreadBlock({
  entry,
  currentUserId,
  onReplyAdded,
  onReplyUpdated,
  onReplyDeleted,
  onReactionUpdated,
}: {
  entry: ThreadEntry;
  currentUserId: string | undefined;
  onReplyAdded: (parentId: string, reply: RawMessage) => void;
  onReplyUpdated: (messageId: string, content: string, updatedAt: string) => void;
  onReplyDeleted: (messageId: string) => void;
  onReactionUpdated: (messageId: string, reactions: ReactionView[]) => void;
}) {
  const { parent, replies, kind, channelId, channelName, dmConversationId, otherUserName } = entry;

  const contextLabel =
    kind === "dm"
      ? `DM · ${otherUserName ?? "Direct Message"}`
      : `#${channelName ?? channelId}`;

  const noop = useCallback(() => {}, []);

  // Propagate reaction updates from SlackMessage up to entries state
  const handleReactionUpdate = useCallback(
    (msgId: string, reactions: ReactionView[]) => {
      onReactionUpdated(msgId, reactions);
    },
    [onReactionUpdated],
  );

  // Propagate edits from SlackMessage up to entries state
  const handleMessageUpdate = useCallback(
    (msgId: string, newContent: string, newUpdatedAt: string) => {
      onReplyUpdated(msgId, newContent, newUpdatedAt);
    },
    [onReplyUpdated],
  );

  // Propagate deletes from SlackMessage up to entries state
  const handleMessageDelete = useCallback(
    (msgId: string) => {
      onReplyDeleted(msgId);
    },
    [onReplyDeleted],
  );

  return (
    <div className="border-b border-gray-100 last:border-0">
      {/* Context label */}
      <div className="px-6 pt-3 pb-1">
        <span className="text-xs font-medium text-[#007a5a] bg-[#007a5a]/8 px-2 py-0.5 rounded-full">
          {contextLabel}
        </span>
      </div>

      {/* Parent message */}
      <SlackMessage
        state="thread"
        avatar={getAvatarUrl(parent.sender?.avatar)}
        username={getDisplayName(parent.sender)}
        time={parent.createdAt}
        createdAt={parent.createdAt}
        updatedAt={parent.updatedAt}
        text={parent.content}
        files={safeArray(parent.files)}
        reactions={safeArray(parent.reactions)}
        replies={0}
        lastReply=""
        messageId={parent.id}
        channelId={channelId ?? ""}
        currentUserId={currentUserId ?? null}
        senderId={parent.sender?.id}
        onCommentClick={noop}
        onReactionUpdate={handleReactionUpdate}
        hideThreadButton
      />

      {/* Replies */}
      {replies.length > 0 && (
        <div className="ml-[52px] border-l-2 border-gray-100 pl-3 mr-6 mb-2">
          <div className="flex items-center gap-2 py-1.5">
            <span className="text-xs font-semibold text-[#007a5a]">
              {replies.length} {replies.length === 1 ? "reply" : "replies"}
            </span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {replies.map((reply) => (
            <SlackMessage
              key={reply.id}
              state="thread"
              avatar={getAvatarUrl(reply.sender?.avatar)}
              username={getDisplayName(reply.sender)}
              time={reply.createdAt}
              createdAt={reply.createdAt}
              updatedAt={reply.updatedAt}
              text={reply.content}
              files={safeArray(reply.files)}
              reactions={safeArray(reply.reactions)}
              replies={0}
              lastReply=""
              messageId={reply.id}
              channelId={channelId ?? ""}
              currentUserId={currentUserId ?? null}
              senderId={reply.sender?.id}
              onCommentClick={noop}
              onReactionUpdate={handleReactionUpdate}
              onMessageUpdate={handleMessageUpdate}
              onMessageDelete={handleMessageDelete}
              hideThreadButton
            />
          ))}
        </div>
      )}

      {/* Inline reply editor */}
      <div className="px-6 pb-4 pt-1">
        <MessageEditor
          userData={currentUserId ? { id: currentUserId } : null}
          parentMessageId={parent.id}
          dmConversationId={dmConversationId ?? null}
          placeholder="Reply in thread…"
        />
      </div>
    </div>
  );
});

// ── Main page ──────────────────────────────────────────────────────────────────

export default function ThreadsPage() {
  const { user } = useAuth();
  const { socket } = useSocket();
  const workspaceId = useWorkspaceId();

  const [entries, setEntries] = useState<ThreadEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Initial data load ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!user?.id || !workspaceId) return;
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const collected: ThreadEntry[] = [];

      // 1. DM threads
      try {
        const convs = await getDmConversations(workspaceId, user.id);
        await Promise.all(
          safeArray<DmConversationItem>(convs).map(async (conv) => {
            try {
              const msgs = await getDmMessages(workspaceId, conv.id, user.id);
              const parents = safeArray<RawMessage>(msgs).filter(
                (m) => !m.parentId && (m.replyCount ?? 0) > 0,
              );
              await Promise.all(
                parents.map(async (parent) => {
                  try {
                    const thread = await getDmThread(workspaceId, conv.id, parent.id, user.id);
                    const all = safeArray<RawMessage>(thread);
                    collected.push({
                      parent,
                      replies: all.length > 1 ? all.slice(1) : [],
                      kind: "dm",
                      dmConversationId: conv.id,
                      otherUserName: conv.otherUser?.dispname || conv.otherUser?.email || "Direct Message",
                    });
                  } catch {
                    collected.push({
                      parent,
                      replies: [],
                      kind: "dm",
                      dmConversationId: conv.id,
                      otherUserName: conv.otherUser?.dispname || conv.otherUser?.email || "Direct Message",
                    });
                  }
                }),
              );
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
              const parents = safeArray<RawMessage>(res.data).filter(
                (m) => !m.parentId && (m.replyCount ?? 0) > 0,
              );
              await Promise.all(
                parents.map(async (parent) => {
                  try {
                    const tRes = await api.get(`/api/channels/${ch.id}/messages/${parent.id}/thread`);
                    const all = safeArray<RawMessage>(tRes.data);
                    collected.push({
                      parent,
                      replies: all.length > 1 ? all.slice(1) : [],
                      kind: ch.channelType === "private" ? "private" : "public",
                      channelId: ch.id,
                      channelName: ch.name ?? ch.id,
                    });
                  } catch {
                    collected.push({
                      parent,
                      replies: [],
                      kind: ch.channelType === "private" ? "private" : "public",
                      channelId: ch.id,
                      channelName: ch.name ?? ch.id,
                    });
                  }
                }),
              );
            } catch { /* skip */ }
          }),
        );
      }

      if (!cancelled) {
        collected.sort((a, b) => {
          const at = a.parent.lastReplyAt ?? a.parent.createdAt;
          const bt = b.parent.lastReplyAt ?? b.parent.createdAt;
          return new Date(bt).getTime() - new Date(at).getTime();
        });
        setEntries(collected);
        setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [user?.id, workspaceId, socket]);

  // ── Real-time socket listeners ─────────────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // ── DM thread reply arrives ──────────────────────────────────────────────
    const onNewDmThreadMessage = (msg: RawMessage) => {
      if (!msg.parentId) return; // root message — not a reply
      setEntries((prev) =>
        prev.map((e) => {
          if (e.kind !== "dm" || e.parent.id !== msg.parentId) return e;
          // Avoid duplicates
          if (e.replies.some((r) => r.id === msg.id)) return e;
          return {
            ...e,
            replies: [...e.replies, msg],
            parent: { ...e.parent, replyCount: e.parent.replyCount + 1, lastReplyAt: msg.createdAt },
          };
        }),
      );
    };

    // ── Channel thread reply arrives ─────────────────────────────────────────
    const onNewThreadMessage = (msg: RawMessage) => {
      if (!msg.parentId) return;
      setEntries((prev) =>
        prev.map((e) => {
          if (e.kind === "dm" || e.parent.id !== msg.parentId) return e;
          if (e.replies.some((r) => r.id === msg.id)) return e;
          return {
            ...e,
            replies: [...e.replies, msg],
            parent: { ...e.parent, replyCount: e.parent.replyCount + 1, lastReplyAt: msg.createdAt },
          };
        }),
      );
    };

    // ── DM thread root updated (replyCount / lastReplyAt) ────────────────────
    const onDmThreadUpdated = (updatedRoot: RawMessage) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.kind === "dm" && e.parent.id === updatedRoot.id
            ? { ...e, parent: { ...e.parent, replyCount: updatedRoot.replyCount, lastReplyAt: updatedRoot.lastReplyAt } }
            : e,
        ),
      );
    };

    // ── Channel thread root updated ──────────────────────────────────────────
    const onThreadUpdated = (updatedRoot: RawMessage) => {
      setEntries((prev) =>
        prev.map((e) =>
          e.kind !== "dm" && e.parent.id === updatedRoot.id
            ? { ...e, parent: { ...e.parent, replyCount: updatedRoot.replyCount, lastReplyAt: updatedRoot.lastReplyAt } }
            : e,
        ),
      );
    };

    // ── Reaction updated (DM or channel) ────────────────────────────────────
    const onDmReactionUpdated = (payload: { messageId: string; reactions: ReactionView[] }) => {
      setEntries((prev) =>
        prev.map((e) => ({
          ...e,
          parent: e.parent.id === payload.messageId ? { ...e.parent, reactions: payload.reactions } : e.parent,
          replies: e.replies.map((r) =>
            r.id === payload.messageId ? { ...r, reactions: payload.reactions } : r,
          ),
        })),
      );
    };

    const onReactionUpdated = (payload: { messageId: string; reactions: ReactionView[] }) => {
      onDmReactionUpdated(payload); // same shape — reuse
    };

    // ── Message edited ───────────────────────────────────────────────────────
    const onDmMessageEdited = (payload: { messageId: string; content: string; updatedAt: string }) => {
      setEntries((prev) =>
        prev.map((e) => ({
          ...e,
          replies: e.replies.map((r) =>
            r.id === payload.messageId ? { ...r, content: payload.content, updatedAt: payload.updatedAt } : r,
          ),
        })),
      );
    };

    const onMessageEdited = (payload: { messageId: string; content: string; updatedAt: string }) => {
      onDmMessageEdited(payload);
    };

    // ── Message deleted ──────────────────────────────────────────────────────
    const onDmMessageDeleted = (payload: { messageId: string }) => {
      setEntries((prev) =>
        prev.map((e) => ({
          ...e,
          replies: e.replies.filter((r) => r.id !== payload.messageId),
        })),
      );
    };

    const onMessageDeleted = (payload: { messageId: string }) => {
      onDmMessageDeleted(payload);
    };

    // ── Profile updated — refresh avatars/names in entries ───────────────────
    const onProfileUpdated = (data: { userId?: string; id?: string; dispname?: string; avatar?: string }) => {
      const uid = data?.userId ?? data?.id;
      if (!uid) return;
      const patch = (sender: RawMessage["sender"]) => {
        if (!sender || sender.id !== uid) return sender;
        return {
          ...sender,
          dispname: data.dispname ?? sender.dispname,
          avatar: data.avatar ?? sender.avatar,
        };
      };
      setEntries((prev) =>
        prev.map((e) => ({
          ...e,
          parent: { ...e.parent, sender: patch(e.parent.sender) },
          replies: e.replies.map((r) => ({ ...r, sender: patch(r.sender) })),
        })),
      );
    };

    socket.on("new_dm_thread_message", onNewDmThreadMessage);
    socket.on("new_thread_message",    onNewThreadMessage);
    socket.on("dm_thread_updated",     onDmThreadUpdated);
    socket.on("thread_updated",        onThreadUpdated);
    socket.on("dm_reaction_updated",   onDmReactionUpdated);
    socket.on("reaction_updated",      onReactionUpdated);
    socket.on("dmMessageEdited",       onDmMessageEdited);
    socket.on("messageEdited",         onMessageEdited);
    socket.on("dmMessageDeleted",      onDmMessageDeleted);
    socket.on("messageDeleted",        onMessageDeleted);
    socket.on("updated_profile",       onProfileUpdated);

    return () => {
      socket.off("new_dm_thread_message", onNewDmThreadMessage);
      socket.off("new_thread_message",    onNewThreadMessage);
      socket.off("dm_thread_updated",     onDmThreadUpdated);
      socket.off("thread_updated",        onThreadUpdated);
      socket.off("dm_reaction_updated",   onDmReactionUpdated);
      socket.off("reaction_updated",      onReactionUpdated);
      socket.off("dmMessageEdited",       onDmMessageEdited);
      socket.off("messageEdited",         onMessageEdited);
      socket.off("dmMessageDeleted",      onDmMessageDeleted);
      socket.off("messageDeleted",        onMessageDeleted);
      socket.off("updated_profile",       onProfileUpdated);
    };
  }, [socket]);

  // ── Stable callbacks passed down to ThreadBlock ────────────────────────────

  const handleReplyAdded = useCallback((parentId: string, reply: RawMessage) => {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.parent.id !== parentId) return e;
        if (e.replies.some((r) => r.id === reply.id)) return e;
        return { ...e, replies: [...e.replies, reply] };
      }),
    );
  }, []);

  const handleReplyUpdated = useCallback((messageId: string, content: string, updatedAt: string) => {
    setEntries((prev) =>
      prev.map((e) => ({
        ...e,
        replies: e.replies.map((r) =>
          r.id === messageId ? { ...r, content, updatedAt } : r,
        ),
      })),
    );
  }, []);

  const handleReplyDeleted = useCallback((messageId: string) => {
    setEntries((prev) =>
      prev.map((e) => ({
        ...e,
        replies: e.replies.filter((r) => r.id !== messageId),
      })),
    );
  }, []);

  const handleReactionUpdated = useCallback((messageId: string, reactions: ReactionView[]) => {
    setEntries((prev) =>
      prev.map((e) => ({
        ...e,
        parent: e.parent.id === messageId ? { ...e.parent, reactions } : e.parent,
        replies: e.replies.map((r) => (r.id === messageId ? { ...r, reactions } : r)),
      })),
    );
  }, []);

  // ── Classify ───────────────────────────────────────────────────────────────
  const dmEntries      = useMemo(() => entries.filter((e) => e.kind === "dm"),      [entries]);
  const publicEntries  = useMemo(() => entries.filter((e) => e.kind === "public"),  [entries]);
  const privateEntries = useMemo(() => entries.filter((e) => e.kind === "private"), [entries]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
        Loading threads…
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
        <span className="text-4xl">💬</span>
        <p className="text-sm font-medium">No threads yet</p>
        <p className="text-xs text-gray-300">Reply to a message to start a thread</p>
      </div>
    );
  }

  const blockProps = {
    currentUserId: user?.id,
    onReplyAdded: handleReplyAdded,
    onReplyUpdated: handleReplyUpdated,
    onReplyDeleted: handleReplyDeleted,
    onReactionUpdated: handleReactionUpdated,
  };

  return (
    <div className="h-full overflow-y-auto bg-white w-full">
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3">
        <h2 className="text-lg font-bold text-gray-900">Threads</h2>
      </div>

      {dmEntries.length > 0 && (
        <Section title="Direct Messages">
          {dmEntries.map((e) => (
            <ThreadBlock key={e.parent.id} entry={e} {...blockProps} />
          ))}
        </Section>
      )}

      {publicEntries.length > 0 && (
        <Section title="Public Channels">
          {publicEntries.map((e) => (
            <ThreadBlock key={e.parent.id} entry={e} {...blockProps} />
          ))}
        </Section>
      )}

      {privateEntries.length > 0 && (
        <Section title="Private Channels">
          {privateEntries.map((e) => (
            <ThreadBlock key={e.parent.id} entry={e} {...blockProps} />
          ))}
        </Section>
      )}
    </div>
  );
}
