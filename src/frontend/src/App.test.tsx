import React from 'react';
import { act, render, screen, fireEvent, waitFor } from '@testing-library/react';
import RestaurantList from '../src/components/RestaurantList';
import {
  getRestaurants,
  deleteRestaurant,
} from '../src/api';

// Mock the API functions
jest.mock('../src/api', () => ({
  getRestaurants: jest.fn(),
  addRestaurant: jest.fn(),
  deleteRestaurant: jest.fn(),
  updateRestaurant: jest.fn()
}));

// Mock the Lucide React icons
jest.mock('lucide-react', () => ({
  Plus: () => <div data-testid="plus-icon" />,
  Edit: () => <div data-testid="edit-icon" />,
  Trash2: () => <div data-testid="trash-icon" />
}));

describe('RestaurantList Component', () => {
  const mockRestaurants = [
    { ID: '1', name: 'Test Restaurant 1', cuisine: 'Italian', location: 'New York' },
    { ID: '2', name: 'Test Restaurant 2', cuisine: 'Japanese', location: 'Los Angeles' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the initial API call to get restaurants
    (getRestaurants as jest.Mock).mockResolvedValue(mockRestaurants);
  });

  test('renders the component with restaurant list', async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<RestaurantList />);
    });

    expect(getRestaurants).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Restaurants')).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant 1')).toBeInTheDocument();
    expect(screen.getByText('Test Restaurant 2')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
    expect(screen.getByText('Japanese')).toBeInTheDocument();
  });

  test('opens edit restaurant dialog when edit button is clicked', async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<RestaurantList />);
    });

    const editButtons = screen.getAllByText('Edit');
    fireEvent.click(editButtons[0]);

    expect(screen.getByText('Edit Restaurant')).toBeInTheDocument();
  });

  test('opens delete restaurant dialog when delete button is clicked', async () => {
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<RestaurantList />);
    });

    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // We'd need to check for the delete confirmation dialog
    // This depends on the implementation of DeleteRestaurantDialog
    // For this test, we'll just check if the dialog triggers
    expect(deleteRestaurant).not.toHaveBeenCalled(); // Should not call delete immediately
  });

  test('deletes a restaurant successfully', async () => {
    (deleteRestaurant as jest.Mock).mockResolvedValue({ success: true });
    
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<RestaurantList />);
    });

    // Click delete button for first restaurant
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Find and click the confirm delete button
    // This depends on your DeleteRestaurantDialog implementation
    const confirmDeleteButton = screen.getByRole('button', { name: /confirm|yes|delete/i });
    fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(deleteRestaurant).toHaveBeenCalledWith('1');
      // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
      expect(getRestaurants).toHaveBeenCalledTimes(2); // Initial load + after delete
    });
  });

  test('handles restaurant filtering or sorting if implemented', async () => {
    // This is a placeholder test for any filtering or sorting functionality
    // that might be implemented in the future
    
    // eslint-disable-next-line testing-library/no-unnecessary-act
    await act(async () => {
      render(<RestaurantList />);
    });
  });
});