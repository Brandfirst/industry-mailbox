// This file is intentionally kept minimal as testing is currently disabled
// All mocks have been removed to prevent TypeScript errors with JSX in ts files

// Mock empty objects instead of complex JSX components
jest.mock('react-router-dom', () => ({}));
jest.mock('@/components/ui/table', () => ({}));
jest.mock('@/components/ui/button', () => ({}));
jest.mock('@/components/ui/checkbox', () => ({}));
jest.mock('@/components/ui/select', () => ({}));
jest.mock('@/components/ui/input', () => ({}));
jest.mock('@/components/ui/badge', () => ({}));
jest.mock('lucide-react', () => ({}));
jest.mock('date-fns', () => ({}));
jest.mock('@/components/ui/alert', () => ({}));
jest.mock('@/components/ui/popover', () => ({}));

export {}; // This ensures TypeScript treats this as a module
