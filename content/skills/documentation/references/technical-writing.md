# Technical Writing

Guide to writing architecture documents, design docs, and technical specifications.

## Document Types

| Type | Purpose | Audience | Length |
|------|---------|----------|--------|
| RFC/Design Doc | Propose solutions | Engineers | 5-20 pages |
| Architecture Doc | System overview | Team + stakeholders | 10-30 pages |
| ADR | Record decisions | Future developers | 1-2 pages |
| Runbook | Operational procedures | On-call engineers | 2-5 pages |
| Post-mortem | Learn from incidents | Team | 2-5 pages |

## Design Document Template

```markdown
# [Project/Feature Name] Design Document

**Author:** [Name]
**Reviewers:** [Names]
**Status:** Draft | In Review | Approved | Implemented
**Last Updated:** [Date]

## Overview

### Problem Statement
[What problem are we solving? Why does it matter?]

### Goals
- [Goal 1]
- [Goal 2]

### Non-Goals
- [Explicitly out of scope item 1]
- [Explicitly out of scope item 2]

## Background

[Context needed to understand this document. Link to related docs.]

## Proposed Solution

### High-Level Design

[Diagrams and explanation of the overall approach]

```
┌─────────────┐     ┌─────────────┐
│   Client    │────▶│    API      │
└─────────────┘     └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   Service   │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │  Database   │
                    └─────────────┘
```

### Detailed Design

#### Component 1: [Name]
[Detailed explanation]

#### Component 2: [Name]
[Detailed explanation]

### API Design

```
POST /api/v1/resource
Content-Type: application/json

{
  "field1": "value",
  "field2": 123
}

