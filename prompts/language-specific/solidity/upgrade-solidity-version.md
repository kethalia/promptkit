# Upgrade Solidity Version

Migrate Solidity smart contracts to a newer compiler version, addressing breaking changes and adopting new features.

---

## Context

Gather the following before starting:
- All Solidity files to upgrade
- Current Solidity version (pragma statements)
- Target Solidity version
- Build configuration (hardhat.config.js, foundry.toml)
- Dependencies and their version requirements (OpenZeppelin, etc.)
- Whether contracts are deployed (immutable) or pre-deployment

## Instructions

1. **Identify current version usage**
   - Scan all pragma statements across files
   - Note any floating pragmas (^0.8.0) vs pinned (0.8.19)
   - Check dependency version requirements
   - Document the minimum viable version across all files

2. **Review breaking changes between versions**
   
   Key breaking changes by version:
   
   **0.5.x → 0.6.x:**
   - `constructor` keyword required
   - `fallback` and `receive` split
   - Array length is read-only
   - `abstract` keyword for contracts
   - `override` and `virtual` keywords required
   
   **0.6.x → 0.7.x:**
   - `using A for B` only in contracts
   - Exponentiation is right-associative
   - `gwei` and `finney` removed
   - State variable shadowing disallowed
   
   **0.7.x → 0.8.x:**
   - Built-in overflow/underflow checks
   - `msg.sender` and `tx.origin` are `address` not `address payable`
   - Exponent base restricted (no negative bases)
   - `byte` aliased to `bytes1`
   - Failing assertions use revert opcode
   
   **0.8.x minor versions:**
   - 0.8.4: Custom errors, `bytes.concat()`
   - 0.8.8: User-defined value types
   - 0.8.13: `using` with global directive
   - 0.8.18: Named mappings parameters
   - 0.8.20: Default EVM version Shanghai (PUSH0)
   - 0.8.24: Transient storage (EIP-1153)
   - 0.8.26: `require` with custom errors

3. **Identify deprecated features in use**
   - `suicide` → `selfdestruct`
   - `throw` → `revert()`
   - `sha3` → `keccak256`
   - `callcode` → `delegatecall`
   - `constant` (functions) → `view`/`pure`
   - `var` keyword
   - Unary `+` operator

4. **Check compiler settings compatibility**
   - EVM version compatibility (London, Paris, Shanghai, Cancun)
   - Optimizer settings
   - Via-IR pipeline considerations
   - Metadata hash settings

5. **Create migration plan**
   
   For each file:
   ```
   File: Contract.sol
   Current: 0.7.6
   Target: 0.8.20
   
   Changes required:
   - [ ] Update pragma statement
   - [ ] Remove SafeMath (built-in checks)
   - [ ] Add explicit casts for address payable
   - [ ] Add override keywords
   - [ ] Review unchecked blocks for intentional overflow
   ```

6. **Implement migration**
   - Update pragma statements
   - Apply syntax changes
   - Remove deprecated patterns
   - Add required keywords (virtual, override, abstract)
   - Handle type conversion changes

7. **Leverage new features**
   
   Consider adopting:
   - Custom errors (0.8.4+) for gas savings
   - User-defined value types for type safety
   - Named mapping parameters for clarity
   - Transient storage for gas optimization
   - `require` with custom errors (0.8.26+)

8. **Update dependencies**
   - Check OpenZeppelin version compatibility
   - Update imported contract versions
   - Verify interface compatibility

9. **Verify compilation and tests**
   - Compile with new version
   - Run full test suite
   - Check for new warnings
   - Verify gas usage hasn't regressed significantly

## Output Format

### Version Migration Report

**Current State:**
| File | Current Version | Target Version |
|------|-----------------|----------------|
| Token.sol | 0.7.6 | 0.8.20 |
| Vault.sol | 0.8.0 | 0.8.20 |

### Breaking Changes Affecting This Codebase

```
### BC-1: Overflow/Underflow Checks

**Impact:** SafeMath can be removed, gas savings possible

**Files Affected:**
- Token.sol: Uses SafeMath for all arithmetic
- Vault.sol: Uses SafeMath for balance calculations

**Migration:**
- Remove SafeMath imports
- Replace .add(), .sub(), .mul(), .div() with operators
- Add unchecked blocks where overflow is intentional
```

### Migration Steps

1. **Update pragma statements**
   ```solidity
   // Before
   pragma solidity ^0.7.6;
   // After
   pragma solidity ^0.8.20;
   ```

2. **[Additional steps with code examples]**

### New Features to Adopt

| Feature | Benefit | Files to Update |
|---------|---------|-----------------|
| Custom errors | Gas savings | All files with require |
| Named mappings | Readability | Token.sol |

### Post-Migration Checklist

- [ ] All files compile without errors
- [ ] All tests pass
- [ ] No new warnings introduced
- [ ] Gas usage verified (not regressed significantly)
- [ ] Dependencies updated to compatible versions
- [ ] Storage layout verified (if upgradeable)
- [ ] Code review of all changes

### Migration Checklist by Version Jump

**0.7.x to 0.8.x:**
- [ ] Remove SafeMath imports and `.add()`, `.sub()` calls
- [ ] Add `payable()` casts where needed for address conversions
- [ ] Review any intentional overflow logic, wrap in `unchecked {}`
- [ ] Update any `now` references to `block.timestamp`
- [ ] Change `byte` to `bytes1`

**0.8.x to 0.8.20+:**
- [ ] Review EVM target (Shanghai default uses PUSH0)
- [ ] Consider adopting custom errors
- [ ] Consider named mapping parameters

## Interactive Decisions

Ask the user to clarify:
- **Target version**: Latest stable, or specific version for compatibility?
- **Breaking change handling**: Preserve exact behavior or optimize with new patterns?
- **SafeMath removal**: Remove entirely or keep for explicit intent?
- **New feature adoption**: Just migrate, or also modernize with new features?
- **Dependency updates**: Update OpenZeppelin and other deps simultaneously?
- **Testing strategy**: Unit tests sufficient or need additional integration testing?
