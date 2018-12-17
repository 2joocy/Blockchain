import net, { Server, Socket } from 'net';
import { Block, Transaction } from '../types/Block';

/**
 * AddressGet: Command to request a random number of current connections
 * AddressUpdate: Response to AddressGet, contains a list of connections
 * BlockMined: Announcement to the network that a block has been mined
 * BlocksGet: Command to request all blocks after a given height (or undefined)
 * BlocksUpdate: Response to BlocksGet, contains a list of blocks
 * NewTransaction: Announcement to the network a transaction has been made
 */
export enum ActionType {
    AddressGet,
    AddressUpdate,
    BlockMined,
    BlocksGet,
    BlocksUpdate,
    NewTransaction,
}

interface BlockMinedData {
    block: Block;
    publicKey: string;
}

export class TCPCommand {

    public action: ActionType;
    public data: BlockMinedData | Transaction;

    constructor(action: ActionType, data: BlockMinedData | Transaction) {
        this.action = action;
        this.data = data;
    }

}

export function createNewTransactionCommand(transaction: Transaction): TCPCommand {
    return new TCPCommand(ActionType.NewTransaction, transaction);
}

export function createBlockMinedCommand(block: Block, publicKey: string): TCPCommand {
    const mined: BlockMinedData = {
        block: block,
        publicKey: publicKey
    }
    return new TCPCommand(ActionType.BlockMined, mined);
}

export function createServer(onData: (tcpCommand: TCPCommand) => void): Server {
    return net.createServer((socket) => {
        //When a new socket connects
        //console.log(`New socket has connected!`);
        socket.setEncoding('utf8');
        socket.on('data', (data) => {
            try {
                const tcpCommand = <TCPCommand> JSON.parse(data.toString('utf8'));
                //console.log(`Received ${ActionType[tcpCommand.action]} command from socket: ${data.toString('utf8')}`);
                onData(tcpCommand);
            } catch (err) {
                console.log(`Received an unparsable message from socket, this is the data: ${data.toString('utf8')}`);
                console.log(err);
            }
        });
    });
}

export function createClient(address: string, port: number): Socket {
    const options: net.NetConnectOpts = {
        port: port,
        host: address
    }
    return net.createConnection(options);
}
