"use client";

import { useState, useEffect } from "react";
import { FiHash, FiX, FiSearch } from "react-icons/fi";
import { useSocket } from "@/providers/SocketProvider";
import ModalOverlay from "./ModalOverlay";
import { getAvatarUrl } from "@/lib/messageUtils";

type WorkspaceMember = {
  id: string;
  dispname: string;
  email: string;
  avatar?: string;
};

export default function CreateChannelModal({
  isOpen,
  onClose,
  workspaceId,
  userId,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  userId: string;
}) {
  const { socket } = useSocket();

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private">("public");
  const [loading, setLoading] = useState(false);

  // Step 3 — invite members state
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [membersLoading, setMembersLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const totalSteps = visibility === "private" ? 3 : 2;

  useEffect(() => {
    if (step !== 3 || !isOpen) return;
    setMembersLoading(true);
    const base = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";
    fetch(`${base}/api/workspaces/${workspaceId}/dm/candidates?currentUserId=${userId}`)
      .then((r) => r.json())
      .then((data: WorkspaceMember[]) => setMembers(Array.isArray(data) ? data : []))
      .catch(() => setMembers([]))
      .finally(() => setMembersLoading(false));
  }, [step, isOpen, workspaceId, userId]);

  if (!isOpen) return null;

  const handleClose = () => {
    setStep(1);
    setName("");
    setVisibility("public");
    setLoading(false);
    setSearch("");
    setSelectedIds([]);
    setMembers([]);
    onClose();
  };

  const handleCreate = async () => {
    if (!socket) return;
    try {
      setLoading(true);
      socket.emit("channel:create", {
        workspaceId,
        name,
        type: visibility,
        userId,
        invitedUserIds: selectedIds,
      });
      handleClose();
    } catch (err) {
      console.error("Create channel failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (visibility === "private") {
        setStep(3);
      } else {
        handleCreate();
      }
    }
  };

  const toggleMember = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase();
    return m.dispname?.toLowerCase().includes(q) || m.email?.toLowerCase().includes(q);
  });

  const selectedMembers = members.filter((m) => selectedIds.includes(m.id));

  return (
    <ModalOverlay onClose={handleClose} className="w-[500px] p-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Create a channel</h2>
          {step >= 2 && <p className="text-sm text-gray-500 mt-1"># {name}</p>}
        </div>
        <button onClick={handleClose}>
          <FiX className="text-gray-500" size={18} />
        </button>
      </div>

      {/* Step 1 — Name */}
      {step === 1 && (
        <div className="mt-5">
          <label className="text-sm font-semibold text-gray-800">Name</label>
          <div className="mt-2 flex items-center border rounded-md border-gray-400 px-3 py-2">
            <FiHash className="text-gray-400 mr-2" />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. plan-budget"
              className="w-full outline-none text-black"
              maxLength={80}
            />
            <span className="text-xs text-gray-400">{80 - name.length}</span>
          </div>
        </div>
      )}

      {/* Step 2 — Visibility */}
      {step === 2 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-gray-800 mb-3">Visibility</p>
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input type="radio" checked={visibility === "public"} onChange={() => setVisibility("public")} />
              Public — anyone
            </label>
            <label className="flex items-center gap-2 text-black cursor-pointer">
              <input type="radio" checked={visibility === "private"} onChange={() => setVisibility("private")} />
              Private — only invited
            </label>
          </div>
        </div>
      )}

      {/* Step 3 — Invite Members */}
      {step === 3 && (
        <div className="mt-5">
          <p className="text-sm font-medium text-gray-800 mb-3">Invite members</p>

          {selectedMembers.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3">
              {selectedMembers.map((m) => (
                <span
                  key={m.id}
                  className="flex items-center gap-1 bg-gray-100 border border-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full"
                >
                  {m.dispname || m.email}
                  <button onClick={() => toggleMember(m.id)} className="text-gray-400 hover:text-gray-600">
                    <FiX size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center border rounded-md border-gray-400 px-3 py-2 mb-3">
            <FiSearch className="text-gray-400 mr-2" size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email"
              className="w-full outline-none text-black text-sm"
            />
          </div>

          <div className="max-h-48 overflow-y-auto space-y-1">
            {membersLoading ? (
              <p className="text-sm text-gray-400 text-center py-4">Loading...</p>
            ) : filteredMembers.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">No members found</p>
            ) : (
              filteredMembers.map((m) => (
                <button
                  key={m.id}
                  onClick={() => toggleMember(m.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm transition-colors ${
                    selectedIds.includes(m.id)
                      ? "bg-[#007a5a]/10 border border-[#007a5a]/30"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold text-gray-600 shrink-0 overflow-hidden">
                    {m.avatar ? (
                      <img src={getAvatarUrl(m.avatar)} alt={m.dispname ?? m.email} className="w-full h-full object-cover" />
                    ) : (
                      (m.dispname?.[0] ?? m.email?.[0] ?? "?").toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 truncate">{m.dispname || m.email}</p>
                    {m.dispname && <p className="text-xs text-gray-400 truncate">{m.email}</p>}
                  </div>
                  <input
                    type="checkbox"
                    readOnly
                    checked={selectedIds.includes(m.id)}
                    className="accent-[#007a5a]"
                  />
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-6 flex justify-between items-center">
        <span className="text-xs text-gray-400">Step {step} of {totalSteps}</span>

        {step === 1 ? (
          <button
            disabled={!name.trim()}
            onClick={handleNext}
            className={`px-4 py-1.5 rounded text-sm ${name.trim() ? "bg-[#007a5a] text-white" : "bg-gray-200 text-gray-400"}`}
          >
            Next
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep(step - 1)}
              className="bg-gray-700 text-white px-4 py-1.5 border rounded text-sm"
            >
              Back
            </button>
            {step === totalSteps ? (
              <button
                onClick={handleCreate}
                disabled={loading}
                className="bg-[#007a5a] text-white px-4 py-1.5 rounded text-sm"
              >
                {loading ? "Creating..." : "Create"}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="bg-[#007a5a] text-white px-4 py-1.5 rounded text-sm"
              >
                Next
              </button>
            )}
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}
