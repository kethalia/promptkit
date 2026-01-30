---
title: "CSS Architecture"
---
# CSS Architecture

Guide to organizing and maintaining CSS at scale.

## Tailwind Organization

### Component Classes with @apply

```css
/* styles/components.css */
@layer components {
  .btn {
    @apply rounded-md px-4 py-2 font-medium transition-colors;
  }

  .btn-primary {
    @apply bg-blue-600 text-white hover:bg-blue-700;
  }

  .btn-secondary {
    @apply border border-gray-300 bg-white text-gray-700 hover:bg-gray-50;
  }

  .input {
    @apply block w-full rounded-md border border-gray-300 px-3 py-2;
    @apply focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500;
  }

  .card {
    @apply rounded-lg border border-gray-200 bg-white p-6 shadow-sm;
  }
}
```

### When to Use @apply

```css
/* ✅ Good: Repeated component patterns */
.btn { @apply rounded-md px-4 py-2 font-medium; }

/* ✅ Good: Complex state combinations */
.input-error {
  @apply border-red-500 focus:border-red-500 focus:ring-red-500;
}

/* ❌ Avoid: One-off styling (use inline classes) */
.hero-title { @apply text-4xl font-bold; }
```

### Custom Utilities

```css
@layer utilities {
  .text-balance {
    text-wrap: balance;
  }

  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

## Tailwind Config Organization

```javascript
// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  
  theme: {
    // Override defaults
    screens: {
      xs: '475px',
      ...defaultTheme.screens,
    },
    
    extend: {
      // Extend defaults
      colors: {
        brand: {
          50: '#f0f9ff',
          500: '#0ea5e9',
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
```

## BEM Methodology (When Needed)

### Naming Convention

```
Block__Element--Modifier

.card           /* Block */
.card__title    /* Element */
.card__title--large  /* Modifier */
.card--featured /* Block modifier */
```

### Example

```css
/* Block */
.card {
  border-radius: 8px;
  padding: 1.5rem;
  background: white;
}

/* Elements */
.card__header {
  margin-bottom: 1rem;
}

.card__title {
  font-size: 1.25rem;
  font-weight: 600;
}

.card__body {
  color: #666;
}

/* Modifiers */
.card--featured {
  border: 2px solid blue;
}

.card__title--small {
  font-size: 1rem;
}
```

```html
<div class="card card--featured">
  <div class="card__header">
    <h3 class="card__title">Title</h3>
  </div>
  <div class="card__body">Content</div>
</div>
```

## CSS Custom Properties

### Design Tokens

```css
:root {
  /* Colors */
  --color-primary: #3b82f6;
  --color-primary-dark: #2563eb;
  --color-secondary: #64748b;
  --color-success: #22c55e;
  --color-error: #ef4444;
  
  /* Typography */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'Fira Code', monospace;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Borders */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
}

/* Dark mode */
[data-theme="dark"] {
  --color-primary: #60a5fa;
  --color-bg: #1f2937;
  --color-text: #f9fafb;
}
```

### Usage

```css
.button {
  background: var(--color-primary);
  border-radius: var(--radius-md);
  padding: var(--spacing-sm) var(--spacing-md);
  transition: background var(--transition-fast);
}

.button:hover {
  background: var(--color-primary-dark);
}
```

## File Structure

### Small Project

```
styles/
├── globals.css       # Base styles, imports
├── components.css    # Component classes
└── utilities.css     # Custom utilities
```

### Large Project

```
styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/
│   ├── buttons.css
│   ├── forms.css
│   ├── cards.css
│   └── navigation.css
├── layouts/
│   ├── header.css
│   ├── footer.css
│   └── sidebar.css
├── utilities/
│   └── helpers.css
└── main.css          # Import all
```

### CSS Modules (React/Next.js)

```
components/
├── Button/
│   ├── Button.tsx
│   └── Button.module.css
├── Card/
│   ├── Card.tsx
│   └── Card.module.css
```

```css
/* Button.module.css */
.button {
  /* Scoped styles */
}

.primary {
  background: blue;
}
```

```jsx
import styles from './Button.module.css';

function Button({ variant = 'primary', children }) {
  return (
    <button className={`${styles.button} ${styles[variant]}`}>
      {children}
    </button>
  );
}
```

## Specificity Management

### Keep Specificity Low

```css
/* ✅ Good: Single class */
.nav-link { }

/* ❌ Avoid: Overly specific */
header nav ul li a.nav-link { }
```

### Utility Classes Override Components

```css
@layer base {
  /* Lowest specificity */
}

@layer components {
  /* Medium specificity */
}

@layer utilities {
  /* Highest specificity - can override components */
}
```

## Performance Tips

### Critical CSS

```html
<!-- Inline critical CSS in <head> -->
<style>
  /* Above-the-fold styles */
  .header { ... }
  .hero { ... }
</style>

<!-- Load rest asynchronously -->
<link rel="preload" href="styles.css" as="style" onload="this.rel='stylesheet'">
```

### Reduce Unused CSS

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Include all files that use Tailwind classes
  ],
};
```

### Avoid Expensive Selectors

```css
/* ❌ Expensive */
*:not(.class) { }
[class*="btn"] { }

/* ✅ Better */
.btn { }
```

## Naming Conventions

### Component-Based

```
.ComponentName           /* PascalCase for components */
.ComponentName-element   /* Child elements */
.ComponentName--modifier /* Variants */
.is-active               /* State classes */
.has-error
```

### Utility-Based

```
.text-center
.mt-4
.flex
.hidden
```

### Semantic

```
.nav-primary
.btn-submit
.card-featured
.alert-error
```
