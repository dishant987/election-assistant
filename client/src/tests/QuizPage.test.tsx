import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { QuizPage } from '../pages/QuizPage'
import { BrowserRouter } from 'react-router-dom'

const renderWithRouter = (ui: React.ReactElement) => {
  return render(ui, { wrapper: BrowserRouter })
}

describe('QuizPage', () => {
  it('renders country selection initially', () => {
    renderWithRouter(<QuizPage />)
    
    expect(screen.getByText(/The Election Expert Quiz/i)).toBeInTheDocument()
    expect(screen.getByText(/India/i)).toBeInTheDocument()
  })

  it('starts quiz when country is selected', async () => {
    renderWithRouter(<QuizPage />)
    
    const indiaButton = screen.getByText('India').closest('button')
    fireEvent.click(indiaButton!)
    
    expect(await screen.findByText(/Question 1 of 10/i)).toBeInTheDocument()
    expect(screen.getByText(/Who was the first Chief Election Commissioner of India/i)).toBeInTheDocument()
  })

  it('shows explanation when option is selected', async () => {
    renderWithRouter(<QuizPage />)
    
    const indiaButton = screen.getByText('India').closest('button')
    fireEvent.click(indiaButton!)
    
    const option = await screen.findByText('Sukumar Sen')
    fireEvent.click(option)
    
    expect(await screen.findByText(/Explanation:/i)).toBeInTheDocument()
    expect(screen.getByText(/Sukumar Sen served as the first Chief/i)).toBeInTheDocument()
  })

  it('can navigate through questions', async () => {
    renderWithRouter(<QuizPage />)
    
    const indiaButton = screen.getByText('India').closest('button')
    fireEvent.click(indiaButton!)
    
    // Question 1
    const option = await screen.findByText('Sukumar Sen')
    fireEvent.click(option)
    const nextButton = await screen.findByText(/Next Question/i)
    fireEvent.click(nextButton)
    
    // Question 2
    expect(await screen.findByText(/Question 2 of 10/i)).toBeInTheDocument()
    expect(screen.getByText(/What is the maximum limit of election expenditure/i)).toBeInTheDocument()
  })

  it('can reset quiz at the end', async () => {
    renderWithRouter(<QuizPage />)
    
    fireEvent.click(screen.getByText('India').closest('button')!)
    const changeButton = await screen.findByText(/Change Country/i)
    fireEvent.click(changeButton)
    
    expect(await screen.findByText(/The Election Expert Quiz/i)).toBeInTheDocument()
  })
})
