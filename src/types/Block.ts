import crypto from 'crypto';


import { mine, NonceGeneration, hashIsValid } from '../api/mining';
import { isValid } from '../api/transactions';

//64-bits
const GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

export class Block {

    private previous: Block | undefined;
    private transactions: Array<Transaction>;
    private nonce: number | undefined;

    constructor(previous: Block | undefined, transactions: Array<Transaction> | Transaction, nonce?: number){
        this.previous = previous;
        this.transactions = Array.isArray(transactions) ? transactions : [transactions];
        this.nonce = nonce;
    }

    public generateHash(): string {
        if (this.nonce === undefined) {
            throw new Error(`No nonce is set for this block.`);
        }
        const prevHash = this.previous ? this.previous.generateHash() : GENESIS_HASH;
        const transactions = {
            transactions: this.transactions,
            nonce: this.nonce,
            prevHash: prevHash
        }
        return crypto.createHash('sha256').update(JSON.stringify(transactions)).digest('hex');
    }

    public setNonce(nonce: number) {
        this.nonce = nonce;
    }

    public getNonce() {
        return this.nonce;
    }

    public getPreviousBlock() {
        return this.previous;
    }

    public getTransactions() {
        return this.transactions;
    }

    public addTransaction(transaction: Transaction) {
        if (isValid(this, transaction)) {
            this.transactions.push(transaction);
        }
    }

    public mineBlock(minerAddress: string | Transaction, difficulty: number, nonceGeneration: NonceGeneration): Block {
        let result = mine(this, minerAddress, difficulty, nonceGeneration).getNonce();
        if (result) {
            this.setNonce(result);
        }
        return this;
    }

    public getHeight(): number {
        const prev = this.getPreviousBlock();
        if (prev !== undefined) {
            return prev.getHeight() + 1;
        }
        return 1;
    }

    /**
     * Every 20th block, the difficulty increases
     */
    public getDifficulty(): number {
        return this.getHeight() / 20;
    }

    public containsBlock(block: Block): boolean {
        let prevBlock = this.getPreviousBlock();
        if (this.generateHash() === block.generateHash()) {
            return true;
        } else if (prevBlock !== undefined) {
            return prevBlock.containsBlock(block);
        }
        return false;
    }

}

/**
 * Method of getting how much should be mined from a specific block height
 * @param block Can either bme the height of the block, or the block itself
 */
export function getMinerReward(block: Block | number): number {
     //100 coins for the first <= 100.000, then 50 > 100.00 <= 200.000, then 25 > 200.000 <= 300.000, etc. (12.5, 6.25, 3.125)
     const maxCoinsPrBlock = 100;
     const step = 10;
     const blockHeight = typeof(block) === "number" ? block : block.getHeight();
     const divisor = Math.pow(2, (Math.trunc(blockHeight / step)));
     return maxCoinsPrBlock / divisor;
}

export function blockchainIsValid(block: Block): boolean {
    while (block !== undefined) {
        if (!hashIsValid(block.generateHash(), block.getDifficulty())) {
            return false;
        }
        //@ts-ignore    We already take care of the undefined case: "while (block !== undefined)"
        block = block.getPreviousBlock();
    }
    return true;
}

function getGenesisBlock(block: Block): Block {
    const previous = block.getPreviousBlock();
    if (previous) {
        return getGenesisBlock(previous);
    }
    return block;
}

export interface Transaction {
    unixEpochMilli: number;
    sender: string | undefined;
    receiver: string;
    amount: number;
    minersFee: number;
}
