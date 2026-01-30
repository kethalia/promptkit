# CSS Animations

Guide to creating smooth, performant animations.

## Transitions

### Basic Syntax

```css
.element {
  transition: property duration timing-function delay;
  transition: all 0.3s ease;
  transition: transform 0.2s ease-out, opacity 0.2s ease-out;
}
```

### Tailwind Transitions

```html
<!-- Basic transition -->
<button class="transition hover:bg-blue-700">
  Hover me
</button>

<!-- Specific properties -->
<div class="transition-colors hover:bg-gray-100">Color only</div>
<div class="transition-opacity hover:opacity-50">Opacity only</div>
<div class="transition-transform hover:scale-105">Transform only</div>

<!-- Duration -->
<div class="transition duration-150">Fast (150ms)</div>
<div class="transition duration-300">Normal (300ms)</div>
<div class="transition duration-500">Slow (500ms)</div>

<!-- Timing functions -->
<div class="transition ease-in">Ease in</div>
<div class="transition ease-out">Ease out</div>
<div class="transition ease-in-out">Ease in-out</div>
```

### Common Transition Patterns

```html
<!-- Button hover -->
<button class="bg-blue-600 transition-colors hover:bg-blue-700">
  Click
</button>

<!-- Card hover lift -->
<div class="rounded-lg shadow transition-shadow hover:shadow-lg">
  Card
</div>

<!-- Scale on hover -->
<div class="transition-transform hover:scale-105">
  Zoom
</div>

<!-- Fade in/out (with JS toggle) -->
<div class="opacity-0 transition-opacity duration-300 data-[visible=true]:opacity-100">
  Fading content
</div>

<!-- Slide down (height animation) -->
<div class="grid grid-rows-[0fr] transition-all data-[open=true]:grid-rows-[1fr]">
  <div class="overflow-hidden">
    Collapsible content
  </div>
</div>
```

## Keyframe Animations

### Tailwind Built-in

```html
<!-- Spin -->
<svg class="animate-spin h-5 w-5">...</svg>

<!-- Ping (ripple effect) -->
<span class="relative flex h-3 w-3">
  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
  <span class="relative inline-flex rounded-full h-3 w-3 bg-sky-500"></span>
</span>

<!-- Pulse -->
<div class="animate-pulse">
  Loading...
</div>

<!-- Bounce -->
<div class="animate-bounce">
  ↓
</div>
```

### Custom Keyframes

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
};
```

```html
<div class="animate-fade-in">Fading in</div>
<div class="animate-slide-up">Sliding up</div>
```

### CSS Keyframes

```css
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInFromBottom {
  0% {
    transform: translateY(20px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

.slide-in {
  animation: slideInFromBottom 0.4s ease-out forwards;
}

.shake {
  animation: shake 0.5s ease-in-out;
}
```

## Loading Animations

### Skeleton Loading

```html
<div class="animate-pulse space-y-4">
  <!-- Avatar + text skeleton -->
  <div class="flex items-center space-x-4">
    <div class="h-12 w-12 rounded-full bg-gray-200"></div>
    <div class="flex-1 space-y-2">
      <div class="h-4 w-3/4 rounded bg-gray-200"></div>
      <div class="h-4 w-1/2 rounded bg-gray-200"></div>
    </div>
  </div>
  
  <!-- Text block skeleton -->
  <div class="space-y-2">
    <div class="h-4 rounded bg-gray-200"></div>
    <div class="h-4 w-5/6 rounded bg-gray-200"></div>
    <div class="h-4 w-4/6 rounded bg-gray-200"></div>
  </div>
</div>
```

### Spinner

```html
<!-- Simple spinner -->
<svg class="h-5 w-5 animate-spin text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
</svg>

<!-- Dots loading -->
<div class="flex space-x-1">
  <div class="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]"></div>
  <div class="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]"></div>
  <div class="h-2 w-2 animate-bounce rounded-full bg-blue-600"></div>
</div>
```

### Progress Bar

```html
<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
  <div class="h-full w-1/2 rounded-full bg-blue-600 transition-all duration-500"></div>
</div>

<!-- Indeterminate -->
<div class="h-2 w-full overflow-hidden rounded-full bg-gray-200">
  <div class="h-full w-1/3 animate-[shimmer_1.5s_infinite] rounded-full bg-blue-600"></div>
</div>
```

## Interactive Animations

### Button Press

```html
<button class="transform transition-transform active:scale-95">
  Click me
</button>
```

### Checkbox Toggle

```html
<label class="relative inline-flex cursor-pointer items-center">
  <input type="checkbox" class="peer sr-only" />
  <div class="h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-blue-600 peer-checked:after:translate-x-full"></div>
</label>
```

### Accordion

```html
<div class="border-b">
  <button class="flex w-full items-center justify-between py-4" onclick="this.parentElement.classList.toggle('open')">
    <span>Section Title</span>
    <svg class="h-5 w-5 transition-transform [.open_&]:rotate-180">
      <!-- Chevron icon -->
    </svg>
  </button>
  <div class="grid grid-rows-[0fr] transition-all [.open_&]:grid-rows-[1fr]">
    <div class="overflow-hidden">
      <div class="pb-4">
        Content here
      </div>
    </div>
  </div>
</div>
```

### Modal

```html
<!-- Backdrop -->
<div class="fixed inset-0 bg-black/50 opacity-0 transition-opacity data-[state=open]:opacity-100"></div>

<!-- Modal -->
<div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-95 opacity-0 transition-all data-[state=open]:scale-100 data-[state=open]:opacity-100">
  Modal content
</div>
```

## Performance

### Use Transform and Opacity

```css
/* ✅ Good: GPU accelerated, no layout recalculation */
.animate {
  transform: translateX(100px);
  opacity: 0.5;
}

/* ❌ Avoid: Triggers layout recalculation */
.animate {
  left: 100px;
  width: 200px;
  height: 200px;
}
```

### will-change

```css
/* Hint browser about upcoming animation */
.will-animate {
  will-change: transform, opacity;
}

/* Remove after animation */
.animation-done {
  will-change: auto;
}
```

### Reduce Motion

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

```html
<!-- Tailwind -->
<div class="animate-bounce motion-reduce:animate-none">
  Respects reduced motion
</div>
```

## Staggered Animations

```html
<!-- Stagger children -->
<ul class="space-y-2">
  <li class="animate-slide-up [animation-delay:0ms]">Item 1</li>
  <li class="animate-slide-up [animation-delay:50ms]">Item 2</li>
  <li class="animate-slide-up [animation-delay:100ms]">Item 3</li>
  <li class="animate-slide-up [animation-delay:150ms]">Item 4</li>
</ul>
```

```css
/* CSS approach */
.stagger-children > * {
  animation: slideUp 0.3s ease-out forwards;
  opacity: 0;
}

.stagger-children > *:nth-child(1) { animation-delay: 0ms; }
.stagger-children > *:nth-child(2) { animation-delay: 50ms; }
.stagger-children > *:nth-child(3) { animation-delay: 100ms; }
.stagger-children > *:nth-child(4) { animation-delay: 150ms; }
```

## Animation Libraries

### Framer Motion (React)

```jsx
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -20 }}
  transition={{ duration: 0.3 }}
>
  Animated content
</motion.div>
```

### CSS Animation Libraries

- **Animate.css** - Pre-built animations
- **Tailwind Animate** - Tailwind animation utilities
- **AutoAnimate** - Automatic animations for lists
