---
title: "Test Coverage"
---
# Test Coverage

Comprehensive guide to testing Solidity contracts with Foundry and Hardhat.

## Foundry Testing

### Setup

```bash
# Initialize project
forge init my-project
cd my-project

# Project structure
├── src/           # Contracts
├── test/          # Tests
├── script/        # Deployment scripts
└── foundry.toml   # Configuration
```

### Basic Test Structure

```solidity
// test/Counter.t.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {Counter} from "../src/Counter.sol";

contract CounterTest is Test {
    Counter public counter;

    // Runs before each test
    function setUp() public {
        counter = new Counter();
    }

    // Test functions must start with "test"
    function test_InitialValue() public view {
        assertEq(counter.count(), 0);
    }

    function test_Increment() public {
        counter.increment();
        assertEq(counter.count(), 1);
    }

    // Test for reverts
    function test_RevertWhen_Unauthorized() public {
        vm.prank(address(0x1));  // Change msg.sender
        vm.expectRevert("Unauthorized");
        counter.adminFunction();
    }
}
```

### Foundry Cheatcodes

```solidity
// Address manipulation
vm.prank(address);           // Set msg.sender for next call
vm.startPrank(address);      // Set msg.sender until stopPrank
vm.stopPrank();

// Time manipulation
vm.warp(timestamp);          // Set block.timestamp
vm.roll(blockNumber);        // Set block.number
skip(seconds);               // Advance time

// Balance manipulation
deal(address, amount);       // Set ETH balance
deal(token, address, amount);// Set token balance

// Expectation
vm.expectRevert();           // Expect next call to revert
vm.expectRevert("message");  // Expect specific message
vm.expectRevert(CustomError.selector);
vm.expectEmit(true, false, false, true);  // Expect event

// State
vm.snapshot();               // Save state
vm.revertTo(snapshot);       // Restore state

// Fork
vm.createFork(rpcUrl);       // Create fork
vm.selectFork(forkId);       // Switch fork
```

### Fuzz Testing

```solidity
// Foundry auto-generates random inputs
function testFuzz_Deposit(uint256 amount) public {
    // Bound inputs to valid range
    amount = bound(amount, 1, type(uint128).max);
    
    deal(address(this), amount);
    vault.deposit{value: amount}();
    
    assertEq(vault.balanceOf(address(this)), amount);
}

// Assume to filter inputs
function testFuzz_Transfer(address to, uint256 amount) public {
    vm.assume(to != address(0));
    vm.assume(amount > 0 && amount <= balance);
    // ...
}
```

### Invariant Testing

```solidity
// test/invariants/VaultInvariant.t.sol
contract VaultInvariantTest is Test {
    Vault vault;
    Handler handler;

    function setUp() public {
        vault = new Vault();
        handler = new Handler(vault);
        
        // Target the handler contract
        targetContract(address(handler));
    }

    // Invariant: total deposits == contract balance
    function invariant_BalanceMatchesDeposits() public view {
        assertEq(
            address(vault).balance,
            vault.totalDeposits()
        );
    }
}

// Handler defines actions fuzzer can take
contract Handler is Test {
    Vault vault;
    
    constructor(Vault _vault) {
        vault = _vault;
    }
    
    function deposit(uint256 amount) public {
        amount = bound(amount, 0, 10 ether);
        deal(address(this), amount);
        vault.deposit{value: amount}();
    }
    
    function withdraw(uint256 amount) public {
        amount = bound(amount, 0, vault.balanceOf(address(this)));
        vault.withdraw(amount);
    }
}
```

### Fork Testing

```solidity
contract ForkTest is Test {
    uint256 mainnetFork;
    
    function setUp() public {
        mainnetFork = vm.createFork(vm.envString("MAINNET_RPC_URL"));
    }
    
    function test_ForkInteraction() public {
        vm.selectFork(mainnetFork);
        
        // Interact with mainnet contracts
        IERC20 dai = IERC20(0x6B175474E89094C44Da98b954EescdeCB5);
        uint256 balance = dai.balanceOf(someWhale);
        
        assertGt(balance, 0);
    }
}
```

### Running Foundry Tests

```bash
# Run all tests
forge test

# Verbose output
forge test -vvvv

# Run specific test
forge test --match-test test_Deposit

# Run specific contract
forge test --match-contract VaultTest

# Gas report
forge test --gas-report

# Coverage
forge coverage

# Coverage report
forge coverage --report lcov
genhtml lcov.info -o coverage
```

## Hardhat Testing

### Setup

```bash
# Initialize project
npx hardhat init

# Install dependencies
npm install --save-dev @nomicfoundation/hardhat-toolbox
```

### Basic Test Structure

