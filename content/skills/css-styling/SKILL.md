---
name: css-styling
description: CSS and styling patterns for modern web development. Use when working with Tailwind CSS, responsive design, animations, or CSS architecture. Triggers include "CSS", "Tailwind", "styling", "responsive", "animation", "layout", "flexbox", "grid", or when styling components. Covers Tailwind patterns, responsive design, CSS architecture, and animations.
---

# CSS Styling Skill

Comprehensive CSS and styling patterns for modern web development. This skill covers:
1. **Tailwind CSS** - Utility patterns, custom config, best practices
2. **Responsive Design** - Breakpoints, mobile-first, fluid layouts
3. **CSS Architecture** - Organization, naming, maintainability
4. **Animations** - Transitions, keyframes, performance

## Quick Reference

| Scenario | Reference |
|----------|-----------|
| Tailwind patterns | See [tailwind-patterns.md](references/tailwind-patterns.md) |
| Responsive design | See [responsive-design.md](references/responsive-design.md) |
| CSS architecture | See [css-architecture.md](references/css-architecture.md) |
| Animations | See [animations.md](references/animations.md) |

## Tailwind Quick Reference

### Spacing

```
p-4      padding: 1rem
m-4      margin: 1rem
px-4     padding-left/right: 1rem
py-4     padding-top/bottom: 1rem
mt-4     margin-top: 1rem
space-x-4  gap between horizontal children
gap-4    grid/flex gap: 1rem
```

### Sizing

```
w-full   width: 100%
w-1/2    width: 50%
w-64     width: 16rem
h-screen height: 100vh
max-w-md max-width: 28rem
min-h-0  min-height: 0
```

### Flexbox

```html
<div class="flex items-center justify-between gap-4">
  <div class="flex-1">Grows</div>
  <div class="flex-shrink-0">Fixed</div>
</div>
```

### Grid

```html
<div class="grid grid-cols-3 gap-4">
  <div class="col-span-2">Wide</div>
  <div>Normal</div>
</div>
```

### Typography

```
text-sm      font-size: 0.875rem
text-lg      font-size: 1.125rem
font-bold    font-weight: 700
text-gray-600  color: gray
leading-tight  line-height: 1.25
tracking-wide  letter-spacing: 0.025em
```

### Responsive

```html
<!-- Mobile first: stack on mobile, row on md+ -->
<div class="flex flex-col md:flex-row">
  <div class="w-full md:w-1/2">Left</div>
  <div class="w-full md:w-1/2">Right</div>
</div>
```

### Common Patterns

```html
<!-- Card -->
<div class="rounded-lg border bg-white p-6 shadow-sm">
  Content
</div>

<!-- Button -->
<button class="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
  Click me
</button>

<!-- Input -->
<input class="w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500" />

<!-- Center content -->
<div class="flex min-h-screen items-center justify-center">
  Centered
</div>
```

## Breakpoints

| Breakpoint | Min Width | Typical Devices |
|------------|-----------|-----------------|
| `sm` | 640px | Large phones |
| `md` | 768px | Tablets |
| `lg` | 1024px | Laptops |
| `xl` | 1280px | Desktops |
| `2xl` | 1536px | Large screens |

## Output Format

When providing CSS solutions:

```markdown
## Styling: [Component]

### HTML Structure
```html
[HTML with classes]
```

### Custom CSS (if needed)
```css
[Additional CSS]
```

### Responsive Behavior
- Mobile: [description]
- Desktop: [description]
```
