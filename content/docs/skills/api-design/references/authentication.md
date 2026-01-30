---
title: "API Authentication"
---
# API Authentication

Guide to implementing authentication in APIs.

## Authentication Methods

| Method | Best For | Security |
|--------|----------|----------|
| JWT (Bearer Token) | SPAs, mobile apps | High |
| API Keys | Server-to-server, third-party | Medium |
| Session Cookies | Traditional web apps | High |
| OAuth 2.0 | Third-party access | High |

## JWT Authentication

### Token Structure

```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.
eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4iLCJpYXQiOjE1MTYyMzkwMjJ9.
SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
```

### Payload Claims

```json
{
  "sub": "user_123",        // Subject (user ID)
  "iat": 1704067200,        // Issued at
  "exp": 1704153600,        // Expiration
  "iss": "api.example.com", // Issuer
  "aud": "app.example.com", // Audience
  "role": "admin",          // Custom claims
  "permissions": ["read", "write"]
}
```

### Authentication Flow

```
1. Login
POST /auth/login
{ "email": "user@example.com", "password": "secret" }

Response:
{
  "access_token": "eyJhbG...",
  "refresh_token": "dGhpcy...",
  "token_type": "Bearer",
  "expires_in": 3600
}

2. Use Token
GET /api/users/me
Authorization: Bearer eyJhbG...

3. Refresh Token
POST /auth/refresh
{ "refresh_token": "dGhpcy..." }

Response:
{
  "access_token": "eyJhbG...(new)",
  "expires_in": 3600
}
```

### Implementation (Node.js)

```javascript
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRY = '15m';
const REFRESH_TOKEN_EXPIRY = '7d';

// Generate tokens
function generateTokens(user) {
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role },
    JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRY }
  );
  
  const refreshToken = jwt.sign(
    { sub: user.id, type: 'refresh' },
    JWT_SECRET,
    { expiresIn: REFRESH_TOKEN_EXPIRY }
  );
  
  return { accessToken, refreshToken };
}

// Verify middleware
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({
      error: { code: 'AUTH_REQUIRED', message: 'Authentication required' }
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({
        error: { code: 'TOKEN_EXPIRED', message: 'Token has expired' }
      });
    }
    return res.status(401).json({
      error: { code: 'INVALID_TOKEN', message: 'Invalid token' }
    });
  }
}

// Routes
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  const user = await User.findByEmail(email);
  if (!user || !await user.verifyPassword(password)) {
    return res.status(401).json({
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' }
    });
  }
  
  const tokens = generateTokens(user);
  res.json({
    ...tokens,
    token_type: 'Bearer',
    expires_in: 900 // 15 minutes
  });
});

app.post('/auth/refresh', async (req, res) => {
  const { refresh_token } = req.body;
  
  try {
    const payload = jwt.verify(refresh_token, JWT_SECRET);
    if (payload.type !== 'refresh') {
      throw new Error('Invalid token type');
    }
    
    const user = await User.findById(payload.sub);
    const tokens = generateTokens(user);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({
      error: { code: 'INVALID_REFRESH_TOKEN', message: 'Invalid refresh token' }
    });
  }
});

// Protected route
app.get('/users/me', authenticate, (req, res) => {
  res.json({ data: { id: req.user.sub, role: req.user.role } });
});
```

## API Keys

### Key Format

```
# Prefixed keys (easier to identify/rotate)
sk_live_abc123def456...   # Secret key (live)
sk_test_xyz789...         # Secret key (test)
pk_live_...               # Public key (if needed)

# Or simple format
api_abc123def456ghi789...
```

### Usage

```
# Header (recommended)
GET /api/data
X-API-Key: sk_live_abc123...

# Or Authorization header
GET /api/data
Authorization: ApiKey sk_live_abc123...

# Query parameter (less secure, avoid)
GET /api/data?api_key=sk_live_abc123...
```

### Implementation

