---
title: "Tailwind CSS Patterns"
---
# Tailwind CSS Patterns

Guide to common Tailwind CSS patterns and best practices.

## Layout Patterns

### Container

```html
<!-- Centered container with padding -->
<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  Content
</div>

<!-- Full-width with max content width -->
<div class="w-full">
  <div class="mx-auto max-w-3xl">
    Content
  </div>
</div>
```

### Flexbox Layouts

```html
<!-- Horizontal center -->
<div class="flex justify-center">
  <div>Centered</div>
</div>

<!-- Vertical center -->
<div class="flex min-h-screen items-center">
  <div>Vertically centered</div>
</div>

<!-- Both center -->
<div class="flex min-h-screen items-center justify-center">
  <div>Fully centered</div>
</div>

<!-- Space between -->
<div class="flex items-center justify-between">
  <div>Left</div>
  <div>Right</div>
</div>

<!-- Wrap with gap -->
<div class="flex flex-wrap gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>
```

### Grid Layouts

```html
<!-- Equal columns -->
<div class="grid grid-cols-3 gap-4">
  <div>1</div>
  <div>2</div>
  <div>3</div>
</div>

<!-- Responsive grid -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  <div>Card 1</div>
  <div>Card 2</div>
  <div>Card 3</div>
</div>

<!-- Auto-fit (as many as fit) -->
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  <div>Card</div>
  <div>Card</div>
  <div>Card</div>
</div>

<!-- Sidebar layout -->
<div class="grid grid-cols-[250px_1fr] gap-6">
  <aside>Sidebar</aside>
  <main>Content</main>
</div>
```

### Stack (Vertical Spacing)

```html
<!-- Consistent vertical spacing -->
<div class="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
  <div>Item 3</div>
</div>

<!-- Larger spacing between sections -->
<div class="space-y-8">
  <section>Section 1</section>
  <section>Section 2</section>
</div>
```

## Component Patterns

### Card

```html
<!-- Basic card -->
<div class="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
  <h3 class="text-lg font-semibold">Title</h3>
  <p class="mt-2 text-gray-600">Description</p>
</div>

<!-- Card with image -->
<div class="overflow-hidden rounded-lg border bg-white shadow-sm">
  <img src="..." class="h-48 w-full object-cover" alt="" />
  <div class="p-6">
    <h3 class="font-semibold">Title</h3>
    <p class="mt-2 text-sm text-gray-600">Description</p>
  </div>
</div>

<!-- Hoverable card -->
<div class="rounded-lg border bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
  Content
</div>

<!-- Clickable card -->
<a href="#" class="block rounded-lg border bg-white p-6 shadow-sm transition-all hover:border-blue-500 hover:shadow-md">
  Content
</a>
```

### Buttons

```html
<!-- Primary button -->
<button class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Primary
</button>

<!-- Secondary button -->
<button class="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Secondary
</button>

<!-- Ghost button -->
<button class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500">
  Ghost
</button>

<!-- Danger button -->
<button class="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
  Delete
</button>

<!-- Disabled button -->
<button class="cursor-not-allowed rounded-md bg-gray-300 px-4 py-2 text-sm font-medium text-gray-500" disabled>
  Disabled
</button>

<!-- Loading button -->
<button class="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white" disabled>
  <svg class="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">...</svg>
  Loading...
</button>

<!-- Icon button -->
<button class="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
  <svg class="h-5 w-5">...</svg>
</button>
```

### Form Inputs

```html
<!-- Text input -->
<input
  type="text"
  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  placeholder="Enter text"
/>

<!-- Input with label -->
<div>
  <label class="block text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    class="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  />
</div>

<!-- Input with error -->
<div>
  <label class="block text-sm font-medium text-gray-700">Email</label>
  <input
    type="email"
    class="mt-1 block w-full rounded-md border border-red-500 px-3 py-2 shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
  />
  <p class="mt-1 text-sm text-red-600">Invalid email address</p>
</div>

<!-- Select -->
<select class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
  <option>Option 1</option>
  <option>Option 2</option>
</select>

<!-- Textarea -->
<textarea
  rows="4"
  class="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
></textarea>

<!-- Checkbox -->
<label class="flex items-center gap-2">
  <input type="checkbox" class="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
  <span class="text-sm text-gray-700">Remember me</span>
</label>
```

