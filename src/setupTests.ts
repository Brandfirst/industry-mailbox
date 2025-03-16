
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock the UI components that are imported from shadcn
jest.mock('@/components/ui/table', () => ({
  Table: (props) => (
    <div data-testid="table" className={props.className}>{props.children}</div>
  ),
  TableHeader: (props) => (
    <div data-testid="table-header" className={props.className}>{props.children}</div>
  ),
  TableBody: (props) => (
    <div data-testid="table-body" className={props.className}>{props.children}</div>
  ),
  TableHead: (props) => (
    <div data-testid="table-head" className={props.className}>{props.children}</div>
  ),
  TableRow: (props) => (
    <div 
      data-testid="table-row" 
      className={props.className}
      data-selected={props.isSelected ? 'true' : 'false'}
      data-highlighted={props.isHighlighted ? 'true' : 'false'}
    >
      {props.children}
    </div>
  ),
  TableCell: (props) => (
    <div data-testid="table-cell" className={props.className}>{props.children}</div>
  ),
  TableCaption: (props) => (
    <div data-testid="table-caption" className={props.className}>{props.children}</div>
  )
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props) => (
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
  Input: (props) => (
    <input 
      {...props}
      data-testid="input"
    />
  )
}));

jest.mock('@/components/ui/button', () => ({
  Button: (props) => (
    <button 
      onClick={props.onClick} 
      disabled={props.disabled}
      className={props.className}
      data-variant={props.variant}
      data-size={props.size}
      data-testid="button"
    >
      {props.children}
    </button>
  )
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: (props) => (
    <span 
      className={`badge ${props.className || ''}`}
      data-variant={props.variant}
      data-testid="badge"
    >
      {props.children}
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
  ChevronUp: () => <span data-testid="chevron-up-icon">ChevronUp Icon</span>,
  RefreshCw: () => <span data-testid="refresh-icon">RefreshCw Icon</span>
}));

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => '2023-05-20') // Return a fixed date string for testing
}));

// Mock the select component from shadcn
jest.mock('@/components/ui/select', () => ({
  Select: (props) => (
    <div data-testid="select-container">
      <select 
        value={props.value} 
        onChange={(e) => props.onValueChange && props.onValueChange(e.target.value)}
        disabled={props.disabled}
        data-testid="select"
      >
        {props.children}
      </select>
    </div>
  ),
  SelectTrigger: (props) => (
    <div className={props.className} data-testid="select-trigger">
      {props.children}
    </div>
  ),
  SelectValue: (props) => (
    <div data-placeholder={props.placeholder} data-testid="select-value">
      Select Value
    </div>
  ),
  SelectContent: (props) => (
    <div className={props.className} data-testid="select-content">
      {props.children}
    </div>
  ),
  SelectItem: (props) => (
    <option value={props.value} className={props.className} data-testid="select-item">
      {props.children}
    </option>
  ),
  SelectGroup: (props) => (
    <div data-testid="select-group">{props.children}</div>
  ),
  SelectLabel: (props) => (
    <div data-testid="select-label">{props.children}</div>
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
  Alert: (props) => (
    <div data-testid="alert" className={props.className}>{props.children}</div>
  ),
  AlertDescription: (props) => (
    <div data-testid="alert-description">{props.children}</div>
  )
}));

// Mock popover component
jest.mock('@/components/ui/popover', () => ({
  Popover: (props) => (
    <div data-testid="popover">{props.children}</div>
  ),
  PopoverTrigger: (props) => (
    <div data-testid="popover-trigger" onClick={props.asChild ? props.onClick : undefined}>
      {props.children}
    </div>
  ),
  PopoverContent: (props) => (
    <div data-testid="popover-content" className={props.className}>
      {props.children}
    </div>
  )
}));

// Mock Promise behavior
window.Promise = global.Promise;

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: function(key) {
      return store[key] || null;
    },
    setItem: function(key, value) {
      store[key] = value.toString();
    },
    removeItem: function(key) {
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
