import { Block, Transaction, getMinerReward } from './types/Block'
import { CPUmine, mine, NonceGeneration } from './api/mining';
import { createTransaction, isValid, getBalance } from './api/transactions';
import { createWallet } from './types/Wallet';
import { createServer, createClient, createBlockMinedCommand, ActionType } from './api/net';

console.log(ActionType[ActionType.BlockMined]);



/*

const PORT = 8088;

const server = createServer((receivedCommand) => {
    console.log(receivedCommand);
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

const socket = createClient('localhost', PORT);

setTimeout(() => {
    socket.write(JSON.stringify(blockMinedCommand), "utf8");
}, 1000)


setTimeout(() => {
    socket.destroy();
}, 2500);

*/