# Security Audit

Comprehensive workflow for conducting security code reviews.

## Security Audit Process

### Phase 1: Reconnaissance

**Understand the scope:**

```markdown
## Audit Scope

### Application Type
- [ ] Web application
- [ ] API
- [ ] Mobile app
- [ ] Desktop app
- [ ] Library/SDK

### Components to Review
- [ ] Authentication
- [ ] Authorization
- [ ] Data handling
- [ ] Input processing
- [ ] External integrations
- [ ] Configuration
- [ ] Dependencies

### Sensitive Data Types
- [ ] Credentials
- [ ] PII (Personal Identifiable Information)
- [ ] Financial data
- [ ] Health data
- [ ] Other: ___
```

### Phase 2: Threat Modeling

**Identify threats using STRIDE:**

| Threat | Question | Example |
|--------|----------|---------|
| **S**poofing | Can attacker impersonate? | Session hijacking |
| **T**ampering | Can attacker modify data? | Parameter manipulation |
| **R**epudiation | Can actions be denied? | Missing audit logs |
| **I**nfo Disclosure | Can data leak? | Error messages with stack traces |
| **D**enial of Service | Can service be disrupted? | Resource exhaustion |
| **E**levation of Privilege | Can attacker gain access? | Privilege escalation |

### Phase 3: Code Review

**Review each area systematically:**

## Authentication Review

### Checklist

```markdown
- [ ] Password requirements enforced (length, complexity)
- [ ] Passwords hashed with strong algorithm (bcrypt, Argon2)
- [ ] Salt is unique per user
- [ ] Brute force protection (rate limiting, lockout)
- [ ] Secure password reset flow
- [ ] Session tokens are random and sufficient length
- [ ] Sessions invalidated on logout
- [ ] Sessions expire appropriately
- [ ] Remember-me is secure (separate token)
- [ ] MFA implemented correctly
```

### Common Issues

**Weak password hashing:**
```python
# ❌ Bad
password_hash = md5(password).hexdigest()
password_hash = sha256(password).hexdigest()

# ✅ Good
password_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
```

**Insecure session:**
```javascript
// ❌ Bad - predictable session ID
const sessionId = `user_${userId}_${Date.now()}`;

// ✅ Good - cryptographically random
const sessionId = crypto.randomBytes(32).toString('hex');
```

## Authorization Review

### Checklist

```markdown
- [ ] Authorization checked on every request
- [ ] Resource ownership verified
- [ ] Role/permission checks are server-side
- [ ] Default deny (explicit allow required)
- [ ] Vertical privilege escalation prevented
- [ ] Horizontal privilege escalation prevented
- [ ] Direct object references validated
```

### Common Issues

**Missing authorization check:**
```python
# ❌ Bad - no ownership check
@app.route('/documents/<id>')
def get_document(id):
    return Document.query.get(id)

# ✅ Good - verify ownership
@app.route('/documents/<id>')
@login_required
def get_document(id):
    doc = Document.query.get(id)
    if doc.owner_id != current_user.id:
        abort(403)
    return doc
```

**Insecure direct object reference (IDOR):**
```javascript
// ❌ Bad - trusting client-provided ID
app.get('/api/users/:id', (req, res) => {
    return User.findById(req.params.id);
});

// ✅ Good - verify authorization
app.get('/api/users/:id', authenticate, (req, res) => {
    if (req.params.id !== req.user.id && !req.user.isAdmin) {
        return res.status(403).json({ error: 'Forbidden' });
    }
    return User.findById(req.params.id);
});
```

## Input Validation Review

### Checklist

```markdown
- [ ] All input validated (query, body, headers, cookies)
- [ ] Input type verified
- [ ] Input length limited
- [ ] Input format validated (regex, schema)
- [ ] File uploads validated (type, size, content)
- [ ] Allowlist preferred over denylist
```

### Common Issues

