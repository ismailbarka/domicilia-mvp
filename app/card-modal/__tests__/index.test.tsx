import { render, screen } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import CardModalScreen from '../index';

// Mock expo-router
jest.mock('expo-router', () => ({
  useLocalSearchParams: jest.fn(),
  useRouter: () => ({
    back: jest.fn()
  })
}));

describe('CardModalScreen', () => {
  it('shows "Get Directions" text', () => {
    (useLocalSearchParams as jest.Mock).mockReturnValue({
      provider: JSON.stringify({})
    });

    render(<CardModalScreen />);

    expect(screen.getByText('Get Directions')).toBeTruthy();
  });
});
