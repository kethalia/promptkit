# API Documentation

Guide to documenting functions, classes, and modules across languages.

## JavaScript/TypeScript (JSDoc/TSDoc)

### Function Documentation

```javascript
/**
 * Fetches user data from the API.
 *
 * @param {string} userId - The unique identifier of the user
 * @param {Object} [options] - Optional configuration
 * @param {boolean} [options.includeProfile=false] - Include profile data
 * @param {string[]} [options.fields] - Specific fields to retrieve
 * @returns {Promise<User>} The user object
 * @throws {NotFoundError} When user doesn't exist
 * @throws {NetworkError} When API is unreachable
 *
 * @example
 * // Basic usage
 * const user = await getUser('123');
 *
 * @example
 * // With options
 * const user = await getUser('123', {
 *   includeProfile: true,
 *   fields: ['name', 'email']
 * });
 *
 * @see {@link updateUser} for updating user data
 * @since 1.0.0
 * @deprecated Use fetchUser instead
 */
async function getUser(userId, options = {}) {
```

### Class Documentation

```typescript
/**
 * Manages HTTP client connections and requests.
 *
 * @class
 * @implements {IHttpClient}
 *
 * @example
 * const client = new HttpClient({ baseUrl: 'https://api.example.com' });
 * const response = await client.get('/users');
 */
class HttpClient implements IHttpClient {
  /**
   * The base URL for all requests.
   * @type {string}
   * @readonly
   */
  readonly baseUrl: string;

  /**
   * Creates a new HTTP client instance.
   *
   * @param {HttpClientConfig} config - Client configuration
   * @param {string} config.baseUrl - Base URL for requests
   * @param {number} [config.timeout=30000] - Request timeout in ms
   * @param {Record<string, string>} [config.headers] - Default headers
   */
  constructor(config: HttpClientConfig) {
```

### TypeScript-Specific

```typescript
/**
 * Configuration options for the API client.
 */
interface ApiConfig {
  /** The API endpoint URL */
  endpoint: string;
  
  /** Authentication token */
  token?: string;
  
  /**
   * Request timeout in milliseconds
   * @default 5000
   */
  timeout?: number;
}

/**
 * Result of a successful API operation.
 * @template T - The type of the data payload
 */
interface ApiResult<T> {
  /** Whether the operation succeeded */
  success: true;
  
  /** The response data */
  data: T;
  
  /** Response metadata */
  meta: {
    /** Request duration in ms */
    duration: number;
  };
}
```

## Python (Google Style)

### Function Documentation

```python
def fetch_user(
    user_id: str,
    include_profile: bool = False,
    fields: list[str] | None = None
) -> User:
    """Fetch user data from the database.

    Retrieves a user by their unique identifier, optionally including
    their profile information and filtering to specific fields.

    Args:
        user_id: The unique identifier of the user.
        include_profile: Whether to include profile data. Defaults to False.
        fields: Specific fields to retrieve. If None, returns all fields.

    Returns:
        User object containing the requested data.

    Raises:
        NotFoundError: If the user doesn't exist.
        ValidationError: If user_id is not a valid format.

    Example:
        >>> user = fetch_user('123')
        >>> print(user.name)
        'John Doe'

        >>> user = fetch_user('123', include_profile=True)
        >>> print(user.profile.bio)
        'Software developer'

    Note:
        This function caches results for 5 minutes.

    See Also:
        update_user: For updating user data.
        delete_user: For removing users.
    """
```

### Class Documentation

```python
class DatabaseConnection:
    """Manages database connections with connection pooling.

    This class provides a high-level interface for database operations
    with automatic connection management and retry logic.

    Attributes:
        host: Database server hostname.
        port: Database server port.
        is_connected: Whether currently connected to the database.

    Example:
        >>> db = DatabaseConnection('localhost', 5432)
        >>> with db.connect() as conn:
        ...     result = conn.execute('SELECT * FROM users')

    Note:
        Connections are automatically returned to the pool when
        the context manager exits.
    """

    def __init__(self, host: str, port: int, **kwargs) -> None:
        """Initialize database connection.

        Args:
            host: Database server hostname.
            port: Database server port.
            **kwargs: Additional connection options.
                pool_size (int): Connection pool size. Defaults to 10.
                timeout (float): Connection timeout in seconds. Defaults to 30.0.
        """
```

### Module Documentation

```python
"""Database utilities for the application.

This module provides database connection management, query building,
and transaction handling utilities.

Typical usage example:

    from myapp import database

    db = database.connect('postgresql://localhost/mydb')
    users = db.query(User).filter(active=True).all()

Modules:
    connection: Database connection management.
    query: Query building utilities.
    migrations: Schema migration tools.

See Also:
    https://docs.myapp.com/database for full documentation.
"""
```

## Go (GoDoc)

