# Upgrade Solidity Version

Guide to migrating smart contracts to newer Solidity versions.

## Version Compatibility

### Major Version Changes

| From | To | Key Changes |
|------|-----|-------------|
| 0.7.x | 0.8.x | Built-in overflow checks, ABI coder v2 default |
| 0.8.0 | 0.8.4 | Custom errors, bytes.concat() |
| 0.8.4 | 0.8.8 | Override improvements |
| 0.8.8 | 0.8.13 | Using for at file level |
| 0.8.13 | 0.8.18 | Unicode, optimizer improvements |
| 0.8.18 | 0.8.20+ | Shanghai EVM (PUSH0), transient storage |

## Upgrading from 0.7.x to 0.8.x

### Built-in Overflow Checks

```solidity
// 0.7.x - needed SafeMath
import "@openzeppelin/contracts/math/SafeMath.sol";
using SafeMath for uint256;

uint256 result = a.add(b);

// 0.8.x - built-in checks
uint256 result = a + b;  // Reverts on overflow

// Use unchecked for gas optimization when safe
unchecked {
    result = a + b;  // No overflow check
}
```

### ABI Coder v2 Default

```solidity
// 0.7.x - had to enable
pragma experimental ABIEncoderV2;

// 0.8.x - default, can disable with
pragma abicoder v1;
```

### Constructor Visibility

```solidity
// 0.7.x
constructor() public { }

// 0.8.x - no visibility needed
constructor() { }
```

### Abstract Contracts

```solidity
// 0.7.x - could be implicit
contract Base {
    function foo() virtual public;
}

// 0.8.x - must be explicit
abstract contract Base {
    function foo() virtual public;
}
```

### Virtual/Override

```solidity
// 0.8.x requires explicit virtual and override
contract Base {
    function foo() public virtual returns (uint256) {
        return 1;
    }
}

contract Child is Base {
    function foo() public override returns (uint256) {
        return 2;
    }
}
```

## Upgrading Within 0.8.x

### 0.8.4+: Custom Errors

```solidity
// Before - string errors
require(balance >= amount, "Insufficient balance");

// After - custom errors
error InsufficientBalance(uint256 available, uint256 required);

if (balance < amount) {
    revert InsufficientBalance(balance, amount);
}
```

### 0.8.4+: bytes.concat()

```solidity
// Before
bytes memory result = abi.encodePacked(a, b);

// After - for bytes concatenation
bytes memory result = bytes.concat(a, b);
```

### 0.8.12+: string.concat()

```solidity
// Before
string memory result = string(abi.encodePacked(a, b));

// After
string memory result = string.concat(a, b);
```

### 0.8.13+: Using for at File Level

```solidity
// Before - inside contract
contract MyContract {
    using SafeMath for uint256;
}

// After - file level
using SafeMath for uint256;

contract MyContract {
    // SafeMath available
}
```

### 0.8.18+: Named Parameters in Mappings

```solidity
// Before
mapping(address => uint256) balances;

// After - named parameters
mapping(address user => uint256 balance) balances;
```

### 0.8.20+: PUSH0 Opcode

```solidity
// 0.8.20+ uses PUSH0 for pushing 0 to stack
// Slightly more gas efficient
// Note: May not be supported on all chains yet

pragma solidity ^0.8.20;
// Will use PUSH0 when pushing 0
```

### 0.8.24+: Transient Storage (EIP-1153)

```solidity
// Temporary storage that's cleared after transaction
// Much cheaper than regular storage for temp data

// tstore and tload opcodes
assembly {
    tstore(slot, value)  // Store transiently
    let v := tload(slot) // Load transient value
}
```

## Migration Checklist

### Preparation

```markdown
- [ ] Review changelog for target version
- [ ] Check OpenZeppelin compatibility
- [ ] Check other dependency compatibility
- [ ] Review breaking changes
- [ ] Set up test environment
```

### Code Changes

```markdown
- [ ] Update pragma statement
- [ ] Remove SafeMath usage (0.8+)
- [ ] Update constructor visibility
- [ ] Add abstract keyword where needed
- [ ] Add virtual/override keywords
- [ ] Update to custom errors
- [ ] Review unchecked blocks
```

### Testing

```markdown
- [ ] All existing tests pass
- [ ] Gas comparison before/after
- [ ] Test on target EVM version
- [ ] Check chain compatibility
```

### Deployment

```markdown
- [ ] Update compiler settings
- [ ] Update deployment scripts
- [ ] Verify on block explorer
- [ ] Update documentation
```

## Common Migration Issues

### Issue: SafeMath No Longer Needed

```solidity
// Remove SafeMath imports and usage
// Before
import "@openzeppelin/contracts/math/SafeMath.sol";
using SafeMath for uint256;
uint256 result = a.add(b);

// After
uint256 result = a + b;
```

### Issue: Public Constructor

```solidity
// Error in 0.8+
constructor() public { }  // Error!

// Fix
constructor() { }
```

### Issue: Missing Override

```solidity
// Error in 0.8+
function foo() public { }  // Error if overriding

// Fix
function foo() public override { }
```

### Issue: License Identifier

```solidity
// Warning if missing
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
```

### Issue: Receive/Fallback

```solidity
// 0.6+ split fallback into receive and fallback
// Ensure both are properly defined if needed

receive() external payable {
    // Handle plain ETH transfers
}

fallback() external payable {
    // Handle calls with data
}
```

## Version-Specific Features to Adopt

### Recommended for 0.8.4+

```solidity
// 1. Custom errors (saves gas)
error Unauthorized();
error InvalidAmount(uint256 amount);

// 2. bytes.concat for bytes
bytes memory data = bytes.concat(a, b);
```

### Recommended for 0.8.18+

```solidity
// 1. Named mapping parameters
mapping(address owner => mapping(address spender => uint256 amount)) allowances;
```

### Recommended for 0.8.20+

```solidity
// 1. Understand PUSH0 implications for chain compatibility
// If deploying to older chains, may need to target older EVM
```

## Compiler Settings

### Foundry (foundry.toml)

```toml
[profile.default]
solc_version = "0.8.20"
evm_version = "paris"  # or "shanghai" for PUSH0

[profile.default.optimizer]
enabled = true
runs = 200
```

### Hardhat (hardhat.config.js)

```javascript
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      evmVersion: "paris"  // or "shanghai"
    }
  }
};
```

## Chain Compatibility

| EVM Version | Chains Supporting |
|-------------|-------------------|
| Paris | Most chains |
| Shanghai | Ethereum, some L2s |
| Cancun | Ethereum (after Dencun) |

Check target chain's EVM compatibility before using features like PUSH0 or transient storage.
