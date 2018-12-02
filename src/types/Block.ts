import crypto from 'crypto';

export class Block{

    constructor(previous: Block | undefined, data: string){
        this.previous = previous;
        this.data = data;
        //this.nonce = 85;
        this.previousHash = this.hash();
    }

    previousHash: string | undefined;
    previous: Block | undefined;
    data: string | undefined;
    nonce: number | undefined;

    hash(){
        if(this.previous){
            return crypto.createHmac('sha256', "bingobois").update(this.previous.toString()).digest('hex');
        }

        return "0000000000000000000000000000000000000000000000000000000000000000";
    }
}