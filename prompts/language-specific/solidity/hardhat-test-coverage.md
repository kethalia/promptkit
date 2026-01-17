# Hardhat Test Coverage

Generate comprehensive Hardhat tests using Mocha/Chai and ethers.js that verify actual contract behavior with specific assertions on return values and state changes.

---

## Context

Gather the following before starting:
- Contract source files to test
- Existing test files and patterns in the codebase
- hardhat.config.js/ts configuration
- Test dependencies (@nomicfoundation/hardhat-toolbox, chai, etc.)
- Any existing test utilities or fixtures
- ethers.js version (v5 vs v6 syntax differences)

## Instructions

1. **Analyze contract interface and state**
   - List all public/external functions
   - Identify state variables and their access patterns
   - Map function dependencies and state transitions
   - Document expected invariants
   - Identify privileged roles and access controls

2. **Set up test file structure**
   
   ```typescript
   import { expect } from "chai";
   import { ethers } from "hardhat";
   import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
   import { ContractUnderTest } from "../typechain-types";
   import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

   describe("ContractUnderTest", function () {
     let contract: ContractUnderTest;
     let owner: SignerWithAddress;
     let user1: SignerWithAddress;
     let user2: SignerWithAddress;

     async function deployFixture() {
       const [owner, user1, user2] = await ethers.getSigners();
       
       const ContractFactory = await ethers.getContractFactory("ContractUnderTest");
       const contract = await ContractFactory.deploy();
       
       return { contract, owner, user1, user2 };
     }

     beforeEach(async function () {
       ({ contract, owner, user1, user2 } = await loadFixture(deployFixture));
     });

     // Tests go here
   });
   ```

3. **Write unit tests for each function**
   
   For each function, test:
   - Happy path with valid inputs
   - Access control (unauthorized callers should revert)
   - Input validation (boundary values, zero addresses)
   - State changes (verify storage updates)
   - Return values (verify correctness)
   - Events (verify emission with correct parameters)

   ```typescript
   describe("transfer", function () {
     it("should update balances correctly", async function () {
       const amount = ethers.parseEther("100");
       
       // Setup: give user1 tokens
       await contract.mint(user1.address, amount);
       
       // Execute
       await contract.connect(user1).transfer(user2.address, amount);
       
       // Verify state changes
       expect(await contract.balanceOf(user1.address)).to.equal(0n);
       expect(await contract.balanceOf(user2.address)).to.equal(amount);
     });

     it("should emit Transfer event with correct parameters", async function () {
       const amount = ethers.parseEther("100");
       await contract.mint(user1.address, amount);
       
       await expect(contract.connect(user1).transfer(user2.address, amount))
         .to.emit(contract, "Transfer")
         .withArgs(user1.address, user2.address, amount);
     });

     it("should revert when sender has insufficient balance", async function () {
       await expect(
         contract.connect(user1).transfer(user2.address, 1n)
       ).to.be.revertedWithCustomError(contract, "InsufficientBalance");
     });
   });
   ```

4. **Test access control with different signers**
   
   ```typescript
   describe("Access Control", function () {
     describe("onlyOwner functions", function () {
       it("should allow owner to call adminFunction", async function () {
         await expect(contract.connect(owner).adminFunction())
           .to.not.be.reverted;
       });

       it("should revert when non-owner calls adminFunction", async function () {
         await expect(
           contract.connect(user1).adminFunction()
         ).to.be.revertedWithCustomError(contract, "Unauthorized");
       });

       it("should update owner after ownership transfer", async function () {
         await contract.connect(owner).transferOwnership(user1.address);
         
         expect(await contract.owner()).to.equal(user1.address);
         
         // Old owner should no longer have access
         await expect(
           contract.connect(owner).adminFunction()
         ).to.be.revertedWithCustomError(contract, "Unauthorized");
         
         // New owner should have access
         await expect(contract.connect(user1).adminFunction())
           .to.not.be.reverted;
       });
     });
   });
   ```

