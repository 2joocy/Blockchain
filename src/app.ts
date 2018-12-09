import { Block, Transaction } from './types/Block'
import { mine, NonceGeneration } from './api/mining';
import { createTransaction } from './api/transactions';

const difficulty = 3;

const transaction = createTransaction('william', 'chris', 1);

let block =  new Block(undefined, transaction);

block = mine(block, difficulty, NonceGeneration.RNG);

console.log(block);
console.log(block.generateHash())