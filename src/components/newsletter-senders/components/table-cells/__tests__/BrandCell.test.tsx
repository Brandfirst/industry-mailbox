
import React from 'react';
import { render, screen } from '@testing-library/react';
import BrandCell from '../BrandCell';

// Mock the BrandInput component
jest.mock('../../BrandInput', () => ({
  __esModule: true,
  default: ({ 
    senderEmail, 
    initialValue, 
    isUpdating, 
    onUpdate 
  }) => (
    <div data-testid="brand-input">
      <span data-testid="sender-email">{senderEmail}</span>
      <span data-testid="initial-value">{initialValue}</span>
      <span data-testid="is-updating">{isUpdating.toString()}</span>
      <button 
        data-testid="update-button"
        onClick={() => onUpdate(senderEmail, 'Updated Brand')}
      >
        Update
      </button>
    </div>
  ),
}));

describe('BrandCell Component', () => {
  const senderEmail = 'test@example.com';
  const brandInputValue = 'Test Brand';
  const onBrandUpdate = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders BrandInput with correct props', () => {
    render(
      <table>
        <tbody>
          <tr>
            <BrandCell 
              senderEmail={senderEmail} 
              brandInputValue={brandInputValue} 
              isUpdating={false} 
              onBrandUpdate={onBrandUpdate} 
            />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByTestId('brand-input')).toBeInTheDocument();
    expect(screen.getByTestId('sender-email')).toHaveTextContent(senderEmail);
    expect(screen.getByTestId('initial-value')).toHaveTextContent(brandInputValue);
    expect(screen.getByTestId('is-updating')).toHaveTextContent('false');
  });

  test('passes isUpdating prop', () => {
    render(
      <table>
        <tbody>
          <tr>
            <BrandCell 
              senderEmail={senderEmail} 
              brandInputValue={brandInputValue} 
              isUpdating={true} 
              onBrandUpdate={onBrandUpdate} 
            />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByTestId('is-updating')).toHaveTextContent('true');
  });
});
