# HomeWork week 2

## Deployment

### Input

```bash
yarn run ts-node --files ./scripts/Deployment.ts
```

### Output

```bash
GroupTenToken(GTET) contract deployed at 0x25e5737A26602289490C794693031D38973B023F

voter 0xe5E7fF9C1256f4313Cec401A11f835c5688A28a4 was given 1000000 tokens
voter 0x48f393CC45A3587Dc925fea9Cfe2e24DA7E35E7F was given 1000000 tokens
voter 0xdB60C8a001b7A83beFD68C8f5d6b000d1241B641 was given 1000000 tokens
voter 0xe1E387799F7eff9a02c994358Ea2f7c8f64d2458 was given 1000000 tokens
voter 0xcae4fF8c4cB2D2B2623d3C8379f34Fc04AC8f3d8 was given 1000000 tokens
voter 0x765fc9690a14b6beb3ea3f9ee0d1491a2fb348cd was given 1000000 tokens

voting powers given


ballot for voting on following proposals deployed at contract
0x3b6092237fC93DF9Eac1C81EB2F9f971edf24a16 at block [object Object]

Remix
VSCode
VIM
```                                                              

### Remarks

Initially we didn't save the proposals. But we realized it would be appropriate
to store the them onchain. Moreover we were missing storage of voters. To save
gas we decided to store that info offchain in a json file containing members of
group 8.

After the deploy and mint group members whose address was in voters.json were
given GTET tokens in the following transactions:

- https://goerli.etherscan.io/tx/0x3b98906ea578e74718cab65d5983ca667769dd5491bb35d8eff2ab8b9eca9aa6
- https://goerli.etherscan.io/tx/0x1e4fa3249e9c1d4ff1a3841d474c49ac0aa700edc9dbfb2390a6579cd576fc8a
- https://goerli.etherscan.io/tx/0xe99e951df2f8c583f5444ede6d2f47480ef22652ef036bcea0f039af79294572
- https://goerli.etherscan.io/tx/0x07ca54ba273be57b3120fb98cff4b1b4d49e726b4f61a33723838ea3bbbbb67b
- https://goerli.etherscan.io/tx/0x29b205b96bcd68de45dd4405ab5828ff2918e72181029f6924456358ba1a1749
- https://goerli.etherscan.io/tx/0xdf1062cdccd7b5b9af7a9d14e8a1b6ef5d753cc103afcdf4212895cf548e115e


### Correction

- When we deployed the contract the block number was not shown correctly. We
  fixed that by invoking the number method.

## Delegation

### Input

```bash
yarn run ts-node --files scripts/Delegate.ts "0xe5E7fF9C1256f4313Cec401A11f835c5688A28a4"
```

### Output

```bash
Attaching GTET token to contract
Delegating voting right from 0xe5E7fF9C1256f4313Cec401A11f835c5688A28a4 to
              0xF40cfBaaB1E3f4035c9D88cc97BE2445cB6EF7cf
              
              
    from: 0xe5E7fF9C1256f4313Cec401A11f835c5688A28a4

    to: 0xF40cfBaaB1E3f4035c9D88cc97BE2445cB6EF7cf
    with voting power of 1000000000000000000000000
```

Before testing delegating to another person, I self delegated to my self in
order to be compliant with ERC20Votes.

After Delegate.ts call on the token contract the person who ran the script will
see his addressed being replaced in voters.json by the delegatee.

The associated transaction is 
[0x19cbcc1361ec0b87fa793a9b56e82e4fcccd28d21d692df870507fd0b6f4c1e6](https://goerli.etherscan.io/tx/0x19cbcc1361ec0b87fa793a9b56e82e4fcccd28d21d692df870507fd0b6f4c1e6)


## CastVoting

### Input

```bash
yarn run ts-node --files ./scripts/CastVote.ts <number>
```
 
The number represents the index of the vote. Must be bigger than zero.


### Remarks

While trying to attach the tokenized ballot contract wit it's address we ran
into multiple problems such as `resolver or addr is not configured for ENS
name` or `missing revert data in call exception; Transaction reverted without a
reason string`. Hardhat provided us with a
[hint](https://docs.ethers.io/v5/troubleshooting/errors/#help-CALL_EXCEPTION)
which helped us to resolve the problem. 

