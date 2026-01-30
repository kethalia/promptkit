# Rust Projects

Guide to bootstrapping Rust projects.

## Binary Application

### Quick Setup

```bash
cargo new my-app
cd my-app
```

### Project Structure

```
my-app/
├── src/
│   ├── main.rs
│   ├── lib.rs
│   ├── config.rs
│   └── commands/
│       ├── mod.rs
│       └── serve.rs
├── tests/
│   └── integration_test.rs
├── benches/
│   └── benchmark.rs
├── examples/
│   └── basic.rs
├── Cargo.toml
├── Cargo.lock
├── .gitignore
└── README.md
```

### Cargo.toml

```toml
[package]
name = "my-app"
version = "0.1.0"
edition = "2021"
authors = ["Your Name <you@example.com>"]
description = "A short description"
license = "MIT"
repository = "https://github.com/username/my-app"
readme = "README.md"
keywords = ["keyword1", "keyword2"]
categories = ["category"]

[dependencies]
anyhow = "1.0"
thiserror = "1.0"
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
tokio = { version = "1.0", features = ["full"] }
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }

[dev-dependencies]
criterion = { version = "0.5", features = ["html_reports"] }

[[bench]]
name = "benchmark"
harness = false

[profile.release]
lto = true
codegen-units = 1
strip = true

[lints.rust]
unsafe_code = "forbid"

[lints.clippy]
all = "warn"
pedantic = "warn"
nursery = "warn"
```

### src/main.rs

```rust
use anyhow::Result;
use tracing::info;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;

fn main() -> Result<()> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(tracing_subscriber::fmt::layer())
        .with(tracing_subscriber::EnvFilter::from_default_env())
        .init();

    info!("Starting application");

    // Load configuration
    let config = config::Config::load()?;
    info!(?config, "Configuration loaded");

    // Run application
    run(config)?;

    Ok(())
}

fn run(config: config::Config) -> Result<()> {
    info!("Running with port: {}", config.port);
    Ok(())
}
```

### src/config.rs

```rust
use anyhow::Result;
use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub struct Config {
    #[serde(default = "default_port")]
    pub port: u16,
    #[serde(default = "default_env")]
    pub environment: String,
    pub database_url: Option<String>,
}

fn default_port() -> u16 {
    8080
}

fn default_env() -> String {
    "development".to_string()
}

impl Config {
    pub fn load() -> Result<Self> {
        // Load from environment variables
        let config = envy::from_env::<Config>()?;
        Ok(config)
    }
}
```

## Library Crate

### Quick Setup

```bash
cargo new my-lib --lib
cd my-lib
```

### Project Structure

```
my-lib/
├── src/
│   ├── lib.rs
│   ├── error.rs
│   └── types.rs
├── tests/
│   └── integration_test.rs
├── examples/
│   └── basic.rs
├── Cargo.toml
└── README.md
```

### src/lib.rs

```rust
//! My Library
//!
//! A brief description of what this library does.
//!
//! # Examples
//!
//! ```
//! use my_lib::process;
//!
//! let result = process("input").unwrap();
//! assert_eq!(result, "processed: input");
//! ```

mod error;
mod types;

pub use error::{Error, Result};
pub use types::Config;

/// Processes the input and returns a result.
///
/// # Arguments
///
/// * `input` - The input string to process
///
/// # Returns
///
/// Returns `Ok(String)` on success, or an error if processing fails.
///
/// # Examples
///
/// ```
/// use my_lib::process;
///
/// let result = process("hello")?;
/// # Ok::<(), my_lib::Error>(())
/// ```
pub fn process(input: &str) -> Result<String> {
    if input.is_empty() {
        return Err(Error::EmptyInput);
    }
    Ok(format!("processed: {input}"))
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_process() {
        let result = process("test").unwrap();
        assert_eq!(result, "processed: test");
    }

    #[test]
    fn test_process_empty() {
        let result = process("");
        assert!(result.is_err());
    }
}
```

### src/error.rs

```rust
use thiserror::Error;

/// Library result type alias.
pub type Result<T> = std::result::Result<T, Error>;

/// Library error types.
#[derive(Error, Debug)]
pub enum Error {
    #[error("Input cannot be empty")]
    EmptyInput,

