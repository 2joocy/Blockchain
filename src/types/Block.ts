import crypto from 'crypto';

export class Block {

    private GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

    private previous: Block | undefined;
    private transactions: Array<Transaction> | undefined;
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

}

export interface Transaction {

    unixEpochMilli: number;
    sender: string;
    receiver: string;
    amount: number;

}