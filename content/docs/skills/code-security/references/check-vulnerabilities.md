---
title: "Check Vulnerabilities"
---
# Check Vulnerabilities

Guide to identifying common security vulnerabilities in code.

## Vulnerability Categories

### 1. Injection Vulnerabilities

#### SQL Injection

**Vulnerable patterns:**
```python
# ❌ String concatenation
query = "SELECT * FROM users WHERE id = " + user_id

# ❌ String formatting
query = f"SELECT * FROM users WHERE name = '{name}'"

# ❌ % formatting
query = "SELECT * FROM users WHERE id = %s" % user_id
```

**Secure patterns:**
```python
# ✅ Parameterized query
cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))

# ✅ ORM
User.objects.filter(id=user_id)
```

**Detection:**
```bash
# Search for potential SQL injection
grep -rn "execute.*%" src/
grep -rn "SELECT.*\+" src/
grep -rn "f\".*SELECT" src/
```

#### Command Injection

**Vulnerable patterns:**
```python
# ❌ os.system with user input
os.system(f"ping {host}")

# ❌ subprocess with shell=True
subprocess.call(f"ls {directory}", shell=True)

# ❌ eval/exec
eval(user_input)
```

**Secure patterns:**
```python
# ✅ Subprocess without shell
subprocess.run(["ping", "-c", "1", host], check=True)

# ✅ Allowlist validation
allowed_commands = {"status", "health"}
if command in allowed_commands:
    run_command(command)
```

#### Template Injection

**Vulnerable patterns:**
```python
# ❌ User input in template string
render_template_string(user_input)
Template(user_input).render()
```

**Secure patterns:**
```python
# ✅ User input as variable
render_template("page.html", content=user_input)
```

### 2. Cross-Site Scripting (XSS)

#### Reflected XSS

**Vulnerable patterns:**
```javascript
// ❌ Direct HTML insertion
document.getElementById('output').innerHTML = userInput;

// ❌ jQuery html()
$('#output').html(userInput);

// ❌ Unsafe template (no auto-escaping)
res.send(`<div>${userInput}</div>`);
```

**Secure patterns:**
```javascript
// ✅ Text content
document.getElementById('output').textContent = userInput;

// ✅ jQuery text()
$('#output').text(userInput);

// ✅ Sanitize if HTML needed
$('#output').html(DOMPurify.sanitize(userInput));
```

#### Stored XSS

**Look for:**
- User input saved to database, displayed later
- Profile fields, comments, messages
- File names, metadata

**Prevention:**
- Sanitize on input
- Encode on output
- Content Security Policy

#### DOM-based XSS

**Vulnerable sinks:**
```javascript
// ❌ Dangerous DOM APIs
element.innerHTML = location.hash;
document.write(url.searchParams.get('q'));
eval(localStorage.getItem('code'));
```

### 3. Authentication Vulnerabilities

#### Weak Password Storage

**Vulnerable:**
```python
# ❌ Plain text
user.password = password

# ❌ Weak hash
user.password = hashlib.md5(password).hexdigest()
user.password = hashlib.sha1(password).hexdigest()

# ❌ No salt
user.password = hashlib.sha256(password).hexdigest()
```

**Secure:**
```python
# ✅ Strong adaptive hash
user.password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

# ✅ Argon2
user.password = argon2.hash(password)
```

#### Session Management Issues

**Vulnerable patterns:**
```javascript
// ❌ Predictable session ID
const sessionId = `${userId}_${timestamp}`;

// ❌ Session in URL
redirect(`/dashboard?session=${sessionId}`);

// ❌ No session expiration
// Session lives forever
```

**Secure patterns:**
```javascript
// ✅ Random session ID
const sessionId = crypto.randomBytes(32).toString('hex');

// ✅ HttpOnly, Secure cookies
res.cookie('session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 3600000
});
```

### 4. Authorization Vulnerabilities

#### Insecure Direct Object Reference (IDOR)

**Vulnerable:**
```javascript
// ❌ No ownership check
app.get('/api/documents/:id', (req, res) => {
  return Document.findById(req.params.id);
});
```

**Secure:**
```javascript
// ✅ Verify ownership
app.get('/api/documents/:id', auth, (req, res) => {
  const doc = Document.findById(req.params.id);
  if (doc.ownerId !== req.user.id) {
    return res.status(403).send('Forbidden');
  }
  return doc;
});
```

#### Privilege Escalation

