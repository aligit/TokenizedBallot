# Encode Lesson-11 test cases Troubleshooting

```shell
❯ yarn hardhat test


  NFT Shop
    When the Shop contract is deployed
      1) defines the ratio as provided in parameters
      ✔ uses a valid ERC20 as payment token (58ms)
      When a user purchase an ERC20 from the Token contract
        ✔ charges the correct amount of ETH
        2) gives the correct amount of tokens
        When a user burns an ERC20 at the Token contract
          3) "before each" hook for "gives the correct amount of ETH"
      When a user purchase a NFT from the Shop contract
        4) "before each" hook for "charges the correct amount of tokens"


  2 passing (2s)
  4 failing

  1) NFT Shop
       When the Shop contract is deployed
         defines the ratio as provided in parameters:

      AssertionError: expected 200000000000000000 to equal 1. The numerical values of the given "ethers.BigNumber"
      + expected - actual

      -200000000000000000
      +1

      at Context.<anonymous> (tests/TokenSale.ts:49:24)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at runNextTicks (node:internal/process/task_queues:65:3)
      at listOnTimeout (node:internal/timers:528:9)
      at processTimers (node:internal/timers:502:7)

  2) NFT Shop
       When the Shop contract is deployed
         When a user purchase an ERC20 from the Token contract
           gives the correct amount of tokens:

      AssertionError: expected 5 to equal 1000000000000000000. The numerical values of the given "ethers.BigNumber
      + expected - actual

      -5
      +1000000000000000000

      at Context.<anonymous> (tests/TokenSale.ts:89:30)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at runNextTicks (node:internal/process/task_queues:65:3)
      at listOnTimeout (node:internal/timers:528:9)
      at processTimers (node:internal/timers:502:7)

  3) NFT Shop
       When the Shop contract is deployed
         When a user purchase an ERC20 from the Token contract
           When a user burns an ERC20 at the Token contract
             "before each" hook for "gives the correct amount of ETH":
     Error: cannot estimate gas; transaction may fail or may require manual gas limit [ See: https://links.ethers.amount\n    ) internal virtual {}\n\n    /**\n     * @dev Hook that is called after any transfer of tokens. This includes\n     * minting and burning.\n     *\n     * Calling conditions:\n     *\n     * - when `from` and `to` are both non-zero, `amount` of ``from``'s tokens\n     * has been transferred to `to`.\n     * - when `from` is zero, `amount` tokens have been minted for `to`.\n     * - when `to` is zero, `amount` of ``from``'s tokens have been burned.\n     * - `from` and `to` are never both zero.\n     *\n     * To learn more about hooks, head to xref:ROOT:extending-contracts.adoc#using-hooks[Using Hooks].\n     */\n    function _afterTokenTransfer(\n        address from,\n        address to,\n        uint256 amount\n    ) internal virtual {}\n}\n","line":291,"range":[9688,9759]},"message":{"value":{"type":"Buffer","data":[8,195,121,160,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,32,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,34,69,82,67,50,48,58,32,98,117,114,110,32,97,109,111,117,110,116,32,101,120,99,101,101,100,115,32,98,97,108,97,110,99,101,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]},"_selector":"08c379a0"},"isInvalidOpcodeError":false}],"data":"0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000002245524332303a206275726e20616d6f756e7420657863656564732062616c616e6365000000000000000000000000000000000000000000000000000000000000"}, code=UNPREDICTABLE_GAS_LIMIT, version=providers/5.7.2)
      at Logger.makeError (node_modules/@ethersproject/logger/src.ts/index.ts:269:28)
      at Logger.throwError (node_modules/@ethersproject/logger/src.ts/index.ts:281:20)
      at checkError (node_modules/@ethersproject/providers/src.ts/json-rpc-provider.ts:78:20)
      at EthersProviderWrapper.<anonymous> (node_modules/@ethersproject/providers/src.ts/json-rpc-provider.ts:642:20)
      at step (node_modules/@ethersproject/providers/lib/json-rpc-provider.js:48:23)
      at Object.throw (node_modules/@ethersproject/providers/lib/json-rpc-provider.js:29:53)
      at rejected (node_modules/@ethersproject/providers/lib/json-rpc-provider.js:21:65)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at runNextTicks (node:internal/process/task_queues:65:3)
      at listOnTimeout (node:internal/timers:528:9)

  4) NFT Shop
       When the Shop contract is deployed
         When a user purchase a NFT from the Shop contract
           "before each" hook for "charges the correct amount of tokens":
     Error: call revert exception; VM Exception while processing transaction: reverted with reason string "ERC721: invalid token ID" [ See: https://links.ethers.org/v5-errors-CALL_EXCEPTION ] (method="ownerOf(uint256)", data="0x08c379a0000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000184552433732313a20696e76616c696420746f6b656e2049440000000000000000", errorArgs=["ERC721: invalid token ID"], errorName="Error", errorSignature="Error(string)", reason="ERC721: invalid token ID", code=CALL_EXCEPTION, version=abi/5.7.0)
      at Logger.makeError (node_modules/@ethersproject/logger/src.ts/index.ts:269:28)
      at Logger.throwError (node_modules/@ethersproject/logger/src.ts/index.ts:281:20)
      at Interface.decodeFunctionResult (node_modules/@ethersproject/abi/src.ts/interface.ts:427:23)
      at Contract.<anonymous> (node_modules/@ethersproject/contracts/src.ts/index.ts:400:44)
      at step (node_modules/@ethersproject/contracts/lib/index.js:48:23)
      at Object.next (node_modules/@ethersproject/contracts/lib/index.js:29:53)
      at fulfilled (node_modules/@ethersproject/contracts/lib/index.js:20:58)
      at processTicksAndRejections (node:internal/process/task_queues:96:5)
      at runNextTicks (node:internal/process/task_queues:65:3)
      at listOnTimeout (node:internal/timers:528:9)
```
