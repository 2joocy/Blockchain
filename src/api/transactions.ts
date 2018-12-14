import { Transaction, Block } from "../types/Block";

/**
 * Useful tool to automatically create a transaction used as data for blocks
 * @param sender the sender's ID
 * @param receiver the receiver's ID
 * @param amount the amount to be sent to the receiver
 * @param unixEpochMilli [Optional] Unix Epoch Time
 */
export function createTransaction(sender: string, receiver: string, amount: number, unixEpochMilli?: number): Transaction {
    return {
        amount: amount,
        receiver: receiver,
        sender: sender,
        unixEpochMilli: unixEpochMilli ? unixEpochMilli : new Date().getTime()
    }
}

/**
 * Validates if a transaction is a valid one (Does a user have the balance to spend the amount in the transaction?)
 * @param blockchain Must be the latest block in the blockchain
 * @param transaction The transaction to validate.
 */
export function isValid(blockchain: Block, transaction: Transaction) {
    const balance: Balance = {
        balance: 0,
        sender: transaction.sender
    }
    let senderBalance = getBalance(blockchain, balance);
    return (senderBalance >= transaction.amount);
}

/**
 * Recursively iterates through each block - backwards from the current back to Genesis and adds and removes balance
 * @param block The current block
 * @param balance The current amount the sender has as a balance
 */
export function getBalance(block: Block, balance: Balance): number {
    let balanceDiff = checkTransactions(block.getTransactions(), balance.sender);
    //console.log(`The sender had: ${balance.balance} before Block: ${block.generateHash()}, now has: ${balance.balance + balanceDiff}`);
    balance.balance += balanceDiff;
    const previous = block.getPreviousBlock();
    if (previous !== undefined) {
        return getBalance(previous, balance);
    }
    return balance.balance;
}

/**
 * Iterates through all given transactions and reads if the transaction is valid for the sender
 * @param transcations List of transactiosn to be checked
 * @param sender Person who is attempting to send the money
 */
function checkTransactions(transcations: Array<Transaction> | undefined, sender: string): number {
    let total = 0;
    transcations && transcations.forEach(transaction => {
        if (transaction.sender === sender) {
            total -= transaction.amount;
        } else if (transaction.receiver === sender) {
            total += transaction.amount;
        }
    });
    return total;
}

interface Balance {
    sender: string;
    balance: number;
}