import { create } from "zustand";

type Message = any;

type MessageStore = {
  messages: Message[];
  loading: boolean;
  flag: string;
  setMessages: (messages: Message[]) => void;
  appendMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  clearMessages: () => void;
  setFlag: (flag: string) => void;
};

export const useMessageStore = create<MessageStore>((set) => ({
  messages: [],
  loading: true,
  // Initialize to "" so flag === "" renders the default message/DM view on first
  // mount and after full page reloads — previously null caused the content area
  // to stay blank because every conditional checked flag === "" (not null).
  flag: "",

  setMessages: (messages) => set({ messages }),
  appendMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ loading }),
  clearMessages: () => set({ messages: [], loading: true }),
  setFlag: (flag) => set({ flag }),
}));
