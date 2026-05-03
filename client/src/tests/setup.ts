import React from 'react'
import { expect, vi } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Mock framer-motion to disable animations
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>()
  return {
    ...actual,
    motion: {
      ...actual.motion,
      div: ({ children, ...props }: any) => React.createElement('div', props, children),
      button: ({ children, ...props }: any) => React.createElement('button', props, children),
      span: ({ children, ...props }: any) => React.createElement('span', props, children),
      h1: ({ children, ...props }: any) => React.createElement('h1', props, children),
      p: ({ children, ...props }: any) => React.createElement('p', props, children),
    },
    AnimatePresence: ({ children }: any) => children,
  }
})

// Mock ScrollToBottom since it uses DOM APIs that might not be fully available in jsdom
vi.mock('react-scroll-to-bottom', () => ({
  default: ({ children, className }: any) => React.createElement('div', { className }, children),
}))

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
})
