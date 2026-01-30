---
title: "Responsive Design"
---
# Responsive Design

Guide to creating responsive layouts that work on all devices.

## Breakpoints

### Tailwind Default Breakpoints

| Prefix | Min Width | CSS |
|--------|-----------|-----|
| `sm` | 640px | `@media (min-width: 640px)` |
| `md` | 768px | `@media (min-width: 768px)` |
| `lg` | 1024px | `@media (min-width: 1024px)` |
| `xl` | 1280px | `@media (min-width: 1280px)` |
| `2xl` | 1536px | `@media (min-width: 1536px)` |

### Custom Breakpoints

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
  },
}
```

## Mobile-First Approach

### Principle

```css
/* Start with mobile styles (no media query) */
.element {
  width: 100%;
}

/* Add styles for larger screens */
@media (min-width: 768px) {
  .element {
    width: 50%;
  }
}
```

### Tailwind Mobile-First

```html
<!-- Mobile: stack, Tablet+: side by side -->
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/2">Left</div>
  <div class="w-full md:w-1/2">Right</div>
</div>

<!-- Mobile: full width, Desktop: max width -->
<div class="w-full lg:max-w-4xl lg:mx-auto">
  Content
</div>

<!-- Mobile: small text, Desktop: larger -->
<h1 class="text-2xl md:text-4xl lg:text-5xl">
  Responsive Heading
</h1>
```

## Responsive Patterns

### Navigation

```html
<!-- Mobile: hamburger, Desktop: horizontal nav -->
<header class="border-b bg-white">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
    <div class="font-bold">Logo</div>
    
    <!-- Desktop navigation -->
    <nav class="hidden items-center gap-6 md:flex">
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
    
    <!-- Mobile menu button -->
    <button class="md:hidden">
      <svg class="h-6 w-6"><!-- Menu icon --></svg>
    </button>
  </div>
  
  <!-- Mobile navigation (toggle visibility) -->
  <nav class="border-t px-4 py-2 md:hidden">
    <a href="#" class="block py-2">Home</a>
    <a href="#" class="block py-2">About</a>
    <a href="#" class="block py-2">Contact</a>
  </nav>
</header>
```

### Grid Layout

```html
<!-- 1 col mobile, 2 col tablet, 3 col desktop -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div class="rounded-lg border p-4">Card 1</div>
  <div class="rounded-lg border p-4">Card 2</div>
  <div class="rounded-lg border p-4">Card 3</div>
  <div class="rounded-lg border p-4">Card 4</div>
  <div class="rounded-lg border p-4">Card 5</div>
  <div class="rounded-lg border p-4">Card 6</div>
</div>

<!-- 1 col mobile, 4 col desktop -->
<div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
  <!-- Stats cards -->
</div>
```

### Sidebar Layout

```html
<!-- Mobile: stack, Desktop: sidebar -->
<div class="lg:flex lg:gap-8">
  <!-- Sidebar -->
  <aside class="mb-8 lg:mb-0 lg:w-64 lg:flex-shrink-0">
    <nav class="space-y-1">
      <a href="#" class="block rounded-md px-3 py-2 hover:bg-gray-100">Link 1</a>
      <a href="#" class="block rounded-md px-3 py-2 hover:bg-gray-100">Link 2</a>
    </nav>
  </aside>
  
  <!-- Main content -->
  <main class="flex-1">
    Content
  </main>
</div>
```

### Hero Section

```html
<section class="px-4 py-12 md:py-20 lg:py-32">
  <div class="mx-auto max-w-4xl text-center">
    <h1 class="text-3xl font-bold md:text-5xl lg:text-6xl">
      Responsive Hero Title
    </h1>
    <p class="mt-4 text-lg text-gray-600 md:mt-6 md:text-xl">
      Description that adapts to screen size
    </p>
    <div class="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
      <button class="rounded-md bg-blue-600 px-6 py-3 text-white">
        Primary Action
      </button>
      <button class="rounded-md border px-6 py-3">
        Secondary Action
      </button>
    </div>
  </div>
