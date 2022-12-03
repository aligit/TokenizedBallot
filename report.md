# HomeWork week 3

We initially started deploying on testnet but due to slow workflow switched to
local testnet. AllInOne.ts will run the complete workflow as it follows:
  - Deploy Token
  - Mint
  - Self-delegate
  - Deploy Ballot
  - Show Vote power
  - Cast vote
  - Show results

After this script was working we split all these actions in different scripts.
In the next chapters we show how to interact with goerli testnet.

## Token contract Deployment

### Input

```bash
yarn run ts-node --files ./scripts/DeployTokenContract.ts
```

### Result

GroupTenToken(GTET) contract was deployed at
[0x55F7fed01508Ec0F8a62fE4f96E384FAFDF8070D](https://goerli.etherscan.io/address/0x55f7fed01508ec0f8a62fe4f96e384fafdf8070d)

ballot for voting on following proposals deployed at contract
0x3b6092237fC93DF9Eac1C81EB2F9f971edf24a16 at block [object Object]

Remix
VSCode
VIM

### Remarks

Initially the deployment consisted of Token and Ballot deployment in the same
process. However we realized this is not convenient as this will cause problems
later for voters.

## Delegation

Right after token deployment this script is called by every person who wants to
vote on the upcoming ballot.

### Input

```bash
yarn run ts-node --files ./scripts/Delegate.ts  "0x55F7fed01508Ec0F8a62fE4f96E384FAFDF8070D" "TOKEN_HOLDER_ADDRESS"
```

### Output

Given the token contract and delegatee address this successfully [self
delegate](https://goerli.etherscan.io/address/0x103a5f440e6fb3e348606194a61080de0a70064a)
after the mint.

```bash
Attaching GTET token to contract
Delegating voting right from 0x103a5f440e6fb3e348606194A61080DE0a70064A to
              0x103a5f440e6fb3e348606194A61080DE0a70064A
              with voting power of 1000000000000000000000000
```

Before testing delegating to another person, I self delegated to my self in
order to be compliant with ERC20Votes.

After Delegate.ts call on the token contract the person who ran the script will
see his addressed being replaced in voters.json by the delegatee.

The associated transaction is 
[0x19cbcc1361ec0b87fa793a9b56e82e4fcccd28d21d692df870507fd0b6f4c1e6](https://goerli.etherscan.io/tx/0x19cbcc1361ec0b87fa793a9b56e82e4fcccd28d21d692df870507fd0b6f4c1e6)


## CheckVotingPower

### Input

```bash
yarn run ts-node --files ./scripts/CheckVotingPower.ts "0xe5E7fF9C1256f4313Cec401A11f835c5688A28a
4" "0xAa4DbD8D21A50697ab2498707ED41a7A8F409786"
```

### Output

```bash
The voter has 100.0 vote power
```

### Remarks

This script caused a lot of issues. Initially we forgot to self-delegate before
deploying ballot contract.
We also were confused why we could not CastVote despite having vote power. Once
we realized the importance of block number and getting getPastVotes we
successfully managed all the workflows.
Unfortunately to show past votes for a specific block we were not able to fetch
the target block in which ballot contract was deployed.

## CastVote

The subject of the vote was editors for solidity:

- Remix
- VSCode
- VIM

### Input

```bash
yarn run ts-node --files scripts/CastVote.ts "0xAa4DbD8D21A50697ab2498707ED41a7A8F409786"  2 10
```

The arguments represent:
- Ballot contract address.
- 2 is the index number which represent a vote.
- 10 is the amount number a user has to vote

### Remarks

We didn't manage to vote as we run into "not enough power" because power votes
didn't match the ballot block number. This worked very well on local testnet as
we had more control on the flow.