### Navigation

```html
<!-- Horizontal nav -->
<nav class="flex items-center gap-6">
  <a href="#" class="text-sm font-medium text-gray-900">Home</a>
  <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-900">About</a>
  <a href="#" class="text-sm font-medium text-gray-500 hover:text-gray-900">Contact</a>
</nav>

<!-- Header -->
<header class="border-b bg-white">
  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
    <div class="font-bold">Logo</div>
    <nav class="hidden gap-6 md:flex">
      <a href="#" class="text-sm font-medium">Home</a>
      <a href="#" class="text-sm font-medium text-gray-500">About</a>
    </nav>
    <button class="md:hidden">Menu</button>
  </div>
</header>
```

### Badges/Tags

```html
<!-- Badge -->
<span class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
  Badge
</span>

<!-- Status badges -->
<span class="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
  Active
</span>
<span class="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
  Pending
</span>
<span class="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
  Error
</span>
```

### Modal/Dialog

```html
<!-- Modal backdrop -->
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
  <!-- Modal content -->
  <div class="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
    <h2 class="text-lg font-semibold">Modal Title</h2>
    <p class="mt-2 text-gray-600">Modal content goes here.</p>
    <div class="mt-4 flex justify-end gap-2">
      <button class="rounded-md border px-4 py-2 text-sm">Cancel</button>
      <button class="rounded-md bg-blue-600 px-4 py-2 text-sm text-white">Confirm</button>
    </div>
  </div>
</div>
```

### Avatar

```html
<!-- Image avatar -->
<img src="..." class="h-10 w-10 rounded-full object-cover" alt="" />

<!-- Initials avatar -->
<div class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
  JD
</div>

<!-- Avatar group -->
<div class="flex -space-x-2">
  <img src="..." class="h-8 w-8 rounded-full ring-2 ring-white" alt="" />
  <img src="..." class="h-8 w-8 rounded-full ring-2 ring-white" alt="" />
  <img src="..." class="h-8 w-8 rounded-full ring-2 ring-white" alt="" />
</div>
```

## Utility Patterns

### Truncate Text

```html
<!-- Single line truncate -->
<p class="truncate">Very long text that will be truncated...</p>

<!-- Multi-line clamp -->
<p class="line-clamp-2">
  Text that spans multiple lines but will be clamped to 2 lines...
</p>
```

### Aspect Ratio

```html
<!-- 16:9 aspect ratio -->
<div class="aspect-video">
  <img src="..." class="h-full w-full object-cover" alt="" />
</div>

<!-- Square -->
<div class="aspect-square">
  <img src="..." class="h-full w-full object-cover" alt="" />
</div>
```

### Sticky Elements

```html
<!-- Sticky header -->
<header class="sticky top-0 z-10 bg-white shadow-sm">
  Header content
</header>

<!-- Sticky sidebar -->
<aside class="sticky top-4 h-fit">
  Sidebar content
</aside>
```

### Dividers

```html
<!-- Horizontal divider -->
<div class="border-t border-gray-200"></div>

<!-- With text -->
<div class="relative">
  <div class="absolute inset-0 flex items-center">
    <div class="w-full border-t border-gray-200"></div>
  </div>
  <div class="relative flex justify-center">
    <span class="bg-white px-2 text-sm text-gray-500">Or continue with</span>
  </div>
</div>
```

### Dark Mode

```html
<!-- Dark mode support -->
<div class="bg-white dark:bg-gray-900">
  <h1 class="text-gray-900 dark:text-white">Title</h1>
  <p class="text-gray-600 dark:text-gray-400">Description</p>
</div>
```
