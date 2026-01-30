---
title: "Smart Contract Audit"
---
# Smart Contract Audit

Comprehensive security audit workflow for Solidity smart contracts.

## Audit Process

### Phase 1: Understanding

1. Read documentation and specs
2. Understand the protocol's purpose
3. Identify trust assumptions
4. Map out contract interactions
5. Review previous audits (if any)

### Phase 2: Analysis

1. Manual code review
2. Automated tool analysis
3. Test coverage review
4. Edge case identification

### Phase 3: Testing

1. Write proof-of-concept exploits
2. Fuzz testing
3. Invariant testing
4. Fork testing against mainnet

### Phase 4: Reporting

1. Document findings with severity
2. Provide remediation guidance
3. Verify fixes

## Security Checklist

### Access Control

```solidity
// ❌ Missing access control
function mint(address to, uint256 amount) external {
    _mint(to, amount);
}

// ✅ Proper access control
function mint(address to, uint256 amount) external onlyOwner {
    _mint(to, amount);
}

// Check for:
// - [ ] All sensitive functions have access control
// - [ ] Role-based permissions are correct
// - [ ] Owner/admin functions are protected
// - [ ] Initializers can only be called once
```

### Reentrancy

```solidity
// ❌ Vulnerable to reentrancy
function withdraw() external {
    uint256 amount = balances[msg.sender];
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] = 0;  // State updated AFTER external call
}

// ✅ Protected (Checks-Effects-Interactions)
function withdraw() external {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0;  // State updated BEFORE external call
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}

// ✅ Using ReentrancyGuard
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

function withdraw() external nonReentrant {
    // ...
}
```

### Integer Overflow/Underflow

```solidity
// Solidity 0.8+ has built-in overflow checks
// But watch for unchecked blocks

// ❌ Dangerous unchecked
unchecked {
    balance -= amount;  // Can underflow!
}

// ✅ Safe unchecked (only when mathematically proven safe)
unchecked {
    // Safe because we checked i < array.length
    for (uint256 i = 0; i < array.length; ++i) {
        // ...
    }
}
```

### External Calls

```solidity
// ❌ Using transfer (limited gas, can fail)
payable(recipient).transfer(amount);

// ❌ Using send (returns bool, often ignored)
payable(recipient).send(amount);

// ✅ Using call with checks
(bool success, ) = recipient.call{value: amount}("");
require(success, "Transfer failed");

// ✅ Check return values from external calls
(bool success, bytes memory data) = target.call(payload);
require(success, "Call failed");
```

### Oracle Manipulation

```solidity
// ❌ Vulnerable - single block price
uint256 price = pair.getReserves();

// ✅ Use TWAP or Chainlink
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

function getPrice() public view returns (uint256) {
    (, int256 price, , uint256 updatedAt, ) = priceFeed.latestRoundData();
    require(block.timestamp - updatedAt < MAX_DELAY, "Stale price");
    require(price > 0, "Invalid price");
    return uint256(price);
}
```

### Front-Running

```solidity
// ❌ Vulnerable to sandwich attack
function swap(uint256 amountIn, uint256 minAmountOut) external {
    // Attacker sees this in mempool, front-runs
}

// ✅ Use commit-reveal
mapping(bytes32 => bool) public commitments;

function commit(bytes32 hash) external {
    commitments[hash] = true;
}

function reveal(uint256 amount, bytes32 secret) external {
    bytes32 hash = keccak256(abi.encodePacked(msg.sender, amount, secret));
    require(commitments[hash], "Invalid commitment");
    // Process
}

// ✅ Use deadline and slippage protection
function swap(
    uint256 amountIn,
    uint256 minAmountOut,
    uint256 deadline
) external {
    require(block.timestamp <= deadline, "Expired");
    // ...
    require(amountOut >= minAmountOut, "Slippage");
}
```

### Flash Loan Attacks

```solidity
// Check for:
// - [ ] Price oracles can be manipulated in single tx
// - [ ] Governance can be manipulated with borrowed tokens
// - [ ] Collateral can be manipulated

// ✅ Snapshot balances at previous block
function getVotingPower(address user) public view returns (uint256) {
    return balanceOfAt(user, block.number - 1);
}
```

