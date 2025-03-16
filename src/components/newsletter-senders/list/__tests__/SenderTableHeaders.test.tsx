
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SenderTableHeaders from '../SenderTableHeaders';
import { SenderSortField } from '../../components/SenderTableHeaders';

describe('SenderTableHeaders Component', () => {
  const onSort = jest.fn();
  const onSelectAll = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders all column headers', () => {
    render(
      <table>
        <SenderTableHeaders 
          sortField="name" 
          sortDirection="asc" 
          onSort={onSort} 
          allSelected={false} 
          onSelectAll={onSelectAll} 
        />
      </table>
    );

    expect(screen.getByText('Sender')).toBeInTheDocument();
    expect(screen.getByText('Brand')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Newsletters')).toBeInTheDocument();
    expect(screen.getByText('Last Sync')).toBeInTheDocument();
  });

  test('renders select all checkbox when onSelectAll is provided', () => {
    render(
      <table>
        <SenderTableHeaders 
          sortField="name" 
          sortDirection="asc" 
          onSort={onSort} 
          allSelected={false} 
          onSelectAll={onSelectAll} 
        />
      </table>
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  test('does not render select all checkbox when onSelectAll is not provided', () => {
    render(
      <table>
        <SenderTableHeaders 
          sortField="name" 
          sortDirection="asc" 
          onSort={onSort} 
          allSelected={false} 
        />
      </table>
    );

    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  test('displays correct sort indicators for active sort field', () => {
    render(
      <table>
        <SenderTableHeaders 
          sortField="name" 
          sortDirection="asc" 
          onSort={onSort} 
          allSelected={false} 
        />
      </table>
    );

    // Check that ArrowUpIcon is visible for the "name" column (ascending)
    const senderColumnBtn = screen.getByText('Sender').closest('button');
    expect(senderColumnBtn).toBeInTheDocument();
    expect(senderColumnBtn?.innerHTML).toContain('ArrowUpIcon');

    // Check other columns don't have sort indicators
    const brandColumnBtn = screen.getByText('Brand').closest('button');
    expect(brandColumnBtn?.innerHTML).not.toContain('ArrowUpIcon');
    expect(brandColumnBtn?.innerHTML).not.toContain('ArrowDownIcon');
  });

  test('calls onSort when column header is clicked', () => {
    render(
      <table>
        <SenderTableHeaders 
          sortField="name" 
          sortDirection="asc" 
          onSort={onSort} 
          allSelected={false} 
        />
      </table>
    );

    const brandColumnBtn = screen.getByText('Brand').closest('button');
    fireEvent.click(brandColumnBtn!);
    expect(onSort).toHaveBeenCalledWith('brand');
  });

  test('calls onSelectAll when select all checkbox is clicked', () => {
    render(
      <table>
        <SenderTableHeaders 
          sortField="name" 
          sortDirection="asc" 
          onSort={onSort} 
          allSelected={false} 
          onSelectAll={onSelectAll} 
        />
      </table>
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(onSelectAll).toHaveBeenCalled();
  });
});
