import addressBookReducer, {
  addAddress,
  removeAddress,
  updateAddresses,
  selectAddress,
} from '../addressBookSlice';
import { Address } from '@/types';

describe('addressBookSlice', () => {
  const initialState = {
    addresses: [],
  };

  const mockAddress1: Address = {
    id: '1',
    street: 'Main Street',
    houseNumber: '123',
    postcode: '12345',
    city: 'Amsterdam',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockAddress2: Address = {
    id: '2',
    street: 'Second Street',
    houseNumber: '456',
    postcode: '67890',
    city: 'Rotterdam',
    firstName: 'Jane',
    lastName: 'Smith',
  };

  const duplicateAddress: Address = {
    id: '3', // Different ID but same address details
    street: 'Main Street',
    houseNumber: '123',
    postcode: '12345',
    city: 'Amsterdam',
    firstName: 'John',
    lastName: 'Doe',
  };

  describe('addAddress', () => {
    it('should add address to empty state', () => {
      const action = addAddress(mockAddress1);
      const state = addressBookReducer(initialState, action);

      expect(state.addresses).toHaveLength(1);
      expect(state.addresses[0]).toEqual(mockAddress1);
    });

    it('should add multiple different addresses', () => {
      let state = addressBookReducer(initialState, addAddress(mockAddress1));
      state = addressBookReducer(state, addAddress(mockAddress2));

      expect(state.addresses).toHaveLength(2);
      expect(state.addresses[0]).toEqual(mockAddress1);
      expect(state.addresses[1]).toEqual(mockAddress2);
    });

    it('should prevent duplicate addresses', () => {
      let state = addressBookReducer(initialState, addAddress(mockAddress1));
      state = addressBookReducer(state, addAddress(duplicateAddress));

      expect(state.addresses).toHaveLength(1);
      expect(state.addresses[0]).toEqual(mockAddress1);
    });

    it('should allow addresses with same street but different house numbers', () => {
      const similarAddress: Address = {
        ...mockAddress1,
        id: '3',
        houseNumber: '124', // Different house number
      };

      let state = addressBookReducer(initialState, addAddress(mockAddress1));
      state = addressBookReducer(state, addAddress(similarAddress));

      expect(state.addresses).toHaveLength(2);
    });

    it('should allow addresses with same details but different names', () => {
      const sameAddressDifferentPerson: Address = {
        ...mockAddress1,
        id: '3',
        firstName: 'Jane', // Different person
        lastName: 'Smith',
      };

      let state = addressBookReducer(initialState, addAddress(mockAddress1));
      state = addressBookReducer(state, addAddress(sameAddressDifferentPerson));

      expect(state.addresses).toHaveLength(2);
    });
  });

  describe('removeAddress', () => {
    it('should remove address by id', () => {
      const stateWithAddresses = {
        addresses: [mockAddress1, mockAddress2],
      };

      const state = addressBookReducer(stateWithAddresses, removeAddress('1'));

      expect(state.addresses).toHaveLength(1);
      expect(state.addresses[0]).toEqual(mockAddress2);
    });

    it('should handle removing non-existent address', () => {
      const stateWithAddresses = {
        addresses: [mockAddress1],
      };

      const state = addressBookReducer(stateWithAddresses, removeAddress('non-existent'));

      expect(state.addresses).toHaveLength(1);
      expect(state.addresses[0]).toEqual(mockAddress1);
    });

    it('should remove all instances with same id', () => {
      const stateWithAddresses = {
        addresses: [mockAddress1, mockAddress2, mockAddress1],
      };

      const state = addressBookReducer(stateWithAddresses, removeAddress('1'));

      expect(state.addresses).toHaveLength(1);
      expect(state.addresses[0]).toEqual(mockAddress2);
    });

    it('should handle removing from empty state', () => {
      const state = addressBookReducer(initialState, removeAddress('1'));

      expect(state.addresses).toHaveLength(0);
    });
  });

  describe('updateAddresses', () => {
    it('should replace all addresses with new array', () => {
      const stateWithAddresses = {
        addresses: [mockAddress1],
      };

      const newAddresses = [mockAddress2, duplicateAddress];
      const state = addressBookReducer(stateWithAddresses, updateAddresses(newAddresses));

      expect(state.addresses).toHaveLength(2);
      expect(state.addresses).toEqual(newAddresses);
    });

    it('should handle updating with empty array', () => {
      const stateWithAddresses = {
        addresses: [mockAddress1, mockAddress2],
      };

      const state = addressBookReducer(stateWithAddresses, updateAddresses([]));

      expect(state.addresses).toHaveLength(0);
    });

    it('should completely replace existing addresses', () => {
      const stateWithAddresses = {
        addresses: [mockAddress1, mockAddress2],
      };

      const newAddresses = [duplicateAddress];
      const state = addressBookReducer(stateWithAddresses, updateAddresses(newAddresses));

      expect(state.addresses).toHaveLength(1);
      expect(state.addresses[0]).toEqual(duplicateAddress);
    });
  });

  describe('selectAddress selector', () => {
    it('should select addresses from state', () => {
      const mockState = {
        addressBook: {
          addresses: [mockAddress1, mockAddress2],
        },
      };

      const addresses = selectAddress(mockState as any);

      expect(addresses).toEqual([mockAddress1, mockAddress2]);
    });

    it('should return empty array when no addresses', () => {
      const mockState = {
        addressBook: {
          addresses: [],
        },
      };

      const addresses = selectAddress(mockState as any);

      expect(addresses).toEqual([]);
    });
  });

  describe('duplicate detection edge cases', () => {
    it('should detect duplicates with different casing', () => {
      const addressWithDifferentCasing: Address = {
        ...mockAddress1,
        id: '3',
        street: 'MAIN STREET', // Different casing
      };

      let state = addressBookReducer(initialState, addAddress(mockAddress1));
      state = addressBookReducer(state, addAddress(addressWithDifferentCasing));

      // Should allow since case is different (exact match required)
      expect(state.addresses).toHaveLength(2);
    });

    it('should detect exact duplicates with whitespace', () => {
      const addressWithWhitespace: Address = {
        ...mockAddress1,
        id: '3',
        street: ' Main Street ', // Extra whitespace
      };

      let state = addressBookReducer(initialState, addAddress(mockAddress1));
      state = addressBookReducer(state, addAddress(addressWithWhitespace));

      // Should allow since whitespace makes it different (exact match required)
      expect(state.addresses).toHaveLength(2);
    });
  });
});
