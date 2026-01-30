# Create GitHub Issues from Project Plan

Create structured GitHub issues organized as epics with digestible sub-issues that build incrementally on each other.

---

## Context

This prompt should be used after project documentation is complete. It translates the project plan into actionable GitHub issues organized hierarchically (epics → sub-issues).

## Prerequisites

Required information:
- Project documentation (README, ARCHITECTURE, component docs)
- GitHub repository initialized
- `gh` CLI installed and authenticated
- Clear understanding of project features and scope

## Instructions

### Phase 1: Identify Epics

Analyze the project documentation and identify major feature areas or workstreams that should be epics. Common epic categories:

**For Full-Stack Applications:**
- Project Setup & Infrastructure
- Database Schema & Models
- Authentication & Authorization
- Backend API Development
- Frontend UI Components
- Integration & Data Flow
- Testing & Quality Assurance
- Deployment & DevOps
- Documentation & Developer Experience

**For Web3/Blockchain Projects:**
- Project Setup & Infrastructure
- Smart Contract Development
- Smart Contract Testing & Security
- Backend/API Integration
- Frontend dApp Interface
- Wallet Integration
- Blockchain Deployment
- Testing & Auditing
- Documentation

**For CLI Tools:**
- Project Setup
- Core Command Framework
- Individual Commands
- Configuration System
- Testing
- Distribution & Packaging
- Documentation

### Phase 2: Break Down Epics into Sub-Issues

For each epic, create 3-10 sub-issues that:
1. Are small enough to complete in 1-3 days
2. Build incrementally on previous issues
3. Have clear acceptance criteria
4. Can be worked on somewhat independently
5. Follow a logical progression

**Key Principles:**
- Start with foundational work (setup, models, types)
- Progress to core functionality
- End with polish and edge cases
- Each issue should be testable/verifiable
- Avoid issues that are too large or vague

### Phase 3: Create Issues in GitHub

Use `gh` CLI to create issues in the following order:

```bash
# 1. Create Epic #1
gh issue create --title "Epic: [Name]" --body "[description]" --label "epic"

# 2. Create all sub-issues for Epic #1
gh issue create --title "[Sub-issue]" --body "[description]\n\nPart of #1" --label "feature"
gh issue create --title "[Sub-issue]" --body "[description]\n\nPart of #1" --label "feature"
# ... continue for all sub-issues

# 3. Create Epic #2
gh issue create --title "Epic: [Name]" --body "[description]" --label "epic"

# 4. Create all sub-issues for Epic #2
# ... and so on
```

### Phase 4: Issue Template Structure

Each issue should include:

**Epic Issue Template:**
```markdown
# Epic: [Epic Name]

## Overview
Brief description of this epic and its goals.

## Scope
High-level list of what this epic encompasses:
- Feature area 1
- Feature area 2
- Feature area 3

## Success Criteria
- [ ] All sub-issues completed
- [ ] Integration tests passing
- [ ] Documentation updated
- [ ] Code reviewed and merged

## Sub-Issues
Will be created as separate issues and linked here:
- #X - [Sub-issue title]
- #Y - [Sub-issue title]
- ...

## Dependencies
- Depends on: #Z (if applicable)
- Blocks: #A (if applicable)

## Estimated Timeline
[X weeks/sprints]

## Notes
Any additional context or considerations.
```

**Sub-Issue Template:**
```markdown
# [Specific, actionable title]

## Part of Epic
#[Epic number] - [Epic title]

## Description
Clear description of what needs to be built/changed.

## Acceptance Criteria
- [ ] Specific, testable criterion 1
- [ ] Specific, testable criterion 2
- [ ] Specific, testable criterion 3
- [ ] Tests written and passing
- [ ] Code reviewed

## Technical Details
- Files to create/modify: `path/to/file.ts`
- Key functions/components: `ComponentName`, `functionName`
- APIs/endpoints: `POST /api/resource`
- Database changes: tables, columns, indexes

## Dependencies
- Requires: #X to be completed first
- Blocks: #Y cannot start until this is done

## Testing Checklist
- [ ] Unit tests added
- [ ] Integration tests added (if applicable)
- [ ] Manual testing completed
- [ ] Edge cases covered

## Implementation Notes
- Use existing pattern from `path/to/example.ts`
- Follow authentication middleware pattern
- Reuse utility function `helperName`

## Estimated Effort
[Small (< 1 day) / Medium (1-2 days) / Large (2-3 days)]
```

### Phase 5: Ordering and Dependencies

Create issues so that:
1. Foundation work comes first (setup, configuration)
2. Dependencies are clear and referenced
3. Each epic is self-contained when possible
4. Sub-issues within an epic build on each other
5. Later epics can reference earlier epic completion

## Example Epic Breakdown

### Epic #1: Project Setup & Infrastructure

**Sub-issues:**
1. Initialize project with TypeScript, ESLint, and Prettier
2. Set up development database (PostgreSQL) with Docker
3. Configure environment variables and .env files
4. Create base project structure (folders, barrel exports)
5. Set up testing framework (Jest) with example test
6. Configure CI/CD pipeline (GitHub Actions)
7. Set up pre-commit hooks with Husky

### Epic #2: Database Schema & Models

