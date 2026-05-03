import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ChatWindow } from '../components/ChatWindow'
import { useChatStore } from '../store/chatStore'

// Mock the chat store
vi.mock('../store/chatStore', () => ({
  useChatStore: vi.fn(),
}))

describe('ChatWindow', () => {
  it('renders welcome screen when no country is selected', () => {
    vi.mocked(useChatStore).mockReturnValue({
      messages: [],
      isLoading: false,
      selectedCountry: null,
    } as any)

    render(<ChatWindow />)
    
    expect(screen.getByText(/Welcome to Election Assistant/i)).toBeInTheDocument()
    expect(screen.getByText(/Select a country from the list above/i)).toBeInTheDocument()
    expect(screen.getByRole('region', { name: /welcome screen/i })).toBeInTheDocument()
  })

  it('renders chat messages when a country is selected', () => {
    const mockMessages = [
      { role: 'model', parts: [{ text: 'Hello! How can I help?' }] },
      { role: 'user', parts: [{ text: 'Tell me about elections.' }] },
    ]

    vi.mocked(useChatStore).mockReturnValue({
      messages: mockMessages,
      isLoading: false,
      selectedCountry: 'india',
    } as any)

    render(<ChatWindow />)

    expect(screen.getByText(/Hello! How can I help?/i)).toBeInTheDocument()
    expect(screen.getByText(/Tell me about elections./i)).toBeInTheDocument()
    expect(screen.getByRole('log', { name: /chat history/i })).toBeInTheDocument()
  })

  it('handles empty message list with a selected country', () => {
    vi.mocked(useChatStore).mockReturnValue({
      messages: [],
      isLoading: false,
      selectedCountry: 'usa',
    } as any)

    render(<ChatWindow />)

    const chatHistory = screen.getByRole('log', { name: /chat history/i })
    expect(chatHistory).toBeInTheDocument()
    expect(chatHistory.children[0]).toBeEmptyDOMElement()
  })
})
