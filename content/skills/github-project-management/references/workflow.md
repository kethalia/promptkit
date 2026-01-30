# Project Planning Workflow

Step-by-step workflow for breaking down work into epics and sub-issues.

## The Golden Rule

> **Any work involving 2+ distinct tasks gets an epic with sub-issues. No exceptions.**

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  1. IDENTIFY WORK                                           │
│     "What needs to be done?"                                │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  2. ASSESS SIZE                                             │
│     Single task (< 2 hrs)? → Regular Issue                  │
│     Multiple tasks?        → Epic + Sub-Issues              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  3. BREAK DOWN                                              │
│     List ALL distinct tasks                                 │
│     Each task = 1-4 hours                                   │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  4. CREATE EPIC                                             │
│     Overview, goals, acceptance criteria                    │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  5. CREATE SUB-ISSUES                                       │
│     One per task, linked to epic                            │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│  6. EXECUTE                                                 │
│     Work sub-issues, close when done                        │
│     Close epic when all sub-issues complete                 │
└─────────────────────────────────────────────────────────────┘
```

## Step 1: Identify Work

Ask yourself:
- What is the end goal?
- What problem does this solve?
- What does "done" look like?

**Example:**
> "We need to add user authentication so users can have accounts."

## Step 2: Assess Size

| Question | If Yes | If No |
|----------|--------|-------|
| Will this take > 2 hours? | → Epic | → Maybe regular issue |
| Are there 2+ distinct tasks? | → Epic | → Regular issue |
| Will multiple files change? | → Likely epic | → Consider |
| Could someone else help? | → Epic | → Consider |

**Example:**
> User authentication = database changes + registration + login + tests = **Definitely an epic**

## Step 3: Break Down into Tasks

### Technique: Task Decomposition

List everything that needs to happen:

```
User Authentication
├── Database: Create users table
├── API: Registration endpoint  
├── API: Login endpoint
├── API: Password reset endpoint
├── Security: JWT token handling
├── Middleware: Auth middleware
├── Tests: Auth endpoint tests
└── Docs: API documentation
```

### Validate Each Task

For each task, verify:
- [ ] Single, clear objective
- [ ] Completable in 1-4 hours
- [ ] Can define "done" clearly
- [ ] Independent enough to track separately

### Merge or Split

**Too small?** Combine:
```
❌ "Add email field"
❌ "Add password field"
✅ "Create users table with email, password_hash, timestamps"
```

**Too large?** Split:
```
❌ "Build entire admin dashboard"
✅ "Create admin layout component"
✅ "Add user management page"
✅ "Add settings page"
```

## Step 4: Create the Epic

### Template

```markdown
## Overview
[1-2 sentences: What and why]

## Goals
- [ ] Goal 1
- [ ] Goal 2

## Sub-Issues
<!-- Will be updated after creating sub-issues -->
- [ ] #___ - Task 1
- [ ] #___ - Task 2

## Acceptance Criteria
- [ ] Specific measurable criterion
- [ ] Another criterion

## Notes
[Technical context, links, decisions]
```

### Command

```bash
gh issue create \
  --title "Epic: User Authentication" \
  --body "[epic body from template]" \
  --label "epic"
```

**Note the issue number!** (e.g., #100)

## Step 5: Create Sub-Issues

### For Each Task

```bash
gh issue create \
  --title "[Task title]" \
  --body "## Task
[What to do]

## Done When
- [ ] [Specific criterion]

Parent: #100"
```

### Example Sequence

```bash
# Task 1
gh issue create --title "Create users database table" \
  --body "## Task
Create users table with: id, email, password_hash, created_at, updated_at.

## Done When
- [ ] Migration file exists
- [ ] Migration runs successfully

Parent: #100"

# Task 2
gh issue create --title "Add registration endpoint" \
  --body "## Task
POST /api/auth/register - accepts email/password, creates user, returns JWT.

## Done When
- [ ] Endpoint creates user
- [ ] Returns JWT on success
- [ ] Returns 400 on invalid input
- [ ] Returns 409 on duplicate email

Parent: #100"

