"use client";

import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  ChevronDown,
  Grid2x2,
  ArrowRight,
  Menu,
  Search,
  X,
} from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "../../../context/Workspacecontext"
import Modal_s from "../../../components/WorkspaceList/Modal_s";

/* ================================
   FETCHER
================================ */

const fetcher = async ([_, email]: [string, string]) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/check-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  return data.workspaces;
};

/* ================================
   AVATARS
================================ */
type AvatarItem = {
  avatar: string;
  alt: string;
};

const avatarGroup: AvatarItem[] = [
  { avatar: "/WorkspaceList/avatars/avatar(5).png", alt: "ari" },
  { avatar: "/WorkspaceList/avatars/avatar(2).png", alt: "alex" },
  { avatar: "/WorkspaceList/avatars/avatar(3).png", alt: "reon" },
  { avatar: "/WorkspaceList/avatars/avatar(1).png", alt: "defult" },
  { avatar: "/WorkspaceList/avatars/avatar(4).png", alt: "seryog" },
  { avatar: "/WorkspaceList/avatars/avatar(6).png", alt: "wiliam" },
  { avatar: "/WorkspaceList/avatars/avatar(7).png", alt: "punch" },
  { avatar: "/WorkspaceList/avatars/avatar(8).png", alt: "primary" },
  { avatar: "/WorkspaceList/avatars/avatar(9).png", alt: "second" },
  { avatar: "/WorkspaceList/avatars/avatar(10).png", alt: "third" },
];

/* ================================
   COLORS
================================ */

const getWorkspaceColor = (index: number) => {
  const colors = ["#36C5F0", "#2EB67D", "#ECB22E", "#E01E5A", "#4A154B"];
  return colors[index % colors.length];
};

/* ================================
   COMPONENT
================================ */

