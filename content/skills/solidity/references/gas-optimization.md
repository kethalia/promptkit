# Gas Optimization

Guide to reducing gas costs in Solidity smart contracts.

## Gas Cost Overview

| Operation | Approximate Cost |
|-----------|------------------|
| Transaction base | 21,000 gas |
| SSTORE (new slot) | 20,000 gas |
| SSTORE (update) | 5,000 gas |
| SSTORE (zero) | 2,900 gas (refund) |
| SLOAD | 2,100 gas |
| Memory | 3 gas + memory expansion |
| Calldata | 4 gas/zero byte, 16 gas/non-zero |

## Storage Optimizations

### Pack Variables

```solidity
// ❌ Bad - uses 3 storage slots (96 bytes)
contract Unoptimized {
    uint256 a;    // Slot 0 (32 bytes)
    uint8 b;      // Slot 1 (32 bytes, wastes 31)
    uint256 c;    // Slot 2 (32 bytes)
}

// ✅ Good - uses 2 storage slots
contract Optimized {
    uint256 a;    // Slot 0
    uint256 c;    // Slot 1
    uint8 b;      // Slot 1 (packed with c)
}

// ✅ Better - pack smaller types together
contract MoreOptimized {
    uint128 a;    // Slot 0 (16 bytes)
    uint128 b;    // Slot 0 (16 bytes) - PACKED!
    uint256 c;    // Slot 1
}

// Struct packing
// ❌ Bad - 3 slots
struct BadUser {
    uint256 id;
    bool active;
    uint256 balance;
}

// ✅ Good - 2 slots
struct GoodUser {
    uint256 id;       // Slot 0
    uint128 balance;  // Slot 1
    bool active;      // Slot 1 (packed)
}
```

### Use Mappings vs Arrays

```solidity
// Arrays - gas grows with size for operations
// Mappings - constant gas for read/write

// ❌ Expensive - O(n) to find
address[] public users;

function isUser(address user) public view returns (bool) {
    for (uint i = 0; i < users.length; i++) {
        if (users[i] == user) return true;
    }
    return false;
}

// ✅ Cheap - O(1)
mapping(address => bool) public isUser;
```

### Cache Storage Variables

```solidity
// ❌ Bad - multiple SLOAD operations
function bad() public {
    for (uint i = 0; i < items.length; i++) {  // SLOAD each iteration
        total += items[i].value;  // SLOAD each iteration
    }
}

// ✅ Good - cache in memory
function good() public {
    uint256 length = items.length;  // Single SLOAD
    uint256 sum = 0;
    for (uint i = 0; i < length; i++) {
        sum += items[i].value;
    }
    total = sum;  // Single SSTORE
}
```

## Function Optimizations

### Use External vs Public

```solidity
// ❌ Public copies calldata to memory
function processData(uint256[] memory data) public {
    // ...
}

// ✅ External uses calldata directly
function processData(uint256[] calldata data) external {
    // ...
}

// ~60 gas saved per array element
```

### Use calldata for Read-Only Arrays

```solidity
// ❌ Memory - copies data
function sum(uint256[] memory numbers) external pure returns (uint256) {
    // ...
}

// ✅ Calldata - references directly
function sum(uint256[] calldata numbers) external pure returns (uint256) {
    // ...
}
```

### Short-Circuit Conditions

```solidity
// ❌ Always evaluates both
function check(uint256 a, uint256 b) public view returns (bool) {
    return expensiveCheck(a) && cheapCheck(b);
}

// ✅ Cheap check first
function check(uint256 a, uint256 b) public view returns (bool) {
    return cheapCheck(b) && expensiveCheck(a);
}
```

### Use Custom Errors

```solidity
// ❌ String errors - expensive
require(balance >= amount, "Insufficient balance");

// ✅ Custom errors - cheap
error InsufficientBalance(uint256 available, uint256 required);

if (balance < amount) {
    revert InsufficientBalance(balance, amount);
}

// Saves ~50 gas and reduces deployment size
```

## Loop Optimizations

### Cache Array Length

```solidity
// ❌ Bad - reads length each iteration
for (uint256 i = 0; i < array.length; i++) {
    // ...
}

// ✅ Good - cache length
uint256 length = array.length;
for (uint256 i = 0; i < length; i++) {
    // ...
}
```

### Use ++i Instead of i++

```solidity
// ❌ i++ creates temporary variable
for (uint256 i = 0; i < length; i++) {
    // ...
}

// ✅ ++i is slightly cheaper
for (uint256 i = 0; i < length; ++i) {
    // ...
}
```