    #[error("Invalid format: {0}")]
    InvalidFormat(String),

    #[error("IO error: {0}")]
    Io(#[from] std::io::Error),

    #[error("Unknown error: {0}")]
    Unknown(String),
}
```

## CLI Application (Clap)

### Add Dependencies

```bash
cargo add clap --features derive
cargo add anyhow
```

### src/main.rs

```rust
use anyhow::Result;
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "my-cli")]
#[command(author, version, about, long_about = None)]
struct Cli {
    /// Turn debugging information on
    #[arg(short, long, action = clap::ArgAction::Count)]
    verbose: u8,

    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Greet someone
    Greet {
        /// Name of the person to greet
        #[arg(short, long)]
        name: String,
    },
    /// Run the server
    Serve {
        /// Port to listen on
        #[arg(short, long, default_value = "8080")]
        port: u16,
    },
}

fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::Greet { name } => {
            println!("Hello, {name}!");
        }
        Commands::Serve { port } => {
            println!("Starting server on port {port}");
        }
    }

    Ok(())
}
```

## Async Web Server (Axum)

### Add Dependencies

```bash
cargo add axum
cargo add tokio --features full
cargo add tower-http --features cors,trace
cargo add serde --features derive
cargo add serde_json
```

### src/main.rs

```rust
use axum::{
    extract::State,
    http::StatusCode,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::sync::Arc;
use tokio::sync::RwLock;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

#[derive(Clone)]
struct AppState {
    // Shared state
    counter: Arc<RwLock<i32>>,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let state = AppState {
        counter: Arc::new(RwLock::new(0)),
    };

    let app = Router::new()
        .route("/health", get(health_check))
        .route("/counter", get(get_counter).post(increment_counter))
        .layer(TraceLayer::new_for_http())
        .layer(CorsLayer::permissive())
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:8080").await.unwrap();
    println!("Listening on http://0.0.0.0:8080");
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> &'static str {
    "OK"
}

#[derive(Serialize)]
struct CounterResponse {
    value: i32,
}

async fn get_counter(State(state): State<AppState>) -> Json<CounterResponse> {
    let value = *state.counter.read().await;
    Json(CounterResponse { value })
}

async fn increment_counter(State(state): State<AppState>) -> Json<CounterResponse> {
    let mut counter = state.counter.write().await;
    *counter += 1;
    Json(CounterResponse { value: *counter })
}
```

## Workspace

### Cargo.toml (root)

```toml
[workspace]
members = [
    "crates/my-lib",
    "crates/my-cli",
    "crates/my-server",
]
resolver = "2"

[workspace.package]
version = "0.1.0"
edition = "2021"
license = "MIT"
repository = "https://github.com/username/my-workspace"

[workspace.dependencies]
anyhow = "1.0"
thiserror = "1.0"
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
```

### crates/my-lib/Cargo.toml

```toml
[package]
name = "my-lib"
version.workspace = true
edition.workspace = true

[dependencies]
anyhow.workspace = true
thiserror.workspace = true
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

env:
  CARGO_TERM_COLOR: always

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Install Rust
        uses: dtolnay/rust-action@stable
        with:
          components: clippy, rustfmt

      - name: Cache cargo
        uses: Swatinem/rust-cache@v2

      - name: Format check
        run: cargo fmt --all -- --check

      - name: Clippy
        run: cargo clippy --all-targets --all-features -- -D warnings

      - name: Test
        run: cargo test --all-features

      - name: Build
        run: cargo build --release
```

## .gitignore for Rust

```gitignore
# Build
/target/
Cargo.lock  # Keep for binaries, ignore for libraries

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store

# Environment
.env
```

## Bootstrap Checklist

```markdown
- [ ] Initialize with cargo new
- [ ] Configure Cargo.toml metadata
- [ ] Add dependencies
- [ ] Create module structure
- [ ] Add error handling (thiserror/anyhow)
- [ ] Add logging (tracing)
- [ ] Set up tests
- [ ] Add examples
- [ ] Configure clippy lints
- [ ] Add .gitignore
- [ ] Add README.md
- [ ] Add LICENSE
- [ ] Initialize git
- [ ] Add CI workflow
```
