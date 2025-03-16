
import React from 'react';
import { render, screen } from '@testing-library/react';
import LastSyncCell from '../LastSyncCell';
import { format } from 'date-fns';

// Mock date-fns to control date formatting
jest.mock('date-fns', () => ({
  format: jest.fn().mockReturnValue('May 20, 2023')
}));

describe('LastSyncCell Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders formatted date for valid date', () => {
    render(
      <table>
        <tbody>
          <tr>
            <LastSyncCell lastSyncDate="2023-05-20T12:00:00Z" />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('May 20, 2023')).toBeInTheDocument();
    expect(format).toHaveBeenCalledWith(expect.any(Date), 'MMM d, yyyy');
  });

  test('renders "Never" when date is null', () => {
    render(
      <table>
        <tbody>
          <tr>
            <LastSyncCell lastSyncDate={null} />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Never')).toBeInTheDocument();
    expect(format).not.toHaveBeenCalled();
  });

  test('renders with Calendar icon', () => {
    render(
      <table>
        <tbody>
          <tr>
            <LastSyncCell lastSyncDate="2023-05-20T12:00:00Z" />
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByText('Calendar Icon')).toBeInTheDocument();
  });
});
