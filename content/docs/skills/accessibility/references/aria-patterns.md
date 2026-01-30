---
title: "ARIA Patterns"
---
# ARIA Patterns

Guide to using ARIA (Accessible Rich Internet Applications) attributes.

## ARIA Rules

1. **Don't use ARIA if native HTML works**
2. **Don't change native semantics** (unless necessary)
3. **All interactive elements must be keyboard accessible**
4. **Don't hide focusable elements**
5. **Interactive elements must have accessible names**

## Common ARIA Attributes

### Labels and Descriptions

```html
<!-- aria-label: Provides accessible name -->
<button aria-label="Close dialog">×</button>

<!-- aria-labelledby: References visible text -->
<h2 id="dialog-title">Settings</h2>
<div role="dialog" aria-labelledby="dialog-title">...</div>

<!-- aria-describedby: Additional description -->
<input 
  type="password" 
  aria-describedby="password-requirements"
/>
<p id="password-requirements">Must be at least 8 characters</p>
```

### States

```html
<!-- aria-expanded: Expandable elements -->
<button aria-expanded="false" aria-controls="menu">
  Menu
</button>
<ul id="menu" hidden>...</ul>

<!-- aria-pressed: Toggle buttons -->
<button aria-pressed="false">Bold</button>

<!-- aria-selected: Selection in widgets -->
<div role="tab" aria-selected="true">Tab 1</div>

<!-- aria-checked: Checkboxes/radios -->
<div role="checkbox" aria-checked="true">Option</div>

<!-- aria-current: Current item in navigation -->
<a href="/about" aria-current="page">About</a>

<!-- aria-disabled: Disabled state -->
<button aria-disabled="true">Submit</button>

<!-- aria-invalid: Validation error -->
<input type="email" aria-invalid="true" />
```

### Live Regions

```html
<!-- aria-live: Announce dynamic changes -->
<div aria-live="polite">
  <!-- Updated content announced when idle -->
</div>

<div aria-live="assertive">
  <!-- Updated content announced immediately -->
</div>

<!-- role="alert": Assertive by default -->
<div role="alert">Error: Form submission failed</div>

<!-- role="status": Polite by default -->
<div role="status">Saving...</div>

<!-- aria-atomic: Announce entire region -->
<div aria-live="polite" aria-atomic="true">
  3 items in cart
</div>
```

### Relationships

```html
<!-- aria-controls: Element controls another -->
<button aria-controls="panel" aria-expanded="false">
  Toggle Panel
</button>
<div id="panel">...</div>

<!-- aria-owns: Parent-child relationship -->
<div role="listbox" aria-owns="option1 option2">
  <div id="option1" role="option">Option 1</div>
  <div id="option2" role="option">Option 2</div>
</div>

<!-- aria-haspopup: Has popup -->
<button aria-haspopup="menu">Options</button>
```

## Component Patterns

### Modal Dialog

```html
<div 
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Confirm Delete</h2>
  <p id="dialog-desc">Are you sure you want to delete this item?</p>
  
  <button>Cancel</button>
  <button>Delete</button>
</div>

<!-- Backdrop prevents interaction -->
<div class="backdrop" aria-hidden="true"></div>
```

### Tabs

```html
<div class="tabs">
  <div role="tablist" aria-label="Settings tabs">
    <button 
      role="tab" 
      id="tab-1"
      aria-selected="true"
      aria-controls="panel-1"
    >
      General
    </button>
    <button 
      role="tab"
      id="tab-2"
      aria-selected="false"
      aria-controls="panel-2"
      tabindex="-1"
    >
      Privacy
    </button>
  </div>
  
  <div 
    role="tabpanel"
    id="panel-1"
    aria-labelledby="tab-1"
  >
    General settings content
  </div>
  
  <div 
    role="tabpanel"
    id="panel-2"
    aria-labelledby="tab-2"
    hidden
  >
    Privacy settings content
  </div>
</div>
```

