---
title: "Sub-Issues"
---
# Sub-Issues

Guide to creating compact, digestible sub-issues that are easy to understand and complete.

## Sub-Issue Principles

### 1. Compact
- One clear task per issue
- Completable in 1-4 hours ideally
- No more than 1 day of work

### 2. Digestible
- Readable in 30 seconds
- Clear what "done" means
- No ambiguity

### 3. Self-Contained
- All context needed is in the issue
- Links to parent epic for broader context
- No hunting for information

## Sub-Issue Structure

### Title Format

```
[Action Verb] [Specific Thing]
```

**Good titles:**
- `Add user registration endpoint`
- `Create users database table`
- `Write tests for auth middleware`
- `Fix password validation bug`

**Bad titles:**
- `Authentication stuff`
- `Work on the feature`
- `Updates`
- `Part 2`

### Body Structure (Minimal)

```markdown
## Task
[1-2 sentences: exactly what to do]

## Details
- [Specific detail 1]
- [Specific detail 2]

## Done When
- [ ] [Specific, verifiable criterion]

Parent: #[epic-number]
```

### Body Structure (With More Context)

```markdown
## Task
[1-2 sentences: exactly what to do]

## Context
[Why this is needed - brief]

## Details
- [Specific requirement 1]
- [Specific requirement 2]
- [Specific requirement 3]

## Files to Modify
- `src/routes/auth.ts`
- `src/models/user.ts`

## Done When
- [ ] [Criterion 1]
- [ ] [Criterion 2]

## Notes
[Edge cases, gotchas, links]

Parent: #[epic-number]
```

## Examples

### Good Sub-Issue

```markdown
# Add user registration endpoint

## Task
Create POST /api/auth/register endpoint that accepts email and password, creates a user, and returns a JWT token.

## Details
- Validate email format
- Require password minimum 8 characters
- Hash password with bcrypt (cost 12)
- Return JWT token on success
- Return 400 for validation errors
- Return 409 if email exists

## Done When
- [ ] Endpoint accepts POST with email/password
- [ ] Validation errors return 400 with message
- [ ] Duplicate email returns 409
- [ ] Success returns 201 with JWT token
- [ ] Password is hashed in database

Parent: #100
```

### Bad Sub-Issue (Too Vague)

```markdown
# Work on registration

Do the registration thing for users.

Parent: #100
```

### Bad Sub-Issue (Too Large)

```markdown
# Implement all authentication

- Create database tables
- Add registration
- Add login
- Add password reset
- Add middleware
- Write all tests
- Update documentation

Parent: #100
```
This should be the **epic**, not a sub-issue!

## Sizing Sub-Issues

### Right Size (1-4 hours)

| Task | Appropriate? |
|------|--------------|
| Create one API endpoint | ✅ Yes |
| Add one database table | ✅ Yes |
| Write tests for one module | ✅ Yes |
| Fix a specific bug | ✅ Yes |
| Add a single UI component | ✅ Yes |

### Too Large (Split Further)

| Task | Split Into |
|------|------------|
| "Add all API endpoints" | One issue per endpoint |
| "Write all tests" | One issue per module |
| "Build the UI" | One issue per component/page |
| "Set up infrastructure" | One issue per service |

### Too Small (Combine or Skip)

| Task | Action |
|------|--------|
| "Fix typo in comment" | Just do it, no issue |
| "Add one import" | Part of larger task |
| "Rename variable" | Part of larger task |

## Creating Sub-Issues with gh CLI

### Single Sub-Issue

```bash
gh issue create \
  --title "Add user registration endpoint" \
  --body "## Task
Create POST /api/auth/register endpoint.

## Details
- Validate email/password
- Hash password with bcrypt
- Return JWT on success

## Done When
- [ ] Endpoint works as specified
- [ ] Validation errors handled

Parent: #100" \
  --label "sub-issue"
```

### Multiple Sub-Issues (Script)

```bash
#!/bin/bash
EPIC=100

# Sub-issue 1
gh issue create \
  --title "Create users database table" \
  --body "## Task
Create users table with id, email, password_hash, created_at.

## Done When
- [ ] Migration file created
- [ ] Table exists in database

Parent: #$EPIC"

# Sub-issue 2
gh issue create \
  --title "Add user registration endpoint" \
  --body "## Task
Create POST /api/auth/register endpoint.

## Done When
- [ ] Endpoint creates user
- [ ] Returns JWT token

Parent: #$EPIC"

# Sub-issue 3
gh issue create \
  --title "Add login endpoint" \
  --body "## Task
Create POST /api/auth/login endpoint.

## Done When
- [ ] Validates credentials
- [ ] Returns JWT token

Parent: #$EPIC"
```

### Batch Creation Pattern

```bash
# Create multiple sub-issues for an epic
EPIC_NUM=100

create_sub() {
  local title="$1"
  local task="$2"
  local done="$3"
  
  gh issue create \
    --title "$title" \
    --body "## Task
$task

## Done When
- [ ] $done

Parent: #$EPIC_NUM"
}

create_sub "Create users table" \
  "Add users table with email, password_hash, timestamps." \
  "Migration runs successfully"

create_sub "Add registration endpoint" \
  "POST /api/auth/register creates user and returns token." \
  "Endpoint works with valid input"

create_sub "Add login endpoint" \
  "POST /api/auth/login validates and returns token." \
  "Endpoint authenticates correctly"
```

## Linking to Epic

**Always include parent reference:**

```markdown
Parent: #100
```

Or in the body:
```markdown
## Related
- Epic: #100
```

This allows:
- Easy navigation to epic
- Searchability: `gh issue list --search "Parent: #100"`
- Context for anyone viewing the sub-issue

## Sub-Issue Checklist

Before creating:
- [ ] Task is single, clear action
- [ ] Completable in 1-4 hours
- [ ] "Done When" is specific and verifiable
- [ ] Parent epic number is known

Content includes:
- [ ] Clear title with action verb
- [ ] 1-2 sentence task description
- [ ] Specific details/requirements
- [ ] Done criteria as checkboxes
- [ ] Parent epic reference

## Quick Reference

### Title Patterns

```
Add [thing]
Create [thing]
Implement [feature]
Fix [bug description]
Update [thing] to [new state]
Remove [thing]
Refactor [thing]
Write tests for [thing]
Document [thing]
```

### Done When Patterns

```
- [ ] [Thing] exists and works
- [ ] [Endpoint] returns correct response
- [ ] [Test] passes
- [ ] [Feature] handles edge case
- [ ] [Code] has no linter errors
- [ ] [Documentation] is updated
```