Response: 201 Created
{
  "id": "abc123",
  "field1": "value",
  "field2": 123,
  "createdAt": "2024-01-15T10:30:00Z"
}
```

### Data Model

```sql
CREATE TABLE resources (
    id UUID PRIMARY KEY,
    field1 VARCHAR(255) NOT NULL,
    field2 INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

## Alternatives Considered

### Alternative 1: [Name]
**Description:** [What is it?]
**Pros:**
- [Advantage]
**Cons:**
- [Disadvantage]
**Why not chosen:** [Reason]

### Alternative 2: [Name]
[Same structure]

## Security Considerations

- [Authentication/authorization approach]
- [Data encryption]
- [Potential vulnerabilities and mitigations]

## Privacy Considerations

- [PII handling]
- [Data retention]
- [GDPR/compliance requirements]

## Testing Strategy

- Unit tests for [components]
- Integration tests for [flows]
- Load testing for [scenarios]

## Rollout Plan

### Phase 1: [Name]
- [Tasks]
- [Success criteria]

### Phase 2: [Name]
- [Tasks]
- [Success criteria]

### Rollback Plan
[How to revert if issues arise]

## Monitoring and Alerting

- [Metrics to track]
- [Alert thresholds]
- [Dashboards]

## Open Questions

- [ ] [Question 1]
- [ ] [Question 2]

## References

- [Link to related doc]
- [Link to external resource]
```

## Architecture Decision Record (ADR)

```markdown
# ADR-001: [Title]

## Status
Proposed | Accepted | Deprecated | Superseded by ADR-XXX

## Date
[YYYY-MM-DD]

## Context
[What is the issue that we're seeing that is motivating this decision?]

## Decision
[What is the change that we're proposing and/or doing?]

## Consequences

### Positive
- [Benefit 1]
- [Benefit 2]

### Negative
- [Drawback 1]
- [Drawback 2]

### Neutral
- [Observation]

## Alternatives Considered
- [Alternative 1]: Rejected because [reason]
- [Alternative 2]: Rejected because [reason]
```

## Runbook Template

```markdown
# [Service/Process Name] Runbook

## Overview
[Brief description of the service and its purpose]

## Architecture
[Simple diagram showing components and dependencies]

## Common Operations

### Deploying
```bash
# Steps to deploy
./deploy.sh production
```

### Restarting
```bash
# Steps to restart
kubectl rollout restart deployment/service-name
```

### Scaling
```bash
# How to scale up/down
kubectl scale deployment/service-name --replicas=5
```

## Troubleshooting

### Alert: High Error Rate
**Symptoms:** Error rate > 1%
**Likely Causes:**
1. Database connection issues
2. Downstream service failure
3. Invalid input data

**Resolution Steps:**
1. Check database connectivity: `./scripts/check-db.sh`
2. Verify downstream services: `curl https://downstream/health`
3. Check recent deployments: `kubectl rollout history`

### Alert: High Latency
[Similar structure]

## Contacts
- **Team:** #team-channel
- **On-call:** [Link to PagerDuty]
- **Escalation:** [Names/contacts]

## Related Documentation
- [Architecture doc]
- [API documentation]
- [Monitoring dashboard]
```

## Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date:** [YYYY-MM-DD]
**Duration:** [Start time] - [End time] ([X] hours)
**Severity:** P1 | P2 | P3 | P4
**Author:** [Name]
**Status:** Draft | Final

## Summary
[1-2 sentence summary of what happened and impact]

## Impact
- **Users Affected:** [Number or percentage]
- **Revenue Impact:** [If applicable]
- **Duration:** [How long users were affected]

## Timeline (All times in UTC)

| Time | Event |
|------|-------|
| 14:00 | Deployment started |
| 14:05 | Alerts fired for increased errors |
| 14:10 | On-call engineer paged |
| 14:15 | Investigation started |
| 14:30 | Root cause identified |
| 14:35 | Rollback initiated |
| 14:40 | Service restored |

## Root Cause
[Detailed explanation of what caused the incident]

## Contributing Factors
- [Factor 1 that made things worse or delayed resolution]
- [Factor 2]

## What Went Well
- [Positive aspect of the response]
- [Something that worked as intended]

## What Went Poorly
- [Aspect that could be improved]
- [Gap in process or tooling]

## Action Items

| Action | Owner | Priority | Due Date | Status |
|--------|-------|----------|----------|--------|
| Add monitoring for X | @name | P1 | 2024-01-20 | In Progress |
| Update runbook for Y | @name | P2 | 2024-01-25 | Not Started |
| Review deployment process | @name | P2 | 2024-01-30 | Not Started |

## Lessons Learned
[Key takeaways for the team and organization]

## Appendix
- [Links to relevant logs]
- [Screenshots or data]
```

## Writing Tips

### Be Concise

```markdown
❌ Bad:
"In order to facilitate the implementation of this feature, 
we will need to utilize a database solution that provides 
the capability to store and retrieve data in a manner that 
is both efficient and scalable."

✅ Good:
"We'll use PostgreSQL for efficient, scalable data storage."
```

### Use Active Voice

```markdown
❌ Passive: "The data will be processed by the service."
✅ Active: "The service processes the data."

❌ Passive: "Errors are handled by the middleware."
✅ Active: "The middleware handles errors."
```

### Include Diagrams

Use ASCII diagrams for simple cases:
```
┌─────┐    ┌─────┐    ┌─────┐
│  A  │───▶│  B  │───▶│  C  │
└─────┘    └─────┘    └─────┘
```

Or reference external diagrams:
```markdown
![Architecture Diagram](./diagrams/architecture.png)

See [Mermaid diagram](./architecture.mmd) for the system overview.
```

### Structure for Skimming

- Use headers liberally
- Keep paragraphs short (3-5 sentences)
- Use bullet points for lists
- Bold key terms
- Include a TL;DR or summary section

## Documentation Checklist

```markdown
### Before Writing
- [ ] Identified target audience
- [ ] Determined document type
- [ ] Gathered necessary information
- [ ] Created outline

### Content
- [ ] Clear problem statement
- [ ] Goals and non-goals defined
- [ ] Alternatives considered
- [ ] Trade-offs discussed
- [ ] Diagrams included

### Review
- [ ] Spell-checked
- [ ] Links verified
- [ ] Diagrams render correctly
- [ ] Reviewed by stakeholders
- [ ] Feedback incorporated

### Maintenance
- [ ] Document location documented
- [ ] Update process defined
- [ ] Ownership assigned
```
