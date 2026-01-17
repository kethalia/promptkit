# Gas Optimization

Optimize Solidity smart contract gas usage while balancing readability, maintainability, and security.

---

## Context

Gather the following before starting:
- All Solidity contract files to optimize
- Current gas benchmarks if available (`forge test --gas-report` or hardhat-gas-reporter)
- Deployment vs runtime gas priorities
- Target Solidity version and EVM version
- Whether contracts are upgradeable (storage layout constraints)
- User-specified constraints (readability preferences, no breaking changes)

## Instructions

1. **Profile current gas usage**
   - Run gas reports using Foundry or Hardhat Gas Reporter
   - Identify the most expensive functions
   - Note deployment costs vs per-call costs
   - Document baseline metrics for comparison

2. **Optimize storage operations**
   - Identify redundant SLOAD operations (cache storage reads in memory)
   - Minimize SSTORE operations (batch updates, avoid unnecessary writes)
   - Use storage pointers instead of copying structs to memory when appropriate
   - Consider transient storage (EIP-1153) for temporary values if available

3. **Review struct packing**
   - Order struct fields to minimize storage slots
   - Pack variables smaller than 32 bytes together
   - Verify mapping/dynamic array members are slot-aligned
   ```solidity
   // Before: 3 slots
   struct Bad { uint256 a; uint8 b; uint256 c; uint8 d; }
   // After: 2 slots
   struct Good { uint256 a; uint256 c; uint8 b; uint8 d; }
   ```

4. **Optimize variable ordering**
   - Group state variables by size for slot packing
   - Place frequently accessed variables together
   - Consider access patterns (variables read together should be stored together)

5. **Analyze function parameters**
   - Use calldata instead of memory for read-only array/struct parameters
   - Avoid unnecessary copying between memory and calldata
   - Consider struct parameters vs multiple parameters for gas

6. **Review loops and iterations**
   - Cache array length outside loops
   - Use unchecked blocks for loop counters when safe
   - Consider ++i vs i++ (pre-increment is slightly cheaper)
   - Avoid unbounded loops; add pagination where needed
   ```solidity
   // Before
   for (uint i = 0; i < arr.length; i++) { ... }
   // After
   uint len = arr.length;
   for (uint i; i < len; ) { ... unchecked { ++i; } }
   ```

7. **Optimize external calls**
   - Batch multiple calls where possible
   - Consider multicall patterns for user transactions
   - Review call vs staticcall appropriateness
   - Minimize cross-contract calls in hot paths

8. **Reduce bytecode size**
   - Use errors instead of require strings (Solidity 0.8.4+)
   - Use internal functions to reduce code duplication
   - Consider libraries for repeated logic
   - Remove unused code and imports

9. **Review mathematical operations**
   - Use unchecked blocks where overflow is impossible
   - Prefer shifts over multiplication/division by powers of 2
   - Use short-circuit evaluation in conditions
   - Consider fixed-point libraries for precision vs gas tradeoffs

10. **Evaluate data structures**
    - Mappings vs arrays: mappings for sparse data, arrays for iteration
    - EnumerableSet/Map costs vs benefits
    - Consider merkle proofs for large allowlists
    - Review event data vs storage tradeoffs

11. **Apply Solidity-specific optimizations**
    - Use immutable for values set in constructor
    - Use constant for compile-time known values
    - Prefer bytes32 over string where possible
    - Use custom errors instead of revert strings

## Output Format

### Gas Optimization Report

**Current Baseline:**
| Function | Current Gas | Category |
|----------|-------------|----------|
| transfer | 45,000 | High Priority |
| mint | 120,000 | High Priority |

### Optimizations

For each optimization:

```
### Optimization: [Title]

**Location:** `Contract.sol:L50-L75`

**Category:** Storage / Computation / External Calls / Bytecode

**Current Code:**
```solidity
// existing implementation
```

**Optimized Code:**
```solidity
// optimized implementation
```

**Gas Savings:** ~X,XXX gas per call (XX% reduction)

**Tradeoffs:**
- Readability impact: Low/Medium/High
- Maintainability impact: Low/Medium/High
- Security considerations: None / [describe if any]
```

### Summary

| Optimization | Gas Saved | Tradeoff Level |
|--------------|-----------|----------------|
| Cache storage reads | 2,100 | Low |
| Pack structs | 20,000 | Low |
| Use calldata | 500 | None |

**Total Estimated Savings:** X,XXX gas (XX% reduction)

### Optimization vs Readability Matrix

| Change Type | Gas Impact | Readability Impact | Recommendation |
|-------------|------------|-------------------|----------------|
| Storage packing | High | Low | Always apply |
| Caching SLOAD | Medium | Low | Always apply |
| Unchecked math | Low-Medium | Medium | Apply in safe loops |
| Bitwise operations | Low | High | Only for hot paths |
| Assembly blocks | Variable | High | Avoid unless critical |

## Interactive Decisions

Ask the user to clarify:
- **Priority**: Optimize for deployment cost or runtime cost?
- **Constraints**: Any storage layout that must be preserved (upgradeable contracts)?
- **Readability threshold**: Accept reduced readability for marginal gains?
- **Target functions**: Focus on specific high-traffic functions?
- **Breaking changes**: Can function signatures or storage layout change?
- **Verification**: Run gas benchmarks before/after to confirm savings?
