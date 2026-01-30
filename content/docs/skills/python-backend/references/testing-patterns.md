---
title: "Python Testing Patterns"
---
# Python Testing Patterns

Guide to testing Python applications with pytest.

## pytest Basics

### Test Structure

```python
# tests/test_users.py
import pytest

def test_user_creation():
    """Test that user can be created."""
    user = User(email="test@example.com", name="Test")
    assert user.email == "test@example.com"
    assert user.name == "Test"

class TestUserService:
    """Group related tests in classes."""
    
    def test_create_user(self):
        pass
    
    def test_get_user(self):
        pass
    
    def test_delete_user(self):
        pass
```

### Fixtures

```python
# conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

@pytest.fixture
def db_session():
    """Create a test database session."""
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    yield session
    
    session.close()

@pytest.fixture
def user(db_session):
    """Create a test user."""
    user = User(email="test@example.com", name="Test User")
    db_session.add(user)
    db_session.commit()
    return user

@pytest.fixture
def authenticated_client(client, user):
    """Client with authentication."""
    token = create_access_token(user.id)
    client.headers["Authorization"] = f"Bearer {token}"
    return client
```

### Fixture Scopes

```python
@pytest.fixture(scope="function")  # Default: new for each test
def function_fixture():
    pass

@pytest.fixture(scope="class")  # Once per test class
def class_fixture():
    pass

@pytest.fixture(scope="module")  # Once per test file
def module_fixture():
    pass

@pytest.fixture(scope="session")  # Once per test run
def session_fixture():
    pass
```

## FastAPI Testing

### Test Client

```python
import pytest
from fastapi.testclient import TestClient
from httpx import AsyncClient

from app.main import app
from app.dependencies import get_db

# Sync client
@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as client:
        yield client
    
    app.dependency_overrides.clear()

# Async client
@pytest.fixture
async def async_client(db_session):
    def override_get_db():
        yield db_session
    
    app.dependency_overrides[get_db] = override_get_db
    
    async with AsyncClient(app=app, base_url="http://test") as client:
        yield client
    
    app.dependency_overrides.clear()
```

### Testing Endpoints

```python
def test_create_user(client):
    response = client.post(
        "/api/users",
        json={"email": "new@example.com", "name": "New User", "password": "password123"},
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "new@example.com"
    assert "id" in data
    assert "password" not in data

def test_create_user_duplicate_email(client, user):
    response = client.post(
        "/api/users",
        json={"email": user.email, "name": "Another", "password": "password123"},
    )
    
    assert response.status_code == 409
    assert "already" in response.json()["error"]["message"].lower()

def test_get_user(client, user):
    response = client.get(f"/api/users/{user.id}")
    
    assert response.status_code == 200
    assert response.json()["id"] == user.id

def test_get_user_not_found(client):
    response = client.get("/api/users/99999")
    
    assert response.status_code == 404

def test_update_user_unauthorized(client, user):
    response = client.patch(
        f"/api/users/{user.id}",
        json={"name": "Updated"},
    )
    
    assert response.status_code == 401

def test_update_user(authenticated_client, user):
    response = authenticated_client.patch(
        f"/api/users/{user.id}",
        json={"name": "Updated Name"},
    )
    
    assert response.status_code == 200
    assert response.json()["name"] == "Updated Name"
```

### Async Tests

```python
import pytest

@pytest.mark.asyncio
async def test_async_endpoint(async_client):
    response = await async_client.get("/api/users")
    assert response.status_code == 200
```

## Django Testing

### Test Client

```python
import pytest
from django.test import Client
from rest_framework.test import APIClient

@pytest.fixture
def client():
    return Client()

@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def authenticated_api_client(api_client, user):
    api_client.force_authenticate(user=user)
    return api_client
```

### Testing Views

```python
import pytest
from django.urls import reverse

@pytest.mark.django_db
def test_post_list(api_client):
    response = api_client.get(reverse('post-list'))
    
    assert response.status_code == 200
    assert isinstance(response.data, list)

@pytest.mark.django_db
def test_create_post(authenticated_api_client):
    response = authenticated_api_client.post(
        reverse('post-list'),
        data={'title': 'Test Post', 'content': 'Content'},
    )
    
    assert response.status_code == 201
    assert response.data['title'] == 'Test Post'

@pytest.mark.django_db
def test_create_post_unauthorized(api_client):
    response = api_client.post(
        reverse('post-list'),
        data={'title': 'Test', 'content': 'Content'},
    )
    
    assert response.status_code == 401
```

### Testing Models

