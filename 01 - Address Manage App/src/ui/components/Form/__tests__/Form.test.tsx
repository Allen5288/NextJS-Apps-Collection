import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Form from '../Form';

// Mock the CSS modules
jest.mock('../Form.module.css', () => ({
  formRow: 'formRow',
}));

// Mock the child components
jest.mock('../Button/Button', () => {
  return function MockButton({ children, loading, type, ...props }: any) {
    return (
      <button type={type} disabled={loading} {...props}>
        {loading && <span data-testid="loading-spinner" />}
        {children}
      </button>
    );
  };
});

jest.mock('../InputText/InputText', () => {
  return function MockInputText({ name, placeholder, value, onChange, ...props }: any) {
    return (
      <input
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    );
  };
});

describe('Form Component', () => {
  const mockOnSubmit = jest.fn();
  
  const defaultProps = {
    label: 'Test Form',
    loading: false,
    formEntries: [
      {
        name: 'email',
        placeholder: 'Enter email',
        extraProps: {
          value: '',
          onChange: jest.fn(),
        },
      },
      {
        name: 'password',
        placeholder: 'Enter password',
        extraProps: {
          value: '',
          onChange: jest.fn(),
        },
      },
    ],
    onFormSubmit: mockOnSubmit,
    submitText: 'Submit',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with legend', () => {
    render(<Form {...defaultProps} />);
    
    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByRole('group')).toBeInTheDocument();
  });

  it('renders all form entries', () => {
    render(<Form {...defaultProps} />);
    
    expect(screen.getByPlaceholderText('Enter email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter password')).toBeInTheDocument();
  });

  it('renders submit button with correct text', () => {
    render(<Form {...defaultProps} />);
    
    const submitButton = screen.getByRole('button', { name: 'Submit' });
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute('type', 'submit');
  });

  it('calls onFormSubmit when form is submitted', () => {
    render(<Form {...defaultProps} />);
    
    const form = screen.getByRole('group').closest('form');
    fireEvent.submit(form!);
    
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('shows loading state on submit button', () => {
    render(<Form {...defaultProps} loading={true} />);
    
    const submitButton = screen.getByRole('button');
    expect(submitButton).toBeDisabled();
    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('applies correct CSS classes to form rows', () => {
    render(<Form {...defaultProps} />);
    
    const formRows = document.querySelectorAll('.formRow');
    expect(formRows).toHaveLength(2);
  });

  it('passes extraProps to InputText components', () => {
    const onChange = jest.fn();
    const propsWithValues = {
      ...defaultProps,
      formEntries: [
        {
          name: 'test',
          placeholder: 'Test input',
          extraProps: {
            value: 'test value',
            onChange,
          },
        },
      ],
    };

    render(<Form {...propsWithValues} />);
    
    const input = screen.getByDisplayValue('test value');
    expect(input).toBeInTheDocument();
    
    fireEvent.change(input, { target: { value: 'new value' } });
    expect(onChange).toHaveBeenCalled();
  });

  it('handles empty form entries array', () => {
    const emptyProps = {
      ...defaultProps,
      formEntries: [],
    };

    render(<Form {...emptyProps} />);
    
    expect(screen.getByText('Test Form')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });
});
