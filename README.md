# TODO update the title

## Requirements
 - rename **example.env** to **.env** and update your secrets
 - source **.env** before running interacting with testnet

## Commands

```bash
yarn install
```

### Deploy contract

```bash
yarn hardhat run ./scripts/Deployment.ts
```

### Mint tokens to self && Delegate Power to self

```bash
yarn run ts-node --files scripts/GiveVotingTokens.ts $CONTRACT 
```

### Delegate Power to others

```bash
yarn run ts-node --files scripts/Delegate.ts $CONTRACT NEW_DELEGATE_PERSON_ADDRESS
```

### Query Results

```bash
yarn run ts-node --files scripts/Delegate.ts $CONTRACT
```
