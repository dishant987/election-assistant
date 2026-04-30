import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { sendChatStream } from "../lib/api";
import { COUNTRIES, type Country, type Message } from "../types";

interface ChatStore {
  selectedCountry: Country | null;
  messages: Message[];
  isLoading: boolean;
  language: string;
  setLanguage: (lang: string) => void;
  setCountry: (countryId: Country) => void;
  addMessage: (msg: Message) => void;
  setLoading: (v: boolean) => void;
  sendMessage: (text: string) => Promise<void>;
  clearHistory: () => void;
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      selectedCountry: null,
      messages: [],
      isLoading: false,
      language: "English",

      setLanguage: (lang) => set({ language: lang }),

      setCountry: (countryId) => {
        const { selectedCountry, messages } = get();
        const country = COUNTRIES.find((c) => c.id === countryId);
        if (!country) return;

        // If switching to a new country or if no messages exist, set the welcome message
        if (selectedCountry !== countryId || messages.length === 0) {
          set({
            selectedCountry: countryId,
            messages: [
              {
                role: "model",
                parts: [
                  {
                    text: `Welcome! You've selected ${country.flag} ${country.label}. I'm here to help you understand ${country.label}'s election process. What would you like to know?`,
                  },
                ],
                language: get().language,
              },
            ],
          });
        }
      },

      addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),

      setLoading: (v) => set({ isLoading: v }),

      sendMessage: async (text) => {
        const { selectedCountry, messages } = get();
        if (!selectedCountry) return;

        const userMessage: Message = { role: "user", parts: [{ text }], language: get().language };
        const currentMessages = [...messages, userMessage];

        set({
          messages: currentMessages,
          isLoading: true,
        });

        let modelReply = "";
        
        // Create a temporary message that we will update with chunks
        const tempModelMessage: Message = { role: "model", parts: [{ text: "" }], language: get().language };
        set((state) => ({
          messages: [...state.messages, tempModelMessage],
        }));

        await sendChatStream(
          { country: selectedCountry, messages: currentMessages, language: get().language },
          (chunk) => {
            modelReply += chunk;
            set((state) => {
              const newMessages = [...state.messages];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg && lastMsg.role === "model") {
                lastMsg.parts[0].text = modelReply;
              }
              return { messages: newMessages };
            });
          },
          (error) => {
            set((state) => {
              const newMessages = [...state.messages];
              const lastMsg = newMessages[newMessages.length - 1];
              if (lastMsg && lastMsg.role === "model") {
                lastMsg.parts[0].text = `⚠️ ${error}`;
              } else {
                newMessages.push({
                  role: "model",
                  parts: [{ text: `⚠️ ${error}` }],
                });
              }
              return { messages: newMessages };
            });
          }
        );

        set({ isLoading: false });
      },

      clearHistory: () => {
        const { selectedCountry } = get();
        if (!selectedCountry) {
            set({ messages: [] });
            return;
        }
        
        const country = COUNTRIES.find((c) => c.id === selectedCountry);
        set({
          messages: [
            {
              role: "model",
              parts: [
                {
                  text: `History cleared. Welcome back! I'm here to help you understand ${country?.label}'s election process. What would you like to know?`,
                },
              ],
              language: get().language,
            },
          ],
        });
      },
    }),
    {
      name: "election-chat-storage",
      storage: createJSONStorage(() => localStorage),
      // Only persist messages and selectedCountry, not isLoading
      partialize: (state) => ({
        messages: state.messages,
        selectedCountry: state.selectedCountry,
        language: state.language,
      }),
    }
  )
);
