
import React from 'react';
import { render, screen } from '@testing-library/react';
import NewsletterCountCell from '../NewsletterCountCell';

describe('NewsletterCountCell Component', () => {
  test('renders count in a badge', () => {
    render(
      <table>
        <tbody>
          <tr>
            <NewsletterCountCell count={5} />
          </tr>
        </tbody>
      </table>
    );

    const badge = screen.getByText('5');
    expect(badge).toBeInTheDocument();
    expect(badge.closest('.badge')).toHaveClass('text-xs font-normal');
  });

  test('renders zero when count is zero', () => {
    render(
      <table>
        <tbody>
          <tr>
            <NewsletterCountCell count={0} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });

  test('handles undefined count by showing zero', () => {
    render(
      <table>
        <tbody>
          <tr>
            <NewsletterCountCell count={undefined as any} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('0')).toBeInTheDocument();
  });
});
