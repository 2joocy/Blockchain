import { Block } from '../types/Block';
import { createTransaction } from '../api/transactions';

describe('Block tests', () => {
    test('Can create a block', () => {
        const unixEpochMilli = 1544351858258;
        const transaction = createTransaction('william', 'chris', 1, unixEpochMilli);
        const block = new Block(undefined, transaction, 0);
        expect(block.generateHash()).toBe('703a1e044decf4f2b5ae3a094eba268c482e24c32ca4dba8d499c4616c0c4c52');
    });
    test('Can recreate a block with 3 leading zero', () => {
        const unixEpochMilli = 1544352023228;
        const transaction = createTransaction('william', 'chris', 1, unixEpochMilli);
        let validBlock = new Block(undefined, transaction, 105693291048363);
        expect(validBlock.generateHash()).toBe('000cc0f20f6c55076373d36ca3ce8aa8620d2766f8e21249a6bb69fb5c7e9569');
    });
    test('Block throws error if no nonce is given and trying to calculate hash', () => {
        const transaction = createTransaction('william', 'chris', 1);
        let nonValidBlock = new Block(undefined, transaction);
        expect(() => nonValidBlock.generateHash()).toThrowError(`No nonce is set for this block.`);
    })

})