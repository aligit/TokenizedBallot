# HomeWork week 2

## Deployment

### input

```bash
yarn run ts-node --files ./scripts/Deployment.ts
```

### output

```bash
GroupTenToken(GTET) contract deployed at 0x25e5737A26602289490C794693031D38973B023F

voter 0xe5E7fF9C1256f4313Cec401A11f835c5688A28a4 was given 166667 tokens
voter 0x48f393CC45A3587Dc925fea9Cfe2e24DA7E35E7F was given 166667 tokens
voter 0xdB60C8a001b7A83beFD68C8f5d6b000d1241B641 was given 166667 tokens
voter 0xe1E387799F7eff9a02c994358Ea2f7c8f64d2458 was given 166667 tokens
voter 0xcae4fF8c4cB2D2B2623d3C8379f34Fc04AC8f3d8 was given 166667 tokens
voter 0x765fc9690a14b6beb3ea3f9ee0d1491a2fb348cd was given 166667 tokens

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

### Correction

- When we deployed the contract the block number was not shown correctly. We
  fixed that by invoking the number method.
