---
title: "Dependency Audit"
---
# Dependency Audit

Workflow for auditing third-party dependencies for security vulnerabilities.

## Why Dependency Auditing Matters

- 80%+ of modern applications are third-party code
- Vulnerabilities in dependencies affect your application
- Transitive dependencies (dependencies of dependencies) multiply risk
- Supply chain attacks are increasing

## Dependency Audit Process

### Step 1: Inventory Dependencies

**Generate dependency list:**

```bash
# JavaScript
npm list --all > dependencies.txt
npm list --prod --all  # Production only

# Python
pip freeze > requirements.txt
pip list --format=freeze

# Go
go list -m all

# Ruby
bundle list

# Java/Maven
mvn dependency:tree

# Rust
cargo tree
```

**Count dependencies:**
```bash
# JavaScript
npm list --all | wc -l

# Python
pip list | wc -l
```

### Step 2: Scan for Vulnerabilities

#### JavaScript/npm

```bash
# Built-in audit
npm audit

# With JSON output
npm audit --json

# Fix automatically where possible
npm audit fix

# Force fix (may include breaking changes)
npm audit fix --force

# Third-party tools
npx snyk test
npx retire
```

#### Python

```bash
# pip-audit (recommended)
pip-audit

# Safety
safety check
safety check -r requirements.txt

# With Snyk
snyk test

# Bandit for code + deps
bandit -r . -f json
```

#### Go

```bash
# Built-in vulnerability check (Go 1.18+)
govulncheck ./...

# With Snyk
snyk test
```

#### Ruby

```bash
# Bundler audit
bundle audit check --update

# With Snyk
snyk test
```

#### Java/Maven

```bash
# OWASP Dependency Check
mvn org.owasp:dependency-check-maven:check

# With Snyk
snyk test
```

#### Rust

```bash
# Cargo audit
cargo audit

# With advisory database update
cargo audit --deny warnings
```

#### Multi-language

```bash
# Snyk (supports many languages)
snyk test

# Trivy (containers + filesystems)
trivy fs .

# Grype
grype dir:.
```

### Step 3: Analyze Results

#### Understand Severity

| Severity | CVSS Score | Action |
|----------|------------|--------|
| Critical | 9.0 - 10.0 | Fix immediately |
| High | 7.0 - 8.9 | Fix within days |
| Medium | 4.0 - 6.9 | Fix within sprint |
| Low | 0.1 - 3.9 | Track and plan |

#### Evaluate Exploitability

Not all vulnerabilities are exploitable in your context:

```markdown
Questions to ask:
1. Is the vulnerable code path used?
2. Is the vulnerable feature enabled?
3. Is the vulnerability reachable from user input?
4. Does your environment mitigate the issue?
```

### Step 4: Remediate

#### Option 1: Update Dependency

```bash
# JavaScript - update specific package
npm update vulnerable-package
npm install vulnerable-package@latest

# JavaScript - update to specific safe version
npm install vulnerable-package@2.1.1

# Python
pip install --upgrade vulnerable-package

# Go
go get vulnerable-package@v1.2.3
```

#### Option 2: Use Resolution/Override

When transitive dependency is vulnerable:

```json
// package.json (npm)
{
  "overrides": {
    "vulnerable-package": "2.0.0"
  }
}

// package.json (yarn)
{
  "resolutions": {
    "vulnerable-package": "2.0.0"
  }
}
```

```toml
# pyproject.toml (pip)
[tool.pip-tools]
# Pin transitive dependency
vulnerable-package==2.0.0
```

#### Option 3: Replace Dependency

If no fix available:
1. Find alternative package
2. Evaluate alternatives for security
3. Plan migration
4. Remove vulnerable dependency

#### Option 4: Mitigate/Accept Risk

When update not possible:
1. Document the risk
2. Implement compensating controls
3. Monitor for exploits
4. Plan future remediation

