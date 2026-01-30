---
title: "Semantic HTML"
---
# Semantic HTML

Guide to using HTML elements for accessibility.

## Document Structure

### Landmarks

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Page Title - Site Name</title>
</head>
<body>
  <header>
    <nav aria-label="Main">
      <!-- Primary navigation -->
    </nav>
  </header>
  
  <main>
    <h1>Page Title</h1>
    <!-- Main content -->
    
    <article>
      <!-- Self-contained content -->
    </article>
    
    <aside>
      <!-- Related content -->
    </aside>
  </main>
  
  <footer>
    <nav aria-label="Footer">
      <!-- Footer navigation -->
    </nav>
  </footer>
</body>
</html>
```

### Landmark Elements

| Element | ARIA Role | Purpose |
|---------|-----------|---------|
| `<header>` | banner | Site header (top-level only) |
| `<nav>` | navigation | Navigation links |
| `<main>` | main | Primary content (one per page) |
| `<aside>` | complementary | Related content |
| `<footer>` | contentinfo | Site footer (top-level only) |
| `<section>` | region | Thematic grouping (with heading) |
| `<article>` | article | Self-contained content |

## Headings

### Proper Hierarchy

```html
<!-- ✅ Correct hierarchy -->
<h1>Page Title</h1>
  <h2>Section 1</h2>
    <h3>Subsection 1.1</h3>
    <h3>Subsection 1.2</h3>
  <h2>Section 2</h2>
    <h3>Subsection 2.1</h3>

<!-- ❌ Skipped levels -->
<h1>Page Title</h1>
  <h3>Section 1</h3>  <!-- Skipped h2 -->
```

### Rules

- One `<h1>` per page
- Don't skip levels
- Use headings for structure, not styling
- Every section should have a heading

## Images

### Types of Images

```html
<!-- Informative: Conveys information -->
<img src="chart.png" alt="Sales grew 25% from Q3 to Q4 2024" />

<!-- Decorative: No information -->
<img src="divider.png" alt="" />
<!-- Or use CSS background-image -->

<!-- Functional: Button/link -->
<button>
  <img src="search.svg" alt="Search" />
</button>

<!-- Complex: Needs longer description -->
<figure>
  <img src="infographic.png" alt="Company growth infographic" />
  <figcaption>
    Detailed description of the infographic showing...
  </figcaption>
</figure>

<!-- Or with aria-describedby -->
<img 
  src="diagram.png" 
  alt="Network architecture"
  aria-describedby="diagram-desc"
/>
<div id="diagram-desc" class="sr-only">
  The diagram shows three tiers: web servers connect to 
  application servers, which connect to database servers...
</div>
```

### Alt Text Guidelines

| Image Type | Alt Text |
|------------|----------|
| Photo of person | "Sarah Johnson, CEO" |
| Icon with text | "" (empty, text provides meaning) |
| Icon without text | Describe function: "Search" |
| Chart | Summarize data/trend |
| Logo link | "Company Name - Home" |
| Decorative | "" (empty) |

## Forms

### Labels

```html
<!-- Explicit label (preferred) -->
<label for="email">Email address</label>
<input type="email" id="email" name="email" />

<!-- Implicit label -->
<label>
  Email address
  <input type="email" name="email" />
</label>

<!-- ❌ No label -->
<input type="email" placeholder="Email" />
```

### Complete Form Example

```html
<form>
  <!-- Text input with hint -->
  <div>
    <label for="username">Username</label>
    <input 
      type="text" 
      id="username" 
      name="username"
      aria-describedby="username-hint"
      required
    />
    <span id="username-hint">3-20 characters, letters and numbers only</span>
  </div>
  
  <!-- Input with error -->
  <div>
    <label for="email">Email</label>
    <input 
      type="email" 
      id="email" 
      name="email"
      aria-invalid="true"
      aria-describedby="email-error"
    />
    <span id="email-error" role="alert">Please enter a valid email</span>
  </div>
  
  <!-- Select -->
  <div>
    <label for="country">Country</label>
    <select id="country" name="country">
      <option value="">Select a country</option>
      <option value="us">United States</option>
      <option value="uk">United Kingdom</option>
    </select>
  </div>
  
  <!-- Checkbox -->
  <div>
    <input type="checkbox" id="newsletter" name="newsletter" />
    <label for="newsletter">Subscribe to newsletter</label>
  </div>
  
  <!-- Radio group -->
  <fieldset>
    <legend>Preferred contact method</legend>
    <div>
      <input type="radio" id="contact-email" name="contact" value="email" />
      <label for="contact-email">Email</label>
    </div>
    <div>
      <input type="radio" id="contact-phone" name="contact" value="phone" />
      <label for="contact-phone">Phone</label>
    </div>
  </fieldset>
  
  <button type="submit">Submit</button>
