import { Block, getMinerReward } from '../types/Block';
import { createTransaction } from '../api/transactions';
import { createWallet } from '../types/Wallet';

describe('Block tests', () => {
    test('Can create a block', () => {
        const unixEpochMilli = 1544351858258;
        const transaction = createTransaction('william', 'chris', 1, 0.05, unixEpochMilli);
        const block = new Block(undefined, transaction, 0);
        expect(block.generateHash()).toBe('b7f5f59be521cacea139a1d539ec4e1c032f5fd1cc33b36f5641f52b1cea6721');
    });
    test('Can recreate a block with 5 leading zero', () => {
        const unixEpochMilli = 1544351858258;
        const transaction = createTransaction('william', 'chris', 1, 0.01, unixEpochMilli);
        const minerTransaction = createTransaction(undefined, createWallet('123'), 1, 0.01, unixEpochMilli);
        let validBlock = new Block(undefined, transaction, 1536436);
        validBlock.addTransaction(minerTransaction);
        expect(validBlock.generateHash()).toBe('00000ad25eef6218280112e20242e00a8074f5e9c296365bddabd2b8a047ede2');
    });
    test('Block throws error if no nonce is given and trying to calculate hash', () => {
        const transaction = createTransaction('william', 'chris', 1, 0.01);
        let nonValidBlock = new Block(undefined, transaction);
        expect(() => nonValidBlock.generateHash()).toThrowError(`No nonce is set for this block.`);
    });
    test('Block can get its own height, based on full ledger', () => {
        const transaction = createTransaction('william', 'chris', 1, 0.01);
        let block1 = new Block(undefined, transaction);
        let block2 = new Block(block1, transaction);
        let block3 = new Block(block2, transaction);
        let block4 = new Block(block3, transaction);
        expect(block4.getHeight()).toBe(4);
    });
    test('Halving rate of Miner Reward', () => {
        let height1 = 2;
        let height2 = 20;
        let height3 = 50;
        expect(getMinerReward(height1)).toBe(100);
        expect(getMinerReward(height2)).toBe(25);
        expect(getMinerReward(height3)).toBe(3.125);
    });

});
