
import '@testing-library/jest-dom';

// Mock react-router-dom hooks
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  useParams: () => ({ senderSlug: 'test-sender' }),
  useLocation: () => ({ pathname: '/test', search: '', hash: '', state: null }),
}));

// Mock components from shadcn/ui
jest.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table">{children}</div>,
  TableHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-header">{children}</div>,
  TableBody: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-body">{children}</div>,
  TableHead: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-head">{children}</div>,
  TableRow: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-row">{children}</div>,
  TableCell: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-cell">{children}</div>,
  TableFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-table-footer">{children}</div>,
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
    <button data-testid="mock-button" onClick={onClick}>
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/checkbox', () => ({
  Checkbox: (props: { checked?: boolean, onCheckedChange?: (checked: boolean) => void }) => (
    <input
      type="checkbox"
      data-testid="mock-checkbox"
      checked={props.checked}
      onChange={(e) => props.onCheckedChange && props.onCheckedChange(e.target.checked)}
    />
  ),
}));

jest.mock('@/components/ui/select', () => ({
  Select: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-select">{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-select-trigger">{children}</div>,
  SelectValue: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-select-value">{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-select-content">{children}</div>,
  SelectItem: ({ children, value }: { children: React.ReactNode, value: string | number }) => (
    <div data-testid="mock-select-item" data-value={value}>
      {children}
    </div>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: { value?: string, onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder?: string }) => (
    <input
      data-testid="mock-input"
      value={props.value}
      onChange={props.onChange}
      placeholder={props.placeholder}
    />
  ),
}));

jest.mock('@/components/ui/badge', () => ({
  Badge: ({ children, variant }: { children: React.ReactNode, variant?: string }) => (
    <span data-testid="mock-badge" data-variant={variant}>
      {children}
    </span>
  ),
}));

jest.mock('lucide-react', () => ({
  RefreshCw: () => <span data-testid="mock-refresh-icon">RefreshIcon</span>,
  ArrowUpIcon: () => <span data-testid="mock-arrow-up-icon">ArrowUpIcon</span>,
  ArrowDownIcon: () => <span data-testid="mock-arrow-down-icon">ArrowDownIcon</span>,
  Trash2: () => <span data-testid="mock-trash-icon">TrashIcon</span>,
  XCircle: () => <span data-testid="mock-x-circle-icon">XCircleIcon</span>,
  Filter: () => <span data-testid="mock-filter-icon">FilterIcon</span>,
  X: () => <span data-testid="mock-x-icon">XIcon</span>,
  Check: () => <span data-testid="mock-check-icon">CheckIcon</span>,
  ChevronDown: () => <span data-testid="mock-chevron-down-icon">ChevronDownIcon</span>,
  Search: () => <span data-testid="mock-search-icon">SearchIcon</span>,
  Mail: () => <span data-testid="mock-mail-icon">MailIcon</span>,
  CalendarIcon: () => <span data-testid="mock-calendar-icon">CalendarIcon</span>,
  Loader2: () => <span data-testid="mock-loader-icon">LoaderIcon</span>,
  Building: () => <span data-testid="mock-building-icon">BuildingIcon</span>,
  Tag: () => <span data-testid="mock-tag-icon">TagIcon</span>,
}));

jest.mock('date-fns', () => ({
  format: jest.fn().mockImplementation(() => 'Formatted Date'),
  formatDistanceToNow: jest.fn().mockImplementation(() => '2 days ago'),
  differenceInDays: jest.fn().mockImplementation(() => 2),
}));

jest.mock('@/components/ui/alert', () => ({
  Alert: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-alert">{children}</div>,
  AlertTitle: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-alert-title">{children}</div>,
  AlertDescription: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-alert-description">{children}</div>,
}));

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-popover">{children}</div>,
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-popover-trigger">{children}</div>,
  PopoverContent: ({ children }: { children: React.ReactNode }) => <div data-testid="mock-popover-content">{children}</div>,
}));
