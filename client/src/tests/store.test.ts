import { describe, it, expect, beforeEach } from "vitest";
import { useChatStore } from "../store/chatStore";

describe("Chat Store", () => {
  beforeEach(() => {
    useChatStore.getState().clearHistory();
  });

  it("should initialize with default values", () => {
    const state = useChatStore.getState();
    expect(state.selectedCountry).toBe("india");
    expect(state.language).toBe("English");
    expect(state.messages.length).toBe(1);
  });

  it("should change country correctly", () => {
    const store = useChatStore.getState();
    store.setCountry("usa");
    const newState = useChatStore.getState();
    expect(newState.selectedCountry).toBe("usa");
    expect(newState.messages[0].parts[0].text).toContain("USA");
  });

  it("should update language", () => {
    const store = useChatStore.getState();
    store.setLanguage("Hindi");
    expect(useChatStore.getState().language).toBe("Hindi");
  });

  it("should clear history", () => {
    const store = useChatStore.getState();
    store.addMessage({ role: "user", parts: [{ text: "test" }] });
    expect(useChatStore.getState().messages.length).toBe(2);
    store.clearHistory();
    expect(useChatStore.getState().messages.length).toBe(1);
  });
});
