
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock the UI components that are imported from shadcn
jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table data-testid="table">{children}</table>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead data-testid="table-header">{children}</thead>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody data-testid="table-body">{children}</tbody>
  ),
  TableHead: ({ 
    children, 
    className 
  }: { 
    children: React.ReactNode;
    className?: string;
  }) => (
    <th data-testid="table-head" className={className}>{children}</th>
  ),
  TableRow: ({ 
    children, 
    className 
  }: { 
    children: React.ReactNode;
    className?: string;
  }) => (
    <tr data-testid="table-row" className={className}>{children}</tr>
  ),
  TableCell: ({ 
    children, 
    className 
  }: { 
    children: React.ReactNode;
    className?: string;
  }) => (
    <td data-testid="table-cell" className={className}>{children}</td>
  )
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props: any) => (
    <input 
      type="checkbox" 
      checked={props.checked} 
      onChange={props.onCheckedChange ? () => props.onCheckedChange(!props.checked) : undefined}
      className={props.className}
      aria-label={props["aria-label"]}
      data-testid="checkbox"
    />
  )
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => (
    <input 
      {...props}
      data-testid="input"
      className={props.className}
    />
  )
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ 
    children, 
    onClick, 
    disabled, 
    variant, 
    size, 
    className 
  }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={className}
      data-variant={variant}
      data-size={size}
      data-testid="button"
    >
      {children}
    </button>
  )
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ 
    children, 
    variant, 
    className 
  }: any) => (
    <span 
      className={`badge ${className || ''}`}
      data-variant={variant}
      data-testid="badge"
    >
      {children}
    </span>
  )
}));

jest.mock('lucide-react', () => ({
  Mail: () => <span data-icon="mail" data-testid="mail-icon">Mail Icon</span>,
  Calendar: () => <span data-icon="calendar" data-testid="calendar-icon">Calendar Icon</span>,
  Trash2: () => <span data-icon="trash2" data-testid="trash-icon">Trash Icon</span>,
  ArrowUpIcon: () => <span data-icon="arrow-up" data-testid="arrow-up-icon">ArrowUpIcon</span>,
  ArrowDownIcon: () => <span data-icon="arrow-down" data-testid="arrow-down-icon">ArrowDownIcon</span>,
  Briefcase: () => <span data-icon="briefcase" data-testid="briefcase-icon">Briefcase Icon</span>,
  Pen: () => <span data-icon="pen" data-testid="pen-icon">Pen Icon</span>,
  Tag: () => <span data-icon="tag" data-testid="tag-icon">Tag Icon</span>,
  InfoIcon: () => <span data-icon="info" data-testid="info-icon">Info Icon</span>
}));

jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => '2023-05-20') // Return a fixed date string for testing
}));

// Mock the select component from shadcn
jest.mock('@/components/ui/select', () => ({
  Select: ({ 
    children, 
    value, 
    onValueChange, 
    disabled 
  }: any) => (
    <div className="select-container" data-testid="select-container">
      <select 
        value={value} 
        onChange={(e) => onValueChange && onValueChange(e.target.value)}
        disabled={disabled}
        data-testid="select"
      >
        {children}
      </select>
    </div>
  ),
  SelectTrigger: ({ 
    children, 
    className 
  }: any) => (
    <div className={`select-trigger ${className || ''}`} data-testid="select-trigger">
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: any) => (
    <div className="select-value" data-placeholder={placeholder} data-testid="select-value">
      Select Value
    </div>
  ),
  SelectContent: ({ 
    children, 
    className 
  }: any) => (
    <div className={`select-content ${className || ''}`} data-testid="select-content">
      {children}
    </div>
  ),
  SelectItem: ({ 
    children, 
    value, 
    className 
  }: any) => (
    <option value={value} className={className} data-testid="select-item">
      {children}
    </option>
  )
}));

// Mock Promise behavior
window.Promise = global.Promise;

// Mock localStorage
const localStorageMock = (function() {
  let store: Record<string, string> = {};
  return {
    getItem: function(key: string) {
      return store[key] || null;
    },
    setItem: function(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem: function(key: string) {
      delete store[key];
    },
    clear: function() {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});
