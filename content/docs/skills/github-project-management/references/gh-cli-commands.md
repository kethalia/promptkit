---
title: "GitHub CLI Commands"
---
# GitHub CLI Commands

Complete reference for managing issues with the `gh` CLI.

## Setup

### Install gh CLI

```bash
# macOS
brew install gh

# Ubuntu/Debian
sudo apt install gh

# Windows
winget install GitHub.cli
```

### Authenticate

```bash
gh auth login
```

### Set Default Repository

```bash
# In a git repository
gh repo set-default

# Or specify
gh repo set-default owner/repo
```

## Creating Issues

### Basic Issue

```bash
gh issue create --title "Issue title" --body "Description"
```

### With All Options

```bash
gh issue create \
  --title "Epic: Feature Name" \
  --body "Issue description" \
  --label "epic,priority:high" \
  --assignee "username" \
  --assignee "@me" \
  --milestone "v1.0" \
  --project "Project Name"
```

### From File

```bash
gh issue create --title "Issue title" --body-file issue.md
```

### Interactive Mode

```bash
gh issue create
# Prompts for title, body, etc.
```

### Get Issue Number After Creation

```bash
# Returns issue number
ISSUE_NUM=$(gh issue create --title "Title" --body "Body" | grep -oP '#\K\d+')
echo "Created issue #$ISSUE_NUM"

# Or capture URL
ISSUE_URL=$(gh issue create --title "Title" --body "Body")
echo "Created: $ISSUE_URL"
```

## Creating Epics and Sub-Issues

### Create Epic

```bash
gh issue create \
  --title "Epic: User Authentication" \
  --body "## Overview
Implement user authentication with JWT.

## Sub-Issues
<!-- To be added -->

## Acceptance Criteria
- [ ] Users can register and login" \
  --label "epic"
```

### Create Sub-Issue

```bash
gh issue create \
  --title "Add registration endpoint" \
  --body "## Task
Create POST /api/auth/register.

## Done When
- [ ] Endpoint works

Parent: #100" \
  --label "sub-issue"
```

### Create Multiple Sub-Issues

```bash
#!/bin/bash
EPIC=100

for task in "Create users table" "Add registration" "Add login" "Write tests"; do
  gh issue create \
    --title "$task" \
    --body "## Task
$task

Parent: #$EPIC"
done
```

## Viewing Issues

### View Single Issue

```bash
# View in terminal
gh issue view 100

# View with comments
gh issue view 100 --comments

# View in browser
gh issue view 100 --web

# Output as JSON
gh issue view 100 --json title,body,state
```

### List Issues

```bash
# All open issues
gh issue list

# Include closed
gh issue list --state all

# Only closed
gh issue list --state closed

# With label
gh issue list --label "epic"

# Assigned to me
gh issue list --assignee "@me"

# Search
gh issue list --search "auth"

# Search for sub-issues of epic
gh issue list --search "Parent: #100"

# Limit results
gh issue list --limit 50

# JSON output
gh issue list --json number,title,state
```

### Filter Options

```bash
gh issue list \
  --state open \
  --label "epic" \
  --assignee "username" \
  --milestone "v1.0" \
  --search "keyword"
```

## Editing Issues

### Edit Title

```bash
gh issue edit 100 --title "New Title"
```

### Edit Body

```bash
gh issue edit 100 --body "New body content"

# From file
gh issue edit 100 --body-file updated-issue.md
```

### Add/Remove Labels

```bash
# Add labels
gh issue edit 100 --add-label "in-progress"

# Remove labels
gh issue edit 100 --remove-label "blocked"
```

### Change Assignee

```bash
# Add assignee
gh issue edit 100 --add-assignee "username"

# Remove assignee
gh issue edit 100 --remove-assignee "username"
```

### Set Milestone

```bash
gh issue edit 100 --milestone "v1.0"
```

### Add to Project

```bash
gh issue edit 100 --add-project "Project Name"
```

## Closing Issues

### Close Issue

```bash
gh issue close 100
```

### Close with Reason

```bash
gh issue close 100 --reason completed
gh issue close 100 --reason "not planned"
```

### Close with Comment

```bash
gh issue close 100 --comment "Completed in PR #150"
```

