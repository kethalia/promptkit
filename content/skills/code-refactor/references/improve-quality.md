# Improve Code Quality

Systematic approach to identifying and fixing code quality issues.

## Quality Assessment Process

### Step 1: Identify Code Smells

**Quick scan checklist:**

- [ ] Any function > 30 lines?
- [ ] Any class > 300 lines?
- [ ] Any function with > 4 parameters?
- [ ] Any deeply nested code (> 3 levels)?
- [ ] Any duplicated code blocks?
- [ ] Any complex conditionals?
- [ ] Any magic numbers/strings?
- [ ] Any unclear names?

### Step 2: Prioritize by Impact

| Priority | Fix When | Examples |
|----------|----------|----------|
| **High** | Now | Bugs, security, blocking issues |
| **Medium** | This sprint | Maintainability, readability |
| **Low** | Backlog | Style, minor improvements |

### Step 3: Refactor Incrementally

One smell at a time, tests between each change.

## Common Quality Issues & Fixes

### Issue: Long Functions

**Signs:**
- Function > 20-30 lines
- Multiple levels of abstraction
- Does more than one thing
- Hard to name

**Fix: Extract Method**

```python
# Before
def process_order(order):
    # Validate
    if not order.items:
        raise ValueError("Empty order")
    if not order.customer:
        raise ValueError("No customer")
    
    # Calculate totals
    subtotal = sum(item.price * item.qty for item in order.items)
    tax = subtotal * 0.1
    shipping = 5.99 if subtotal < 50 else 0
    total = subtotal + tax + shipping
    
    # Save
    db.save(order)
    db.save(Payment(order.id, total))
    
    # Notify
    email.send(order.customer, "Order confirmed")
    
    return total

# After
def process_order(order):
    validate_order(order)
    total = calculate_total(order)
    save_order(order, total)
    notify_customer(order)
    return total

def validate_order(order):
    if not order.items:
        raise ValueError("Empty order")
    if not order.customer:
        raise ValueError("No customer")

def calculate_total(order):
    subtotal = sum(item.price * item.qty for item in order.items)
    tax = subtotal * TAX_RATE
    shipping = 0 if subtotal >= FREE_SHIPPING_THRESHOLD else SHIPPING_COST
    return subtotal + tax + shipping

def save_order(order, total):
    db.save(order)
    db.save(Payment(order.id, total))

def notify_customer(order):
    email.send(order.customer, "Order confirmed")
```

### Issue: Deep Nesting

**Signs:**
- More than 3 levels of indentation
- Hard to follow logic flow
- Arrow-shaped code

**Fix: Early Returns / Guard Clauses**

```javascript
// Before
function processUser(user) {
  if (user) {
    if (user.isActive) {
      if (user.hasPermission) {
        if (user.email) {
          // Finally do the work
          sendNotification(user);
        }
      }
    }
  }
}

// After
function processUser(user) {
  if (!user) return;
  if (!user.isActive) return;
  if (!user.hasPermission) return;
  if (!user.email) return;
  
  sendNotification(user);
}
```

### Issue: Complex Conditionals

**Signs:**
- Long if/else chains
- Nested ternaries
- Hard to understand logic

**Fix: Extract to Named Functions or Use Lookup**

```javascript
// Before
function getDiscount(customer) {
  if (customer.type === 'premium' && customer.years > 5) {
    return 0.2;
  } else if (customer.type === 'premium') {
    return 0.15;
  } else if (customer.type === 'regular' && customer.orders > 100) {
    return 0.1;
  } else if (customer.type === 'regular') {
    return 0.05;
  } else {
    return 0;
  }
}

// After - Strategy approach
const discountStrategies = {
  premium: (c) => c.years > 5 ? 0.2 : 0.15,
  regular: (c) => c.orders > 100 ? 0.1 : 0.05,
  default: () => 0
};

function getDiscount(customer) {
  const strategy = discountStrategies[customer.type] || discountStrategies.default;
  return strategy(customer);
}
```

