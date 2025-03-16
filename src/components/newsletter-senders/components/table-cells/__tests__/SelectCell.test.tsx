
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SelectCell from '../SelectCell';

describe('SelectCell Component', () => {
  const onToggleSelect = jest.fn();
  const senderEmail = 'test@example.com';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders checkbox with unchecked state', () => {
    render(
      <table>
        <tbody>
          <tr>
            <SelectCell 
              isSelected={false} 
              senderEmail={senderEmail} 
              onToggleSelect={onToggleSelect} 
            />
          </tr>
        </tbody>
      </table>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).not.toBeChecked();
  });

  test('renders checkbox with checked state', () => {
    render(
      <table>
        <tbody>
          <tr>
            <SelectCell 
              isSelected={true} 
              senderEmail={senderEmail} 
              onToggleSelect={onToggleSelect} 
            />
          </tr>
        </tbody>
      </table>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  test('calls onToggleSelect when checkbox clicked', () => {
    render(
      <table>
        <tbody>
          <tr>
            <SelectCell 
              isSelected={false} 
              senderEmail={senderEmail} 
              onToggleSelect={onToggleSelect} 
            />
          </tr>
        </tbody>
      </table>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    
    expect(onToggleSelect).toHaveBeenCalledWith(senderEmail);
  });

  test('sets correct aria-label', () => {
    render(
      <table>
        <tbody>
          <tr>
            <SelectCell 
              isSelected={false} 
              senderEmail={senderEmail} 
              onToggleSelect={onToggleSelect} 
            />
          </tr>
        </tbody>
      </table>
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-label', `Select ${senderEmail}`);
  });
});
