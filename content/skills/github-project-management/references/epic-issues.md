# Epic Issues

Guide to creating and managing epic issues for medium-to-large workloads.

## What is an Epic?

An epic is a **parent issue** that:
- Represents a significant piece of work
- Contains multiple related tasks (sub-issues)
- Provides overview and context
- Tracks overall progress

## When to Create an Epic

**ALWAYS create an epic when:**
- Work involves 2 or more distinct tasks
- Estimated effort exceeds 2 hours
- Multiple files/components are affected
- Work spans multiple days
- Multiple people might be involved

**Examples requiring epics:**
- Implement user authentication
- Add new API endpoint with tests
- Refactor database schema
- Set up CI/CD pipeline
- Create new feature with UI

**Examples NOT requiring epics:**
- Fix a typo
- Update a dependency
- Add a single test
- Small bug fix (< 1 hour)

## Epic Structure

### Title Format

```
Epic: [Clear, Concise Description]
```

Examples:
- `Epic: Implement User Authentication`
- `Epic: Add Payment Processing`
- `Epic: Migrate to PostgreSQL`
- `Epic: Create Admin Dashboard`

### Body Structure

```markdown
## Overview
[1-2 sentences explaining WHAT this epic accomplishes and WHY it matters]

## Goals
- [ ] Primary goal 1
- [ ] Primary goal 2
- [ ] Primary goal 3

## Sub-Issues
<!-- Updated as sub-issues are created -->
- [ ] #__ - [Task 1]
- [ ] #__ - [Task 2]
- [ ] #__ - [Task 3]

## Acceptance Criteria
- [ ] [Specific, measurable criterion 1]
- [ ] [Specific, measurable criterion 2]
- [ ] [Specific, measurable criterion 3]

## Technical Notes
[Architecture decisions, constraints, dependencies, links to docs]

## Out of Scope
- [Explicitly excluded item 1]
- [Explicitly excluded item 2]
```

## Example Epic

```markdown
# Epic: Implement User Authentication

## Overview
Add user authentication to the application using JWT tokens, allowing users to register, login, and access protected routes.

## Goals
- [ ] Users can register with email/password
- [ ] Users can login and receive JWT token
- [ ] Protected routes require valid token
- [ ] Passwords are securely hashed

## Sub-Issues
- [ ] #101 - Set up authentication database schema
- [ ] #102 - Implement user registration endpoint
- [ ] #103 - Implement login endpoint with JWT
- [ ] #104 - Add authentication middleware
- [ ] #105 - Add password reset flow
- [ ] #106 - Write authentication tests

## Acceptance Criteria
- [ ] Registration creates user and returns token
- [ ] Login validates credentials and returns token
- [ ] Invalid tokens return 401
- [ ] Passwords are hashed with bcrypt
- [ ] All endpoints have test coverage

## Technical Notes
- Using JWT with RS256 algorithm
- Tokens expire after 24 hours
- Refresh tokens stored in httpOnly cookies
- See RFC: docs/auth-design.md

## Out of Scope
- OAuth/social login (separate epic)
- Two-factor authentication (future)
- Session management
```

## Creating an Epic with gh CLI

### Basic Creation

```bash
gh issue create \
  --title "Epic: Implement User Authentication" \
  --body "## Overview
Add user authentication using JWT tokens.

## Goals
- [ ] User registration
- [ ] User login
- [ ] Protected routes

## Sub-Issues
<!-- To be added -->

## Acceptance Criteria
- [ ] All auth endpoints working
- [ ] Test coverage > 80%" \
  --label "epic"
```

### With Additional Options

```bash
gh issue create \
  --title "Epic: Implement User Authentication" \
  --body-file epic-template.md \
  --label "epic,priority:high" \
  --assignee "@me" \
  --milestone "v1.0" \
  --project "Development"
```

### Using a Template File

Create `epic-template.md`:
```markdown
## Overview
[Description]

## Goals
- [ ] Goal 1

## Sub-Issues
<!-- To be added -->

## Acceptance Criteria
- [ ] Criterion 1
```

Then:
```bash
gh issue create --title "Epic: Feature" --body-file epic-template.md --label "epic"
```

## Managing Epic Progress

### Update Sub-Issue Links

After creating sub-issues, edit the epic:

```bash
gh issue edit 100 --body "## Overview
...

## Sub-Issues
- [ ] #101 - Database schema
- [ ] #102 - Registration endpoint
- [ ] #103 - Login endpoint
..."
```

### Track Progress

```bash
# View epic with comments
gh issue view 100 --comments

# List all sub-issues (if labeled)
gh issue list --search "Parent: #100"

# Check epic status
gh issue status
```

### Close Epic

Only close when ALL sub-issues are complete:

```bash
# Verify all sub-issues closed
gh issue list --search "Parent: #100" --state open

# Close epic
gh issue close 100 --reason completed
```

## Epic Checklist

Before creating an epic:
- [ ] Work is clearly defined
- [ ] Work involves 2+ tasks
- [ ] Can identify distinct sub-issues
- [ ] Acceptance criteria are measurable

After creating an epic:
- [ ] Sub-issues are created and linked
- [ ] Epic body updated with sub-issue numbers
- [ ] Labels applied
- [ ] Assignee set (if known)

## Anti-Patterns

❌ **Too vague:**
```
Epic: Improve the app
```

✅ **Specific:**
```
Epic: Improve Dashboard Load Time to < 2s
```

---

❌ **Too large (split into multiple epics):**
```
Epic: Build entire e-commerce platform
```

✅ **Focused:**
```
Epic: Implement Shopping Cart
Epic: Implement Checkout Flow
Epic: Implement Order Management
```

---

❌ **No sub-issues:**
```
Epic: Add authentication
(no breakdown, just one big task)
```

✅ **Properly broken down:**
```
Epic: Add authentication
├── Sub: Database schema
├── Sub: Registration
├── Sub: Login
└── Sub: Tests
```