### Denial of Service

```solidity
// ❌ Unbounded loop
function distribute(address[] calldata recipients) external {
    for (uint256 i = 0; i < recipients.length; i++) {
        token.transfer(recipients[i], amount);
    }
}

// ✅ Bounded or pull pattern
uint256 public constant MAX_RECIPIENTS = 100;

function distribute(address[] calldata recipients) external {
    require(recipients.length <= MAX_RECIPIENTS, "Too many");
    // ...
}

// ❌ Relies on external call success
function withdrawAll() external {
    for (uint256 i = 0; i < users.length; i++) {
        payable(users[i]).transfer(balances[users[i]]);  // One failure blocks all
    }
}

// ✅ Pull pattern
function withdraw() external {
    uint256 amount = balances[msg.sender];
    balances[msg.sender] = 0;
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}
```

### Signature Issues

```solidity
// ❌ Missing nonce (replay attack)
function execute(bytes memory signature, address to, uint256 amount) external {
    bytes32 hash = keccak256(abi.encodePacked(to, amount));
    address signer = ECDSA.recover(hash, signature);
    require(signer == owner);
    // Execute
}

// ✅ With nonce and domain separator
mapping(address => uint256) public nonces;

function execute(
    bytes memory signature,
    address to,
    uint256 amount,
    uint256 nonce,
    uint256 deadline
) external {
    require(block.timestamp <= deadline, "Expired");
    require(nonces[msg.sender] == nonce, "Invalid nonce");
    
    bytes32 hash = keccak256(abi.encodePacked(
        "\x19\x01",
        DOMAIN_SEPARATOR,
        keccak256(abi.encode(to, amount, nonce, deadline))
    ));
    
    address signer = ECDSA.recover(hash, signature);
    require(signer == owner);
    
    nonces[msg.sender]++;
    // Execute
}
```

## Automated Tools

```bash
# Slither - static analyzer
slither . --print human-summary
slither . --detect reentrancy-eth,uninitialized-state

# Mythril - symbolic execution
myth analyze contracts/Contract.sol

# Echidna - fuzzer
echidna-test . --contract TestContract

# Foundry invariant tests
forge test --match-test invariant
```

## Audit Report Template

```markdown
# Security Audit Report

## Executive Summary
- **Project:** [Name]
- **Commit:** [Hash]
- **Auditors:** [Names]
- **Date:** [Date]
- **Overall Risk:** [Critical/High/Medium/Low]

## Scope
- Contracts reviewed
- Lines of code
- External dependencies

## Findings Summary
| Severity | Count | Fixed |
|----------|-------|-------|
| Critical | X | X |
| High | X | X |
| Medium | X | X |
| Low | X | X |
| Informational | X | X |

## Detailed Findings

### [C-1] Critical Finding Title
**Severity:** Critical
**Status:** Fixed/Acknowledged/Open
**Location:** Contract.sol#L123

**Description:**
[What the issue is]

**Impact:**
[What could happen]

**Proof of Concept:**
```solidity
// Attack code
```

**Recommendation:**
[How to fix]

**Resolution:**
[What was done]

## Appendix
- Tools used
- Test results
- Gas analysis
```

## Common Vulnerability Patterns (SWC)

| SWC ID | Name | Description |
|--------|------|-------------|
| SWC-100 | Function Default Visibility | Missing visibility |
| SWC-101 | Integer Overflow/Underflow | Math errors |
| SWC-104 | Unchecked Call Return | Ignored return value |
| SWC-106 | Unprotected SELFDESTRUCT | Anyone can destroy |
| SWC-107 | Reentrancy | State after external call |
| SWC-110 | Assert Violation | Reachable assert |
| SWC-113 | DoS with Failed Call | Blocking withdrawals |
| SWC-114 | Transaction Order Dependence | Front-running |
| SWC-115 | Authorization through tx.origin | Phishing |
| SWC-116 | Block Timestamp Manipulation | Miner manipulation |
