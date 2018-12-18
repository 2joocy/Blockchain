# Block Chain - Bingo Bois

## Documentation
Each node has a set of connections that it keeps, of all it’s clients. Those clients are being sent information, and when being sent to, uses a controller to decide whichever action it should take with the given connection. 

We’re using interfaces in Typescript to make sure that we follow the same data correction between members. Our infaces for each of our objects are:

For our transaction, we’re using the following format:
```typescript
export interface Transaction {
    unixEpochMilli: number;
    sender: string | undefined;
    receiver: string;
    amount: number;
    minersFee: number;
}
```

Key Pairs
```typescript
interface KeyPair {
    privateKey: string;
    publicKey: string;
}
```

Blocks are defined as such:
```typescript
export class Block {

    private previous: Block | undefined;
    private transactions: Array<Transaction>;
    private nonce: number | undefined;
}
```

Each time the nodes receive a message, it’s being handled by the handleActions described in one of our classes. Each of these commands are described with the given enum:
```typescript
export enum ActionType {
    AddressGet,
    AddressUpdate,
    BlockMined,
    BlocksGet,
    BlocksUpdate,
    IsAlive,
    NewTransaction
}
```

So far, these commands are supported


#### AddressGet
> returns a list of addresses known to the client, all it needs is the given enum from the sender and it will return that > list to the sender as a TCP call.

#### AddressUpdate
> Takes in a enum, aswell as a list of ip endpoints for each of the clients connections. This could be used to update existing nodes if someone decides to shut down their client.

#### BlockMined
> Takes in a block, validates it and sends it out to all clients known to the nodes

#### BlocksGet
> Takes in a validated block, and checks for blocks which are newer than the one being sent. If there's none, all previous blocks are returned

#### BlocksUpdate
> Takes in several blocks. After each of them are validated, they're added to the blockchain and sent out to all nodes

#### NewTransaction
> Validates the block, then adds it to the queue, where others are able to mine it.

## Sources

>https://en.wikipedia.org/wiki/Cryptographic_nonce
Helped explain what a “nonce” is, and why it’s used
https://lisk.io/academy/blockchain-basics/blockchain-basics-intro
Basic glossary and quick-tips guide to how the networking is done in a blockchain architecture
https://medium.com/@sahityakumarsuman/blockchain-3-layer-architecture-51e8bb2388cf
Article, where a user shows the structure of “blocks”, and references nice terms like “Genesis Block” etc.
https://support.bitpay.com/hc/en-us/articles/115003393863-What-are-bitcoin-miner-fees-Why-are-miner-fees-so-high-
Explains nicely why there’s a need for a miners fee, and what it does to help blockchain currency users and it’s services
https://www.youtube.com/watch?v=xIDL_akeras
Youtube video explaining public and private keys, and each of their uses and possible security measurements.
https://www.youtube.com/watch?v=SSo_EIwHSd4
A super quick guide /  youtube video showing overall structure of blockchains and how the system works (Very broad)
https://medium.com/@hlopez_/how-are-public-and-private-keys-created-in-bitcoin-f90b2b88f40a
Goes over nicely SHA256 encryption and gives more understanding into how encrypting works for blockchains
