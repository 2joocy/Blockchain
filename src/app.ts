import { Block, Transaction, getMinerReward } from './types/Block'
import { CPUmine, mine, NonceGeneration } from './api/mining';
import { createTransaction, isValid, getBalance } from './api/transactions';
import { createWallet } from './types/Wallet';
import { createServer, createClient, createBlockMinedCommand, createNewTransactionCommand, ActionType, createAddressGetCommand } from './api/net';
import { saveBlockchain, loadBlockchain } from './api/file';

/*

const server = createServer((command, socket) => {
    console.log(command);
    console.log(`REEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE ${socket.remoteAddress}`);
});
server.listen(8585);

const socket = createClient('2.108.240.90', 8585);
socket.on('data', (data) => {
    console.log(data.toString('utf8'));
});
socket.write(JSON.stringify(createAddressGetCommand()));

/*
const block = new Block(undefined, createTransaction('Chris', 'William', 10, 0.01), 23);
const block2 = new Block(block, createTransaction('Viktor', 'Chris', 5, 0.5), 22);
const block3 = new Block(block2, createTransaction('Viktor', 'Chris', 5, 0.5));

saveBlockchain(block3);
let loadedBlocks = loadBlockchain();
console.log(loadedBlocks);
loadedBlocks.setNonce(23);
console.log(loadedBlocks.generateHash());

/*
console.log(loadedBlocks);
console.log(loadedBlocks.getHeight());

/*
const PORT = 8585;

const server = createServer((receivedCommand) => {
    console.log(`Received ${ActionType[receivedCommand.action]} command`);
});

server.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});

setTimeout(() => {
    server.close();
}, 5000);

const transaction = createTransaction(undefined, 'chris', getMinerReward(0), 0);
const block = new Block(undefined, transaction);
const blockMinedCommand = createBlockMinedCommand(block, '123');
const transactionCommand = createNewTransactionCommand(transaction);

const socket = createClient('localhost', PORT);

setTimeout(() => {
    socket.write(JSON.stringify(transactionCommand), "utf8");
}, 1000)


setTimeout(() => {
    socket.destroy();
}, 2500);

*/