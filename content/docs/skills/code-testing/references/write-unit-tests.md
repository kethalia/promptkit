---
title: "Write Unit Tests"
---
# Write Unit Tests

Workflow for generating comprehensive unit tests for existing code.

## Process Overview

1. **Analyze** - Understand the code to be tested
2. **Identify** - Find all testable behaviors
3. **Design** - Plan test cases for each behavior
4. **Implement** - Write the actual tests
5. **Verify** - Ensure tests are correct and meaningful

## Step 1: Analyze the Code

Before writing tests, understand:

### Function/Method Analysis
- **Inputs**: What parameters does it accept?
- **Outputs**: What does it return?
- **Side Effects**: Does it modify state, call APIs, write files?
- **Dependencies**: What does it rely on?

### Identify Behaviors
For each function, list:
```
- Happy path (normal operation)
- Edge cases (boundaries, limits)
- Error cases (invalid inputs, failures)
- State transitions (if stateful)
```

## Step 2: Test Case Categories

### Essential Test Categories

**1. Happy Path Tests**
Normal, expected usage:
```javascript
it('should calculate total for items in cart', () => {
  const cart = [{ price: 10 }, { price: 20 }];
  expect(calculateTotal(cart)).toBe(30);
});
```

**2. Edge Cases**
Boundary conditions:
```javascript
it('should return 0 for empty cart', () => {
  expect(calculateTotal([])).toBe(0);
});

it('should handle single item', () => {
  expect(calculateTotal([{ price: 10 }])).toBe(10);
});
```

**3. Error Cases**
Invalid inputs and failures:
```javascript
it('should throw for null input', () => {
  expect(() => calculateTotal(null)).toThrow('Cart cannot be null');
});

it('should throw for negative prices', () => {
  expect(() => calculateTotal([{ price: -5 }])).toThrow();
});
```

**4. Boundary Tests**
Limits and thresholds:
```javascript
it('should handle maximum cart size', () => {
  const largeCart = Array(1000).fill({ price: 1 });
  expect(calculateTotal(largeCart)).toBe(1000);
});
```

## Step 3: Writing Tests

### Test Structure Template

```javascript
describe('[Unit/Component Name]', () => {
  // Setup shared across tests
  let instance;
  
  beforeEach(() => {
    instance = new MyClass();
  });
  
  afterEach(() => {
    // Cleanup if needed
  });

  describe('[method name]', () => {
    describe('when [condition]', () => {
      it('should [expected behavior]', () => {
        // Arrange
        const input = createTestInput();
        
        // Act
        const result = instance.method(input);
        
        // Assert
        expect(result).toEqual(expectedOutput);
      });
    });
  });
});
```

### Language-Specific Templates

**JavaScript/TypeScript (Jest/Vitest)**
```javascript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from './user-service';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockRepository = {
      findById: vi.fn(),
      save: vi.fn(),
    };
    service = new UserService(mockRepository);
  });

  describe('getUser', () => {
    it('should return user when found', async () => {
      // Arrange
      const expectedUser = { id: '1', name: 'Test User' };
      mockRepository.findById.mockResolvedValue(expectedUser);

      // Act
      const result = await service.getUser('1');

      // Assert
      expect(result).toEqual(expectedUser);
      expect(mockRepository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundError when user does not exist', async () => {
      // Arrange
      mockRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(service.getUser('999'))
        .rejects.toThrow(NotFoundError);
    });
  });
});
```

**Python (pytest)**
```python
import pytest
from unittest.mock import Mock, patch
from user_service import UserService

class TestUserService:
    @pytest.fixture
    def mock_repository(self):
        return Mock()
    
    @pytest.fixture
    def service(self, mock_repository):
        return UserService(mock_repository)
    
    class TestGetUser:
        def test_returns_user_when_found(self, service, mock_repository):
            # Arrange
            expected_user = {"id": "1", "name": "Test User"}
            mock_repository.find_by_id.return_value = expected_user
            
            # Act
            result = service.get_user("1")
            
            # Assert
            assert result == expected_user
            mock_repository.find_by_id.assert_called_once_with("1")
        
        def test_raises_not_found_when_user_missing(self, service, mock_repository):
            # Arrange
            mock_repository.find_by_id.return_value = None
            
            # Act & Assert
            with pytest.raises(NotFoundError):
                service.get_user("999")
```

**Go**
```go
func TestUserService_GetUser(t *testing.T) {
    t.Run("returns user when found", func(t *testing.T) {
        // Arrange
        mockRepo := &MockUserRepository{
            FindByIDFunc: func(id string) (*User, error) {
                return &User{ID: "1", Name: "Test User"}, nil
            },
        }
        service := NewUserService(mockRepo)

        // Act
        user, err := service.GetUser("1")

        // Assert
        if err != nil {
            t.Fatalf("unexpected error: %v", err)
        }
        if user.Name != "Test User" {
            t.Errorf("got %s, want Test User", user.Name)
        }
    })

    t.Run("returns error when user not found", func(t *testing.T) {
        // Arrange
        mockRepo := &MockUserRepository{
            FindByIDFunc: func(id string) (*User, error) {
                return nil, ErrNotFound
            },
        }
        service := NewUserService(mockRepo)

        // Act
        _, err := service.GetUser("999")

        // Assert
        if err != ErrNotFound {
            t.Errorf("got %v, want ErrNotFound", err)
        }
    })
}
```

## Step 4: Mocking Strategies

### What to Mock
- External APIs and services
- Database connections
- File system operations
- Time-dependent code
- Random number generation

### What NOT to Mock
- The code under test
- Pure utility functions
- Value objects

### Mocking Patterns

**Stub** - Returns canned responses
```javascript
mockApi.fetchData.mockReturnValue({ data: 'test' });
```

**Spy** - Tracks calls while using real implementation
```javascript
const spy = jest.spyOn(service, 'validate');
// ... run test
expect(spy).toHaveBeenCalledTimes(1);
```

**Mock** - Replaces implementation entirely
```javascript
jest.mock('./api-client', () => ({
  fetch: jest.fn().mockResolvedValue({ data: 'mocked' })
}));
```

## Step 5: Assertion Best Practices

### Be Specific
```javascript
// ❌ Too vague
expect(result).toBeTruthy();

// ✅ Specific
expect(result.status).toBe('success');
expect(result.items).toHaveLength(3);
```

### One Concept Per Test
```javascript
// ❌ Testing multiple things
it('should process order', () => {
  expect(result.status).toBe('processed');
  expect(result.total).toBe(100);
  expect(emailService.send).toHaveBeenCalled();
});

// ✅ Separate tests
it('should set status to processed', () => { ... });
it('should calculate correct total', () => { ... });
it('should send confirmation email', () => { ... });
```

### Use Custom Matchers for Complex Assertions
```javascript
expect.extend({
  toBeValidUser(received) {
    const pass = received.id && received.email && received.name;
    return {
      pass,
      message: () => `expected ${received} to be a valid user`
    };
  }
});

expect(user).toBeValidUser();
```

## Output Format

When generating tests, provide:

```markdown
## Generated Tests for [Component Name]

### Test File: `[component].test.js`

[Full test code]

### Coverage Summary
- Functions covered: X/Y
- Branches covered: X/Y
- Edge cases: [list]

### Notes
- [Any assumptions made]
- [Suggested additional tests]
- [Mocking considerations]
```