</form>
```

### Required Fields

```html
<!-- Visual and programmatic indicator -->
<label for="name">
  Name <span aria-hidden="true">*</span>
  <span class="sr-only">(required)</span>
</label>
<input type="text" id="name" required aria-required="true" />
```

## Links and Buttons

### Links

```html
<!-- Descriptive link text -->
<a href="/pricing">View pricing plans</a>

<!-- ❌ Avoid -->
<a href="/pricing">Click here</a>
<a href="/pricing">Read more</a>

<!-- Link opens new window -->
<a href="https://external.com" target="_blank" rel="noopener">
  External resource
  <span class="sr-only">(opens in new tab)</span>
</a>

<!-- Download link -->
<a href="/report.pdf" download>
  Download annual report (PDF, 2.3MB)
</a>
```

### Buttons

```html
<!-- Button for actions -->
<button type="button" onclick="openModal()">
  Open settings
</button>

<!-- Submit button -->
<button type="submit">Save changes</button>

<!-- Icon button -->
<button type="button" aria-label="Close dialog">
  <svg aria-hidden="true">...</svg>
</button>

<!-- Toggle button -->
<button 
  type="button" 
  aria-pressed="false"
  onclick="toggleDarkMode(this)"
>
  Dark mode
</button>
```

### When to Use Each

| Action | Element |
|--------|---------|
| Navigate to URL | `<a href="...">` |
| Submit form | `<button type="submit">` |
| Trigger JS action | `<button type="button">` |
| Toggle state | `<button aria-pressed>` |

## Tables

### Data Table

```html
<table>
  <caption>Quarterly Sales Report</caption>
  <thead>
    <tr>
      <th scope="col">Product</th>
      <th scope="col">Q1</th>
      <th scope="col">Q2</th>
      <th scope="col">Q3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">Widget A</th>
      <td>$10,000</td>
      <td>$12,000</td>
      <td>$15,000</td>
    </tr>
    <tr>
      <th scope="row">Widget B</th>
      <td>$8,000</td>
      <td>$9,000</td>
      <td>$11,000</td>
    </tr>
  </tbody>
</table>
```

### Complex Table

```html
<table>
  <caption>Employee Schedule</caption>
  <thead>
    <tr>
      <td></td>
      <th scope="col" id="mon">Monday</th>
      <th scope="col" id="tue">Tuesday</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row" id="morning">Morning</th>
      <td headers="mon morning">Alice</td>
      <td headers="tue morning">Bob</td>
    </tr>
  </tbody>
</table>
```

## Lists

```html
<!-- Unordered list -->
<ul>
  <li>Item one</li>
  <li>Item two</li>
</ul>

<!-- Ordered list -->
<ol>
  <li>First step</li>
  <li>Second step</li>
</ol>

<!-- Description list -->
<dl>
  <dt>HTML</dt>
  <dd>HyperText Markup Language</dd>
  
  <dt>CSS</dt>
  <dd>Cascading Style Sheets</dd>
</dl>

<!-- Navigation list -->
<nav aria-label="Main">
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="/about">About</a></li>
  </ul>
</nav>
```

## Screen Reader Only Content

```css
/* Visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

```html
<button>
  <svg aria-hidden="true">...</svg>
  <span class="sr-only">Close menu</span>
</button>
```
