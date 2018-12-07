import { Block } from './types/Block'
import { mine, NonceGeneration } from './api/mining';

const difficulty = 8;

let block =  new Block(undefined, {
    type: 'Transaction',
    sender: 'William',
    receiver: 'Chris',
    amount: 10
});

mine(block, difficulty, NonceGeneration.RNG);
