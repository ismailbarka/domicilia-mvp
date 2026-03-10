import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import FiltersScrollView from '../filters-scroll-view';

describe('FiltersScrollView Component', () => {
  const mockCategories = ['All', 'Cleaners', 'Nannies'];

  it('renders all filter categories correctly', () => {
    const { getByText } = render(
      <FiltersScrollView
        filterCategories={mockCategories}
        category="All"
        onSelectedCategoryChange={() => {}}
      />
    );

    // Verify all categories are rendered on the screen
    mockCategories.forEach(category => {
      expect(getByText(category)).toBeTruthy();
    });
  });

  it('calls setSelectedCategory when a filter is pressed', () => {
    const mockSetSelectedCategory = jest.fn(); // Mock the click handler

    const { getByText } = render(
      <FiltersScrollView
        filterCategories={mockCategories}
        category="All"
        onSelectedCategoryChange={mockSetSelectedCategory}
      />
    );

    // Find the 'Cleaners' button and "tap" it
    const cleanersButton = getByText('Cleaners');
    fireEvent.press(cleanersButton);

    // Ensure the handler was called with 'Cleaners'
    expect(mockSetSelectedCategory).toHaveBeenCalledTimes(1);
    expect(mockSetSelectedCategory).toHaveBeenCalledWith('Cleaners');
  });
});
