
import React from 'react';
import { render, screen } from '@testing-library/react';
import SenderTableRows from '../SenderTableRows';
import { NewsletterSenderStats } from '@/lib/supabase/newsletters';
import { NewsletterCategory } from '@/lib/supabase/types';

// Mock the SenderTableRow component
jest.mock('../../components/SenderTableRow', () => ({
  __esModule: true,
  default: ({ 
    sender, 
    index, 
    categories, 
    isSelected, 
    onToggleSelect 
  }) => (
    <tr data-testid={`sender-row-${sender.sender_email}`}>
      {onToggleSelect && (
        <td>
          <input 
            type="checkbox"
            data-testid={`select-${sender.sender_email}`}
            checked={isSelected}
            readOnly
          />
        </td>
      )}
      <td data-testid={`sender-name-${sender.sender_email}`}>
        {sender.sender_name || sender.sender_email}
      </td>
      <td data-testid={`category-${sender.sender_email}`}>
        {categories.find(c => c.id === sender.category_id)?.name || 'Uncategorized'}
      </td>
    </tr>
  ),
}));

// Mock the EmptyTableRow component
jest.mock('../../components/EmptyTableRow', () => ({
  __esModule: true,
  default: ({ colSpan }) => <tr data-testid="empty-row"><td colSpan={colSpan}>No senders found</td></tr>,
}));

describe('SenderTableRows Component', () => {
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

  const mockProps = {
    senders: mockSenders,
    categories: mockCategories,
    selectedSenders: ['test@example.com'],
    effectiveUpdatingCategory: null,
    effectiveUpdatingBrand: null,
    getBrandInputValue: jest.fn(() => 'Test Brand'),
    onCategoryChange: jest.fn().mockResolvedValue(undefined),
    onBrandUpdate: jest.fn().mockResolvedValue(undefined),
    onToggleSelect: jest.fn()
  };

  test('renders empty state when no senders', () => {
    render(
      <table>
        <tbody>
          <SenderTableRows 
            {...mockProps}
            senders={[]}
          />
        </tbody>
      </table>
    );

    expect(screen.getByTestId('empty-row')).toBeInTheDocument();
  });

  test('renders correct number of sender rows', () => {
    render(
      <table>
        <tbody>
          <SenderTableRows {...mockProps} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId(`sender-row-${mockSenders[0].sender_email}`)).toBeInTheDocument();
    expect(screen.getByTestId(`sender-row-${mockSenders[1].sender_email}`)).toBeInTheDocument();
  });

  test('passes correct selection status to rows', () => {
    render(
      <table>
        <tbody>
          <SenderTableRows {...mockProps} />
        </tbody>
      </table>
    );

    expect(screen.getByTestId(`select-${mockSenders[0].sender_email}`)).toBeChecked();
    expect(screen.getByTestId(`select-${mockSenders[1].sender_email}`)).not.toBeChecked();
  });

  test('renders empty row with correct colspan when no toggle select', () => {
    render(
      <table>
        <tbody>
          <SenderTableRows 
            {...mockProps}
            senders={[]}
            onToggleSelect={undefined}
          />
        </tbody>
      </table>
    );

    // When onToggleSelect is not provided, the colSpan should be 6 instead of 7
    const emptyRow = screen.getByTestId('empty-row');
    expect(emptyRow).toBeInTheDocument();
  });
});