**Sub-issues:**
1. Design and document database schema
2. Set up migration system (Prisma/TypeORM/Knex)
3. Create User model and migration
4. Create Product model and migration
5. Create Order model with relationships
6. Add database indexes for performance
7. Create seed data for development
8. Write model unit tests

### Epic #3: Authentication & Authorization

**Sub-issues:**
1. Implement JWT token generation and validation
2. Create user registration endpoint
3. Create user login endpoint
4. Implement password hashing with bcrypt
5. Create authentication middleware
6. Implement role-based access control (RBAC)
7. Add refresh token mechanism
8. Create password reset flow
9. Write authentication integration tests

### Epic #4: Backend API - User Management

**Sub-issues:**
1. Create GET /users endpoint (list with pagination)
2. Create GET /users/:id endpoint (get single user)
3. Create PUT /users/:id endpoint (update user)
4. Create DELETE /users/:id endpoint (soft delete)
5. Add input validation with Zod/Joi
6. Implement user search and filtering
7. Add API documentation with Swagger
8. Write API integration tests

## Output Format

```markdown
# GitHub Issues Creation Plan

## Summary
- Total Epics: 8
- Total Sub-Issues: 47
- Estimated Timeline: 12 weeks

## Epic Overview

### Epic #1: Project Setup & Infrastructure (7 issues)
Setup development environment, tooling, and CI/CD

**Sub-issues:**
1. #2 - Initialize project with TypeScript, ESLint, and Prettier
2. #3 - Set up development database with Docker
3. #4 - Configure environment variables
4. #5 - Create base project structure
5. #6 - Set up testing framework
6. #7 - Configure CI/CD pipeline
7. #8 - Set up pre-commit hooks

### Epic #9: Database Schema & Models (8 issues)
Design and implement database schema with migrations

**Sub-issues:**
1. #10 - Design and document database schema
2. #11 - Set up migration system
3. #12 - Create User model and migration
4. #13 - Create Product model and migration
... (continue for all epics)

---

## Creation Order

Issues will be created in the following order:
1. Create Epic #1
2. Create issues #2-#8 (Epic #1 sub-issues)
3. Create Epic #9
4. Create issues #10-#17 (Epic #9 sub-issues)
5. Create Epic #18
6. Create issues #19-#27 (Epic #18 sub-issues)
... (continue)

---

Ready to create issues? (yes/no)
```

## Interactive Flow

1. **Analyze documentation** - Review project docs to understand scope
2. **Propose epic structure** - Present epic breakdown to user
3. **Get approval** - Confirm epic organization makes sense
4. **Detail first epic** - Show detailed sub-issues for first epic
5. **Iterate** - Get feedback and adjust
6. **Create issues** - Once approved, create all issues in GitHub
7. **Summarize** - Show issue numbers and links created

## Issue Labels

Use appropriate labels for categorization:
- `epic` - For epic issues
- `feature` - For feature development sub-issues
- `setup` - For setup/infrastructure tasks
- `documentation` - For documentation tasks
- `testing` - For testing-related tasks
- `bug` - For bug fixes (if creating from known issues)
- `enhancement` - For improvements to existing features
- `good-first-issue` - For beginner-friendly issues
- `help-wanted` - For issues where help is needed

## Estimated Effort Labels

- `size/xs` - < 4 hours
- `size/s` - 4-8 hours (1 day)
- `size/m` - 1-2 days
- `size/l` - 3-5 days
- `size/xl` - 1+ week (should be broken down further)

## Best Practices

1. **Keep issues atomic** - Each issue should accomplish one clear thing
2. **Make acceptance criteria specific** - Should be obvious when done
3. **Link related issues** - Use "Part of #X", "Depends on #Y", "Blocks #Z"
4. **Include technical details** - File paths, function names, patterns to follow
5. **Provide context** - Why is this needed? How does it fit in the bigger picture?
6. **Add examples** - Link to similar implementations or patterns
7. **Consider the developer** - Write issues you'd want to work on yourself

## Example GitHub CLI Commands

```bash
# Create an epic
gh issue create \
  --title "Epic: Authentication & Authorization" \
  --body "$(cat epic-template.md)" \
  --label "epic" \
  --label "priority/high"

# Create a sub-issue
gh issue create \
  --title "Implement JWT token generation and validation" \
  --body "$(cat issue-jwt.md)" \
  --label "feature" \
  --label "size/m" \
  --assignee "@me"

# Create issue with milestone
gh issue create \
  --title "Create user registration endpoint" \
  --body "Description here" \
  --label "feature" \
  --milestone "v1.0"
```

## Post-Creation Tasks

After creating all issues:
1. **Review issue board** - Ensure logical flow
2. **Add to project board** - Organize in GitHub Projects (if using)
3. **Assign priorities** - Mark critical path items
4. **Set milestones** - Group issues into releases
5. **Assign initial issues** - If team is ready to start
6. **Create roadmap** - Document timeline in project README

---

## Notes

- Issues can be created in batches - don't need to do all at once
- Adjust epic scope based on team size and timeline
- Some sub-issues may spawn additional issues during implementation
- Keep epics focused - better to have more small epics than few large ones
- Reference actual code examples where they exist
- Update issue relationships as work progresses