</section>
```

### Tables

```html
<!-- Responsive table: horizontal scroll on mobile -->
<div class="overflow-x-auto">
  <table class="min-w-full divide-y divide-gray-200">
    <thead>
      <tr>
        <th class="px-4 py-3 text-left text-sm font-medium">Name</th>
        <th class="px-4 py-3 text-left text-sm font-medium">Email</th>
        <th class="px-4 py-3 text-left text-sm font-medium">Role</th>
      </tr>
    </thead>
    <tbody class="divide-y">
      <tr>
        <td class="whitespace-nowrap px-4 py-3">John Doe</td>
        <td class="whitespace-nowrap px-4 py-3">john@example.com</td>
        <td class="whitespace-nowrap px-4 py-3">Admin</td>
      </tr>
    </tbody>
  </table>
</div>

<!-- Card-based table for mobile -->
<div class="hidden md:block">
  <!-- Regular table -->
</div>
<div class="space-y-4 md:hidden">
  <!-- Card for each row -->
  <div class="rounded-lg border p-4">
    <div class="font-medium">John Doe</div>
    <div class="text-sm text-gray-500">john@example.com</div>
    <div class="mt-2 text-sm">Role: Admin</div>
  </div>
</div>
```

### Images

```html
<!-- Responsive image -->
<img 
  src="image.jpg" 
  class="h-auto w-full"
  alt="Responsive image"
/>

<!-- Different sizes at breakpoints -->
<img 
  src="image.jpg"
  class="h-48 w-full object-cover md:h-64 lg:h-80"
  alt="Responsive height"
/>

<!-- Art direction with picture -->
<picture>
  <source media="(min-width: 1024px)" srcset="desktop.jpg" />
  <source media="(min-width: 768px)" srcset="tablet.jpg" />
  <img src="mobile.jpg" alt="Responsive" class="w-full" />
</picture>
```

## Spacing Adjustments

```html
<!-- Responsive padding -->
<section class="px-4 py-8 md:px-6 md:py-12 lg:px-8 lg:py-16">
  Content
</section>

<!-- Responsive gaps -->
<div class="grid grid-cols-2 gap-4 md:gap-6 lg:gap-8">
  Items
</div>

<!-- Responsive margins -->
<div class="mt-4 md:mt-8 lg:mt-12">
  Spaced content
</div>
```

## Typography Scaling

```html
<!-- Responsive font sizes -->
<h1 class="text-2xl font-bold sm:text-3xl md:text-4xl lg:text-5xl">
  Heading
</h1>

<p class="text-sm md:text-base lg:text-lg">
  Body text that scales
</p>

<!-- Responsive line length -->
<p class="max-w-prose">
  Long text with optimal reading width (65 characters)
</p>
```

## Hide/Show Elements

```html
<!-- Hide on mobile, show on desktop -->
<div class="hidden md:block">
  Desktop only
</div>

<!-- Show on mobile, hide on desktop -->
<div class="md:hidden">
  Mobile only
</div>

<!-- Show only on specific breakpoint -->
<div class="hidden md:block lg:hidden">
  Tablet only
</div>
```

## Container Queries (CSS)

```css
/* Container query setup */
.card-container {
  container-type: inline-size;
}

/* Style based on container width */
@container (min-width: 400px) {
  .card {
    display: flex;
  }
}
```

```html
<div class="@container">
  <div class="@md:flex @md:gap-4">
    Container query responsive
  </div>
</div>
```

## Testing Responsive Design

### Checklist

- [ ] Test at each breakpoint (320px, 640px, 768px, 1024px, 1280px)
- [ ] Check touch targets are 44x44px minimum
- [ ] Verify text is readable without zooming
- [ ] Test landscape and portrait on mobile
- [ ] Check horizontal scroll doesn't occur
- [ ] Verify images scale appropriately
- [ ] Test navigation is accessible on all sizes

### Common Viewport Sizes

| Device | Width | Height |
|--------|-------|--------|
| iPhone SE | 375px | 667px |
| iPhone 14 | 390px | 844px |
| iPhone 14 Pro Max | 430px | 932px |
| iPad | 768px | 1024px |
| iPad Pro | 1024px | 1366px |
| Laptop | 1366px | 768px |
| Desktop | 1920px | 1080px |
