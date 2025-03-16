
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock the UI components that are imported from shadcn
jest.mock('@/components/ui/table', () => ({
  Table: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="table" className={className}>{children}</div>
  ),
  TableHeader: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="table-header" className={className}>{children}</div>
  ),
  TableBody: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="table-body" className={className}>{children}</div>
  ),
  TableHead: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="table-head" className={className}>{children}</div>
  ),
  TableRow: ({ children, className, isSelected, isHighlighted }: { 
    children: React.ReactNode, 
    className?: string,
    isSelected?: boolean,
    isHighlighted?: boolean
  }) => (
    <div 
      data-testid="table-row" 
      className={className}
      data-selected={isSelected ? 'true' : 'false'}
      data-highlighted={isHighlighted ? 'true' : 'false'}
    >
      {children}
    </div>
  ),
  TableCell: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="table-cell" className={className}>{children}</div>
  ),
  TableCaption: ({ children, className }: { children: React.ReactNode, className?: string }) => (
    <div data-testid="table-caption" className={className}>{children}</div>
  )
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props: any) => (
    <input 
      type="checkbox" 
      data-testid="checkbox"
      checked={props.checked} 
      onChange={props.onCheckedChange ? () => props.onCheckedChange(!props.checked) : undefined}
      className={props.className}
      aria-label={props["aria-label"]}
    />
  )
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => (
    <input 
      {...props}
      data-testid="input"
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

// Mock Lucide icons
jest.mock('lucide-react', () => ({
  Mail: () => <span data-testid="mail-icon">Mail Icon</span>,
  Calendar: () => <span data-testid="calendar-icon">Calendar Icon</span>,
  Trash2: () => <span data-testid="trash-icon">Trash Icon</span>,
  ArrowUpIcon: () => <span data-testid="arrow-up-icon">ArrowUpIcon</span>,
  ArrowDownIcon: () => <span data-testid="arrow-down-icon">ArrowDownIcon</span>,
  Briefcase: () => <span data-testid="briefcase-icon">Briefcase Icon</span>,
  Pen: () => <span data-testid="pen-icon">Pen Icon</span>,
  Tag: () => <span data-testid="tag-icon">Tag Icon</span>,
  InfoIcon: () => <span data-testid="info-icon">Info Icon</span>,
  Filter: () => <span data-testid="filter-icon">Filter Icon</span>,
  ChevronRight: () => <span data-testid="chevron-right-icon">ChevronRight Icon</span>,
  ChevronLeft: () => <span data-testid="chevron-left-icon">ChevronLeft Icon</span>,
  Search: () => <span data-testid="search-icon">Search Icon</span>,
  Check: () => <span data-testid="check-icon">Check Icon</span>,
  ChevronDown: () => <span data-testid="chevron-down-icon">ChevronDown Icon</span>,
  ChevronUp: () => <span data-testid="chevron-up-icon">ChevronUp Icon</span>
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => '2023-05-20') // Return a fixed date string for testing
}));

// Mock the select component from shadcn
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => (
    <div data-testid="select-container">
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
  SelectTrigger: ({ children, className }: any) => (
    <div className={className} data-testid="select-trigger">
      {children}
    </div>
  ),
  SelectValue: ({ placeholder }: any) => (
    <div data-placeholder={placeholder} data-testid="select-value">
      Select Value
    </div>
  ),
  SelectContent: ({ children, className }: any) => (
    <div className={className} data-testid="select-content">
      {children}
    </div>
  ),
  SelectItem: ({ children, value, className }: any) => (
    <option value={value} className={className} data-testid="select-item">
      {children}
    </option>
  ),
  SelectGroup: ({ children }: any) => (
    <div data-testid="select-group">{children}</div>
  ),
  SelectLabel: ({ children }: any) => (
    <div data-testid="select-label">{children}</div>
  ),
  SelectSeparator: () => (
    <div data-testid="select-separator" />
  ),
  SelectScrollUpButton: () => (
    <div data-testid="select-scroll-up" />
  ),
  SelectScrollDownButton: () => (
    <div data-testid="select-scroll-down" />
  )
}));

// Mock alert component
jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children, className }: any) => (
    <div data-testid="alert" className={className}>{children}</div>
  ),
  AlertDescription: ({ children }: any) => (
    <div data-testid="alert-description">{children}</div>
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
