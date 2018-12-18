import { ActionType, TCPCommand, BlockMinedData, createServer, createAddressGetCommand, createClient, createAddressUpdateCommand } from '../api/net';
import { Transaction, blockchainIsValid } from '../types/Block';
import { Server, Socket } from 'net';
import { inflateBlockchain } from '../api/file';

let CONNECTION_ARR: Array<Socket> = [];

let server: Server;

export function initalizeNetwork(port: number) {
    server = createServer((receivedCommand, socket) => {
        console.log(`Received ${ActionType[receivedCommand.action]} command`);
        handleActions(receivedCommand, socket);
    });
    server.listen(port, () => {
        console.log(`Server is listening on port: ${port}`);
    });
    //If No connections, or all saved connections are dead:
        //TODO: Ask DNS Seed about connections
    //else: initialize saved connections


    //TODO: Change DNS_SEED to DNS_SEED IP
    const socket = createClient('DNS_SEED', 8585);
    const request = createAddressGetCommand();
    socket.write(JSON.stringify(request));
    CONNECTION_ARR.push(socket);
}

export function closeNetwork() {
    CONNECTION_ARR.forEach(element => {
        element.destroy();
    });
    CONNECTION_ARR = [];
    server.close();
}

export function handleActions(tcpCommand: TCPCommand, socket: Socket) {
    try {
        switch (tcpCommand.action) {
            case ActionType.AddressGet:
                let randomAddresses = randomConnections();
                const command = createAddressUpdateCommand(randomAddresses);
                socket.write(JSON.stringify(command));
                break;
    
            case ActionType.AddressUpdate:
                let receivedAddresses = <Array<string>> tcpCommand.data;
                receivedAddresses.forEach(element => {
                    CONNECTION_ARR.push(createClient(element, 8585));
                });
                break;
    
            case ActionType.BlockMined:
                let blockMinedData = <BlockMinedData> tcpCommand.data;
                //TODO: Figure out access to Block, call containsBlock on it with blockMinedData.block
                //TODO: Validate the block, and add it to the Blockchain, then resend it once to all connections
                break;
    
            case ActionType.BlocksGet:
                //TODO: Find all blocks newer than the data provided in Command, if undefined, return all
                let blockHeight = <number> tcpCommand.data;
                 //TODO: Figure out access to Block
                break;
    
            case ActionType.BlocksUpdate:
                //TODO: Add all blocks from data into the blockchain, after validating them one by one
                let buffer = <Buffer> tcpCommand.data;
                let newChain = inflateBlockchain(buffer);
                if (blockchainIsValid(newChain)) {
                    //TODO: Figure out access to Block
                }
                break;
    
            case ActionType.NewTransaction:
                let transactionData = <Transaction> tcpCommand.data;
                //TODO: Validate transaction, then add it to the block being mined
                break;
    
            default:
                throw Error(`[tcpController.handleActions()] There is no handler for the action: ${ActionType[tcpCommand.action]}`);
        }
    } catch (err) {
        console.log(`Error happened while trying to complete action: ${ActionType[tcpCommand.action]}`);
        console.log(err);
    }
    
}

function randomConnections(): Array<string> {
    let random = Math.round((Math.random() * 3) + 1);
    let index = Math.round(Math.max((Math.random() * CONNECTION_ARR.length) - random, 0));
    let randomArray: Array<string> = [];
    for (let i = 0; i < random; i++) {
        let n = index + i;
        const remoteAdd = CONNECTION_ARR[n].remoteAddress;
        if (remoteAdd) {
            randomArray.push(remoteAdd);
        }
    }
    return randomArray;
}