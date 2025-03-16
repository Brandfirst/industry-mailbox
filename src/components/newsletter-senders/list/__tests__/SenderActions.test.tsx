
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SenderActions from '../SenderActions';

// Mock the DeleteConfirmationDialog
jest.mock('@/components/newsletter-sync/DeleteConfirmationDialog', () => ({
  __esModule: true,
  DeleteConfirmationDialog: ({ 
    isOpen, 
    onOpenChange, 
    onConfirm, 
    isDeleting, 
    count 
  }) => (
    <div data-testid="delete-dialog" style={{ display: isOpen ? 'block' : 'none' }}>
      <div data-testid="dialog-count">{count}</div>
      <button 
        data-testid="dialog-confirm" 
        onClick={onConfirm}
        disabled={isDeleting}
      >
        Confirm
      </button>
      <button 
        data-testid="dialog-cancel" 
        onClick={() => onOpenChange(false)}
      >
        Cancel
      </button>
    </div>
  ),
}));

describe('SenderActions Component', () => {
  const onDeleteSenders = jest.fn().mockResolvedValue(undefined);
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders delete button with correct count', () => {
    render(
      <SenderActions 
        selectedSenders={['test@example.com', 'other@example.com']} 
        onDeleteSenders={onDeleteSenders} 
        isDeleting={false} 
      />
    );

    const deleteButton = screen.getByRole('button');
    expect(deleteButton).toBeInTheDocument();
    expect(deleteButton).toHaveTextContent('Delete 2 selected');
  });

  test('does not render when no senders selected', () => {
    render(
      <SenderActions 
        selectedSenders={[]} 
        onDeleteSenders={onDeleteSenders} 
        isDeleting={false} 
      />
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  test('opens confirmation dialog when delete button clicked', () => {
    render(
      <SenderActions 
        selectedSenders={['test@example.com']} 
        onDeleteSenders={onDeleteSenders} 
        isDeleting={false} 
      />
    );

    const deleteButton = screen.getByRole('button');
    fireEvent.click(deleteButton);

    const dialog = screen.getByTestId('delete-dialog');
    expect(dialog).toHaveStyle('display: block');
  });

  test('calls onDeleteSenders when deletion confirmed', async () => {
    render(
      <SenderActions 
        selectedSenders={['test@example.com', 'other@example.com']} 
        onDeleteSenders={onDeleteSenders} 
        isDeleting={false} 
      />
    );

    // Open dialog
    fireEvent.click(screen.getByRole('button'));
    
    // Confirm deletion
    fireEvent.click(screen.getByTestId('dialog-confirm'));
    
    // Verify onDeleteSenders was called with the selected emails
    expect(onDeleteSenders).toHaveBeenCalledWith(['test@example.com', 'other@example.com']);
    
    // Dialog should be closed after confirmation
    await waitFor(() => {
      expect(screen.getByTestId('delete-dialog')).toHaveStyle('display: none');
    });
  });

  test('disables delete button when isDeleting is true', () => {
    render(
      <SenderActions 
        selectedSenders={['test@example.com']} 
        onDeleteSenders={onDeleteSenders} 
        isDeleting={true} 
      />
    );

    expect(screen.getByRole('button')).toBeDisabled();
  });

  test('closes dialog without deleting when cancel clicked', () => {
    render(
      <SenderActions 
        selectedSenders={['test@example.com']} 
        onDeleteSenders={onDeleteSenders} 
        isDeleting={false} 
      />
    );

    // Open dialog
    fireEvent.click(screen.getByRole('button'));
    
    // Cancel deletion
    fireEvent.click(screen.getByTestId('dialog-cancel'));
    
    // Verify onDeleteSenders was not called
    expect(onDeleteSenders).not.toHaveBeenCalled();
    
    // Dialog should be closed
    expect(screen.getByTestId('delete-dialog')).toHaveStyle('display: none');
  });
});
