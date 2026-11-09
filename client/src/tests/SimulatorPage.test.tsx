import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { SimulatorPage } from '../pages/SimulatorPage'

describe('SimulatorPage', () => {
  it('runs the full voting flow, including the VVPAT auto-advance', () => {
    vi.useFakeTimers()
    render(<SimulatorPage />, { wrapper: BrowserRouter })

    fireEvent.click(screen.getByText('Continue'))
    fireEvent.click(screen.getByText('Apply Indelible Ink'))
    act(() => vi.advanceTimersByTime(1500))

    fireEvent.click(screen.getByRole('button', { name: 'Vote for Unity Alliance' }))
    act(() => vi.advanceTimersByTime(1500))
    expect(screen.getByText(/Slip will drop in 7 seconds/i)).toBeInTheDocument()

    // Used to dead-end here: no timer and no navigation on this step
    act(() => vi.advanceTimersByTime(7000))
    expect(screen.getByText(/You've Made a Difference!/i)).toBeInTheDocument()
    vi.useRealTimers()
  })
})
