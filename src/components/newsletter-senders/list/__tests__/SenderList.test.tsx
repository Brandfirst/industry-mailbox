
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SenderList from '../SenderList';
import { NewsletterSenderStats } from '@/lib/supabase/newsletters';
import { NewsletterCategory } from '@/lib/supabase/types';

// Mock child components
jest.mock('../SenderListHeader', () => ({
  __esModule: true,
  default: ({ searchTerm, setSearchTerm, resultsCount }) => (
    <div data-testid="sender-list-header">
      <input 
        data-testid="search-input" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <span data-testid="results-count">{resultsCount}</span>
    </div>
  ),
}));

jest.mock('../SenderActions', () => ({
  __esModule: true,
  default: ({ selectedSenders, onDeleteSenders, isDeleting }) => (
    <div data-testid="sender-actions">
      <button 
        data-testid="delete-button" 
        disabled={isDeleting}
        onClick={() => onDeleteSenders(selectedSenders)}
      >
        Delete {selectedSenders.length}
      </button>
    </div>
  ),
}));

jest.mock('../SenderTableHeaders', () => ({
  __esModule: true,
  default: ({ sortField, sortDirection, onSort, allSelected, onSelectAll }) => (
    <thead data-testid="table-headers">
      <tr>
        {onSelectAll && (
          <th>
            <input 
              type="checkbox" 
              data-testid="select-all-checkbox" 
              checked={allSelected} 
              onChange={onSelectAll} 
            />
          </th>
        )}
        <th>
          <button data-testid="sort-name" onClick={() => onSort('name')}>
            Name {sortField === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
          </button>
        </th>
      </tr>
    </thead>
  ),
}));

jest.mock('../SenderTableRows', () => ({
  __esModule: true,
  default: ({ 
    senders, 
    categories, 
    selectedSenders, 
    onToggleSelect 
  }) => (
    <tbody data-testid="table-rows">
      {senders.map(sender => (
        <tr key={sender.sender_email} data-testid={`sender-row-${sender.sender_email}`}>
          {onToggleSelect && (
            <td>
              <input 
                type="checkbox"
                data-testid={`select-${sender.sender_email}`}
                checked={selectedSenders.includes(sender.sender_email)}
                onChange={() => onToggleSelect(sender.sender_email)}
              />
            </td>
          )}
          <td>{sender.sender_name || sender.sender_email}</td>
          <td>{categories.find(c => c.id === sender.category_id)?.name || 'Uncategorized'}</td>
        </tr>
      ))}
    </tbody>
  ),
}));

// Mock hooks
jest.mock('../../hooks/useSenderListState', () => ({
  __esModule: true,
  useSenderListState: jest.fn(props => {
    const [searchTerm, setSearchTerm] = React.useState('');
    
    // Return all the properties passed in plus the default values for those not passed
    return {
      searchTerm,
      setSearchTerm,
      sortedSenders: props.senders.filter(sender => 
        sender.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        sender.sender_email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
      effectiveToggleSort: props.toggleSort || jest.fn(),
      effectiveSortField: props.sortKey || 'name',
      effectiveSortDirection: props.sortAsc ? 'asc' : 'desc',
      effectiveUpdatingCategory: props.externalUpdatingCategory || null,
      effectiveUpdatingBrand: props.externalUpdatingBrand || null,
      effectiveDeleting: props.externalDeleting || false,
      selectedSenders: [],
      handleToggleSelect: jest.fn(),
      handleSelectAll: jest.fn(),
      handleCategoryChange: props.onCategoryChange || jest.fn(),
      handleBrandUpdate: props.onBrandChange || jest.fn(),
      handleDeleteSenders: props.onDeleteSenders || props.onDelete || jest.fn(),
      getBrandInputValue: jest.fn(() => ''),
      effectiveDeleteFunction: props.onDeleteSenders || props.onDelete
    };
  })
}));

// Sample test data
const mockSenders: NewsletterSenderStats[] = [
  {
    sender_email: 'test@example.com',
    sender_name: 'Test Sender',
    newsletter_count: 5,
    category_id: 1,
    brand_name: 'Test Brand',
    last_sync_date: '2023-05-20T12:00:00Z'
  },
  {
    sender_email: 'another@example.com',
    sender_name: 'Another Sender',
    newsletter_count: 3,
    category_id: 2,
    brand_name: 'Another Brand',
    last_sync_date: '2023-05-18T14:30:00Z'
  }
];

const mockCategories: NewsletterCategory[] = [
  { id: 1, name: 'News', color: '#FF0000', user_id: 'user1' },
  { id: 2, name: 'Tech', color: '#00FF00', user_id: 'user1' }
];

describe('SenderList Component', () => {
  test('renders loading state', () => {
    render(<SenderList senders={[]} categories={[]} loading={true} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders empty list', () => {
    render(<SenderList senders={[]} categories={mockCategories} loading={false} />);
    expect(screen.getByTestId('table-rows')).toBeInTheDocument();
    expect(screen.getByTestId('results-count').textContent).toBe('0');
  });

  test('renders senders list', () => {
    render(<SenderList senders={mockSenders} categories={mockCategories} loading={false} />);
    expect(screen.getByTestId('table-rows')).toBeInTheDocument();
    expect(screen.getByTestId('results-count').textContent).toBe('2');
    expect(screen.getByTestId(`sender-row-${mockSenders[0].sender_email}`)).toBeInTheDocument();
    expect(screen.getByTestId(`sender-row-${mockSenders[1].sender_email}`)).toBeInTheDocument();
  });

  test('search functionality filters senders', async () => {
    render(<SenderList senders={mockSenders} categories={mockCategories} loading={false} />);
    
    const searchInput = screen.getByTestId('search-input');
    fireEvent.change(searchInput, { target: { value: 'Another' } });
    
    // Wait for the filtering to happen
    await waitFor(() => {
      expect(screen.queryByTestId(`sender-row-${mockSenders[0].sender_email}`)).not.toBeInTheDocument();
      expect(screen.getByTestId(`sender-row-${mockSenders[1].sender_email}`)).toBeInTheDocument();
      expect(screen.getByTestId('results-count').textContent).toBe('1');
    });
  });

  test('renders delete button when onDeleteSenders is provided', () => {
    const handleDelete = jest.fn();
    render(
      <SenderList 
        senders={mockSenders} 
        categories={mockCategories} 
        onDeleteSenders={handleDelete} 
      />
    );
    
    expect(screen.getByTestId('delete-button')).toBeInTheDocument();
  });

  test('does not render delete button when onDeleteSenders is not provided', () => {
    render(<SenderList senders={mockSenders} categories={mockCategories} />);
    expect(screen.queryByTestId('delete-button')).not.toBeInTheDocument();
  });
});
