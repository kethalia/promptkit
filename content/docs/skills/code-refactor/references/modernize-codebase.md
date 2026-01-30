---
title: "Modernize Codebase"
---
# Modernize Codebase

Workflow for updating code to use modern patterns, syntax, and best practices.

## Modernization Strategy

### Assessment First

Before modernizing, assess:

```
1. What's the target environment?
   - Browser support requirements
   - Node.js version
   - Language version

2. What's the risk tolerance?
   - Production system vs. internal tool
   - Test coverage level
   - Rollback capability

3. What's the scope?
   - Full codebase vs. specific modules
   - Breaking changes acceptable?
   - Timeline constraints
```

### Incremental Approach

```
1. Update tooling (linters, formatters)
2. Fix automated issues
3. Modernize syntax (non-breaking)
4. Update patterns (may need refactoring)
5. Upgrade dependencies
6. Update architecture (if needed)
```

## JavaScript/TypeScript Modernization

### ES5 → ES6+ Syntax

**var → const/let**
```javascript
// Before
var name = 'John';
var items = [];

// After
const name = 'John';  // Use const for non-reassigned
let items = [];       // Use let for reassigned
```

**Function → Arrow Function**
```javascript
// Before
var double = function(x) {
  return x * 2;
};

// After
const double = (x) => x * 2;

// Keep function for methods that use 'this'
const obj = {
  name: 'test',
  getName: function() {  // Keep function here
    return this.name;
  }
};
```

**String Concatenation → Template Literals**
```javascript
// Before
var message = 'Hello, ' + name + '! You have ' + count + ' items.';

// After
const message = `Hello, ${name}! You have ${count} items.`;
```

**Object Methods Shorthand**
```javascript
// Before
const obj = {
  name: name,
  getValue: function() {
    return this.value;
  }
};

// After
const obj = {
  name,  // Shorthand property
  getValue() {  // Shorthand method
    return this.value;
  }
};
```

**Destructuring**
```javascript
// Before
var name = user.name;
var email = user.email;
var first = arr[0];

// After
const { name, email } = user;
const [first] = arr;

// With defaults
const { name = 'Anonymous' } = user;
```

**Spread Operator**
```javascript
// Before
var merged = Object.assign({}, obj1, obj2);
var combined = arr1.concat(arr2);

// After
const merged = { ...obj1, ...obj2 };
const combined = [...arr1, ...arr2];
```

**Classes**
```javascript
// Before
function User(name) {
  this.name = name;
}
User.prototype.greet = function() {
  return 'Hello, ' + this.name;
};

// After
class User {
  constructor(name) {
    this.name = name;
  }
  
  greet() {
    return `Hello, ${this.name}`;
  }
}
```

### Async Patterns

**Callbacks → Promises**
```javascript
// Before
function getData(callback) {
  fetch(url, function(err, response) {
    if (err) return callback(err);
    response.json(function(err, data) {
      if (err) return callback(err);
      callback(null, data);
    });
  });
}

// After
function getData() {
  return fetch(url)
    .then(response => response.json());
}
```

**Promises → Async/Await**
```javascript
// Before
function processData() {
  return getData()
    .then(data => transform(data))
    .then(result => save(result))
    .catch(error => handleError(error));
}

// After
async function processData() {
  try {
    const data = await getData();
    const result = await transform(data);
    return await save(result);
  } catch (error) {
    handleError(error);
  }
}
```

### Modern Array Methods

```javascript
// Before - imperative
var results = [];
for (var i = 0; i < items.length; i++) {
  if (items[i].active) {
    results.push(items[i].name);
  }
}

// After - functional
const results = items
  .filter(item => item.active)
  .map(item => item.name);

// Other modern methods
arr.find(x => x.id === id);       // Find first match
arr.findIndex(x => x.id === id);  // Find index
arr.includes(value);              // Check existence
arr.some(x => x.active);          // Any match?
arr.every(x => x.valid);          // All match?
arr.flat();                       // Flatten nested
arr.flatMap(x => x.items);        // Map + flatten
```

### Optional Chaining & Nullish Coalescing

```javascript
// Before
var name = user && user.profile && user.profile.name;
var value = data !== null && data !== undefined ? data : 'default';

// After
const name = user?.profile?.name;
const value = data ?? 'default';

// With function calls
const result = obj.method?.();

// With arrays
const first = arr?.[0];
```

