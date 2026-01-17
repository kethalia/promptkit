# Security Audit

Comprehensive security review identifying vulnerabilities, misconfigurations, and compliance gaps.

---

## Context

Gather before starting:
- Application type (web, API, CLI, library)
- Technology stack and frameworks
- Authentication mechanisms in use
- Data sensitivity level
- Previous security assessments if available
- Compliance requirements (PCI-DSS, HIPAA, SOC2, etc.)

## Instructions

1. **Map the attack surface**
   - Identify all entry points (routes, APIs, file uploads, user inputs)
   - Document data flows and trust boundaries
   - List external integrations and third-party services

2. **Authentication review**
   - Verify password policies and hashing (bcrypt, argon2, scrypt)
   - Check session management (secure cookies, expiration, rotation)
   - Review multi-factor authentication implementation
   - Assess account lockout and brute-force protections
   - Validate password reset and recovery flows

3. **Authorization review**
   - Check access control at every endpoint
   - Verify role-based or attribute-based access controls
   - Test for privilege escalation paths
   - Review object-level authorization (IDOR vulnerabilities)
   - Validate API authorization tokens and scopes

4. **Input validation audit**
   - Check all user inputs for validation and sanitization
   - Identify SQL/NoSQL injection points
   - Find command injection vulnerabilities
   - Check for LDAP, XML, XPath injection
   - Review file upload handling and validation
   - Assess path traversal risks

5. **Output encoding review**
   - Identify XSS vulnerabilities (reflected, stored, DOM-based)
   - Check Content-Type headers and encoding
   - Review template rendering for auto-escaping
   - Validate JSON/XML output encoding

6. **Secrets management audit**
   - Scan for hardcoded credentials, API keys, tokens
   - Verify secrets are loaded from secure storage
   - Check for secrets in logs, error messages, URLs
   - Review .env files and configuration management
   - Validate secrets rotation procedures

7. **Error handling and logging review**
   - Check for information leakage in error messages
   - Verify stack traces are not exposed to users
   - Review logging for sensitive data exposure
   - Assess log injection vulnerabilities
   - Validate audit trail completeness

8. **CSRF and security headers**
   - Verify CSRF token implementation
   - Check security headers (CSP, X-Frame-Options, HSTS, etc.)
   - Review CORS configuration
   - Validate cookie security attributes

9. **Cryptography review**
   - Check TLS configuration and certificate validity
   - Verify encryption algorithms are current (no MD5, SHA1, DES)
   - Review key management practices
   - Assess data-at-rest encryption

10. **Insecure deserialization check**
    - Identify deserialization of untrusted data
    - Review object serialization libraries for known vulnerabilities
    - Check for type confusion vulnerabilities

11. **Cross-reference OWASP Top 10**
    - A01: Broken Access Control
    - A02: Cryptographic Failures
    - A03: Injection
    - A04: Insecure Design
    - A05: Security Misconfiguration
    - A06: Vulnerable Components
    - A07: Authentication Failures
    - A08: Data Integrity Failures
    - A09: Logging Failures
    - A10: SSRF

## Output Format

```markdown
# Security Audit Report

**Application:** [name]
**Date:** [date]
**Scope:** [what was reviewed]

## Executive Summary
[Brief overview of security posture and critical findings]

## Findings

### Critical Severity
| ID | Vulnerability | Location | OWASP Category | Description |
|----|---------------|----------|----------------|-------------|
| C1 | [name] | [file:line] | [A0X] | [description] |

**Remediation:**
[Specific fix with code example]

---

### High Severity
[Same format]

### Medium Severity
[Same format]

### Low Severity
[Same format]

## Positive Findings
[Security controls that are well-implemented]

## Recommendations Summary
1. [Priority-ordered remediation steps]

## Appendix
- Tools used
- Files reviewed
- Testing methodology
```

## Interactive Decisions

Confirm with user:
- [ ] Scope boundaries - which components to include/exclude
- [ ] Whether to test authentication flows actively
- [ ] If findings should include proof-of-concept examples
- [ ] Compliance frameworks to map findings against
- [ ] Whether to review infrastructure configuration
- [ ] Priority of remediation vs. documentation depth
