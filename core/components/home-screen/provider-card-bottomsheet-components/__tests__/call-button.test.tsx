import { Provider } from '@/core/types/provider-type';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Linking } from 'react-native';
import CallButton from '../call-button';

// Mock Expo Vector Icons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons'
}));

// Mock React Native Linking API
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Linking.openURL = jest.fn();
  return RN;
});

describe('CallButton Component', () => {
  const mockProvider: Provider = {
    id: 1,
    name: 'Test Cleaner',
    phone: '0612345678',
    description: 'testing description',
    latitude: 0,
    longitude: 0,
    distance: 1,
    categoryName: 'cleaner',

    // ✅ required fields from type
    categoryId: 10,
    isActive: true,

    // ✅ optional field
    photoUrl: 'http://example.com/image.jpg'
  };

  it('renders correctly with the Call title', () => {
    const { getByText } = render(<CallButton provider={mockProvider} />);

    expect(getByText('Call')).toBeTruthy();
  });

  it('invokes Linking.openURL with the correctly formatted phone number when pressed', () => {
    const { getByText } = render(<CallButton provider={mockProvider} />);

    const button = getByText('Call');
    fireEvent.press(button);

    expect(Linking.openURL).toHaveBeenCalledTimes(1);
    expect(Linking.openURL).toHaveBeenCalledWith('tel:0612345678');
  });
});
