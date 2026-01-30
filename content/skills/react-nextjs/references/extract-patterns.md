# Extract Patterns

Guide to extracting constants, utility functions, and reusable code in React/Next.js projects.

## Extract Constants

### When to Extract

Extract constants when:
- Value is used multiple times
- Value has semantic meaning
- Value might change (single source of truth)
- Magic numbers/strings make code unclear

### Constant Types

#### Configuration Constants

```tsx
// constants/config.ts
export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  ITEMS_PER_PAGE: 20,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_FORMATS: ['jpg', 'png', 'webp'],
} as const;

// Usage
import { CONFIG } from '@/constants/config';
fetch(`${CONFIG.API_URL}/users`);
```

#### UI Constants

```tsx
// constants/ui.ts
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const Z_INDEX = {
  modal: 100,
  dropdown: 50,
  tooltip: 40,
  header: 30,
} as const;

export const ANIMATION = {
  duration: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  easing: {
    default: 'ease-in-out',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
} as const;
```

#### Route Constants

```tsx
// constants/routes.ts
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  
  // Dynamic routes
  USER: (id: string) => `/users/${id}`,
  POST: (slug: string) => `/blog/${slug}`,
} as const;

// Usage
import { ROUTES } from '@/constants/routes';
router.push(ROUTES.DASHBOARD);
router.push(ROUTES.USER(userId));
```

#### Validation Constants

```tsx
// constants/validation.ts
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 20,
  BIO_MAX_LENGTH: 500,
  
  PATTERNS: {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PHONE: /^\+?[\d\s-]{10,}$/,
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  },
} as const;
```

#### Status/Enum Constants

```tsx
// constants/status.ts
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus = typeof ORDER_STATUS[keyof typeof ORDER_STATUS];

// With labels for UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [ORDER_STATUS.PENDING]: 'Pending',
  [ORDER_STATUS.PROCESSING]: 'Processing',
  [ORDER_STATUS.SHIPPED]: 'Shipped',
  [ORDER_STATUS.DELIVERED]: 'Delivered',
  [ORDER_STATUS.CANCELLED]: 'Cancelled',
};
```

### Organization

```
constants/
├── index.ts          # Re-exports all
├── config.ts         # App configuration
├── routes.ts         # Route paths
├── api.ts            # API endpoints
├── ui.ts             # UI-related constants
├── validation.ts     # Validation rules
└── status.ts         # Status enums
```

```tsx
// constants/index.ts
export * from './config';
export * from './routes';
export * from './api';
export * from './ui';
export * from './validation';
export * from './status';
```

## Extract Utility Functions

### When to Extract

Extract utilities when:
- Logic is used in multiple places
- Function is pure (no side effects)
- Logic is complex enough to warrant naming
- Testing would benefit from isolation

### Common Utility Categories

#### String Utilities

```tsx
// utils/string.ts
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length).trim() + '...';
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}
```

#### Date Utilities

```tsx
// utils/date.ts
export function formatDate(date: Date | string, locale = 'en-US'): string {
  return new Date(date).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  
  return formatDate(date);
}

export function isToday(date: Date | string): boolean {
  const today = new Date();
  const check = new Date(date);
  return today.toDateString() === check.toDateString();
}
```

#### Number/Currency Utilities

```tsx
// utils/number.ts
export function formatCurrency(
  amount: number, 
  currency = 'USD',
  locale = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatNumber(num: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(num);
}

export function formatCompact(num: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(num);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function percentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}
```

#### Array Utilities

```tsx
// utils/array.ts
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const value = String(item[key]);
    return {
      ...groups,
      [value]: [...(groups[value] || []), item],
    };
  }, {} as Record<string, T[]>);
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function sortBy<T>(array: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return order === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  return Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );
}
```

#### Validation Utilities

```tsx
// utils/validation.ts
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}
```

#### DOM/Browser Utilities

```tsx
// utils/dom.ts
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text);
}

export function downloadFile(url: string, filename: string): void {
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function scrollToTop(smooth = true): void {
  window.scrollTo({
    top: 0,
    behavior: smooth ? 'smooth' : 'auto',
  });
}

export function getScrollPosition(): { x: number; y: number } {
  return {
    x: window.scrollX,
    y: window.scrollY,
  };
}
```

#### Class Name Utilities

```tsx
// utils/cn.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Usage
<div className={cn(
  'base-class',
  isActive && 'active-class',
  variant === 'primary' ? 'primary' : 'secondary'
)} />
```

### Organization

```
utils/
├── index.ts          # Re-exports all
├── string.ts         # String manipulation
├── date.ts           # Date formatting
├── number.ts         # Number/currency formatting
├── array.ts          # Array operations
├── validation.ts     # Validation helpers
├── dom.ts            # Browser/DOM utilities
└── cn.ts             # Class name utilities
```

## Extract Custom Hooks

### Common Hooks to Extract

```tsx
// hooks/useLocalStorage.ts
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    const valueToStore = value instanceof Function ? value(storedValue) : value;
    setStoredValue(valueToStore);
    window.localStorage.setItem(key, JSON.stringify(valueToStore));
  };

  return [storedValue, setValue] as const;
}

// hooks/useDebounce.ts
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// hooks/useMediaQuery.ts
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);

  return matches;
}
```

## Extraction Checklist

```markdown
### Before Extracting
- [ ] Used in multiple places (or will be)
- [ ] Has clear, single responsibility
- [ ] Can be tested in isolation
- [ ] Has a good descriptive name

### Constants
- [ ] `as const` for type safety
- [ ] Grouped by domain
- [ ] Exported from index.ts

### Utilities
- [ ] Pure functions (no side effects)
- [ ] TypeScript types for params and returns
- [ ] Unit tests written
- [ ] JSDoc comments for complex functions

### Hooks
- [ ] Follows Rules of Hooks
- [ ] Generic where appropriate
- [ ] Cleanup handled
- [ ] TypeScript return type defined
```
