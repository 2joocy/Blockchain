import crypto from 'crypto';

import { mine, NonceGeneration } from '../api/mining';
import { isValid } from '../api/transactions';

export class Block {

    //64-bits
    private GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

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
        const prevHash = this.previous ? this.previous.generateHash() : this.GENESIS_HASH;
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

    public mineBlock(difficulty: number, nonceGeneration: NonceGeneration): Block {
        let result = mine(this, difficulty, nonceGeneration).getNonce();
        if (result) {
            this.setNonce(result);
        }
        return this;
    }

}

export interface Transaction {

    unixEpochMilli: number;
    sender: string;
    receiver: string;
    amount: number;

}

export interface gpuOptions {
    output?: [number] | [number, number] | [number, number, number] | {
        x?: number,
        y?: number,
        z?: number
    };
    outputToTexture?: boolean;
    graphical?: boolean;
    loopMaxIterations?: number;
    constants?: object;
    wraparound?: boolean;
    hardcodeConstants?: boolean;
}