export default function WorkspacesPage() {
  const router = useRouter();
  const email = useSearchParams().get("email");
  const { setWorkspace } = useWorkspace();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"workspaces" | "invites">(
    "workspaces"
  );

  const { data: workspaces } = useSWR(
    email ? ["workspaces", email] : null,
    fetcher
  );

  const onToMain = async (ws: any) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL}/api/auth/generate-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, workspaceName: ws.name }),
        }
      );

      const result = await res.json();

      //  store everything you need
      localStorage.setItem("token", result.token);
      localStorage.setItem("workspaceId", ws.id);
      localStorage.setItem("workspaceName", ws.name);
      setWorkspace(ws);

      //  FIXED
      router.push(`/${ws.id}`);
    } catch (err) {
      console.error(err);
    }
  };
  const shouldScroll = (workspaces?.length || 0) > 3;

  function Avatar({ avatar, alt }: AvatarItem) {
    return (
      <img src={avatar} alt={alt} className="w-[33px] h-[33px] rounded-[13px] border-[2px] border-white -ml-3.5" />
    );
  }

  return (
    <div className="min-h-screen bg-[#fffff] flex flex-col">
      {/* ========================= */}
      {/* NAVBAR */}
      {/* ========================= */}

      <nav className="bg-[#481a54] text-white">
        <div className="max-w-[76.875rem] mx-auto px-4 py-3 flex justify-between items-center pt-[23px]">
          {/* LEFT */}
          <div className="flex items-center gap-6">
            <span className="cursor-pointer">
              <img src={"/slack-workspace-logo.png"} />
            </span>
            <div className="hidden lg:flex gap-6 text-[15px] font-bold">
              {["Features", "Solutions", "Enterprise", "Resources", "Pricing"].map(
                (item) => (
                  <button
                    key={item}
                    className="focus:outline-dotted flex focus:outline-2 cursor-pointer focus:outline-gray-300 p-3"
                  >
                    {item}
                    {(item !== "Enterprise" && item !== "Pricing") ? <ChevronDown size={14} className="mt-1" /> : ""}
                  </button>
                )
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">
            <button className="hidden lg:block focus:outline-dotted focus:outline-2 focus:outline-gray-300">
              <Search className="w-5 h-5" />
            </button>

            <button className="hidden cursor-pointer hover:outline-2 lg:block px-4 py-2 border border-white rounded text-sm focus:outline-dotted focus:outline-2 focus:outline-gray-300 font-bold">
              TALK TO SALES
            </button>

            <button className="hidden lg:block px-4 py-2 bg-white text-[#481a54] rounded text-sm focus:outline-dotted focus:outline-2 focus:outline-gray-300 font-bold" onClick={() =>
              router.push(
                `/auth/create_workspace?email=${email}`
              )
            }>
              CREATE A NEW WORKSPACE
            </button>

            {/* MOBILE TOGGLE (RIGHT) */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 focus:outline-dotted focus:outline-2 focus:outline-gray-300"
            >
              <Menu />
            </button>
          </div>
        </div>
      </nav>

      {/* ========================= */}
      {/* MOBILE MODAL */}
      {/* ========================= */}

      <div
        className={`fixed inset-0 z-50 bg-white transform transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="font-bold text-lg">Menu</h2>
          <button onClick={() => setMobileOpen(false)}>
            <X />
          </button>
        </div>

        <div className="p-6 space-y-6 text-lg">
          <p>Features </p>
          <p>Solutions</p>
          <p>Enterprise</p>
          <p>Resources</p>
          <p>Pricing</p>
        </div>
      </div>

      {/* ========================= */}
      {/* HERO */}
      {/* ========================= */}

      <div className="relative bg-[#481a54] text-white text-center pt-14 pb-40">
        <div className="bg-[#481a54] w-full h-[150px] absolute bottom-[-75px] rounded-[50%]" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4 flex items-center justify-center gap-2">Welcome back
            <img src="/waving-hand.gif" alt="hand" />
          </h1>
          <p className="text-lg text-white/90">
            Choose a workspace to get started.
          </p>
        </div>
      </div>

      {/* ========================= */}
      {/* MAIN */}
      {/* ========================= */}
      <div className="-mt-28 relative z-20 px-4 sm:px-6 pb-16">
        <div className="max-w-[1200px] mx-auto">

          {/* TOP GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* LEFT (Workspaces) */}
            <div className="lg:col-span-2 flex flex-col gap-4">

              {/* TITLE */}
              <div className="flex items-center gap-2">
                <Grid2x2 className="w-5 h-5 text-white" />
                <h2 className="text-lg font-bold text-white">
                  My workspaces
                </h2>
              </div>

              {/* CARD */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* TABS */}
                <div className="flex border-b border-gray-200">
                  <button
                    onClick={() => setActiveTab("workspaces")}
                    className={`mx-6 py-3 text-sm font-medium ${activeTab === "workspaces"
                      ? "border-b-2 border-purple-800"
                      : "text-gray-500"
                      }`}
                  >
                    Workspaces
                  </button>

                  <button
                    onClick={() => setActiveTab("invites")}
                    className={`mx-6 py-3 text-sm font-medium ${activeTab === "invites"
                      ? "border-b-2 border-purple-800"
                      : "text-gray-500"
                      }`}
                  >
                    Open invites
                  </button>
                </div>

                {/* CONTENT */}
                {activeTab === "workspaces" && (
                  <>
                    <div className="px-6 py-4 text-sm text-gray-600 ">
                      Ready to launch
                    </div>

                    <div
                      className={`${shouldScroll ? "max-h-[175px] border-none overflow-y-auto" : ""
                        }`}
                    >
                      {!workspaces && (
                        <div className="p-6 text-center text-gray-400">
                          Loading...
                        </div>
                      )}

                      {workspaces?.map((ws: any, i: number) => (
                        <div
                          key={i}
                          onClick={() => onToMain(ws)}
                          className="flex justify-between items-center px-6 py-4 hover:bg-gray-50 cursor-pointer group"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-lg flex items-center justify-center text-white text-[25px] font-bold"
                              style={{ backgroundColor: getWorkspaceColor(i) }}
                            >
                              {ws.name[0].toUpperCase()}
                            </div>

                            <div>
                              <p className="font-semibold text-[18px]">{ws.name}</p>
                              <div className="flex items-center gap-1">
                                {avatarGroup.slice(0, ws.members).map((item, i) => (
                                  <Avatar key={i} avatar={item.avatar} alt={item.alt} />
                                ))}

                                <p className="text-sm text-gray-500 pt-1 text-[12px]">
                                  {ws.members || 0} members • Last active
                                </p>
                              </div>
                            </div>
                          </div>

                          <ArrowRight className="text-gray-700 transition" />
                        </div>
                      ))}
                    </div>

                    {/* FOOTER */}
                    <div className="px-6 py-5 border-t-2 border-gray-200 text-sm">
                      <button
                        onClick={() =>
                          router.push(`/auth/create_workspace?email=${email}`)
                        }
                        className="text-[#1264a3] font-medium hover:underline"
                      >
                        Create a new workspace
                      </button>

                      <p className="mt-2 text-gray-600">
                        Not seeing your workspace?{" "}
                        <span className="text-[#1264a3] cursor-pointer hover:underline">
                          Try a different email
                        </span>
                      </p>
                    </div>
                  </>
                )}

                {activeTab === "invites" && (
                  <div className="p-10 text-center text-gray-400">
                    No invites yet
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="flex flex-col gap-4 pt-[7px]">

              {/* USER */}
              <div className="flex items-center gap-2 text-white">
                <img
                  src="/WorkspaceList/ava_0015-88.png"
                  className="w-5 h-5 rounded-[6px]"
                />
                <span className="text-sm font-medium">
                  {email?.split("@")[0]}
                </span>
              </div>

              {/* CARDS */}
              <Modal_s
                title="Get started with a template."
                description="Kickstart projects with one click."
                buttonText="Browse templates"
                icon="/WorkspaceList/1.png"
              />

              <Modal_s
                title="Supercharge with AI."
                description="Explore AI features in your plan."
                buttonText="See features"
                icon="/WorkspaceList/2.png"
              />
            </div>
          </div>

          {/* DISCOVER MORE */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <img src="/WorkspaceList/icon.svg" alt="" />
              <h2 className="text-lg font-bold text-black">
                Discover more
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Modal_s
                title="Download Slack for Windows"
                description="Stay up to date on notifications."
                buttonText="Download app"
                icon="/WorkspaceList/3.png"
                className="h-[200px]"
              />
              <Modal_s
                title="Connect your apps."
                description="Choose from over 2,600 apps."
                buttonText="Browse apps"
                icon="/WorkspaceList/4.png"
              />
              <Modal_s
                title="Quick start guide to Slack"
                description="Learn the basics of using Slack."
                buttonText="Get started"
                icon="/WorkspaceList/5.png"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}