```python
import pytest
from django.core.exceptions import ValidationError

@pytest.mark.django_db
def test_user_creation():
    user = User.objects.create_user(
        email='test@example.com',
        username='testuser',
        password='password123',
    )
    
    assert user.email == 'test@example.com'
    assert user.check_password('password123')

@pytest.mark.django_db
def test_post_slug_auto_generated():
    post = Post.objects.create(
        title='My Test Post',
        content='Content',
        author=user,
    )
    
    assert post.slug == 'my-test-post'

@pytest.mark.django_db
def test_post_unique_slug():
    Post.objects.create(title='Test', content='', author=user, slug='test')
    
    with pytest.raises(IntegrityError):
        Post.objects.create(title='Test', content='', author=user, slug='test')
```

## Mocking

### Basic Mocking

```python
from unittest.mock import Mock, patch, MagicMock

def test_with_mock():
    mock_service = Mock()
    mock_service.get_data.return_value = {"key": "value"}
    
    result = mock_service.get_data()
    
    assert result == {"key": "value"}
    mock_service.get_data.assert_called_once()

@patch('app.services.email_service.send_email')
def test_user_registration_sends_email(mock_send_email, client):
    response = client.post("/api/users", json={...})
    
    assert response.status_code == 201
    mock_send_email.assert_called_once()

@patch('app.services.external_api.fetch_data')
def test_with_patched_api(mock_fetch):
    mock_fetch.return_value = {"status": "ok"}
    
    result = some_function_that_calls_api()
    
    assert result["status"] == "ok"
```

### Async Mocking

```python
from unittest.mock import AsyncMock

@pytest.mark.asyncio
async def test_async_service():
    mock_repo = AsyncMock()
    mock_repo.get.return_value = User(id=1, email="test@example.com")
    
    service = UserService(mock_repo)
    user = await service.get_user(1)
    
    assert user.id == 1
    mock_repo.get.assert_awaited_once_with(1)
```

### Mocking Context Manager

```python
from unittest.mock import patch, mock_open

def test_read_file():
    mock_data = "file content"
    with patch("builtins.open", mock_open(read_data=mock_data)):
        result = read_config_file("config.txt")
    
    assert result == "file content"
```

## Parametrized Tests

```python
import pytest

@pytest.mark.parametrize("email,is_valid", [
    ("test@example.com", True),
    ("user@domain.org", True),
    ("invalid", False),
    ("no@tld", False),
    ("@nodomain.com", False),
])
def test_email_validation(email, is_valid):
    result = validate_email(email)
    assert result == is_valid

@pytest.mark.parametrize("password,errors", [
    ("short", ["at least 8 characters"]),
    ("nouppercasehere", ["uppercase letter"]),
    ("NOLOWERCASE123", ["lowercase letter"]),
    ("NoNumbers!", ["number"]),
    ("ValidPass123", []),
])
def test_password_validation(password, errors):
    result = validate_password(password)
    assert result == errors
```

## Factory Pattern

```python
# Using factory_boy
import factory
from factory.django import DjangoModelFactory

class UserFactory(DjangoModelFactory):
    class Meta:
        model = User
    
    email = factory.Sequence(lambda n: f"user{n}@example.com")
    username = factory.Sequence(lambda n: f"user{n}")
    name = factory.Faker('name')

class PostFactory(DjangoModelFactory):
    class Meta:
        model = Post
    
    title = factory.Faker('sentence')
    content = factory.Faker('paragraph')
    author = factory.SubFactory(UserFactory)
    status = Post.Status.PUBLISHED

# Usage in tests
def test_with_factories(db_session):
    user = UserFactory()
    posts = PostFactory.create_batch(5, author=user)
    
    assert len(user.posts) == 5
```

## Test Configuration

### pytest.ini

```ini
[pytest]
testpaths = tests
python_files = test_*.py
python_functions = test_*
python_classes = Test*
addopts = -v --tb=short
filterwarnings =
    ignore::DeprecationWarning
markers =
    slow: marks tests as slow
    integration: marks tests as integration tests
```

### conftest.py

```python
import pytest
import os

# Set test environment
os.environ["ENVIRONMENT"] = "testing"

def pytest_configure(config):
    """Configure test environment."""
    pass

def pytest_collection_modifyitems(config, items):
    """Modify test collection."""
    # Skip slow tests unless --slow flag
    if not config.getoption("--slow"):
        skip_slow = pytest.mark.skip(reason="need --slow option")
        for item in items:
            if "slow" in item.keywords:
                item.add_marker(skip_slow)

def pytest_addoption(parser):
    """Add custom command line options."""
    parser.addoption("--slow", action="store_true", help="run slow tests")
```

## Running Tests

```bash
# Run all tests
pytest

# Run specific file
pytest tests/test_users.py

# Run specific test
pytest tests/test_users.py::test_create_user

# Run with coverage
pytest --cov=app --cov-report=html

# Run marked tests
pytest -m "not slow"
pytest -m integration

# Run in parallel
pytest -n auto

# Verbose output
pytest -v

# Stop on first failure
pytest -x

# Show local variables in traceback
pytest -l
```
