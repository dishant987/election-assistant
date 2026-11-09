import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ProcessPage } from '../pages/ProcessPage'
import { BrowserRouter } from 'react-router-dom'

// Wrap with BrowserRouter for Link components
const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter })
}

describe('ProcessPage', () => {
  it('renders the selection screen initially', () => {
    renderWithRouter(<ProcessPage />)
    
    expect(screen.getByText(/Election Processes/i)).toBeInTheDocument()
    expect(screen.getByText(/India/i)).toBeInTheDocument()
    expect(screen.getByText(/USA/i)).toBeInTheDocument()
    expect(screen.getByText(/UK/i)).toBeInTheDocument()
  })

  it('navigates to country process when clicked', async () => {
    renderWithRouter(<ProcessPage />)
    
    const indiaButton = screen.getByText('India').closest('button')
    fireEvent.click(indiaButton!)
    
    expect(await screen.findByText(/India Election Cycle/i)).toBeInTheDocument()
    // Step titles show in both the step list and the detail panel
    expect(screen.getAllByText(/Electoral Roll Preparation/i).length).toBeGreaterThan(0)
  })

  it('can navigate between steps in the process', async () => {
    renderWithRouter(<ProcessPage />)
    
    const usaButton = screen.getByText('USA').closest('button')
    fireEvent.click(usaButton!)
    
    expect(await screen.findByText(/USA Election Cycle/i)).toBeInTheDocument()
    
    // Check initial step
    expect(screen.getAllByText(/Primaries and Caucuses/i).length).toBeGreaterThan(0)
    
    // Click Next
    const nextButton = screen.getByText(/Next Step/i)
    fireEvent.click(nextButton)
    
    expect((await screen.findAllByText(/National Conventions/i)).length).toBeGreaterThan(0)
  })

  it('can go back to country selection', async () => {
    renderWithRouter(<ProcessPage />)
    
    const ukButton = screen.getByText('UK').closest('button')
    fireEvent.click(ukButton!)
    
    const backButton = await screen.findByText(/Change Country/i)
    fireEvent.click(backButton)
    
    expect(await screen.findByText(/Election Processes/i)).toBeInTheDocument()
  })
})
