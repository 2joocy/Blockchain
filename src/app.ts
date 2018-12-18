import { Block, Transaction, getMinerReward } from './types/Block'
import { CPUmine, mine, NonceGeneration } from './api/mining';
import { createTransaction, isValid, getBalance, verifyTransaction } from './api/transactions';
import { createServer, createClient, createBlockMinedCommand, createNewTransactionCommand, ActionType, createAddressGetCommand, createBlocksGetCommand } from './api/net';
import { saveBlockchain, loadBlockchain } from './api/file';
import { createKeyPairs } from './types/Wallet';
import { initalizeNetwork, getConnections } from './controllers/tcpController';

//Every time it mines, create new transaction for 1 coin into randomly chosen public key, announce to network.

let blockchain: Block;
let keys;

function init() {
    keys = createKeyPairs();
    initalizeNetwork(8585);

    const command = createBlocksGetCommand(0);
    let connection = getConnections()[0];

    //connection.write()
}


function startMining() {
    let random = Math.random();
    if (random > 0.5) {
        //Mine
        //@ts-ignore
        mine();
    } else {
        //CPUMine
        //@ts-ignore
        CPUmine();
    }
}


