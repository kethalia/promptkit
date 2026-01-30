# Cargo Best Practices Review

Review Cargo configuration for structure, dependencies, features, and build optimization.

---

## Context

Gather before starting:
- `Cargo.toml` and `Cargo.lock` files
- All workspace member `Cargo.toml` files if applicable
- `.cargo/config.toml` if present
- `rust-toolchain.toml` or `rust-toolchain` file
- Build scripts (`build.rs`) if present
- CI configuration files for clippy/rustfmt settings

## Instructions

1. **Review Cargo.toml structure and metadata**
   - Check [package] section completeness (name, version, edition, authors, license, description)
   - Verify repository, documentation, and homepage URLs
   - Check keywords and categories for crates.io discoverability
   - Review readme, license-file, and include/exclude patterns
   - Verify edition is current (2021) or intentionally older
   - Check MSRV (rust-version) is specified if needed

2. **Check dependency versions and features**
   - Check for overly permissive version ranges (`*`, `>=`)
   - Identify outdated dependencies (compare to crates.io)
   - Look for yanked versions in Cargo.lock
   - Check for pre-1.0 dependencies with implicit `^` ranges
   - Verify security advisories (rustsec) for dependencies
   - Review pinned versions that might miss security patches
   - Check that only needed features are enabled for each dependency

3. **Validate feature flags organization**
   - Review feature definitions for clarity and naming
   - Check for overly broad "default" features
   - Identify features that should be default but aren't
   - Look for feature flag conflicts or circular dependencies
   - Verify optional dependencies are properly feature-gated
   - Check for deprecated feature patterns

4. **Review build configuration**
   - Check [profile.release] optimizations (lto, codegen-units, opt-level)
   - Review [profile.dev] settings for compile time vs runtime trade-offs
   - Check for custom profiles (bench, test overrides)
   - Review panic strategy (abort vs unwind)
   - Check strip and debug settings for release builds
   - Review incremental compilation settings

5. **Check for unused dependencies**
   - List all dependencies and their purposes
   - Find dependencies only used in one module (consider making optional)
   - Identify overlapping functionality between dependencies
   - Check for dependencies that could be replaced with std
   - Look for heavy dependencies used for trivial functionality
   - Check dev-dependencies aren't in regular dependencies

6. **Validate workspace configuration if applicable**
   - Review workspace member organization
   - Check shared dependency versions in [workspace.dependencies]
   - Verify workspace inheritance is used consistently
   - Review workspace-level metadata and settings
   - Check for dependencies that should be shared but aren't
   - Verify resolver = "2" is set for edition 2021+

7. **Review CI-related settings (clippy, rustfmt)**
   - Check for clippy.toml or .clippy.toml configuration
   - Review rustfmt.toml settings
   - Verify clippy lints are appropriate (deny/warn/allow)
   - Check for CI-specific profile settings
   - Review any cargo-deny or cargo-audit configuration

## Output Format

```markdown
## Cargo Configuration Review

### Metadata Completeness
| Field | Status | Value/Issue |
|-------|--------|-------------|
| edition | ✓/✗ | 2021 |
| license | ✓/✗ | MIT |
| rust-version | ✓/✗ | 1.70 |
| description | ✓/✗ | Present/Missing |

### Dependency Analysis

#### Version Issues
| Dependency | Current | Latest | Issue |
|------------|---------|--------|-------|
| serde | 1.0.100 | 1.0.193 | Outdated |
| tokio | * | 1.35 | Too permissive |

#### Unused/Heavy Dependencies
| Dependency | Size Impact | Usage | Recommendation |
|------------|-------------|-------|----------------|
| regex | +500KB | 1 simple match | Use str methods |

#### Security Advisories
- `RUSTSEC-XXXX-XXXX`: dependency@version - description

### Feature Flags Analysis
```toml
[features]
default = ["std"]  # ✓ Appropriate defaults
std = []           # ✓ Well-named
full = ["a", "b"]  # ⚠ Consider documenting
```
- **Issues**: [List any feature flag problems]

### Build Profile Recommendations
```toml
[profile.release]
lto = "thin"           # Suggested for binary size
codegen-units = 1      # Suggested for optimization
strip = true           # Suggested for smaller binary
```

### Workspace Review (if applicable)
- [ ] Using workspace.dependencies: Yes/No
- [ ] Resolver version: 2
- [ ] Shared settings via inheritance: Yes/No/Partial

### CI/Lint Configuration
- [ ] clippy.toml present: Yes/No
- [ ] rustfmt.toml present: Yes/No
- [ ] cargo-deny configured: Yes/No

### Recommended Actions
1. [High priority action]
2. [Medium priority action]
3. [Low priority action]
```

## Interactive Decisions

Pause for user input on:
- **Dependency removal**: When a dependency appears unnecessary but usage is unclear
- **Version pinning strategy**: When choosing between flexibility and reproducibility
- **Feature flag design**: When restructuring features would be breaking
- **Build optimization trade-offs**: When optimizations increase compile time significantly
- **Workspace restructuring**: When suggesting to split or merge crates
- **MSRV changes**: When newer features would require bumping minimum supported Rust version
