
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import React from 'react';

// Mock the UI components that are imported from shadcn
jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => {
    return <table>{children}</table>;
  },
  TableHeader: ({ children }: { children: React.ReactNode }) => {
    return <thead>{children}</thead>;
  },
  TableBody: ({ children }: { children: React.ReactNode }) => {
    return <tbody>{children}</tbody>;
  },
  TableHead: ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <th className={className}>{children}</th>;
  },
  TableRow: ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <tr className={className}>{children}</tr>;
  },
  TableCell: ({ children, className }: { children: React.ReactNode, className?: string }) => {
    return <td className={className}>{children}</td>;
  }
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props: any) => {
    return (
      <input 
        type="checkbox" 
        checked={props.checked} 
        onChange={props.onCheckedChange ? () => props.onCheckedChange(!props.checked) : undefined}
        className={props.className}
        aria-label={props["aria-label"]}
      />
    );
  }
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => {
    return (
      <input 
        {...props}
        className={props.className}
      />
    );
  }
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant, size, className }: any) => {
    return (
      <button 
        onClick={onClick} 
        disabled={disabled}
        className={className}
        data-variant={variant}
        data-size={size}
      >
        {children}
      </button>
    );
  }
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant, className }: any) => {
    return (
      <span 
        className={`badge ${className || ''}`}
        data-variant={variant}
      >
        {children}
      </span>
    );
  }
}));

jest.mock('lucide-react', () => ({
  Mail: () => <span data-icon="mail">Mail Icon</span>,
  Calendar: () => <span data-icon="calendar">Calendar Icon</span>,
  Trash2: () => <span data-icon="trash2">Trash Icon</span>,
  ArrowUpIcon: () => <span data-icon="arrow-up">ArrowUpIcon</span>,
  ArrowDownIcon: () => <span data-icon="arrow-down">ArrowDownIcon</span>,
  Briefcase: () => <span data-icon="briefcase">Briefcase Icon</span>,
  Pen: () => <span data-icon="pen">Pen Icon</span>,
  Tag: () => <span data-icon="tag">Tag Icon</span>,
  InfoIcon: () => <span data-icon="info">Info Icon</span>
}));

jest.mock('date-fns', () => ({
  format: jest.fn((date, formatStr) => '2023-05-20') // Return a fixed date string for testing
}));

// Mock the select component from shadcn
jest.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange, disabled }: any) => {
    return (
      <div className="select-container">
        <select 
          value={value} 
          onChange={(e) => onValueChange && onValueChange(e.target.value)}
          disabled={disabled}
          data-testid="select"
        >
          {children}
        </select>
      </div>
    );
  },
  SelectTrigger: ({ children, className }: any) => {
    return (
      <div className={`select-trigger ${className || ''}`}>
        {children}
      </div>
    );
  },
  SelectValue: ({ placeholder }: any) => {
    return (
      <div className="select-value" data-placeholder={placeholder}>
        Select Value
      </div>
    );
  },
  SelectContent: ({ children, className }: any) => {
    return (
      <div className={`select-content ${className || ''}`}>
        {children}
      </div>
    );
  },
  SelectItem: ({ children, value, className }: any) => {
    return (
      <option value={value} className={className}>
        {children}
      </option>
    );
  }
}));

// Mock Promises behavior
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