**Check for:**
- User can modify their own role
- Admin functions accessible without admin check
- Role check only on frontend

```javascript
// ❌ Frontend-only check
if (user.role === 'admin') {
  showAdminButton();
}
// Backend doesn't verify!

// ✅ Backend verification
app.post('/api/admin/users', (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).send('Forbidden');
  }
  // ...
});
```

### 5. Sensitive Data Exposure

#### Hardcoded Secrets

**Vulnerable:**
```python
# ❌ Secrets in code
API_KEY = "sk_live_abc123"
DATABASE_URL = "postgres://user:password@host/db"
```

**Secure:**
```python
# ✅ Environment variables
API_KEY = os.environ.get('API_KEY')
DATABASE_URL = os.environ.get('DATABASE_URL')
```

**Detection:**
```bash
# Search for potential secrets
grep -rn "password\s*=" src/
grep -rn "api.?key" src/
grep -rn "secret" src/
trufflehog filesystem src/
```

#### Information Disclosure

**Check for:**
- Stack traces in error responses
- Debug info in production
- Comments with sensitive info
- Verbose error messages

```javascript
// ❌ Leaking info
app.use((err, req, res, next) => {
  res.status(500).json({ error: err.stack });
});

// ✅ Generic error
app.use((err, req, res, next) => {
  console.error(err);  // Log internally
  res.status(500).json({ error: 'Internal server error' });
});
```

### 6. Security Misconfiguration

#### CORS Misconfiguration

**Vulnerable:**
```javascript
// ❌ Allow all origins
app.use(cors({ origin: '*' }));

// ❌ Reflect origin without validation
app.use(cors({ origin: req.headers.origin }));
```

**Secure:**
```javascript
// ✅ Explicit allowlist
app.use(cors({
  origin: ['https://myapp.com', 'https://admin.myapp.com'],
  credentials: true
}));
```

#### Missing Security Headers

**Check for:**
```http
# Required headers
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000
```

### 7. Cryptographic Issues

#### Weak Algorithms

**Vulnerable:**
```python
# ❌ Broken algorithms
hashlib.md5(data)
hashlib.sha1(data)
DES.encrypt(data)
```

**Secure:**
```python
# ✅ Strong algorithms
hashlib.sha256(data)
AES.encrypt(data)
```

#### Improper Key Management

**Check for:**
- Hardcoded keys
- Weak key generation
- Keys in version control
- Keys transmitted insecurely

## Vulnerability Scanning Commands

### Static Analysis

```bash
# JavaScript
npm audit
npx eslint-plugin-security
npx snyk code test

# Python
bandit -r src/
safety check
semgrep --config=p/python

# General
semgrep --config=p/owasp-top-ten src/
```

### Secret Detection

```bash
# Gitleaks
gitleaks detect --source=.

# TruffleHog
trufflehog filesystem .

# grep patterns
grep -rn "BEGIN.*PRIVATE KEY" .
grep -rn "password\s*=\s*['\"]" .
```

## Vulnerability Report Template

```markdown
## Vulnerability: [Name]

**Severity:** Critical / High / Medium / Low
**CWE:** [CWE-XXX]
**CVSS:** X.X

### Description
[What the vulnerability is]

### Location
- File: `path/to/file.js`
- Line: XX
- Code: 
```
[vulnerable code snippet]
```

### Impact
[What an attacker could do]

### Proof of Concept
[Steps to reproduce or exploit code]

### Remediation
[How to fix]

```
[fixed code snippet]
```

### References
- [Relevant OWASP page]
- [CWE link]
```

## Quick Vulnerability Checklist

```markdown
### Injection
- [ ] SQL queries parameterized
- [ ] No shell commands with user input
- [ ] No eval/exec on user input
- [ ] Template injection prevented

### XSS
- [ ] Output encoded for context
- [ ] innerHTML/html() avoided
- [ ] CSP headers present

### Authentication
- [ ] Passwords hashed with bcrypt/Argon2
- [ ] Sessions are random
- [ ] Brute force protection

### Authorization
- [ ] Permission checks on all endpoints
- [ ] Resource ownership verified
- [ ] No client-side only checks

### Data Protection
- [ ] No hardcoded secrets
- [ ] Sensitive data encrypted
- [ ] Error messages don't leak info

### Configuration
- [ ] HTTPS enforced
- [ ] Security headers present
- [ ] CORS properly configured
- [ ] Debug mode disabled
```
