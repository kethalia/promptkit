# Python Projects

Guide to bootstrapping Python projects.

## Python Package (with uv)

### Quick Setup

```bash
# Using uv (recommended)
uv init my-package
cd my-package
uv venv
source .venv/bin/activate  # or .venv\Scripts\activate on Windows
```

### Project Structure

```
my-package/
├── src/
│   └── my_package/
│       ├── __init__.py
│       ├── main.py
│       └── utils.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   └── test_main.py
├── docs/
├── pyproject.toml
├── README.md
├── LICENSE
└── .gitignore
```

### pyproject.toml

```toml
[project]
name = "my-package"
version = "0.1.0"
description = "A short description"
readme = "README.md"
license = { text = "MIT" }
requires-python = ">=3.11"
authors = [
    { name = "Your Name", email = "you@example.com" }
]
classifiers = [
    "Development Status :: 3 - Alpha",
    "Intended Audience :: Developers",
    "License :: OSI Approved :: MIT License",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.11",
    "Programming Language :: Python :: 3.12",
]
dependencies = []

[project.optional-dependencies]
dev = [
    "pytest>=7.0",
    "pytest-cov>=4.0",
    "ruff>=0.1.0",
    "mypy>=1.0",
]

[project.scripts]
my-package = "my_package.main:main"

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"

[tool.hatch.build.targets.wheel]
packages = ["src/my_package"]

[tool.ruff]
line-length = 88
target-version = "py311"

[tool.ruff.lint]
select = ["E", "F", "I", "N", "W", "UP"]

[tool.mypy]
python_version = "3.11"
strict = true
warn_return_any = true
warn_unused_configs = true

[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --cov=src/my_package --cov-report=term-missing"
```

### src/my_package/__init__.py

```python
"""My Package - A short description."""

__version__ = "0.1.0"

from .main import main

__all__ = ["main"]
```

### src/my_package/main.py

```python
"""Main module."""


def main() -> None:
    """Entry point for the application."""
    print("Hello from my-package!")


if __name__ == "__main__":
    main()
```

## FastAPI Application

### Quick Setup

```bash
uv init my-api
cd my-api
uv add fastapi uvicorn[standard] pydantic-settings
uv add --dev pytest pytest-asyncio httpx
```

### Project Structure

```
my-api/
├── src/
│   └── my_api/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── routers/
│       │   ├── __init__.py
│       │   └── users.py
│       ├── models/
│       │   ├── __init__.py
│       │   └── user.py
│       ├── schemas/
│       │   ├── __init__.py
│       │   └── user.py
│       ├── services/
│       │   └── user_service.py
│       └── dependencies.py
├── tests/
├── pyproject.toml
└── README.md
```

### src/my_api/main.py

```python
"""FastAPI application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .routers import users

app = FastAPI(
    title=settings.app_name,
    version="0.1.0",
    description="My API description",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router, prefix="/api/users", tags=["users"])


@app.get("/health")
async def health_check() -> dict[str, str]:
    """Health check endpoint."""
    return {"status": "healthy"}
```

### src/my_api/config.py

```python
"""Application configuration."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings."""

    app_name: str = "My API"
    debug: bool = False
    database_url: str = "sqlite:///./app.db"
    cors_origins: list[str] = ["http://localhost:3000"]

    class Config:
        env_file = ".env"


settings = Settings()
```

## CLI Application (Click)

### Quick Setup

```bash
uv init my-cli
cd my-cli
uv add click rich
uv add --dev pytest
```

### Project Structure

```
my-cli/
├── src/
│   └── my_cli/
│       ├── __init__.py
│       ├── cli.py
│       └── commands/
│           ├── __init__.py
│           └── greet.py
├── tests/
├── pyproject.toml
└── README.md
```

### src/my_cli/cli.py

```python
"""CLI entry point."""

import click

from .commands import greet


@click.group()
@click.version_option()
def cli() -> None:
    """My CLI application."""
    pass


cli.add_command(greet.greet)


def main() -> None:
    """Entry point."""
    cli()


if __name__ == "__main__":
    main()
```

### src/my_cli/commands/greet.py

```python
"""Greet command."""

import click
from rich.console import Console

console = Console()


@click.command()
@click.argument("name")
@click.option("--greeting", "-g", default="Hello", help="Greeting to use")
def greet(name: str, greeting: str) -> None:
    """Greet someone by name."""
    console.print(f"[bold green]{greeting}, {name}![/bold green]")
```

## Testing Setup

### tests/conftest.py

```python
"""Pytest configuration and fixtures."""

import pytest


@pytest.fixture
def sample_data() -> dict[str, str]:
    """Provide sample test data."""
    return {"key": "value"}
```

### tests/test_main.py

```python
"""Tests for main module."""

from my_package.main import main


def test_main(capsys: pytest.CaptureFixture[str]) -> None:
    """Test main function output."""
    main()
    captured = capsys.readouterr()
    assert "Hello" in captured.out
```

## Development Tools

### Ruff (Linting + Formatting)

```bash
# Lint
ruff check .

# Format
ruff format .

# Fix issues
ruff check --fix .
```

### Mypy (Type Checking)

```bash
mypy src/
```

### pytest

```bash
# Run tests
pytest

# With coverage
pytest --cov=src/my_package --cov-report=html

# Run specific test
pytest tests/test_main.py::test_main -v
```

## GitHub Actions CI

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        python-version: ["3.11", "3.12"]

    steps:
      - uses: actions/checkout@v4

      - name: Install uv
        uses: astral-sh/setup-uv@v3

      - name: Set up Python ${{ matrix.python-version }}
        run: uv python install ${{ matrix.python-version }}

      - name: Install dependencies
        run: uv sync --all-extras --dev

      - name: Lint with ruff
        run: uv run ruff check .

      - name: Type check with mypy
        run: uv run mypy src/

      - name: Test with pytest
        run: uv run pytest --cov
```

## .gitignore for Python

```gitignore
# Byte-compiled
__pycache__/
*.py[cod]
*$py.class

# Virtual environments
.venv/
venv/
ENV/

# Distribution
dist/
build/
*.egg-info/

# Testing
.pytest_cache/
.coverage
htmlcov/

# Type checking
.mypy_cache/

# IDE
.idea/
.vscode/
*.swp

# Environment
.env
.env.local

# OS
.DS_Store
```

## Bootstrap Checklist

```markdown
- [ ] Initialize with uv init
- [ ] Create src/ layout
- [ ] Configure pyproject.toml
- [ ] Add ruff for linting/formatting
- [ ] Add mypy for type checking
- [ ] Set up pytest
- [ ] Create tests/ directory
- [ ] Add .gitignore
- [ ] Add README.md
- [ ] Add LICENSE
- [ ] Initialize git
- [ ] Add CI workflow
```
