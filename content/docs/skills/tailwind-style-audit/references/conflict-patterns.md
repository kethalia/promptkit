---
title: "Tailwind Conflict Patterns Reference"
---
# Tailwind Conflict Patterns Reference

Detailed patterns for detecting style conflicts. Consult when auditing complex components.

## Conflict Detection Matrix

Classes in the same row conflict with each other:

### Spacing Conflicts

| Property | Conflicting Classes |
|----------|---------------------|
| padding | `p-*`, `px-*`, `py-*`, `pt-*`, `pr-*`, `pb-*`, `pl-*` |
| margin | `m-*`, `mx-*`, `my-*`, `mt-*`, `mr-*`, `mb-*`, `ml-*` |
| gap | `gap-*`, `gap-x-*`, `gap-y-*` |

Note: `p-4 px-2` is valid (px overrides horizontal). `p-4 p-6` is conflict.

### Layout Conflicts

| Property | Conflicting Classes |
|----------|---------------------|
| display | `block`, `inline`, `inline-block`, `flex`, `inline-flex`, `grid`, `hidden` |
| position | `static`, `relative`, `absolute`, `fixed`, `sticky` |
| flex-direction | `flex-row`, `flex-col`, `flex-row-reverse`, `flex-col-reverse` |
| justify | `justify-start`, `justify-center`, `justify-end`, `justify-between`, `justify-around`, `justify-evenly` |
| align-items | `items-start`, `items-center`, `items-end`, `items-baseline`, `items-stretch` |

### Sizing Conflicts

| Property | Conflicting Classes |
|----------|---------------------|
| width | `w-*`, `w-full`, `w-screen`, `w-auto`, `w-fit` |
| height | `h-*`, `h-full`, `h-screen`, `h-auto`, `h-fit` |
| max-width | `max-w-*` |
| min-width | `min-w-*` |

### Typography Conflicts

| Property | Conflicting Classes |
|----------|---------------------|
| font-size | `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`... |
| font-weight | `font-thin`, `font-light`, `font-normal`, `font-medium`, `font-semibold`, `font-bold` |
| text-color | `text-{color}-{shade}` |
| text-align | `text-left`, `text-center`, `text-right`, `text-justify` |

### Visual Conflicts

| Property | Conflicting Classes |
|----------|---------------------|
| background | `bg-{color}-*`, `bg-transparent`, `bg-white`, `bg-black` |
| border-radius | `rounded`, `rounded-none`, `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-full` |
| border-width | `border`, `border-0`, `border-2`, `border-4` |
| shadow | `shadow-none`, `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl` |
| opacity | `opacity-*` |

## Redundant Default Classes

Remove these - they do nothing:

```
flex-row          (default when using flex)
items-stretch     (default when using flex)
flex-nowrap       (default when using flex)
flex-1            (when only child in flex container - often)
static            (default position)
visible           (default visibility)
opacity-100       (default opacity)
scale-100         (default scale)
rotate-0          (default rotation)
translate-x-0     (default translation)
translate-y-0     (default translation)
skew-x-0          (default skew)
skew-y-0          (default skew)
origin-center     (default transform origin)
z-auto            (default z-index)
```

## shadcn Component Defaults

When auditing shadcn usage, know what's already styled:

### Button
Already has: padding, border-radius, font-weight, transitions, focus states, disabled states
Safe additions: `w-full`, size variants via `size` prop, color via `variant` prop

### Card
Already has: border, border-radius, background, shadow
Safe additions: width constraints, extra padding

### Input
Already has: border, border-radius, padding, focus ring, placeholder styling
Safe additions: width, custom border colors

### Dialog
Already has: overlay, centering, animation, padding, close button positioning
**Rarely needs className additions** - use composition instead

### Badge
Already has: padding, border-radius, font-size, colors via `variant`
Safe additions: rarely needed

## Anti-Patterns by Component Type

### Form Components
```tsx
// ❌ Overriding input focus states
<Input className="focus:ring-0 focus:border-blue-500 outline-none" />
// ✅ Use shadcn's built-in focus handling

// ❌ Custom disabled styling
<Button className="disabled:bg-gray-100 disabled:text-gray-400" />
// ✅ Already handled by shadcn
```

### Layout Components
```tsx
// ❌ Turning Card into a flex container
<Card className="flex flex-row p-0 gap-4" />
// ✅ Use a custom component or plain div

// ❌ Removing all Dialog styling
<Dialog className="bg-transparent shadow-none border-0" />
// ✅ Create custom modal component
```

### Interactive Components
```tsx
// ❌ Overriding hover/active states
<Button className="hover:bg-blue-600 active:bg-blue-700" />
// ✅ Use variant prop or extend theme
```
