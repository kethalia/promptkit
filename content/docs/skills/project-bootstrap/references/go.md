---
title: "Go Projects"
---
# Go Projects

Guide to bootstrapping Go projects.

## Go Application

### Quick Setup

```bash
mkdir my-app && cd my-app
go mod init github.com/username/my-app
```

### Project Structure

```
my-app/
├── cmd/
│   └── my-app/
│       └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── handler/
│   │   └── handler.go
│   └── service/
│       └── service.go
├── pkg/
│   └── utils/
│       └── utils.go
├── api/
│   └── openapi.yaml
├── configs/
│   └── config.yaml
├── scripts/
├── go.mod
├── go.sum
├── Makefile
├── Dockerfile
├── .gitignore
└── README.md
```

### cmd/my-app/main.go

```go
package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/username/my-app/internal/config"
	"github.com/username/my-app/internal/server"
)

func main() {
	// Load configuration
	cfg, err := config.Load()
	if err != nil {
		log.Fatalf("Failed to load config: %v", err)
	}

	// Create server
	srv := server.New(cfg)

	// Graceful shutdown
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		sigCh := make(chan os.Signal, 1)
		signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
		<-sigCh
		log.Println("Shutting down...")
		cancel()
	}()

	// Start server
	if err := srv.Run(ctx); err != nil {
		log.Fatalf("Server error: %v", err)
	}
}
```

### internal/config/config.go

```go
package config

import (
	"os"
)

type Config struct {
	Port        string
	Environment string
	DatabaseURL string
}

func Load() (*Config, error) {
	return &Config{
		Port:        getEnv("PORT", "8080"),
		Environment: getEnv("ENV", "development"),
		DatabaseURL: getEnv("DATABASE_URL", ""),
	}, nil
}

func getEnv(key, defaultValue string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return defaultValue
}
```

## HTTP Server (Chi)

### Add Dependencies

```bash
go get github.com/go-chi/chi/v5
go get github.com/go-chi/chi/v5/middleware
```

### internal/server/server.go

```go
package server

import (
	"context"
	"fmt"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	"github.com/username/my-app/internal/config"
	"github.com/username/my-app/internal/handler"
)

type Server struct {
	cfg    *config.Config
	router *chi.Mux
}

func New(cfg *config.Config) *Server {
	r := chi.NewRouter()

	// Middleware
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(60 * time.Second))

	// Routes
	r.Get("/health", handler.HealthCheck)
	
	r.Route("/api/v1", func(r chi.Router) {
		r.Get("/users", handler.ListUsers)
		r.Post("/users", handler.CreateUser)
		r.Get("/users/{id}", handler.GetUser)
	})

	return &Server{
		cfg:    cfg,
		router: r,
	}
}

func (s *Server) Run(ctx context.Context) error {
	srv := &http.Server{
		Addr:    fmt.Sprintf(":%s", s.cfg.Port),
		Handler: s.router,
	}

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()
		srv.Shutdown(shutdownCtx)
	}()

	fmt.Printf("Server starting on port %s\n", s.cfg.Port)
	return srv.ListenAndServe()
}
```

## CLI Application (Cobra)

### Add Dependencies

```bash
go get github.com/spf13/cobra
go get github.com/spf13/viper
```

### Project Structure

```
my-cli/
├── cmd/
│   ├── root.go
│   ├── serve.go
│   └── version.go
├── internal/
├── main.go
├── go.mod
└── README.md
```

### main.go

```go
package main

import (
	"github.com/username/my-cli/cmd"
)

func main() {
	cmd.Execute()
}
```

### cmd/root.go

```go
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var cfgFile string

var rootCmd = &cobra.Command{
	Use:   "my-cli",
	Short: "A brief description of your application",
	Long:  `A longer description of your application.`,
}

func Execute() {
	if err := rootCmd.Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func init() {
	cobra.OnInitialize(initConfig)
	rootCmd.PersistentFlags().StringVar(&cfgFile, "config", "", "config file")
}

func initConfig() {
	if cfgFile != "" {
		viper.SetConfigFile(cfgFile)
	} else {
		viper.AddConfigPath(".")
		viper.SetConfigName(".my-cli")
	}

	viper.AutomaticEnv()

	if err := viper.ReadInConfig(); err == nil {
		fmt.Println("Using config file:", viper.ConfigFileUsed())
	}
}
```

### cmd/version.go

```go
package cmd

import (
	"fmt"

	"github.com/spf13/cobra"
)

var version = "dev"

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Print the version number",
	Run: func(cmd *cobra.Command, args []string) {
		fmt.Printf("my-cli version %s\n", version)
	},
}

func init() {
	rootCmd.AddCommand(versionCmd)
}
```

## Makefile

```makefile
.PHONY: build run test lint clean

# Variables
BINARY_NAME=my-app
VERSION=$(shell git describe --tags --always --dirty)
BUILD_TIME=$(shell date -u +"%Y-%m-%dT%H:%M:%SZ")
LDFLAGS=-ldflags "-X main.version=$(VERSION) -X main.buildTime=$(BUILD_TIME)"

# Build
build:
	go build $(LDFLAGS) -o bin/$(BINARY_NAME) ./cmd/my-app

# Run
run:
	go run ./cmd/my-app

# Test
test:
	go test -v -race -cover ./...

test-coverage:
	go test -coverprofile=coverage.out ./...
	go tool cover -html=coverage.out -o coverage.html

# Lint
lint:
	golangci-lint run

# Format
fmt:
	go fmt ./...
	goimports -w .

# Clean
clean:
	rm -rf bin/
	rm -f coverage.out coverage.html

# Docker
docker-build:
	docker build -t $(BINARY_NAME):$(VERSION) .

# All
all: lint test build
```

## Dockerfile

```dockerfile
# Build stage
FROM golang:1.22-alpine AS builder

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./
RUN go mod download

# Copy source code
COPY . .

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -ldflags="-s -w" -o /app/bin/my-app ./cmd/my-app

# Runtime stage
FROM alpine:3.19

RUN apk --no-cache add ca-certificates

WORKDIR /app

COPY --from=builder /app/bin/my-app .

EXPOSE 8080

ENTRYPOINT ["./my-app"]
```

## Testing

### internal/handler/handler_test.go

```go
package handler_test

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/username/my-app/internal/handler"
)

func TestHealthCheck(t *testing.T) {
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	h := http.HandlerFunc(handler.HealthCheck)

	h.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}
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
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Set up Go
        uses: actions/setup-go@v5
        with:
          go-version: '1.22'

      - name: Download dependencies
        run: go mod download

      - name: Lint
        uses: golangci/golangci-lint-action@v4
        with:
          version: latest

      - name: Test
        run: go test -v -race -coverprofile=coverage.out ./...

      - name: Build
        run: go build -v ./...
```

## .gitignore for Go

```text
# Binaries
bin/
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test
*.test
coverage.out
coverage.html

# Dependency directories
vendor/

# IDE
.idea/
.vscode/
*.swp

# OS
.DS_Store

# Environment
.env
.env.local
```

## Bootstrap Checklist

```markdown
- [ ] Initialize go.mod
- [ ] Create cmd/ structure
- [ ] Create internal/ packages
- [ ] Add HTTP router (chi/gin)
- [ ] Add configuration
- [ ] Create Makefile
- [ ] Add Dockerfile
- [ ] Set up testing
- [ ] Add golangci-lint config
- [ ] Add .gitignore
- [ ] Add README.md
- [ ] Initialize git
- [ ] Add CI workflow
```