### Function Documentation

```go
// FetchUser retrieves a user by their unique identifier.
//
// The function queries the database for the user and returns
// their complete profile. If the user is not found, it returns
// an ErrNotFound error.
//
// Parameters:
//   - ctx: Context for cancellation and timeouts
//   - userID: The unique identifier of the user
//
// Returns the user if found, or an error if the user doesn't exist
// or if there's a database error.
//
// Example:
//
//	user, err := FetchUser(ctx, "user-123")
//	if err != nil {
//	    log.Fatal(err)
//	}
//	fmt.Println(user.Name)
func FetchUser(ctx context.Context, userID string) (*User, error) {
```

### Type Documentation

```go
// User represents a user in the system.
//
// Users have a unique identifier and can have multiple associated
// profiles for different services.
type User struct {
    // ID is the unique identifier for the user.
    ID string

    // Name is the user's display name.
    Name string

    // Email is the user's primary email address.
    // This field is required and must be unique.
    Email string

    // CreatedAt is when the user was created.
    CreatedAt time.Time

    // Profiles contains the user's service-specific profiles.
    Profiles []Profile
}

// IsActive reports whether the user account is active.
func (u *User) IsActive() bool {
```

### Package Documentation

```go
// Package database provides database connection and query utilities.
//
// This package implements connection pooling, query building, and
// transaction management for PostgreSQL databases.
//
// # Connection
//
// Create a connection using [Connect]:
//
//	db, err := database.Connect("postgres://localhost/mydb")
//	if err != nil {
//	    log.Fatal(err)
//	}
//	defer db.Close()
//
// # Queries
//
// Execute queries using the [DB.Query] method:
//
//	rows, err := db.Query(ctx, "SELECT * FROM users WHERE active = $1", true)
//
// # Transactions
//
// Use [DB.Transaction] for transactional operations:
//
//	err := db.Transaction(ctx, func(tx *Tx) error {
//	    // Operations here are atomic
//	    return nil
//	})
package database
```

## Rust (RustDoc)

### Function Documentation

```rust
/// Fetches a user from the database by their unique identifier.
///
/// This function queries the database and returns the user if found.
/// The operation is async and may take some time for large datasets.
///
/// # Arguments
///
/// * `user_id` - The unique identifier of the user to fetch
/// * `options` - Optional configuration for the fetch operation
///
/// # Returns
///
/// Returns `Ok(User)` if the user is found, or an error if:
/// - The user doesn't exist (`Error::NotFound`)
/// - Database connection fails (`Error::Database`)
///
/// # Examples
///
/// ```
/// use mylib::fetch_user;
///
/// # async fn example() -> Result<(), Box<dyn std::error::Error>> {
/// let user = fetch_user("user-123", None).await?;
/// println!("Found user: {}", user.name);
/// # Ok(())
/// # }
/// ```
///
/// With options:
///
/// ```
/// use mylib::{fetch_user, FetchOptions};
///
/// # async fn example() -> Result<(), Box<dyn std::error::Error>> {
/// let options = FetchOptions::builder()
///     .include_profile(true)
///     .build();
/// let user = fetch_user("user-123", Some(options)).await?;
/// # Ok(())
/// # }
/// ```
///
/// # Errors
///
/// Returns [`Error::NotFound`] if no user exists with the given ID.
/// Returns [`Error::Database`] if the database connection fails.
///
/// # Panics
///
/// Panics if `user_id` is empty.
pub async fn fetch_user(user_id: &str, options: Option<FetchOptions>) -> Result<User, Error> {
```

### Struct Documentation

```rust
/// A user in the system.
///
/// Users are the primary entity in the application. Each user has
/// a unique identifier and can be associated with multiple profiles.
///
/// # Examples
///
/// Creating a new user:
///
/// ```
/// use mylib::User;
///
/// let user = User::new("John Doe", "john@example.com");
/// assert_eq!(user.name, "John Doe");
/// ```
#[derive(Debug, Clone)]
pub struct User {
    /// The unique identifier for this user.
    pub id: String,
    
    /// The user's display name.
    pub name: String,
    
    /// The user's email address. Must be unique across all users.
    pub email: String,
    
    /// When the user was created.
    pub created_at: DateTime<Utc>,
}
```

## Documentation Checklist

```markdown
### For Every Function
- [ ] One-line summary
- [ ] Parameter descriptions with types
- [ ] Return value description
- [ ] Errors/exceptions listed
- [ ] At least one example
- [ ] Edge cases mentioned

### For Every Class/Struct
- [ ] Purpose and responsibility
- [ ] Usage example
- [ ] Public fields/properties documented
- [ ] Thread safety notes (if applicable)

### For Every Module/Package
- [ ] Overview of purpose
- [ ] Main exports listed
- [ ] Usage example
- [ ] Links to related modules
```