### Issue: Magic Numbers/Strings

**Signs:**
- Unexplained numeric literals
- Repeated string values
- Hard to understand meaning

**Fix: Extract Constants**

```python
# Before
def calculate_shipping(weight):
    if weight > 50:
        return weight * 2.5
    return 5.99

# After
MAX_STANDARD_WEIGHT = 50
HEAVY_SHIPPING_RATE = 2.5
STANDARD_SHIPPING_COST = 5.99

def calculate_shipping(weight):
    if weight > MAX_STANDARD_WEIGHT:
        return weight * HEAVY_SHIPPING_RATE
    return STANDARD_SHIPPING_COST
```

### Issue: Unclear Names

**Signs:**
- Single letter variables (except loop counters)
- Abbreviations that aren't obvious
- Names that don't describe purpose

**Fix: Rename with Intent**

```javascript
// Before
function proc(d, t) {
  const r = [];
  for (let i = 0; i < d.length; i++) {
    if (d[i].s === t) {
      r.push(d[i]);
    }
  }
  return r;
}

// After
function filterOrdersByStatus(orders, targetStatus) {
  return orders.filter(order => order.status === targetStatus);
}
```

### Issue: Duplicate Code

**Signs:**
- Copy-pasted blocks
- Similar functions with minor differences
- Same bug fixed in multiple places

**Fix: Extract Common Logic**

```python
# Before
def create_admin_user(name, email):
    user = User(name=name, email=email)
    user.role = 'admin'
    user.permissions = ['read', 'write', 'delete', 'admin']
    db.save(user)
    send_welcome_email(user)
    return user

def create_regular_user(name, email):
    user = User(name=name, email=email)
    user.role = 'user'
    user.permissions = ['read']
    db.save(user)
    send_welcome_email(user)
    return user

# After
def create_user(name, email, role='user'):
    user = User(name=name, email=email)
    user.role = role
    user.permissions = ROLE_PERMISSIONS[role]
    db.save(user)
    send_welcome_email(user)
    return user

ROLE_PERMISSIONS = {
    'admin': ['read', 'write', 'delete', 'admin'],
    'user': ['read']
}
```

### Issue: Large Classes

**Signs:**
- Class has many responsibilities
- Hard to name (uses "And" or "Manager")
- Many unrelated methods

**Fix: Extract Classes by Responsibility**

```python
# Before
class UserManager:
    def create_user(self): ...
    def delete_user(self): ...
    def send_email(self): ...
    def generate_report(self): ...
    def validate_password(self): ...
    def upload_avatar(self): ...

# After
class UserRepository:
    def create(self): ...
    def delete(self): ...

class UserNotificationService:
    def send_email(self): ...

class UserReportGenerator:
    def generate_report(self): ...

class PasswordValidator:
    def validate(self): ...

class AvatarService:
    def upload(self): ...
```

## Quality Improvement Template

```markdown
## Code Quality Improvement

### File/Component
[Name of file or component]

### Issues Found

| Issue | Location | Severity | Fix |
|-------|----------|----------|-----|
| [Smell] | line X | High/Med/Low | [Technique] |

### Refactoring Plan

1. [ ] [First change]
2. [ ] [Second change]
3. [ ] [Third change]

### Before/After

**Issue 1: [Name]**

Before:
```
[code]
```

After:
```
[code]
```

### Verification
- [ ] All tests pass
- [ ] No new warnings
- [ ] Code review approved
```

## Quality Metrics

Track improvement with:

| Metric | Tool | Target |
|--------|------|--------|
| Cyclomatic Complexity | ESLint/pylint | < 10 per function |
| Lines per Function | Linter | < 30 |
| Nesting Depth | Linter | < 4 |
| Code Duplication | Sonar/jscpd | < 5% |
| Test Coverage | Coverage tool | > 80% |
