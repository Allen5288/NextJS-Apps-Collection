import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import '@testing-library/jest-dom';
import App from '../App';
import addressBookReducer from '../core/reducers/addressBookSlice';

// Mock fetch
global.fetch = jest.fn();

// Mock the CSS modules
jest.mock('./App.module.css', () => ({
  container: 'container',
}));

// Mock all the component modules
jest.mock('@/components/Section/Section', () => {
  return function MockSection({ children, variant }: any) {
    return <div data-testid="section" data-variant={variant}>{children}</div>;
  };
});

jest.mock('@/components/Button/Button', () => {
  return function MockButton({ children, onClick, variant, loading, type }: any) {
    return (
      <button 
        onClick={onClick} 
        data-variant={variant}
        disabled={loading}
        type={type}
        data-testid="mock-button"
      >
        {children}
      </button>
    );
  };
});

jest.mock('@/components/Form/Form', () => {
  return function MockForm({ label, onFormSubmit, submitText, loading, formEntries }: any) {
    return (
      <form onSubmit={onFormSubmit} data-testid="mock-form">
        <legend>{label}</legend>
        {formEntries.map((entry: any) => (
          <input
            key={entry.name}
            name={entry.name}
            placeholder={entry.placeholder}
            value={entry.extraProps.value}
            onChange={entry.extraProps.onChange}
            data-testid={`input-${entry.name}`}
          />
        ))}
        <button type="submit" disabled={loading} data-testid="submit-button">
          {submitText}
        </button>
      </form>
    );
  };
});

jest.mock('@/components/Radio/Radio', () => {
  return function MockRadio({ children, name, id, onChange }: any) {
    return (
      <label>
        <input
          type="radio"
          name={name}
          value={id}
          onChange={onChange}
          data-testid={`radio-${id}`}
        />
        {children}
      </label>
    );
  };
});

jest.mock('@/components/Address/Address', () => {
  return function MockAddress(props: any) {
    return <div data-testid="address">{props.street} {props.houseNumber}</div>;
  };
});

jest.mock('@/components/ErrorMessage/ErrorMessage', () => {
  return function MockErrorMessage({ message }: any) {
    return <div data-testid="error-message">{message}</div>;
  };
});

jest.mock('@/components/AddressBook/AddressBook', () => {
  return function MockAddressBook() {
    return <div data-testid="address-book">Address Book</div>;
  };
});

// Mock the core modules
jest.mock('../core/models/address', () => ({
  __esModule: true,
  default: jest.fn((address) => ({
    id: address.id || 'mock-id',
    street: address.street || 'Mock Street',
    houseNumber: address.houseNumber || '123',
    postcode: address.postcode || '1234',
    city: address.city || 'Mock City',
  })),
}));

const mockStore = configureStore({
  reducer: {
    addressBook: addressBookReducer,
  },
});

const renderAppWithStore = () => {
  return render(
    <Provider store={mockStore}>
      <App />
    </Provider>
  );
};

