# Keyboard & Focus

Guide to keyboard navigation and focus management.

## Keyboard Interaction Patterns

### Standard Keys

| Key | Action |
|-----|--------|
| Tab | Move to next focusable element |
| Shift+Tab | Move to previous focusable element |
| Enter | Activate links and buttons |
| Space | Activate buttons, toggle checkboxes |
| Escape | Close modals, cancel actions |
| Arrow keys | Navigate within widgets |

### Widget-Specific

| Widget | Keys |
|--------|------|
| **Tabs** | Left/Right arrows between tabs |
| **Menu** | Up/Down arrows, Home/End |
| **Combobox** | Up/Down to navigate, Enter to select |
| **Slider** | Left/Right or Up/Down to adjust |
| **Tree** | Arrows to navigate, Enter to activate |
| **Grid** | Arrow keys to move between cells |

## Focus Order

### Natural Tab Order

```html
<!-- Focus order follows DOM order -->
<header>
  <a href="/">Logo</a>
  <nav>
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
  </nav>
</header>
<main>
  <input type="text" />
  <button>Submit</button>
</main>
```

### Controlling Tab Order

```html
<!-- Remove from tab order -->
<button tabindex="-1">Not tabbable</button>

<!-- Add to tab order (avoid if possible) -->
<div tabindex="0">Now focusable</div>

<!-- ❌ Avoid positive tabindex -->
<input tabindex="1" />  <!-- Creates confusing order -->
<input tabindex="2" />
```

### Focusable Elements

Naturally focusable:
- `<a href="...">`
- `<button>`
- `<input>`, `<select>`, `<textarea>`
- `<details>`
- Elements with `tabindex="0"`

Not focusable:
- `<div>`, `<span>`, `<p>`
- `<a>` without href
- Disabled elements
- `tabindex="-1"` elements

## Focus Visibility

### CSS Focus Styles

```css
/* ❌ Never do this */
*:focus {
  outline: none;
}

/* ✅ Custom focus styles */
:focus {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* ✅ Focus-visible for keyboard only */
:focus:not(:focus-visible) {
  outline: none;
}

:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}

/* Button example */
button:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
  box-shadow: 0 0 0 4px rgba(0, 95, 204, 0.3);
}
```

### Tailwind Focus Styles

```html
<!-- Focus ring -->
<button class="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Click me
</button>

<!-- Focus visible only -->
<button class="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500">
  Click me
</button>
```

## Focus Management

### Skip Links

```html
<body>
  <a href="#main-content" class="skip-link">
    Skip to main content
  </a>
  
  <header>...</header>
  <nav>...</nav>
  
  <main id="main-content" tabindex="-1">
    <!-- Main content -->
  </main>
</body>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  padding: 8px;
  background: #000;
  color: #fff;
  z-index: 100;
}

.skip-link:focus {
  top: 0;
}
```

### Modal Focus Trap

```javascript
function trapFocus(modal) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab') return;
    
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
}

function openModal(modal) {
  const previouslyFocused = document.activeElement;
  
  modal.hidden = false;
  modal.querySelector('button, [href], input').focus();
  trapFocus(modal);
  
  // Restore focus when closed
  modal.addEventListener('close', () => {
    previouslyFocused.focus();
  }, { once: true });
}
```

### Focus After Actions

```javascript
// After deleting item, focus next item or container
function deleteItem(item) {
  const nextItem = item.nextElementSibling || item.previousElementSibling;
  const container = item.parentElement;
  
  item.remove();
  
  if (nextItem) {
    nextItem.focus();
  } else {
    container.focus();
  }
}

// After form submission error
function handleFormError(form, errors) {
  const firstErrorField = form.querySelector('[aria-invalid="true"]');
  if (firstErrorField) {
    firstErrorField.focus();
  }
}

// After page navigation (SPA)
function navigateToPage(url) {
  loadPage(url);
  
  // Focus main content
  const main = document.querySelector('main');
  main.tabIndex = -1;
  main.focus();
  
  // Announce page change
  announcePageChange(document.title);
}
```

### Roving Tabindex

For widgets like tabs, only one item is tabbable at a time.

```javascript
class TabList {
  constructor(container) {
    this.tabs = container.querySelectorAll('[role="tab"]');
    this.activeIndex = 0;
    
    this.tabs.forEach((tab, index) => {
      tab.tabIndex = index === 0 ? 0 : -1;
      tab.addEventListener('keydown', (e) => this.handleKeydown(e, index));
    });
  }
  
  handleKeydown(e, index) {
    let newIndex;
    
    switch (e.key) {
      case 'ArrowRight':
        newIndex = (index + 1) % this.tabs.length;
        break;
      case 'ArrowLeft':
        newIndex = (index - 1 + this.tabs.length) % this.tabs.length;
        break;
      case 'Home':
        newIndex = 0;
        break;
      case 'End':
        newIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }
    
    e.preventDefault();
    this.focusTab(newIndex);
  }
  
  focusTab(index) {
    this.tabs[this.activeIndex].tabIndex = -1;
    this.tabs[index].tabIndex = 0;
    this.tabs[index].focus();
    this.activeIndex = index;
  }
}
```

## Testing Keyboard Accessibility

### Manual Testing Checklist

- [ ] Can reach all interactive elements with Tab
- [ ] Can activate buttons with Enter and Space
- [ ] Can activate links with Enter
- [ ] Focus is visible on all elements
- [ ] Tab order is logical
- [ ] Modals trap focus
- [ ] Escape closes modals/dropdowns
- [ ] Arrow keys work in widgets
- [ ] Focus returns to trigger after modal closes

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't focus element | Add `tabindex="0"` or use `<button>` |
| Focus not visible | Add `:focus` styles |
| Focus lost after action | Manage focus programmatically |
| Can tab behind modal | Implement focus trap |
| Skip link missing | Add skip link to main content |

## Reduced Motion

```css
/* Respect user preference */
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
<div class="transition motion-reduce:transition-none">
  Content
</div>
```

```javascript
// Check preference in JS
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (!prefersReducedMotion) {
  // Run animation
}
```