### Accordion

```html
<div class="accordion">
  <h3>
    <button 
      aria-expanded="true"
      aria-controls="section-1"
    >
      Section 1
    </button>
  </h3>
  <div id="section-1">
    Section 1 content
  </div>
  
  <h3>
    <button 
      aria-expanded="false"
      aria-controls="section-2"
    >
      Section 2
    </button>
  </h3>
  <div id="section-2" hidden>
    Section 2 content
  </div>
</div>
```

### Menu

```html
<div class="menu-container">
  <button 
    aria-haspopup="true"
    aria-expanded="false"
    aria-controls="menu"
  >
    Options
  </button>
  
  <ul role="menu" id="menu" hidden>
    <li role="menuitem" tabindex="-1">Edit</li>
    <li role="menuitem" tabindex="-1">Duplicate</li>
    <li role="separator"></li>
    <li role="menuitem" tabindex="-1">Delete</li>
  </ul>
</div>
```

### Combobox (Autocomplete)

```html
<div class="combobox">
  <label for="search">Search</label>
  <input 
    type="text"
    id="search"
    role="combobox"
    aria-expanded="false"
    aria-autocomplete="list"
    aria-controls="suggestions"
    aria-activedescendant=""
  />
  
  <ul 
    role="listbox"
    id="suggestions"
    hidden
  >
    <li role="option" id="opt-1">Option 1</li>
    <li role="option" id="opt-2">Option 2</li>
  </ul>
</div>
```

### Alert/Toast

```html
<!-- Alert (assertive, immediate) -->
<div role="alert">
  Error: Unable to save changes.
</div>

<!-- Status (polite) -->
<div role="status">
  Changes saved successfully.
</div>

<!-- Live region for dynamic updates -->
<div 
  aria-live="polite"
  aria-atomic="true"
  class="toast-container"
>
  <!-- Toasts inserted here -->
</div>
```

### Progress

```html
<!-- Determinate progress -->
<div 
  role="progressbar"
  aria-valuenow="50"
  aria-valuemin="0"
  aria-valuemax="100"
  aria-label="Upload progress"
>
  50%
</div>

<!-- Indeterminate progress -->
<div 
  role="progressbar"
  aria-label="Loading"
>
  <span class="spinner"></span>
</div>
```

### Carousel/Slider

```html
<div 
  role="region"
  aria-roledescription="carousel"
  aria-label="Featured products"
>
  <div aria-live="polite">
    <div 
      role="group"
      aria-roledescription="slide"
      aria-label="1 of 5"
    >
      Slide 1 content
    </div>
  </div>
  
  <button aria-label="Previous slide">←</button>
  <button aria-label="Next slide">→</button>
</div>
```

## Hiding Content

```html
<!-- Hidden from everyone -->
<div hidden>...</div>
<div style="display: none;">...</div>

<!-- Hidden from screen readers only -->
<div aria-hidden="true">
  Decorative content
</div>

<!-- Hidden visually, available to screen readers -->
<span class="sr-only">
  Additional context for screen readers
</span>
```

## Common Mistakes

```html
<!-- ❌ Wrong: Redundant role -->
<button role="button">Click me</button>

<!-- ✅ Correct: Native element is enough -->
<button>Click me</button>

<!-- ❌ Wrong: Div with click handler -->
<div onclick="doSomething()">Click me</div>

<!-- ✅ Correct: Use button -->
<button onclick="doSomething()">Click me</button>

<!-- ❌ Wrong: aria-label on non-interactive element -->
<p aria-label="Introduction">...</p>

<!-- ✅ Correct: Use heading or aria-labelledby -->
<section aria-labelledby="intro-heading">
  <h2 id="intro-heading">Introduction</h2>
  ...
</section>

<!-- ❌ Wrong: Empty aria-label -->
<button aria-label="">×</button>

<!-- ✅ Correct: Meaningful label -->
<button aria-label="Close dialog">×</button>
```