```javascript
// Middleware
async function authenticateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  
  if (!apiKey) {
    return res.status(401).json({
      error: { code: 'API_KEY_REQUIRED', message: 'API key required' }
    });
  }
  
  // Hash key before lookup (store hashed keys)
  const keyHash = hashApiKey(apiKey);
  const apiKeyRecord = await ApiKey.findByHash(keyHash);
  
  if (!apiKeyRecord || apiKeyRecord.revoked) {
    return res.status(401).json({
      error: { code: 'INVALID_API_KEY', message: 'Invalid API key' }
    });
  }
  
  // Check rate limits, permissions, etc.
  req.apiKey = apiKeyRecord;
  req.userId = apiKeyRecord.userId;
  next();
}
```

## OAuth 2.0

### Authorization Code Flow

```
1. Redirect to authorization
GET /oauth/authorize?
  response_type=code&
  client_id=CLIENT_ID&
  redirect_uri=https://app.example.com/callback&
  scope=read+write&
  state=random_state

2. User authorizes, redirect back with code
GET https://app.example.com/callback?
  code=AUTH_CODE&
  state=random_state

3. Exchange code for token
POST /oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTH_CODE&
client_id=CLIENT_ID&
client_secret=CLIENT_SECRET&
redirect_uri=https://app.example.com/callback

Response:
{
  "access_token": "...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "refresh_token": "...",
  "scope": "read write"
}
```

### Scopes

```javascript
// Define scopes
const SCOPES = {
  'read:users': 'Read user information',
  'write:users': 'Modify user information',
  'read:orders': 'Read orders',
  'write:orders': 'Create and modify orders',
  'admin': 'Full administrative access',
};

// Check scope in middleware
function requireScope(scope) {
  return (req, res, next) => {
    if (!req.user.scopes.includes(scope)) {
      return res.status(403).json({
        error: {
          code: 'INSUFFICIENT_SCOPE',
          message: `Required scope: ${scope}`,
        }
      });
    }
    next();
  };
}

// Usage
app.delete('/users/:id', authenticate, requireScope('write:users'), deleteUser);
```

## Authorization (RBAC)

### Role-Based Access Control

```javascript
const ROLES = {
  user: ['read:own'],
  editor: ['read:own', 'read:all', 'write:own'],
  admin: ['read:own', 'read:all', 'write:own', 'write:all', 'delete:all'],
};

function requirePermission(permission) {
  return (req, res, next) => {
    const userPermissions = ROLES[req.user.role] || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({
        error: {
          code: 'FORBIDDEN',
          message: 'You do not have permission to perform this action',
        }
      });
    }
    next();
  };
}

// Check resource ownership
function requireOwnership(getResourceUserId) {
  return async (req, res, next) => {
    const resourceUserId = await getResourceUserId(req);
    
    if (resourceUserId !== req.user.sub && req.user.role !== 'admin') {
      return res.status(403).json({
        error: { code: 'FORBIDDEN', message: 'Access denied' }
      });
    }
    next();
  };
}
```

## Security Best Practices

### Token Security

```javascript
// Short-lived access tokens
const ACCESS_TOKEN_EXPIRY = '15m';  // 15 minutes

// Longer refresh tokens
const REFRESH_TOKEN_EXPIRY = '7d';  // 7 days

// Secure token storage (client-side)
// - Access token: Memory only (not localStorage)
// - Refresh token: httpOnly cookie

// Set secure cookie
res.cookie('refresh_token', refreshToken, {
  httpOnly: true,
  secure: true,        // HTTPS only
  sameSite: 'strict',  // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
});
```

### Password Handling

```javascript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

// Hash password
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// Verify password
async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

// Password requirements
function validatePassword(password) {
  const errors = [];
  if (password.length < 8) errors.push('At least 8 characters');
  if (!/[A-Z]/.test(password)) errors.push('At least one uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('At least one lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('At least one number');
  return errors;
}
```

### Rate Limiting Authentication

```javascript
import rateLimit from 'express-rate-limit';

// Strict rate limit for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: {
    error: {
      code: 'TOO_MANY_ATTEMPTS',
      message: 'Too many login attempts. Try again in 15 minutes.',
    }
  },
});

app.post('/auth/login', authLimiter, loginHandler);
```

## Endpoints Summary

```
POST /auth/register     # Create account
POST /auth/login        # Get tokens
POST /auth/logout       # Invalidate tokens
POST /auth/refresh      # Refresh access token
POST /auth/forgot       # Request password reset
POST /auth/reset        # Reset password with token
GET  /auth/me           # Get current user
```
