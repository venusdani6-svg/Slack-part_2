"use client";

import { MainPage } from "@/components/MainPage/MainPage";
import TopBar from "@/components/TopBar/TopBar";
import { WorkSpace } from "@/components/WorkSpace/WorkSpace";
import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useRef } from "react";
import { useAuth } from "@/context/Authcontext";
import { useSocket } from "@/providers/SocketProvider";
import { useActivityStore } from "@/store/activity-store";
import { fetchActivities } from "@/lib/api/activity";

export default function ClientLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAuth();
  const { socket } = useSocket();
  const { setItems } = useActivityStore();
  const mainRowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/auth/sign_in"); return; }

        const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        if (res.status === 401 || res.status === 403 || res.status === 500) {
          localStorage.removeItem("token");
          localStorage.removeItem("userId");
          router.push("/auth/sign_in");
          return;
        }

        setUser(data);
        if (data?.id) {
          localStorage.setItem("userId", data.id);

          // Bootstrap activity unread count immediately after auth
          fetchActivities(data.id)
            .then(setItems)
            .catch(console.error);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };

    checkAuth();
  }, []);

  // Re-join activity room and re-register presence whenever socket becomes
  // available after auth (handles the race where socket connects before userId is stored,
  // and the case where the socket was disconnected on sign-out)
  useEffect(() => {
    if (!socket || !user?.id) return;

    // If the socket was manually disconnected (sign-out), reconnect it first
    if (!socket.connected) {
      socket.connect();
      // register_user will be emitted from the "connect" event handler in SocketProvider
      return;
    }

    socket.emit("register_user", user.id);
    socket.emit("join_activity", user.id);
  }, [socket, user?.id]);

  useEffect(() => {
    const el = mainRowRef.current;
    if (!el) return;

    const emitDebugLog = (runId: string, hypothesisId: string, message: string, data: Record<string, unknown>) => {
      // #region agent log
      fetch('http://127.0.0.1:7597/ingest/00c7dff1-0dec-43fd-8979-4145a69e3cda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'e4736c' },
        body: JSON.stringify({
          sessionId: 'e4736c',
          runId,
          hypothesisId,
          location: 'app/[workspaceId]/layout.tsx:mainRowRef',
          message,
          data,
          timestamp: Date.now(),
        }),
      }).catch(() => { });
      // #endregion
    };

    const report = (runId: string, phase: string) => {
      const rect = el.getBoundingClientRect();
      const styles = window.getComputedStyle(document.body);
      emitDebugLog(runId, 'H5-H6', `layout-row-${phase}`, {
        pathname,
        viewportWidth: window.innerWidth,
        rowClientWidth: el.clientWidth,
        rowScrollWidth: el.scrollWidth,
        rowRightGap: Math.round(window.innerWidth - rect.right),
        bodyBg: styles.backgroundColor,
      });
    };

    report('baseline', 'mount');
    const onResize = () => report('baseline', 'resize');
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [pathname]);

  const isDmRoute = pathname?.includes("/dm/");

  return (
    <div className="h-screen flex flex-col">
      <TopBar />
      <div ref={mainRowRef} className="flex h-[calc(100vh-38px)]">
        <WorkSpace userData={user} />
        {isDmRoute ? (
          <div className="flex-1 h-full overflow-hidden">{children}</div>
        ) : (
          <>
            <div className="flex grow h-full">{children}</div>
            <div className="w-full"><MainPage userData={user} /></div>
          </>
        )}
      </div>
    </div>
  );
}