## Python Modernization

### Python 2 → Python 3

**Print Function**
```python
# Before
print "Hello"

# After
print("Hello")
```

**String Formatting**
```python
# Before
message = "Hello, %s! You have %d items." % (name, count)
message = "Hello, {}! You have {} items.".format(name, count)

# After (f-strings, Python 3.6+)
message = f"Hello, {name}! You have {count} items."
```

**Type Hints**
```python
# Before
def greet(name):
    return "Hello, " + name

# After
def greet(name: str) -> str:
    return f"Hello, {name}"

# With Optional
from typing import Optional, List

def find_user(id: int) -> Optional[User]:
    ...

def get_names(users: List[User]) -> List[str]:
    ...
```

**Dataclasses (Python 3.7+)**
```python
# Before
class User:
    def __init__(self, name, email, age):
        self.name = name
        self.email = email
        self.age = age
    
    def __repr__(self):
        return f"User({self.name}, {self.email}, {self.age})"
    
    def __eq__(self, other):
        return (self.name == other.name and 
                self.email == other.email and 
                self.age == other.age)

# After
from dataclasses import dataclass

@dataclass
class User:
    name: str
    email: str
    age: int
```

**Walrus Operator (Python 3.8+)**
```python
# Before
match = pattern.search(text)
if match:
    process(match)

# After
if (match := pattern.search(text)):
    process(match)
```

**Pattern Matching (Python 3.10+)**
```python
# Before
if status == 200:
    handle_success()
elif status == 404:
    handle_not_found()
elif status >= 500:
    handle_server_error()
else:
    handle_unknown()

# After
match status:
    case 200:
        handle_success()
    case 404:
        handle_not_found()
    case code if code >= 500:
        handle_server_error()
    case _:
        handle_unknown()
```

## React Modernization

### Class → Function Components

```jsx
// Before
class UserProfile extends React.Component {
  state = { loading: true, user: null };
  
  componentDidMount() {
    this.fetchUser();
  }
  
  componentDidUpdate(prevProps) {
    if (prevProps.userId !== this.props.userId) {
      this.fetchUser();
    }
  }
  
  fetchUser = async () => {
    const user = await getUser(this.props.userId);
    this.setState({ user, loading: false });
  };
  
  render() {
    const { loading, user } = this.state;
    if (loading) return <Spinner />;
    return <div>{user.name}</div>;
  }
}

// After
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const user = await getUser(userId);
      setUser(user);
      setLoading(false);
    }
    fetchUser();
  }, [userId]);
  
  if (loading) return <Spinner />;
  return <div>{user.name}</div>;
}
```

### Redux → Modern State Management

```jsx
// Before (Redux with connect)
const mapStateToProps = state => ({
  user: state.user.current
});
const mapDispatchToProps = { fetchUser };
export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);

// After (Redux Toolkit + hooks)
function UserProfile() {
  const user = useSelector(state => state.user.current);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);
}
```

## Modernization Checklist

```markdown
## Modernization Plan: [Project Name]

### Environment
- Current: [versions]
- Target: [versions]

### Phase 1: Tooling
- [ ] Update Node.js/Python version
- [ ] Update linter configuration
- [ ] Update formatter configuration
- [ ] Add/update TypeScript (if applicable)

### Phase 2: Syntax Updates
- [ ] var → const/let
- [ ] Functions → arrow functions
- [ ] String concatenation → template literals
- [ ] Callbacks → async/await
- [ ] [Language-specific updates]

### Phase 3: Pattern Updates
- [ ] Class components → hooks
- [ ] Old state management → modern
- [ ] Legacy APIs → modern equivalents

### Phase 4: Dependencies
- [ ] Audit outdated packages
- [ ] Update to latest stable
- [ ] Remove deprecated packages

### Verification
- [ ] All tests passing
- [ ] No new linter warnings
- [ ] Performance benchmarks
- [ ] Browser/environment testing
```

## Automated Tools

### JavaScript
```bash
# Codemods for React
npx react-codemod

# Update syntax automatically
npx lebab --transform let,arrow,template src/

# ESLint autofix
npx eslint --fix src/
```

### Python
```bash
# Modernize Python 2 to 3
python-modernize -w src/

# Sort imports
isort src/

# Format code
black src/
```