5. **Test events thoroughly**
   
   ```typescript
   describe("Events", function () {
     it("should emit Deposit event with correct args", async function () {
       const amount = ethers.parseEther("1");
       
       await expect(contract.connect(user1).deposit({ value: amount }))
         .to.emit(contract, "Deposit")
         .withArgs(user1.address, amount);
     });

     it("should emit multiple events in correct order", async function () {
       await expect(contract.complexOperation())
         .to.emit(contract, "FirstEvent")
         .and.to.emit(contract, "SecondEvent");
     });

     it("should not emit event on failed transaction", async function () {
       await expect(
         contract.connect(user1).withdraw(ethers.parseEther("1000"))
       ).to.be.reverted;
       
       // Verify no events were emitted by checking logs
     });
   });
   ```

6. **Verify actual state changes, not just non-reversion**
   
   ```typescript
   // BAD: Only checks it doesn't revert
   it("should deposit (BAD)", async function () {
     await contract.deposit({ value: ethers.parseEther("1") });
   });

   // GOOD: Verifies actual state change
   it("should deposit and update balance", async function () {
     const amount = ethers.parseEther("1");
     const balanceBefore = await contract.balanceOf(user1.address);
     
     await contract.connect(user1).deposit({ value: amount });
     
     const balanceAfter = await contract.balanceOf(user1.address);
     expect(balanceAfter).to.equal(balanceBefore + amount);
   });

   // GOOD: Verifies return value
   it("should return correct share amount", async function () {
     const depositAmount = ethers.parseEther("1");
     
     const shares = await contract.connect(user1).deposit.staticCall({ 
       value: depositAmount 
     });
     
     expect(shares).to.equal(depositAmount); // 1:1 for first deposit
   });
   ```

7. **Test edge cases and boundaries**
   
   ```typescript
   describe("Edge Cases", function () {
     it("should revert on zero amount deposit", async function () {
       await expect(
         contract.connect(user1).deposit({ value: 0n })
       ).to.be.revertedWithCustomError(contract, "ZeroAmount");
     });

     it("should revert on transfer to zero address", async function () {
       await contract.mint(user1.address, 100n);
       
       await expect(
         contract.connect(user1).transfer(ethers.ZeroAddress, 100n)
       ).to.be.revertedWithCustomError(contract, "InvalidRecipient");
     });

     it("should handle max uint256 correctly", async function () {
       const maxUint = ethers.MaxUint256;
       // Test behavior with max values
     });

     it("should handle empty arrays", async function () {
       await expect(contract.batchTransfer([], []))
         .to.be.revertedWithCustomError(contract, "EmptyArray");
     });
   });
   ```

8. **Test with time manipulation**
   
   ```typescript
   import { time } from "@nomicfoundation/hardhat-toolbox/network-helpers";

   describe("Time-dependent functions", function () {
     it("should allow withdrawal after lock period", async function () {
       await contract.connect(user1).deposit({ value: ethers.parseEther("1") });
       
       // Fast forward 7 days
       await time.increase(7 * 24 * 60 * 60);
       
       await expect(contract.connect(user1).withdraw())
         .to.not.be.reverted;
     });

     it("should revert withdrawal before lock period ends", async function () {
       await contract.connect(user1).deposit({ value: ethers.parseEther("1") });
       
       // Fast forward only 1 day
       await time.increase(24 * 60 * 60);
       
       await expect(
         contract.connect(user1).withdraw()
       ).to.be.revertedWithCustomError(contract, "LockPeriodActive");
     });
   });
   ```

9. **Test reverts with specific error messages/codes**
   
   ```typescript
   describe("Revert conditions", function () {
     it("should revert with custom error", async function () {
       await expect(contract.failingFunction())
         .to.be.revertedWithCustomError(contract, "CustomError");
     });

     it("should revert with custom error and args", async function () {
       await expect(contract.failingFunction())
         .to.be.revertedWithCustomError(contract, "CustomError")
         .withArgs(user1.address, 100n);
     });

     it("should revert with reason string", async function () {
       await expect(contract.legacyFunction())
         .to.be.revertedWith("Not authorized");
     });

     it("should revert with panic code", async function () {
       await expect(contract.divideByZero())
         .to.be.revertedWithPanic(0x12); // Division by zero
     });
   });
   ```

