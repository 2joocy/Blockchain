import { Transaction, Block, getMinerReward } from "../types/Block";
import crypto from 'crypto';

/**
 * Useful tool to automatically create a transaction used as data for blocks
 * @param sender the sender's ID
 * @param receiver the receiver's ID
 * @param amount the amount to be sent to the receiver
 * @param unixEpochMilli [Optional] Unix Epoch Time
 */
export function createTransaction(sender: string | undefined, receiver: string, amount: number, minersFee: number, privateKey: string, unixEpochMilli?: number): Transaction {
    let readyToSign: Transaction = {
        amount: amount,
        minersFee: minersFee,
        receiver: receiver,
        sender: sender,
        unixEpochMilli: unixEpochMilli ? unixEpochMilli : new Date().getTime()
    };
    let stringified = JSON.stringify(readyToSign);
    console.log(stringified);
    let signature = sign(stringified, privateKey);
    readyToSign.signature = signature;
    return readyToSign;
}

/**
 * Verifies a transaction based on the public key given
 * @param transaction The transaction to check
 * @param publicKey Public key to verify signature in given transaction
 */
export function verifyTransaction(transaction: Transaction) {
    if (!transaction.signature) {
        return false;
    }
    //Transaction has a public key to check from
    if (transaction.sender) {
        let newTransaction: Transaction = {
            amount: transaction.amount,
            minersFee: transaction.minersFee,
            receiver: transaction.receiver,
            sender: transaction.sender,
            unixEpochMilli: transaction.unixEpochMilli
        }
        let stringified = JSON.stringify(newTransaction);
        console.log(stringified);
        return verify(stringified, transaction.signature, transaction.sender);
    } else {
        /* How can we check if the transaction is made by the miner of a specific block? */
        //We need to ensure that the transactions cannot be spoofed, and be given free coins from the system
    }
    return false;
}

function sign(data: string, privateKey: string): string {
    let signer = crypto.createSign('sha256');
    signer.update(data);
    return signer.sign(privateKey, "hex");
} 

function verify(data: string, signature: string, publicKey: string) {
    let verifier = crypto.createVerify('sha256');
    verifier.update(data);
    return verifier.verify(publicKey, signature, 'hex');
}

/**
 * Validates if a transaction is a valid one (Does a user have the balance to spend the amount in the transaction?)
 * @param blockchain Must be the latest block in the blockchain
 * @param transaction The transaction to validate.
 */
export function isValid(blockchain: Block, transaction: Transaction) {
    if (transaction.sender) {
        const balance: Balance = {
            balance: 0,
            sender: transaction.sender
        }
        let senderBalance = getBalance(blockchain, balance);
        return (senderBalance >= transaction.amount);
    }
    return transaction.amount === getMinerReward(blockchain);
}

/**
 * Recursively iterates through each block - backwards from the current back to Genesis and adds and removes balance
 * @param block The current block
 * @param balance The current amount the sender has as a balance
 */
export function getBalance(block: Block, balance: Balance): number {
    let minerAddress = findMinerAddress(block);
    let balanceDiff = checkTransactions(block.getTransactions(), balance.sender, minerAddress);
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
function checkTransactions(transcations: Array<Transaction> | undefined, sender: string, minerAddress: string): number {
    let total = 0;
    transcations && transcations.forEach(transaction => {
        if (transaction.sender === sender) {
            total -= transaction.amount;
        } else if (transaction.receiver === sender) {
            let minersFee = transaction.minersFee * getTransactionLength(transaction);
            total += (transaction.amount - minersFee);
            if (transaction.receiver === minerAddress) {
                total += minersFee;
            }
        }
    });
    return total;
}

/**
 * Finds the miners address from the miner transaction of a block
 * @param block The block to find the miners' transaction from
 */
function findMinerAddress(block: Block) {
    const transactions = block.getTransactions();
    for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].sender === undefined) {
            return transactions[i].receiver;
        }
    }
    throw Error(`No miner transaction found in block #${block.getHeight()}`);
}

/**
 * Calculates the length of the transaction to calculate the final minersFee
 * @param transaction The transaction to get length from
 */
function getTransactionLength(transaction: Transaction) {
    return JSON.stringify(transaction).length;
}

interface Balance {
    sender: string;
    balance: number;
}