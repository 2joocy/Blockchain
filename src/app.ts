import { Block, Transaction } from './types/Block'
import { mine, NonceGeneration, mineGPU, CPUmine } from './api/mining';
import { createTransaction, isValid, getBalance } from './api/transactions';

const difficulty = 5;
const nonceGeneration = NonceGeneration.RNG;

const transaction = createTransaction('william', 'chris', 6.33);

let block = new Block(undefined, transaction);

mine(block, difficulty, nonceGeneration);

console.log(`Found normal block nonce: ${block.getNonce()}`);

CPUmine(block, difficulty, nonceGeneration).then((block) => {
    console.log(`Found block nonce: ${block.getNonce()}`);
});


//mineGPU(block, difficulty, NonceGeneration.BruteForce);

//let block = new Block(undefined, transaction).mineBlock(difficulty, nonceGeneration);

/*

//console.log(block.generateHash());

const transaction2 = createTransaction('chris', 'viktor', 2.77);

if (!isValid(block, transaction2)) {
    throw Error(`Transaction: ${JSON.stringify(transaction2)} is not valid!`);
}

let block2 = new Block(block, transaction2).mineBlock(difficulty, nonceGeneration);

//console.log(block2.generateHash());

console.log(`Chris's Balance: ${getBalance(block2, {
    balance: 0,
    sender: 'chris'
})}`)

console.log(`Viktors Balance: ${getBalance(block2, {
    balance: 0,
    sender: 'viktor'
})}`)

console.log(`Williams Balance: ${getBalance(block2, {
    balance: 0,
    sender: 'william'
})}`)


*/