# Continue for all tasks...
```

### Update Epic

After creating sub-issues, update the epic body:

```bash
gh issue edit 100 --body "## Overview
Add user authentication with JWT tokens.

## Goals
- [ ] Users can register
- [ ] Users can login
- [ ] Protected routes work

## Sub-Issues
- [ ] #101 - Create users database table
- [ ] #102 - Add registration endpoint
- [ ] #103 - Add login endpoint
- [ ] #104 - Add auth middleware
- [ ] #105 - Write auth tests

## Acceptance Criteria
- [ ] All endpoints working
- [ ] Test coverage > 80%"
```

## Step 6: Execute

### Working on Sub-Issues

1. Pick a sub-issue
2. Assign yourself: `gh issue edit 101 --add-assignee "@me"`
3. Add label: `gh issue edit 101 --add-label "in-progress"`
4. Do the work
5. Close: `gh issue close 101 --comment "Completed in commit abc123"`

### Tracking Progress

```bash
# Check epic status
gh issue view 100

# List remaining sub-issues
gh issue list --search "Parent: #100" --state open

# Count progress
TOTAL=$(gh issue list --search "Parent: #100" --state all --json number | jq length)
DONE=$(gh issue list --search "Parent: #100" --state closed --json number | jq length)
echo "$DONE / $TOTAL complete"
```

### Closing the Epic

Only when ALL sub-issues are complete:

```bash
# Verify
gh issue list --search "Parent: #100" --state open
# Should return empty

# Close epic
gh issue close 100 --comment "All sub-issues complete. Feature shipped!"
```

## Complete Example

### Scenario
"Add a user profile page to our app"

### Step 1-2: Identify and Assess
- Multiple components needed
- Frontend + backend work
- Will take > 2 hours
- **→ Create epic**

### Step 3: Break Down

```
Profile Feature
├── API: GET /api/users/:id endpoint
├── API: PATCH /api/users/:id endpoint
├── UI: Profile page component
├── UI: Edit profile form
├── UI: Avatar upload
└── Tests: Profile API tests
```

### Step 4: Create Epic

```bash
gh issue create \
  --title "Epic: User Profile Page" \
  --body "## Overview
Add user profile page where users can view and edit their profile information.

## Goals
- [ ] Users can view their profile
- [ ] Users can edit profile info
- [ ] Users can upload avatar

## Sub-Issues
<!-- To be added -->

## Acceptance Criteria
- [ ] Profile page loads user data
- [ ] Edit form updates user
- [ ] Avatar uploads and displays
- [ ] Tests pass" \
  --label "epic"
# Returns #200
```

### Step 5: Create Sub-Issues

```bash
EPIC=200

gh issue create --title "Add GET /api/users/:id endpoint" \
  --body "## Task
Create endpoint to fetch user profile by ID.

## Done When
- [ ] Returns user data (excluding password)
- [ ] Returns 404 if not found

Parent: #$EPIC"
# Returns #201

gh issue create --title "Add PATCH /api/users/:id endpoint" \
  --body "## Task
Create endpoint to update user profile.

## Done When
- [ ] Updates allowed fields
- [ ] Returns updated user
- [ ] Validates input

Parent: #$EPIC"
# Returns #202

# ... continue for all tasks

# Update epic with sub-issue numbers
gh issue edit 200 --body "## Overview
Add user profile page...

## Sub-Issues
- [ ] #201 - Add GET /api/users/:id endpoint
- [ ] #202 - Add PATCH /api/users/:id endpoint
- [ ] #203 - Create profile page component
- [ ] #204 - Create edit profile form
- [ ] #205 - Add avatar upload
- [ ] #206 - Write profile API tests

## Acceptance Criteria
..."
```

### Step 6: Execute

Work through sub-issues, close each, then close epic.

## Checklist

### Before Starting Work
- [ ] Epic exists for multi-task work
- [ ] All tasks are sub-issues
- [ ] Sub-issues linked to epic
- [ ] Epic updated with sub-issue numbers

### During Work
- [ ] Working on one sub-issue at a time
- [ ] Sub-issues marked in-progress
- [ ] Closing sub-issues when done

### After Completion
- [ ] All sub-issues closed
- [ ] Epic closed
- [ ] Any learnings documented
