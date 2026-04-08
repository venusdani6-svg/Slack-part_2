"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import CustomButton from "../component/channel_button";
import FileSearch from "../component/file_search";
import Card from "./directories_card";
import DirectoriesDropdownBtn from "./DirectoriesDropdownBtn";
import ViewProfileModal from "./ViewProfileModal";
import { useWorkspaceUsers, type DirectoryUser } from "@/hooks/useWorkspaceUsers";
import { useDirectoryStore } from "@/store/directory-store";
import { useAuth } from "@/context/Authcontext";
import { People } from "./domi";
import ProfileSidebar from "@/components/WorkSpace/ProfileSidebar";

function SkeletonCard() {
  return (
    <div className="w-[180px] h-[265px] bg-[#f6f6f6] border border-[#e1e1e1] rounded-[16px] overflow-hidden animate-pulse">
      <div className="w-full h-[180px] bg-[#e1e1e1]" />
      <div className="px-[16px] py-[12px] flex flex-col gap-[8px]">
        <div className="h-[14px] bg-[#e1e1e1] rounded w-[70%]" />
        <div className="h-[12px] bg-[#e1e1e1] rounded w-[50%]" />
      </div>
    </div>
  );
}

type Props = {
  workspaceId?: string;
};

export default function DirectoriesPeople({ workspaceId }: Props) {
  // Seeds the directory store; Cards read directly from the store
  const { loading, error } = useWorkspaceUsers(workspaceId);
  const orderedIds = useDirectoryStore((s) => s.orderedIds);
  const storeUsers = useDirectoryStore((s) => s.users);

  const { user: authUser } = useAuth();
  const currentUserId = authUser?.id ?? null;

  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DirectoryUser | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Search with 300ms debounce
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => setDebouncedSearch(search), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [search]);

  // Filter against live store data — always reflects latest names
  const filteredIds = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return orderedIds;
    return orderedIds.filter((id) => {
      const u = storeUsers[id];
      if (!u) return false;
      return (
        u.name.toLowerCase().includes(q) ||
        u.title.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
      );
    });
  }, [orderedIds, storeUsers, debouncedSearch]);

  function handleCardClick(userId: string) {
    const u = useDirectoryStore.getState().users[userId];
    if (!u) return;
    setSelectedUser(u);
    if (userId === currentUserId) {
      setProfileOpen(true);
    } else {
      setViewOpen(true);
    }
  }

  return (
    <>
      <div className="w-full px-[250px]  flex justify-between items-end mb-[20px]">
        <div className="w-[667px]">
          <FileSearch
            value={search}
            placeholder="Search for people"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <CustomButton
          label="Invite People"
          showIcon={false}
          bgColor="bg-transparent"
          hoverColor="hover:bg-[#e1e1e1]"
          activeColor="active:bg-[#c1c1c1]"
          textColor="text-[#313131]"
          height="h-[40px]"
          paddingX="px-[10px]"
          radius="rounded-[6px]"
        />
      </div>

      <div className="h-[calc(100vh-250px)] flex flex-col items-center min-h-[60vh] overflow-y-scroll sidebar-scroll">
        <div className="w-[100%] px-[250px] mb-[20px] border-[#1f2937] flex items-center justify-between">
          <div className="flex items-center gap-[8px]">
            <DirectoriesDropdownBtn>
              <DirectoriesDropdownBtn.Trigger placeholder="Title" />
              <DirectoriesDropdownBtn.Content>
                <DirectoriesDropdownBtn.Search placeholder="Search..." />
                <DirectoriesDropdownBtn.Check label="Winrar" />
              </DirectoriesDropdownBtn.Content>
            </DirectoriesDropdownBtn>
            <DirectoriesDropdownBtn>
              <DirectoriesDropdownBtn.Trigger placeholder="Location" />
              <DirectoriesDropdownBtn.Content>
                <DirectoriesDropdownBtn.Search placeholder="Search..." />
              </DirectoriesDropdownBtn.Content>
            </DirectoriesDropdownBtn>
            <div className="flex items-center gap-[6px] ml-[8px] text-[#38bdf8] text-[14px] font-[500] cursor-pointer">
              <svg viewBox="0 0 24 24" className="w-[14px] h-[14px] fill-[#38bdf8]">
                <path d="M3 5h18v2H3V5zm4 6h10v2H7v-2zm3 6h4v2h-4v-2z" />
              </svg>
              <span>Filters</span>
            </div>
          </div>
          <DirectoriesDropdownBtn>
            <DirectoriesDropdownBtn.Trigger placeholder="recentlyViewed" />
            <DirectoriesDropdownBtn.Content>
              {People.recentlyViewed.map((item, idx) => (
                <DirectoriesDropdownBtn.List key={idx} label={item.label} />
              ))}
            </DirectoriesDropdownBtn.Content>
          </DirectoriesDropdownBtn>
        </div>

        {error && (
          <div className="w-full px-[250px] mb-[16px]">
            <p className="text-[13px] text-[#dc2626] px-[14px] py-[10px] rounded-[8px] bg-[#fff0f0] border border-[#fca5a5]">
              {error}
            </p>
          </div>
        )}

        <div className="max-w-[100%] grid grid-cols-5 gap-[20px]">
          {loading && Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} />)}

          {!loading && filteredIds.length === 0 && (
            <div className="col-span-5 flex flex-col items-center justify-center py-[60px] text-center">
              <svg viewBox="0 0 64 64" className="w-[48px] h-[48px] mb-[12px] text-[#d1d5db]" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="32" cy="22" r="12" />
                <path d="M8 56c0-13.255 10.745-24 24-24s24 10.745 24 24" />
              </svg>
              <p className="text-[15px] font-[600] text-[#313131]">No people found in this workspace</p>
              <p className="text-[13px] text-[#9ca3af] mt-[4px]">Try adjusting your search</p>
            </div>
          )}

          {!loading && filteredIds.map((userId) => (
            <Card
              key={userId}
              userId={userId}
              isCurrentUser={userId === currentUserId}
              onClick={() => handleCardClick(userId)}
              onEdit={(e) => {
                e.stopPropagation();
                const u = useDirectoryStore.getState().users[userId];
                if (u) { setSelectedUser(u); setProfileOpen(true); }
              }}
            />
          ))}
        </div>
      </div>

      {viewOpen && selectedUser && (
        <ViewProfileModal
          user={selectedUser}
          avater={selectedUser.avatar}
          onClose={() => { setViewOpen(false); setSelectedUser(null); }}
        />
      )}

      <ProfileSidebar
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        userdata={authUser}
      />
    </>
  );
}
