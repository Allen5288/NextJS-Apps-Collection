import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorMessage from '../ErrorMessage';

// Mock the CSS modules
jest.mock('../ErrorMessage.module.css', () => ({
  errorMessage: 'errorMessage',
}));

describe('ErrorMessage Component', () => {
  it('renders error message text', () => {
    const errorText = 'This is an error message';
    render(<ErrorMessage message={errorText} />);
    
    expect(screen.getByText(errorText)).toBeInTheDocument();
  });

  it('applies correct CSS class', () => {
    const errorText = 'Error occurred';
    render(<ErrorMessage message={errorText} />);
    
    const errorDiv = screen.getByText(errorText);
    expect(errorDiv).toHaveClass('errorMessage');
  });
  it('renders empty message correctly', () => {
    render(<ErrorMessage message="" />);
    
    const errorDiv = document.querySelector('.errorMessage');
    expect(errorDiv).toBeInTheDocument();
    expect(errorDiv).toHaveClass('errorMessage');
  });

  it('renders long error message correctly', () => {
    const longMessage = 'This is a very long error message that should still be displayed correctly in the error message component regardless of its length';
    render(<ErrorMessage message={longMessage} />);
    
    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });

  it('handles special characters in message', () => {
    const specialMessage = 'Error: Field "username" is required! Please try again.';
    render(<ErrorMessage message={specialMessage} />);
    
    expect(screen.getByText(specialMessage)).toBeInTheDocument();
  });
});