```javascript
// test/Counter.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Counter", function () {
  let counter;
  let owner;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
  });

  describe("Deployment", function () {
    it("Should initialize count to 0", async function () {
      expect(await counter.count()).to.equal(0);
    });
  });

  describe("Increment", function () {
    it("Should increment count", async function () {
      await counter.increment();
      expect(await counter.count()).to.equal(1);
    });
  });

  describe("Access Control", function () {
    it("Should revert if not owner", async function () {
      const [_, other] = await ethers.getSigners();
      await expect(
        counter.connect(other).adminFunction()
      ).to.be.revertedWith("Unauthorized");
    });
  });
});
```

### TypeScript Tests

```typescript
// test/Counter.ts
import { expect } from "chai";
import { ethers } from "hardhat";
import { Counter } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("Counter", function () {
  let counter: Counter;
  let owner: SignerWithAddress;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();
    const Counter = await ethers.getContractFactory("Counter");
    counter = await Counter.deploy();
  });

  it("Should increment", async function () {
    await counter.increment();
    expect(await counter.count()).to.equal(1n);
  });
});
```

### Time Manipulation

```javascript
const { time } = require("@nomicfoundation/hardhat-network-helpers");

// Advance time
await time.increase(3600); // 1 hour

// Set specific timestamp
await time.increaseTo(timestamp);

// Mine blocks
await mine(100);

// Get latest block time
const latest = await time.latest();
```

### Balance Manipulation

```javascript
const { setBalance } = require("@nomicfoundation/hardhat-network-helpers");

// Set ETH balance
await setBalance(address, ethers.parseEther("100"));

// For tokens, use impersonation
await network.provider.request({
  method: "hardhat_impersonateAccount",
  params: [whaleAddress],
});
const whale = await ethers.getSigner(whaleAddress);
await token.connect(whale).transfer(recipient, amount);
```

### Testing Events

```javascript
// Check event emission
await expect(counter.increment())
  .to.emit(counter, "Incremented")
  .withArgs(1);

// Multiple events
await expect(tx)
  .to.emit(contract, "Event1")
  .and.to.emit(contract, "Event2");
```

### Testing Reverts

```javascript
// Simple revert
await expect(
  contract.restrictedFunction()
).to.be.reverted;

// With message
await expect(
  contract.restrictedFunction()
).to.be.revertedWith("Unauthorized");

// Custom error
await expect(
  contract.withdraw(tooMuch)
).to.be.revertedWithCustomError(contract, "InsufficientBalance")
  .withArgs(balance, tooMuch);
```

### Fork Testing with Hardhat

```javascript
// hardhat.config.js
module.exports = {
  networks: {
    hardhat: {
      forking: {
        url: process.env.MAINNET_RPC_URL,
        blockNumber: 18000000
      }
    }
  }
};

// In test
describe("Fork Tests", function () {
  it("Should interact with mainnet", async function () {
    const dai = await ethers.getContractAt(
      "IERC20",
      "0x6B175474E89094C44Da98b954EedscdeCB5"
    );
    const balance = await dai.balanceOf(whaleAddress);
    expect(balance).to.be.gt(0);
  });
});
```

### Running Hardhat Tests

```bash
# Run all tests
npx hardhat test

# Run specific file
npx hardhat test test/Counter.js

# With gas reporter
REPORT_GAS=true npx hardhat test

# Coverage
npx hardhat coverage

# Parallel
npx hardhat test --parallel
```

## Coverage Best Practices

### What to Test

```markdown
- [ ] All public/external functions
- [ ] All require/revert conditions
- [ ] All state changes
- [ ] All events
- [ ] Edge cases (0, max values)
- [ ] Access control
- [ ] Reentrancy scenarios
- [ ] Integration with other contracts
```

### Coverage Targets

| Type | Target |
|------|--------|
| Line Coverage | 90%+ |
| Branch Coverage | 85%+ |
| Function Coverage | 100% |
| Critical Paths | 100% |

### Test Organization

```
test/
├── unit/              # Unit tests
│   ├── Counter.t.sol
│   └── Vault.t.sol
├── integration/       # Integration tests
│   └── Protocol.t.sol
├── invariants/        # Invariant tests
│   └── Invariants.t.sol
├── fork/              # Fork tests
│   └── Mainnet.t.sol
└── utils/             # Test utilities
    └── Helpers.sol
```

## Comparison: Foundry vs Hardhat

| Feature | Foundry | Hardhat |
|---------|---------|---------|
| Language | Solidity | JS/TS |
| Speed | Very Fast | Slower |
| Fuzzing | Built-in | Plugin |
| Forking | Built-in | Built-in |
| Debugging | Traces | console.log |
| Ecosystem | Growing | Mature |
| Gas Reports | Built-in | Plugin |

### When to Use Each

**Foundry:**
- Need fast test execution
- Want to write tests in Solidity
- Need fuzzing/invariant testing
- Prefer minimal dependencies

**Hardhat:**
- Need JavaScript/TypeScript
- Want rich plugin ecosystem
- Prefer familiar testing frameworks
- Need extensive tooling integration
