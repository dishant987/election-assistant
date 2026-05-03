import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MythBusterPage } from '../pages/MythBusterPage'
import { BrowserRouter } from 'react-router-dom'

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter })
}

describe('MythBusterPage', () => {
  it('renders myths initially', () => {
    renderWithRouter(<MythBusterPage />)
    
    expect(screen.getByText(/Election Myth Buster/i)).toBeInTheDocument()
    expect(screen.getByText(/EVMs can be hacked/i)).toBeInTheDocument()
  })

  it('filters myths based on search term', async () => {
    renderWithRouter(<MythBusterPage />)
    
    const searchInput = screen.getByPlaceholderText(/Search rumors or myths/i)
    fireEvent.change(searchInput, { target: { value: 'Bluetooth' } })
    
    expect(await screen.findByText(/EVMs can be hacked via Bluetooth/i)).toBeInTheDocument()
    expect(screen.queryByText(/If NOTA gets the most votes/i)).toBeNull()
  })

  it('filters myths based on category', async () => {
    renderWithRouter(<MythBusterPage />)
    
    const securityButton = screen.getByText('Security', { selector: 'button' })
    fireEvent.click(securityButton)
    
    expect(await screen.findByText(/EVMs can be hacked via Bluetooth/i)).toBeInTheDocument()
    expect(screen.queryByText(/I can vote online using my smartphone/i)).toBeNull()
  })

  it('shows no results message (implied by empty grid)', () => {
    renderWithRouter(<MythBusterPage />)
    
    const searchInput = screen.getByPlaceholderText(/Search rumors or myths/i)
    fireEvent.change(searchInput, { target: { value: 'nonexistentmyth' } })
    
    // The grid should be empty
    const myths = screen.queryAllByRole('heading', { level: 3 })
    expect(myths.length).toBe(0)
  })
})