**SQL Injection:**
```python
# ❌ Bad - string interpolation
query = f"SELECT * FROM users WHERE id = {user_id}"

# ✅ Good - parameterized query
query = "SELECT * FROM users WHERE id = %s"
cursor.execute(query, (user_id,))
```

**Command Injection:**
```python
# ❌ Bad - shell command with user input
os.system(f"convert {filename} output.png")

# ✅ Good - use safe APIs, validate input
import subprocess
subprocess.run(['convert', filename, 'output.png'], check=True)
```

## Output Encoding Review

### Checklist

```markdown
- [ ] HTML output encoded to prevent XSS
- [ ] JavaScript context properly escaped
- [ ] URL parameters encoded
- [ ] JSON output properly escaped
- [ ] HTTP headers sanitized
```

### Common Issues

**Cross-Site Scripting (XSS):**
```javascript
// ❌ Bad - direct HTML insertion
element.innerHTML = userInput;

// ✅ Good - text content or sanitize
element.textContent = userInput;
// Or use DOMPurify
element.innerHTML = DOMPurify.sanitize(userInput);
```

**Template injection:**
```python
# ❌ Bad - user input in template
return render_template_string(f"Hello {user_input}")

# ✅ Good - pass as variable
return render_template_string("Hello {{ name }}", name=user_input)
```

## Cryptography Review

### Checklist

```markdown
- [ ] Strong algorithms used (AES-256, RSA-2048+, SHA-256+)
- [ ] No deprecated algorithms (MD5, SHA1, DES)
- [ ] Keys are sufficient length
- [ ] Keys stored securely
- [ ] IV/nonce not reused
- [ ] TLS 1.2+ enforced
- [ ] Certificate validation enabled
```

### Common Issues

**Weak cryptography:**
```python
# ❌ Bad
hashlib.md5(data).hexdigest()
DES.new(key, DES.MODE_ECB)

# ✅ Good
hashlib.sha256(data).hexdigest()
AES.new(key, AES.MODE_GCM, nonce=nonce)
```

## Configuration Review

### Checklist

```markdown
- [ ] Debug mode disabled in production
- [ ] Secrets not in code or version control
- [ ] Default credentials changed
- [ ] Unnecessary services disabled
- [ ] Security headers configured
- [ ] CORS properly restricted
- [ ] Error pages don't leak info
```

### Security Headers

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Phase 4: Reporting

### Audit Report Template

```markdown
# Security Audit Report

## Executive Summary
- **Application:** [Name]
- **Audit Date:** [Date]
- **Auditor:** [Name]
- **Risk Rating:** [Critical/High/Medium/Low]

## Findings Summary
| Severity | Count |
|----------|-------|
| Critical | X |
| High | X |
| Medium | X |
| Low | X |

## Critical Findings

### [VULN-001] SQL Injection in User Search
**Severity:** Critical
**Location:** `src/routes/users.js:45`
**Description:** User input is directly interpolated into SQL query
**Impact:** Attacker can read/modify/delete database contents
**Proof of Concept:** 
```
GET /api/users?search=' OR '1'='1
```
**Remediation:** Use parameterized queries
**Status:** [ ] Open / [ ] Fixed / [ ] Verified

## Recommendations
1. [Priority 1 recommendation]
2. [Priority 2 recommendation]

## Appendix
- Tools used
- Test cases
- References
```

## Security Audit Checklist

### Pre-Audit
- [ ] Define scope and objectives
- [ ] Gather documentation
- [ ] Set up test environment
- [ ] Get necessary access

### During Audit
- [ ] Authentication mechanisms
- [ ] Authorization controls
- [ ] Input validation
- [ ] Output encoding
- [ ] Cryptography usage
- [ ] Session management
- [ ] Error handling
- [ ] Logging and monitoring
- [ ] Configuration security
- [ ] Dependency security

### Post-Audit
- [ ] Document findings
- [ ] Prioritize by risk
- [ ] Provide remediation guidance
- [ ] Review fixes
- [ ] Verify remediation
