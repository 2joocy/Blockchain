import { Block } from '../types/Block';

describe('Block tests', () => {
    test('Can create a block', () => {
        const block = new Block(undefined, {
            type: 'Transaction',
            sender: 'William',
            receiver: 'Chris'
        }, 0);
        expect(block.generateHash()).toBe('6ba1f730732627c82a528265022510174d2d117a28d55344c96cf1caecc59c71');
    });
    test('Can create a block with 2 leading zero', () => {
        let validBlock = new Block(undefined, {
            type: 'Transaction',
            sender: 'William',
            receiver: 'Chris'
        }, 12);
        expect(validBlock.generateHash()).toBe('00ed44b3e1a4747658d742cacca9ca172c8dbd7b09458dba30d5fc804d3f0677');
    });
    test('Block throws error if no nonce is given and trying to calculate hash', () => {
        let nonValidBlock = new Block(undefined, {});
        expect(() => nonValidBlock.generateHash()).toThrowError(`No nonce is set for this block.`);
    })

})