### Reopen Issue

```bash
gh issue reopen 100
```

## Comments

### Add Comment

```bash
gh issue comment 100 --body "Comment text"
```

### Add Comment from File

```bash
gh issue comment 100 --body-file comment.md
```

### Edit Last Comment

```bash
gh issue comment 100 --edit-last --body "Updated comment"
```

## Labels

### List Labels

```bash
gh label list
```

### Create Label

```bash
gh label create "epic" --description "Epic issue" --color "0052CC"
gh label create "sub-issue" --description "Sub-issue" --color "1D76DB"
gh label create "blocked" --description "Blocked by dependency" --color "D93F0B"
```

### Delete Label

```bash
gh label delete "old-label"
```

## Milestones

### List Milestones

```bash
gh api repos/{owner}/{repo}/milestones
```

### Create Milestone

```bash
gh api repos/{owner}/{repo}/milestones \
  -f title="v1.0" \
  -f description="Version 1.0 release" \
  -f due_on="2024-03-01T00:00:00Z"
```

## Useful Patterns

### Create Epic with Sub-Issues Script

```bash
#!/bin/bash
# create-epic.sh

EPIC_TITLE="$1"
shift
SUB_ISSUES=("$@")

# Create epic
echo "Creating epic: $EPIC_TITLE"
EPIC_URL=$(gh issue create \
  --title "Epic: $EPIC_TITLE" \
  --body "## Overview
$EPIC_TITLE

## Sub-Issues
<!-- See linked issues -->

## Acceptance Criteria
- [ ] All sub-issues complete" \
  --label "epic")

EPIC_NUM=$(echo "$EPIC_URL" | grep -oP '\d+$')
echo "Created epic #$EPIC_NUM"

# Create sub-issues
for task in "${SUB_ISSUES[@]}"; do
  echo "Creating sub-issue: $task"
  gh issue create \
    --title "$task" \
    --body "## Task
$task

## Done When
- [ ] Task complete

Parent: #$EPIC_NUM" \
    --label "sub-issue"
done

echo "Done! Epic: $EPIC_URL"
```

Usage:
```bash
./create-epic.sh "User Authentication" \
  "Create users table" \
  "Add registration endpoint" \
  "Add login endpoint" \
  "Write auth tests"
```

### List Sub-Issues for Epic

```bash
#!/bin/bash
# list-sub-issues.sh

EPIC=$1
echo "Sub-issues for Epic #$EPIC:"
gh issue list --search "Parent: #$EPIC" --json number,title,state \
  | jq -r '.[] | "#\(.number) [\(.state)] \(.title)"'
```

### Close All Sub-Issues

```bash
#!/bin/bash
# close-sub-issues.sh

EPIC=$1
gh issue list --search "Parent: #$EPIC" --state open --json number \
  | jq -r '.[].number' \
  | xargs -I {} gh issue close {}
```

### Epic Status Report

```bash
#!/bin/bash
# epic-status.sh

EPIC=$1
echo "=== Epic #$EPIC Status ==="
gh issue view $EPIC --json title,state | jq -r '"Title: \(.title)\nState: \(.state)"'

echo -e "\n=== Sub-Issues ==="
TOTAL=$(gh issue list --search "Parent: #$EPIC" --state all --json number | jq length)
OPEN=$(gh issue list --search "Parent: #$EPIC" --state open --json number | jq length)
CLOSED=$(gh issue list --search "Parent: #$EPIC" --state closed --json number | jq length)

echo "Total: $TOTAL | Open: $OPEN | Closed: $CLOSED"
echo "Progress: $CLOSED/$TOTAL complete"
```

## Quick Reference

| Action | Command |
|--------|---------|
| Create issue | `gh issue create -t "Title" -b "Body"` |
| View issue | `gh issue view 100` |
| List issues | `gh issue list` |
| List with label | `gh issue list -l "epic"` |
| Edit issue | `gh issue edit 100 -t "New Title"` |
| Add label | `gh issue edit 100 --add-label "label"` |
| Close issue | `gh issue close 100` |
| Comment | `gh issue comment 100 -b "Comment"` |
| Open in browser | `gh issue view 100 -w` |
