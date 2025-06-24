import { renderHook, act } from '@testing-library/react';
import useFormFields from '../useFormFields';

describe('useFormFields hook', () => {
  it('initializes with empty fields', () => {
    const { result } = renderHook(() => useFormFields());
    
    expect(result.current.fields).toEqual({
      postCode: '',
      houseNumber: '',
      firstName: '',
      lastName: '',
      selectedAddress: '',
    });
  });

  it('updates field value when onChange is called', () => {
    const { result } = renderHook(() => useFormFields());
    
    act(() => {
      result.current.onChange({
        target: { name: 'postCode', value: '12345' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.fields.postCode).toBe('12345');
    expect(result.current.fields.houseNumber).toBe('');
  });

  it('updates multiple fields independently', () => {
    const { result } = renderHook(() => useFormFields());
    
    act(() => {
      result.current.onChange({
        target: { name: 'postCode', value: '12345' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { name: 'firstName', value: 'John' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { name: 'houseNumber', value: '42' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.fields).toEqual({
      postCode: '12345',
      houseNumber: '42',
      firstName: 'John',
      lastName: '',
      selectedAddress: '',
    });
  });

  it('clears all fields when clearFields is called', () => {
    const { result } = renderHook(() => useFormFields());
    
    // Set some values first
    act(() => {
      result.current.onChange({
        target: { name: 'postCode', value: '12345' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { name: 'firstName', value: 'John' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { name: 'selectedAddress', value: 'address-1' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Clear all fields
    act(() => {
      result.current.clearFields();
    });

    expect(result.current.fields).toEqual({
      postCode: '',
      houseNumber: '',
      firstName: '',
      lastName: '',
      selectedAddress: '',
    });
  });

  it('handles radio button change for selectedAddress', () => {
    const { result } = renderHook(() => useFormFields());
    
    act(() => {
      result.current.onChange({
        target: { name: 'selectedAddress', value: 'address-123' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.fields.selectedAddress).toBe('address-123');
  });

  it('preserves field values when updating one field', () => {
    const { result } = renderHook(() => useFormFields());
    
    // Set initial values
    act(() => {
      result.current.onChange({
        target: { name: 'postCode', value: '12345' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    act(() => {
      result.current.onChange({
        target: { name: 'firstName', value: 'John' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Update one field
    act(() => {
      result.current.onChange({
        target: { name: 'lastName', value: 'Doe' }
      } as React.ChangeEvent<HTMLInputElement>);
    });

    // Check that other fields are preserved
    expect(result.current.fields.postCode).toBe('12345');
    expect(result.current.fields.firstName).toBe('John');
    expect(result.current.fields.lastName).toBe('Doe');
  });

  it('callback functions remain stable across re-renders', () => {
    const { result, rerender } = renderHook(() => useFormFields());
    
    const initialOnChange = result.current.onChange;
    const initialClearFields = result.current.clearFields;

    rerender();

    expect(result.current.onChange).toBe(initialOnChange);
    expect(result.current.clearFields).toBe(initialClearFields);
  });
});
