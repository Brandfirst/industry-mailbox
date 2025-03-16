
import React from 'react';
import { render, screen } from '@testing-library/react';
import SenderInfoCell from '../SenderInfoCell';
import { NewsletterSenderStats } from '@/lib/supabase/newsletters/types';

describe('SenderInfoCell Component', () => {
  test('renders sender with name and email', () => {
    const sender: NewsletterSenderStats = {
      sender_email: 'test@example.com',
      sender_name: 'Test Sender',
      newsletter_count: 5,
      category_id: 1,
      brand_name: 'Test Brand',
      last_sync_date: '2023-05-20T12:00:00Z'
    };

    render(
      <table>
        <tbody>
          <tr>
            <SenderInfoCell sender={sender} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Test Sender')).toBeInTheDocument();
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('uses email username when sender name is missing', () => {
    const sender: NewsletterSenderStats = {
      sender_email: 'test@example.com',
      sender_name: null,
      newsletter_count: 5,
      category_id: 1,
      brand_name: 'Test Brand',
      last_sync_date: '2023-05-20T12:00:00Z'
    };

    render(
      <table>
        <tbody>
          <tr>
            <SenderInfoCell sender={sender} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('test')).toBeInTheDocument(); // Should show username part of email
    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });

  test('renders with Mail icon', () => {
    const sender: NewsletterSenderStats = {
      sender_email: 'test@example.com',
      sender_name: 'Test Sender',
      newsletter_count: 5,
      category_id: 1,
      brand_name: 'Test Brand',
      last_sync_date: '2023-05-20T12:00:00Z'
    };

    render(
      <table>
        <tbody>
          <tr>
            <SenderInfoCell sender={sender} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Mail Icon')).toBeInTheDocument();
  });
});
