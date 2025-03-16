
import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryCell from '../CategoryCell';
import { NewsletterCategory } from '@/lib/supabase/types';

// Mock the CategorySelector component
jest.mock('../../CategorySelector', () => ({
  __esModule: true,
  default: ({ 
    senderEmail, 
    categories, 
    currentCategoryId, 
    isUpdating, 
    onChange 
  }) => (
    <div data-testid="category-selector">
      <span data-testid="sender-email">{senderEmail}</span>
      <span data-testid="category-count">{categories.length}</span>
      <span data-testid="current-category">{currentCategoryId}</span>
      <span data-testid="is-updating">{isUpdating.toString()}</span>
      <button 
        data-testid="change-button"
        onClick={() => onChange(senderEmail, '2')}
      >
        Change Category
      </button>
    </div>
  ),
}));

describe('CategoryCell Component', () => {
  const senderEmail = 'test@example.com';
  const categoryId = 1;
  const categories: NewsletterCategory[] = [
    { id: 1, name: 'News', color: '#FF0000', user_id: 'user1' },
    { id: 2, name: 'Tech', color: '#00FF00', user_id: 'user1' }
  ];
  const onCategoryChange = jest.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CategorySelector with correct props', () => {
    render(
      <table>
        <tbody>
          <tr>
            <CategoryCell 
              senderEmail={senderEmail} 
              categoryId={categoryId} 
              categories={categories} 
              isUpdating={false} 
              onCategoryChange={onCategoryChange} 
            />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByTestId('category-selector')).toBeInTheDocument();
    expect(screen.getByTestId('sender-email')).toHaveTextContent(senderEmail);
    expect(screen.getByTestId('category-count')).toHaveTextContent('2');
    expect(screen.getByTestId('current-category')).toHaveTextContent('1');
    expect(screen.getByTestId('is-updating')).toHaveTextContent('false');
  });

  test('passes null categoryId correctly', () => {
    render(
      <table>
        <tbody>
          <tr>
            <CategoryCell 
              senderEmail={senderEmail} 
              categoryId={null} 
              categories={categories} 
              isUpdating={false} 
              onCategoryChange={onCategoryChange} 
            />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByTestId('current-category')).toHaveTextContent('');
  });

  test('passes isUpdating prop', () => {
    render(
      <table>
        <tbody>
          <tr>
            <CategoryCell 
              senderEmail={senderEmail} 
              categoryId={categoryId} 
              categories={categories} 
              isUpdating={true} 
              onCategoryChange={onCategoryChange} 
            />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByTestId('is-updating')).toHaveTextContent('true');
  });
});