### Use unchecked for Safe Math

```solidity
// ❌ Checked arithmetic (Solidity 0.8+)
for (uint256 i = 0; i < length; i++) {
    // Overflow check on every increment
}

// ✅ Unchecked when overflow impossible
for (uint256 i = 0; i < length;) {
    // ...
    unchecked { ++i; }  // Safe: i < length guarantees no overflow
}
```

### Avoid Zero-Initialization

```solidity
// ❌ Redundant - defaults to 0
uint256 count = 0;

// ✅ Let it default
uint256 count;

// ❌ Redundant in loop
for (uint256 i = 0; i < length; ++i) {
    // ...
}

// ✅ Implicit zero
for (uint256 i; i < length;) {
    // ...
    unchecked { ++i; }
}
```

## Data Type Optimizations

### Use bytes32 for Short Strings

```solidity
// ❌ String - dynamic, expensive
string public name = "Token";

// ✅ bytes32 - fixed, cheap
bytes32 public name = "Token";
```

### Use uint256 for Counters

```solidity
// ❌ Smaller types require masking
uint8 public count;

// ✅ uint256 is native EVM word size
uint256 public count;

// Exception: When packing in structs/storage
```

### Immutable and Constant

```solidity
// ❌ Storage variable
address public owner;

// ✅ Immutable - set once in constructor, stored in bytecode
address public immutable owner;

// ✅ Constant - compile-time, stored in bytecode
uint256 public constant MAX_SUPPLY = 1000000;
```

## Event Optimizations

### Use Indexed Sparingly

```solidity
// Indexed parameters cost more gas to emit
// But make filtering cheaper

// ✅ Index only what needs filtering
event Transfer(
    address indexed from,    // Indexed - filter by sender
    address indexed to,      // Indexed - filter by recipient
    uint256 amount           // Not indexed - just log
);
```

## Advanced Optimizations

### Assembly for Hot Paths

```solidity
// ✅ Assembly can save gas in critical paths
function efficientTransfer(address to, uint256 amount) internal {
    assembly {
        // Load balance from storage
        let bal := sload(add(balances.slot, caller()))
        
        // Check balance
        if lt(bal, amount) {
            revert(0, 0)
        }
        
        // Update balances
        sstore(add(balances.slot, caller()), sub(bal, amount))
        sstore(add(balances.slot, to), add(sload(add(balances.slot, to)), amount))
    }
}

// ⚠️ Use sparingly - harder to audit
```

### Batch Operations

```solidity
// ❌ Multiple transactions
function transfer(address to, uint256 amount) external;

// ✅ Batch in single transaction
function batchTransfer(
    address[] calldata recipients,
    uint256[] calldata amounts
) external {
    uint256 length = recipients.length;
    for (uint256 i; i < length;) {
        _transfer(recipients[i], amounts[i]);
        unchecked { ++i; }
    }
}
```

## Gas Comparison Table

| Technique | Before | After | Savings |
|-----------|--------|-------|---------|
| Custom errors | ~200 gas | ~150 gas | ~50 |
| ++i vs i++ | ~5 gas | ~0 gas | ~5 |
| Cache length | ~100 gas/iter | ~3 gas/iter | ~97 |
| calldata vs memory | ~60 gas/elem | ~0 | ~60 |
| Unchecked increment | ~40 gas | ~0 | ~40 |
| Storage packing | 20k gas/slot | 5k gas | ~15k |

## Gas Profiling

### Foundry

```bash
# Gas report
forge test --gas-report

# Snapshot
forge snapshot

# Compare snapshots
forge snapshot --diff
```

### Hardhat

```javascript
// hardhat.config.js
module.exports = {
  gasReporter: {
    enabled: true,
    currency: 'USD',
    gasPrice: 20
  }
};

// Run tests
npx hardhat test
```

## Optimization Checklist

```markdown
### Storage
- [ ] Variables packed efficiently
- [ ] Mappings used over arrays for lookups
- [ ] Storage cached in memory for loops
- [ ] Constants/immutables used where possible

### Functions
- [ ] External over public where possible
- [ ] Calldata over memory for read-only
- [ ] Custom errors over require strings

### Loops
- [ ] Array length cached
- [ ] ++i used
- [ ] Unchecked blocks for safe math
- [ ] No zero initialization

### General
- [ ] Events indexed appropriately
- [ ] Batch operations available
- [ ] Gas profiled and benchmarked
```
