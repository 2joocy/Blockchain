import { ActionType, TCPCommand } from '../api/net';

export function handleActions(tcpCommand: TCPCommand) {
    switch (tcpCommand.action) {
        case ActionType.AddressGet:
            //TODO: Implement list of active connections, and randomly select X amount to send back
            break;

        case ActionType.AddressUpdate:
            //TODO: Implement a list of active connections, and add the received to that list
            break;

        case ActionType.BlockMined:
            //TODO: Validate the block, and add it to the Blockchain, then resend it once to all connections
            break;

        case ActionType.BlocksGet:
            //TODO: Find all blocks newer than the data provided in Command, if undefined, return all
            break;

        case ActionType.BlocksUpdate:
            //TODO: Add all blocks from data into the blockchain, after validating them one by one
            break;

        case ActionType.NewTransaction:
            //TODO: Validate transaction, then add it to the block being mined
            break;

        default:
            throw Error(`[tcpController.handleActions()] There is no handler for the action: ${ActionType[tcpCommand.action]}`);
    }
}