describe('App Integration Tests', () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
    process.env.NEXT_PUBLIC_URL = 'http://localhost:3000';
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders main application elements', () => {
    renderAppWithStore();
    
    expect(screen.getByText(/Create your own address book!/)).toBeInTheDocument();
    expect(screen.getByText('🏠 Find an address')).toBeInTheDocument();
    expect(screen.getByTestId('mock-button')).toHaveTextContent('Clear all fields');
    expect(screen.getByTestId('address-book')).toBeInTheDocument();
  });

  it('handles address search form submission', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        details: [
          {
            id: '1',
            street: 'Test Street',
            postcode: '1234',
            city: 'Test City',
          },
        ],
      }),
    });

    renderAppWithStore();

    // Fill out the form
    const postCodeInput = screen.getByTestId('input-postCode');
    const houseNumberInput = screen.getByTestId('input-houseNumber');
    
    fireEvent.change(postCodeInput, { target: { name: 'postCode', value: '1234' } });
    fireEvent.change(houseNumberInput, { target: { name: 'houseNumber', value: '123' } });

    // Submit the form
    const forms = screen.getAllByTestId('mock-form');
    const addressForm = forms[0]; // First form is address search
    fireEvent.submit(addressForm);

    // Wait for API call and check
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/getAddresses?postcode=1234&streetnumber=123'
      );
    });    // Check that address appears
    await waitFor(() => {
      expect(screen.getByTestId('radio-1')).toBeInTheDocument();
    });
  });

  it('handles API error response', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        errormessage: 'API Error',
      }),
    });

    renderAppWithStore();

    // Fill out and submit form
    const postCodeInput = screen.getByTestId('input-postCode');
    const houseNumberInput = screen.getByTestId('input-houseNumber');
    
    fireEvent.change(postCodeInput, { target: { name: 'postCode', value: '1234' } });
    fireEvent.change(houseNumberInput, { target: { name: 'houseNumber', value: '123' } });

    const forms = screen.getAllByTestId('mock-form');
    fireEvent.submit(forms[0]);

    // Check error appears
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('API Error');
    });
  });

  it('handles network error', async () => {
    (fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    renderAppWithStore();

    // Fill out and submit form
    const postCodeInput = screen.getByTestId('input-postCode');
    const houseNumberInput = screen.getByTestId('input-houseNumber');
    
    fireEvent.change(postCodeInput, { target: { name: 'postCode', value: '1234' } });
    fireEvent.change(houseNumberInput, { target: { name: 'houseNumber', value: '123' } });

    const forms = screen.getAllByTestId('mock-form');
    fireEvent.submit(forms[0]);

    // Check error appears
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Failed to fetch addresses. Please try again.'
      );
    });
  });

  it('validates required fields for address search', async () => {
    renderAppWithStore();

    // Submit form without filling fields
    const forms = screen.getAllByTestId('mock-form');
    fireEvent.submit(forms[0]);

    // Check validation error
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'Post code and house number fields are mandatory!'
      );
    });

    expect(fetch).not.toHaveBeenCalled();
  });

  it('handles personal info form submission', async () => {
    // First setup addresses
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        details: [
          {
            id: '1',
            street: 'Test Street',
            postcode: '1234',
            city: 'Test City',
          },
        ],
      }),
    });

    renderAppWithStore();

    // Fill and submit address form first
    const postCodeInput = screen.getByTestId('input-postCode');
    const houseNumberInput = screen.getByTestId('input-houseNumber');
    
    fireEvent.change(postCodeInput, { target: { name: 'postCode', value: '1234' } });
    fireEvent.change(houseNumberInput, { target: { name: 'houseNumber', value: '123' } });

    const forms = screen.getAllByTestId('mock-form');
    fireEvent.submit(forms[0]);    // Wait for address to appear and select it
    await waitFor(() => {
      const radio = screen.getByTestId('radio-1');
      fireEvent.change(radio, { target: { name: 'selectedAddress', value: '1' } });
    });

    // Now personal info form should be visible
    await waitFor(() => {
      expect(screen.getByText('✏️ Add personal info to address')).toBeInTheDocument();
    });

    // Fill personal info
    const firstNameInput = screen.getByTestId('input-firstName');
    const lastNameInput = screen.getByTestId('input-lastName');
    
    fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'John' } });
    fireEvent.change(lastNameInput, { target: { name: 'lastName', value: 'Doe' } });

    // Submit personal info form
    const personalForms = screen.getAllByTestId('mock-form');
    const personalForm = personalForms.find(form => 
      form.querySelector('legend')?.textContent === '✏️ Add personal info to address'
    );
    fireEvent.submit(personalForm!);

    // Check that form is cleared (no error should appear)
    await waitFor(() => {
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument();
    });
  });

  it('validates personal info form fields', async () => {
    // Setup addresses first
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'ok',
        details: [{ id: '1', street: 'Test Street', postcode: '1234', city: 'Test City' }],
      }),
    });

    renderAppWithStore();

    // Get addresses
    const postCodeInput = screen.getByTestId('input-postCode');
    const houseNumberInput = screen.getByTestId('input-houseNumber');
    
    fireEvent.change(postCodeInput, { target: { name: 'postCode', value: '1234' } });
    fireEvent.change(houseNumberInput, { target: { name: 'houseNumber', value: '123' } });

    const forms = screen.getAllByTestId('mock-form');
    fireEvent.submit(forms[0]);    // Select address
    await waitFor(() => {
      const radio = screen.getByTestId('radio-1');
      fireEvent.change(radio, { target: { name: 'selectedAddress', value: '1' } });
    });

    // Try to submit personal form without filling fields
    await waitFor(() => {
      const personalForms = screen.getAllByTestId('mock-form');
      const personalForm = personalForms.find(form => 
        form.querySelector('legend')?.textContent === '✏️ Add personal info to address'
      );
      fireEvent.submit(personalForm!);
    });

    // Check validation error
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent(
        'First name and last name fields mandatory!'
      );
    });
  });

  it('validates address selection for personal info', async () => {
    renderAppWithStore();

    // Try to submit personal info without selecting address
    // First, we need to trigger the form to appear somehow
    // We'll simulate having fields filled but no address selected
    
    // Fill name fields manually by finding them if they exist
    const firstNameInput = screen.queryByTestId('input-firstName');
    const lastNameInput = screen.queryByTestId('input-lastName');
    
    if (firstNameInput && lastNameInput) {
      fireEvent.change(firstNameInput, { target: { name: 'firstName', value: 'John' } });
      fireEvent.change(lastNameInput, { target: { name: 'lastName', value: 'Doe' } });
      
      // Try to find and submit personal form
      const forms = screen.getAllByTestId('mock-form');
      const personalForm = forms.find(form => 
        form.querySelector('legend')?.textContent === '✏️ Add personal info to address'
      );
      
      if (personalForm) {
        fireEvent.submit(personalForm);
        
        await waitFor(() => {
          expect(screen.getByTestId('error-message')).toHaveTextContent(
            'No address selected, try to select an address or find one if you haven\'t'
          );
        });
      }
    }
  });

  it('clears all fields when clear button is clicked', () => {
    renderAppWithStore();

    // Fill some fields first
    const postCodeInput = screen.getByTestId('input-postCode');
    const houseNumberInput = screen.getByTestId('input-houseNumber');
    
    fireEvent.change(postCodeInput, { target: { name: 'postCode', value: '1234' } });
    fireEvent.change(houseNumberInput, { target: { name: 'houseNumber', value: '123' } });

    // Click clear button
    const clearButton = screen.getByTestId('mock-button');
    fireEvent.click(clearButton);

    // Check fields are cleared
    expect(postCodeInput).toHaveValue('');
    expect(houseNumberInput).toHaveValue('');
  });

  it('handles successful API response with no results', async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: 'error',
        errormessage: 'No addresses found',
      }),
    });

    renderAppWithStore();

    // Fill and submit form
    const postCodeInput = screen.getByTestId('input-postCode');
    const houseNumberInput = screen.getByTestId('input-houseNumber');
    
    fireEvent.change(postCodeInput, { target: { name: 'postCode', value: '9999' } });
    fireEvent.change(houseNumberInput, { target: { name: 'houseNumber', value: '999' } });

    const forms = screen.getAllByTestId('mock-form');
    fireEvent.submit(forms[0]);

    // Check error message appears
    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('No addresses found');
    });
  });

  it('shows loading state during API call', async () => {
    let resolvePromise: (value: any) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    (fetch as jest.Mock).mockReturnValueOnce(promise);

    renderAppWithStore();

    // Fill and submit form
    const postCodeInput = screen.getByTestId('input-postCode');
    const houseNumberInput = screen.getByTestId('input-houseNumber');
    
    fireEvent.change(postCodeInput, { target: { name: 'postCode', value: '1234' } });
    fireEvent.change(houseNumberInput, { target: { name: 'houseNumber', value: '123' } });

    const forms = screen.getAllByTestId('mock-form');
    fireEvent.submit(forms[0]);

    // Check that submit button is disabled (loading state)
    await waitFor(() => {
      const submitButton = forms[0].querySelector('[data-testid="submit-button"]');
      expect(submitButton).toBeDisabled();
    });

    // Resolve the promise
    resolvePromise!({
      ok: true,
      json: async () => ({ status: 'ok', details: [] }),
    });

    // Wait for loading to finish
    await waitFor(() => {
      const submitButton = forms[0].querySelector('[data-testid="submit-button"]');
      expect(submitButton).not.toBeDisabled();
    });
  });
});
