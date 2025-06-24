import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from '../Button';

// Mock the CSS modules
jest.mock('../Button.module.css', () => ({
  button: 'button',
  primary: 'primary',
  secondary: 'secondary',
  clear: 'clear',
  spinner: 'spinner',
}));

describe('Button Component', () => {
  it('renders button with children text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('renders with primary variant by default', () => {
    render(<Button>Primary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'primary');
  });

  it('renders with secondary variant when specified', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'secondary');
  });

  it('renders with clear variant when specified', () => {
    render(<Button variant="clear">Clear Button</Button>);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('button', 'clear');
  });

  it('shows loading spinner when loading is true', () => {
    render(<Button loading={true}>Loading Button</Button>);
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('disables button when loading is true', () => {
    render(<Button loading={true}>Loading Button</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('sets correct button type', () => {
    render(<Button type="submit">Submit Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('defaults to button type when not specified', () => {
    render(<Button>Default Button</Button>);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('does not call onClick when disabled due to loading', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick} loading={true}>Loading Button</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).not.toHaveBeenCalled();
  });
});