10. **Use fixtures for efficient test isolation**
    
    ```typescript
    async function deployWithTokensFixture() {
      const { contract, owner, user1, user2 } = await loadFixture(deployFixture);
      
      // Additional setup
      await contract.mint(user1.address, ethers.parseEther("1000"));
      await contract.mint(user2.address, ethers.parseEther("1000"));
      
      return { contract, owner, user1, user2 };
    }

    describe("With pre-minted tokens", function () {
      beforeEach(async function () {
        ({ contract, owner, user1, user2 } = await loadFixture(
          deployWithTokensFixture
        ));
      });

      it("should transfer between users", async function () {
        // Tests start with users having tokens
      });
    });
    ```

## Output Format

### Test File Structure

```
test/
├── ContractName.test.ts        # Main test file
├── ContractName.access.test.ts # Access control tests
├── ContractName.edge.test.ts   # Edge case tests
└── helpers/
    ├── fixtures.ts             # Shared fixtures
    └── constants.ts            # Test constants
```

### Test Organization

```typescript
describe("ContractName", function () {
  describe("Deployment", function () { /* constructor tests */ });
  
  describe("functionName", function () {
    describe("Success cases", function () { /* happy paths */ });
    describe("Access control", function () { /* auth tests */ });
    describe("Validation", function () { /* input validation */ });
    describe("Edge cases", function () { /* boundaries */ });
  });
  
  describe("Integration", function () { /* multi-function flows */ });
});
```

### Coverage Summary

| Function | Unit | Access | Events | Reverts | Edge |
|----------|------|--------|--------|---------|------|
| deposit | ✓ | ✓ | ✓ | ✓ | ✓ |
| withdraw | ✓ | ✓ | ✓ | ✓ | ✓ |
| transfer | ✓ | - | ✓ | ✓ | ✓ |

## Critical: Tests Must Make Specific Assertions

**IMPORTANT**: Every test must make specific assertions on return values and state changes. Tests that only check for reverts or non-reversion are insufficient.

```typescript
// INSUFFICIENT - only checks non-reversion
it("should deposit (BAD)", async function () {
  await contract.deposit({ value: ethers.parseEther("1") });
  // No assertions!
});

// CORRECT - verifies state changes
it("should deposit and update balance", async function () {
  const balanceBefore = await contract.balanceOf(user1.address);
  
  await contract.connect(user1).deposit({ value: ethers.parseEther("1") });
  
  // Assert on state changes
  expect(await contract.balanceOf(user1.address))
    .to.equal(balanceBefore + ethers.parseEther("1"));
  expect(await ethers.provider.getBalance(contract.target))
    .to.equal(ethers.parseEther("1"));
});

// CORRECT - verifies return value using staticCall
it("should return correct share amount", async function () {
  const shares = await contract.connect(user1).deposit.staticCall({
    value: ethers.parseEther("1")
  });
  
  expect(shares).to.equal(ethers.parseEther("1")); // Assert on return
});

// CORRECT - verifies multiple state changes
it("should transfer and update both balances", async function () {
  const amount = ethers.parseEther("50");
  await contract.mint(user1.address, ethers.parseEther("100"));
  
  await contract.connect(user1).transfer(user2.address, amount);
  
  expect(await contract.balanceOf(user1.address)).to.equal(amount);
  expect(await contract.balanceOf(user2.address)).to.equal(amount);
});
```

## Interactive Decisions

Ask the user to clarify:
- **ethers version**: Using ethers v5 or v6 (syntax differences)?
- **TypeScript**: Generate .ts or .js test files?
- **Test scope**: All functions or specific critical paths?
- **Coverage target**: What percentage coverage is acceptable?
- **Integration tests**: Include tests with external protocol interactions?
- **Gas reporting**: Enable hardhat-gas-reporter for the tests?
