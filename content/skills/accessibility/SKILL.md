---
name: accessibility
description: Web accessibility (a11y) patterns for inclusive design. Use when implementing accessible components, ARIA attributes, keyboard navigation, or screen reader support. Triggers include "accessibility", "a11y", "ARIA", "screen reader", "keyboard navigation", "WCAG", or when building inclusive interfaces. Covers semantic HTML, ARIA patterns, keyboard interaction, and testing.
---

# Accessibility Skill

Comprehensive accessibility patterns for inclusive web development. This skill covers:
1. **Semantic HTML** - Proper element usage
2. **ARIA** - Attributes and patterns
3. **Keyboard Navigation** - Focus management
4. **Testing** - Automated and manual testing

## Quick Reference

| Scenario | Reference |
|----------|-----------|
| Semantic HTML | See [semantic-html.md](references/semantic-html.md) |
| ARIA patterns | See [aria-patterns.md](references/aria-patterns.md) |
| Keyboard & focus | See [keyboard-focus.md](references/keyboard-focus.md) |

## WCAG Quick Reference

### Levels

| Level | Description |
|-------|-------------|
| **A** | Minimum accessibility |
| **AA** | Standard for most sites (legal requirement) |
| **AAA** | Highest level, not always achievable |

### Key Principles (POUR)

1. **Perceivable** - Content can be perceived
2. **Operable** - Interface can be operated
3. **Understandable** - Content is understandable
4. **Robust** - Works with assistive tech

## Common Patterns

### Images

```html
<!-- Informative image -->
<img src="chart.png" alt="Sales increased 25% in Q4" />

<!-- Decorative image -->
<img src="decoration.png" alt="" />

<!-- Complex image -->
<figure>
  <img src="diagram.png" alt="System architecture diagram" />
  <figcaption>Detailed description of the architecture...</figcaption>
</figure>
```

### Forms

```html
<form>
  <div>
    <label for="email">Email address</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      aria-describedby="email-hint"
      required
    />
    <span id="email-hint">We'll never share your email</span>
  </div>
</form>
```

### Buttons vs Links

```html
<!-- Button: performs action -->
<button type="button" onclick="save()">Save</button>

<!-- Link: navigates -->
<a href="/about">About Us</a>

<!-- ❌ Never -->
<div onclick="navigate()">Click here</div>
```

### Skip Link

```html
<a href="#main-content" class="skip-link">
  Skip to main content
</a>
<!-- ... navigation ... -->
<main id="main-content" tabindex="-1">
  Content
</main>
```

## Color Contrast

| Text Size | Minimum Ratio (AA) | Enhanced (AAA) |
|-----------|-------------------|----------------|
| Normal text | 4.5:1 | 7:1 |
| Large text (18pt+) | 3:1 | 4.5:1 |
| UI components | 3:1 | - |

## Checklist

### Essential
- [ ] All images have alt text
- [ ] Form inputs have labels
- [ ] Color contrast meets 4.5:1
- [ ] Page has proper heading hierarchy
- [ ] Interactive elements are keyboard accessible
- [ ] Focus is visible

### Enhanced
- [ ] Skip link provided
- [ ] ARIA landmarks used
- [ ] Error messages are descriptive
- [ ] Focus is managed in modals/SPAs
- [ ] Animations respect reduced motion

## Output Format

When implementing accessible components:

```markdown
## Accessible: [Component]

### HTML
```html
[Semantic markup with ARIA]
```

### Keyboard
- Tab: [behavior]
- Enter/Space: [behavior]
- Escape: [behavior]

### Screen Reader
[How it's announced]
```
