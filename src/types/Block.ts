import crypto from 'crypto';

export class Block {

    private GENESIS_HASH = '0000000000000000000000000000000000000000000000000000000000000000';

    private previous: Block | undefined;
    private data: any | undefined;
    private nonce: number | undefined;

    constructor(previous: Block | undefined, data: any, nonce?: number){
        this.previous = previous;
        this.data = data;
        this.nonce = nonce;
    }

    public generateHash(): string {
        if (this.nonce === undefined) {
            throw new Error(`No nonce is set for this block.`);
        }
        const prevHash = this.previous ? this.previous.generateHash() : this.GENESIS_HASH;
        const data = {
            data: this.data,
            nonce: this.nonce,
            prevHash: prevHash
        }
        return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    }

    public setNonce(nonce: number) {
        this.nonce = nonce;
    }

    public getNonce() {
        return this.nonce;
    }

}