```markdown
## Risk Acceptance: [Package Name]

**Vulnerability:** CVE-XXXX-XXXX
**Severity:** High
**Package:** example-pkg@1.0.0

**Reason for acceptance:**
- Vulnerable code path not reachable in our use case
- Breaking changes in fix would require major refactor
- Mitigated by: WAF rules, input validation

**Review date:** [Future date]
**Owner:** [Name]
```

### Step 5: Prevent Future Issues

#### Lock File Integrity

```bash
# JavaScript - use lockfile
npm ci  # Instead of npm install

# Python - pin versions
pip install -r requirements.txt --require-hashes

# Verify lockfile integrity
npm audit signatures
```

#### Automated Scanning

**GitHub Dependabot** (`.github/dependabot.yml`):
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
```

**CI Pipeline Integration:**
```yaml
# GitHub Actions
- name: Audit dependencies
  run: npm audit --audit-level=high

# Fail on vulnerabilities
- name: Security scan
  run: |
    npm audit --audit-level=critical
    if [ $? -ne 0 ]; then
      echo "Critical vulnerabilities found!"
      exit 1
    fi
```

## Audit Report Template

```markdown
# Dependency Security Audit Report

**Date:** [Date]
**Project:** [Project Name]
**Auditor:** [Name]

## Summary

| Severity | Count | Fixable | Unfixable |
|----------|-------|---------|-----------|
| Critical | X | X | X |
| High | X | X | X |
| Medium | X | X | X |
| Low | X | X | X |

## Dependency Statistics
- Total dependencies: XXX
- Direct dependencies: XX
- Transitive dependencies: XXX

## Critical Vulnerabilities

### CVE-XXXX-XXXX: [Title]
- **Package:** package-name@1.0.0
- **Severity:** Critical (CVSS: 9.8)
- **Description:** [Brief description]
- **Fix:** Upgrade to package-name@2.0.0
- **Status:** [ ] Fixed / [ ] In Progress / [ ] Accepted

### [Additional CVEs...]

## Recommendations

1. **Immediate:** Update [packages] to fix critical vulnerabilities
2. **Short-term:** Enable Dependabot for automated updates
3. **Long-term:** Reduce dependency count, review unused packages

## Action Items

| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|
| Update package-x | [Name] | [Date] | [ ] |
| Enable Dependabot | [Name] | [Date] | [ ] |
| Review transitive deps | [Name] | [Date] | [ ] |
```

## Best Practices

### Minimize Dependencies

```bash
# Audit for unused dependencies
npx depcheck

# Review before adding
# Ask: Do I really need this?
# Consider: Can I implement this simply?
```

### Verify Package Authenticity

```bash
# Check package provenance
npm audit signatures

# Verify checksums
pip hash check

# Use lock files
package-lock.json
yarn.lock
requirements.txt with hashes
```

### Monitor Continuously

- Enable GitHub Dependabot alerts
- Set up Snyk monitoring
- Subscribe to security advisories
- Regular audit schedule (weekly/monthly)

### Policy Guidelines

```markdown
## Dependency Policy

### Adding Dependencies
- [ ] Justified need documented
- [ ] Package actively maintained (commits in last 6 months)
- [ ] Package has reasonable download count
- [ ] No known critical/high vulnerabilities
- [ ] License compatible

### Vulnerability Response
- Critical: Fix within 24 hours
- High: Fix within 7 days
- Medium: Fix within 30 days
- Low: Fix within 90 days

### Exceptions
- Must be documented
- Must have compensating controls
- Must have review date
- Must be approved by security team
```

## Quick Reference Commands

```bash
# Quick audit
npm audit                    # JavaScript
pip-audit                    # Python
govulncheck ./...           # Go
bundle audit                # Ruby
cargo audit                 # Rust

# Update vulnerable packages
npm audit fix               # JavaScript
pip install --upgrade PKG   # Python

# Generate report
npm audit --json > audit.json
snyk test --json > snyk-report.json
```
