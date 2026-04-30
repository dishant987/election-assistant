import type { Message } from "../types";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const sendChatStream = async (
  payload: { country: string; messages: Message[]; language: string },
  onChunk: (text: string) => void,
  onError: (error: string) => void
) => {
  try {
    const response = await fetch(`${BASE}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = "Failed to send message";
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorMessage;
      } catch (e) {
        // Fallback if not JSON
      }
      throw new Error(errorMessage);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) {
      throw new Error("No response stream available");
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  } catch (error: any) {
    console.error("API Error:", error);
    onError(error.message || "An unexpected error occurred");
  }
};
