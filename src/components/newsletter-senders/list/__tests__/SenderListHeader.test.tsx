
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SenderListHeader from '../SenderListHeader';

describe('SenderListHeader Component', () => {
  const setSearchTerm = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders search input', () => {
    render(
      <SenderListHeader 
        searchTerm="" 
        setSearchTerm={setSearchTerm} 
        resultsCount={0} 
      />
    );

    expect(screen.getByPlaceholderText('Search senders...')).toBeInTheDocument();
  });

  test('displays correct result count singular', () => {
    render(
      <SenderListHeader 
        searchTerm="" 
        setSearchTerm={setSearchTerm} 
        resultsCount={1} 
      />
    );

    expect(screen.getByText('1 result')).toBeInTheDocument();
  });

  test('displays correct result count plural', () => {
    render(
      <SenderListHeader 
        searchTerm="" 
        setSearchTerm={setSearchTerm} 
        resultsCount={5} 
      />
    );

    expect(screen.getByText('5 results')).toBeInTheDocument();
  });

  test('updates search term when input changes', () => {
    render(
      <SenderListHeader 
        searchTerm="" 
        setSearchTerm={setSearchTerm} 
        resultsCount={0} 
      />
    );

    const searchInput = screen.getByPlaceholderText('Search senders...');
    fireEvent.change(searchInput, { target: { value: 'test search' } });
    
    expect(setSearchTerm).toHaveBeenCalledWith('test search');
  });

  test('renders with existing search term', () => {
    render(
      <SenderListHeader 
        searchTerm="existing search" 
        setSearchTerm={setSearchTerm} 
        resultsCount={3} 
      />
    );

    const searchInput = screen.getByPlaceholderText('Search senders...') as HTMLInputElement;
    expect(searchInput.value).toBe('existing search');
  });
});
