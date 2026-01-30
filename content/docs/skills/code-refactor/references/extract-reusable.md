---
title: "Extract Reusable Components"
---
# Extract Reusable Components

Workflow for identifying and extracting reusable code following DRY principles.

## The DRY Principle

> **Don't Repeat Yourself** - Every piece of knowledge should have a single, unambiguous representation.

**But also:**
- Don't over-DRY (premature abstraction)
- Rule of Three: Wait until you see it 3 times
- Similar ≠ Same (don't force unrelated things together)

## Extraction Decision Framework

### When to Extract

```
┌─────────────────────────────────────────────┐
│ Is the code duplicated?                      │
│   └─> YES: Is it duplicated 3+ times?        │
│         └─> YES: Extract                     │
│         └─> NO: Wait for third occurrence    │
│   └─> NO: Is it a cohesive concept?          │
│         └─> YES: Consider extracting         │
│         └─> NO: Leave as is                  │
└─────────────────────────────────────────────┘
```

### What to Extract

| Extract When | Don't Extract When |
|--------------|-------------------|
| Same logic, same meaning | Similar code, different meaning |
| Will change together | Might diverge later |
| Natural concept boundary | Arbitrary grouping |
| Tested independently | Only makes sense in context |

## Extraction Patterns

### Pattern 1: Extract Function

**When:** Same logic repeated, can name it clearly

```javascript
// Before - validation repeated
function createUser(data) {
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email');
  }
  // ...
}

function updateUser(id, data) {
  if (!data.email || !data.email.includes('@')) {
    throw new Error('Invalid email');
  }
  // ...
}

// After
function validateEmail(email) {
  if (!email || !email.includes('@')) {
    throw new Error('Invalid email');
  }
}

function createUser(data) {
  validateEmail(data.email);
  // ...
}

function updateUser(id, data) {
  validateEmail(data.email);
  // ...
}
```

### Pattern 2: Extract Class/Module

**When:** Related functions operate on same data

```python
# Before - related functions scattered
def parse_address(text):
    # ...

def format_address(street, city, zip):
    # ...

def validate_address(address):
    # ...

def geocode_address(address):
    # ...

# After - cohesive module
class Address:
    def __init__(self, street, city, zip_code):
        self.street = street
        self.city = city
        self.zip_code = zip_code
    
    @classmethod
    def parse(cls, text):
        # ...
    
    def format(self):
        # ...
    
    def validate(self):
        # ...
    
    def geocode(self):
        # ...
```

### Pattern 3: Extract Configuration

**When:** Values change together or represent settings

```javascript
// Before - magic values everywhere
function createRequest() {
  return fetch('https://api.example.com/v2', {
    timeout: 5000,
    retries: 3,
    headers: { 'X-API-Key': 'abc123' }
  });
}

// After - configuration extracted
const API_CONFIG = {
  baseUrl: 'https://api.example.com/v2',
  timeout: 5000,
  retries: 3,
  apiKey: process.env.API_KEY
};

function createRequest() {
  return fetch(API_CONFIG.baseUrl, {
    timeout: API_CONFIG.timeout,
    retries: API_CONFIG.retries,
    headers: { 'X-API-Key': API_CONFIG.apiKey }
  });
}
```

### Pattern 4: Extract Hook (React)

**When:** Same stateful logic in multiple components

```jsx
// Before - duplicated in components
function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUser(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);
  
  // ...
}

// After - extracted hook
function useUser(id) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetchUser(id)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);
  
  return { user, loading, error };
}

function UserProfile({ id }) {
  const { user, loading, error } = useUser(id);
  // ...
}
```

### Pattern 5: Extract Component (React)

**When:** UI pattern repeated with different data

```jsx
// Before - repeated card structure
function Dashboard() {
  return (
    <div>
      <div className="card">
        <h3>Users</h3>
        <p className="stat">{userCount}</p>
        <span className="trend up">+5%</span>
      </div>
      <div className="card">
        <h3>Revenue</h3>
        <p className="stat">${revenue}</p>
        <span className="trend up">+12%</span>
      </div>
      {/* More cards... */}
    </div>
  );
}

// After - extracted component
function StatCard({ title, value, trend, trendDirection }) {
  return (
    <div className="card">
      <h3>{title}</h3>
      <p className="stat">{value}</p>
      <span className={`trend ${trendDirection}`}>{trend}</span>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <StatCard title="Users" value={userCount} trend="+5%" trendDirection="up" />
      <StatCard title="Revenue" value={`$${revenue}`} trend="+12%" trendDirection="up" />
    </div>
  );
}
```

### Pattern 6: Extract Utility

**When:** Pure function used across modules

```python
# Before - same logic in multiple files
# file1.py
def process_data():
    slug = name.lower().replace(' ', '-').replace('--', '-')
    
# file2.py  
def save_item():
    slug = title.lower().replace(' ', '-').replace('--', '-')

# After - utility module
# utils/string.py
def slugify(text):
    """Convert text to URL-friendly slug."""
    return text.lower().replace(' ', '-').replace('--', '-')

# file1.py
from utils.string import slugify
def process_data():
    slug = slugify(name)
```

### Pattern 7: Extract Middleware/Decorator

**When:** Cross-cutting concern (logging, auth, timing)

```python
# Before - repeated in every function
def get_user(id):
    start = time.time()
    logger.info(f"Getting user {id}")
    try:
        result = db.query(User, id)
        logger.info(f"Got user in {time.time() - start}s")
        return result
    except Exception as e:
        logger.error(f"Failed: {e}")
        raise

# After - decorator
def logged(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        logger.info(f"Calling {func.__name__}")
        try:
            result = func(*args, **kwargs)
            logger.info(f"Completed in {time.time() - start}s")
            return result
        except Exception as e:
            logger.error(f"Failed: {e}")
            raise
    return wrapper

@logged
def get_user(id):
    return db.query(User, id)
```

## Extraction Process

### Step 1: Identify Duplication

Find candidates:
```bash
# JavaScript - find duplicates
npx jscpd src/

# General - search for similar patterns
grep -rn "similar_pattern" src/
```

### Step 2: Analyze Variations

Compare the duplicates:
- What's exactly the same?
- What varies?
- Can variations be parameters?

### Step 3: Design the Interface

```
Questions:
├── What should it be called?
├── What parameters does it need?
├── What does it return?
├── Where should it live?
└── How will it be tested?
```

### Step 4: Extract with Tests

1. Write tests for the new component
2. Create the extracted component
3. Replace first usage
4. Run tests
5. Replace remaining usages
6. Run all tests

### Step 5: Clean Up

- Remove old duplicate code
- Update imports
- Document if needed

## Anti-Patterns to Avoid

### Wrong Abstraction

```javascript
// ❌ Forced abstraction - these aren't the same
function doThing(type) {
  if (type === 'user') {
    // 50 lines of user logic
  } else if (type === 'order') {
    // 50 lines of completely different order logic
  }
}

// ✅ Keep separate - they're different concepts
function processUser() { /* user logic */ }
function processOrder() { /* order logic */ }
```

### Premature Extraction

```javascript
// ❌ Extracted too early (only used once)
const formatGreeting = (name) => `Hello, ${name}!`;
console.log(formatGreeting('World'));

// ✅ Inline is fine for single use
console.log(`Hello, World!`);
```

### Over-Parameterization

```javascript
// ❌ Too many parameters, hard to use
function createButton(text, color, size, onClick, disabled, icon, 
                      iconPosition, tooltip, className, style) { }

// ✅ Use options object
function createButton(text, options = {}) {
  const { color, size, onClick, disabled, icon } = options;
}
```

## Extraction Template

```markdown
## Component Extraction

### Identified Duplication
- Location 1: [file:line]
- Location 2: [file:line]
- Location 3: [file:line]

### Analysis
- Common logic: [description]
- Variations: [what differs]
- Parameterizable: [yes/no, how]

### Proposed Extraction

**Name:** [ComponentName]
**Location:** [path/to/file]
**Interface:**
```
[signature/type definition]
```

### Before/After

**Before (one location):**
```
[duplicated code]
```

**After:**
```
[usage of extracted component]
```

### Migration Plan
1. [ ] Create extracted component with tests
2. [ ] Replace location 1
3. [ ] Replace location 2
4. [ ] Replace location 3
5. [ ] Remove old code
6. [ ] Update documentation
```
