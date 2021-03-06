import { Block, getMinerReward, Transaction } from "../types/Block";
import { createTransaction } from "./transactions";

// Each hexidecimal character = 4 bits, as 0xF = 15 = 0b1111
const MAX_48BIT_NUMBER = 0xFFFFFFFFFFFF;

export enum NonceGeneration {
    BruteForce,
    RNG,
}

/**
 * Function to mine a block until it finds a valid nonce for the given network difficulty
 * @param block The block that needs to be mined
 * @param difficulty The network difficulty
 */
export function mine(block: Block, minerAddress: string | Transaction, difficulty: number, nonceGeneration: NonceGeneration, privateKey: string): Block {
    const minerTransaction = typeof(minerAddress) === "string" ? createTransaction(undefined, minerAddress, getMinerReward(block), 0, privateKey) : minerAddress;
    block.addTransaction(minerTransaction);
    if (block.getNonce() === undefined) {
        block.setNonce(getNextNonce(0, nonceGeneration));
    }
    const startTime = getNanoTime();
    let lastLog = getNanoTime();
    let totalCalculated = 0;
    while (!hashIsValid(block.generateHash(), difficulty)) {
        if ((getNanoTime() - lastLog) > 100000000) {
            const average = (totalCalculated / (((getNanoTime() - startTime) / 1000000) / 1000));
            const avg = convertToSI(average);
            lastLog = getNanoTime();
            console.log(`Calculated a total of: ${totalCalculated}, averaging: ${avg}`);
        }
        //@ts-ignore
        block.setNonce(getNextNonce(block.getNonce(), nonceGeneration));
        totalCalculated++;
        //console.log(`Created a new hash; ${block.generateHash()} from nonce: ${block.getNonce()}`)
    }
    //console.log(`Found valid hash: ${block.generateHash()}`);
    //console.log(`From nonce: ${block.getNonce()}`);
    return block;
}

/**
 * [Slowed Down Mining] Simulates the above function, but slowed down
 * Function to mine a block until it finds a valid nonce for the given network difficulty
 * @param block The block that needs to be mined
 * @param difficulty The network difficulty
 */
export async function CPUmine(block: Block, minerAddress: string | Transaction, difficulty: number, nonceGeneration: NonceGeneration, privateKey: string): Promise<Block> {
    const minerTransaction = typeof(minerAddress) === "string" ? createTransaction(undefined, minerAddress, getMinerReward(block), 0, privateKey) : minerAddress;
    block.addTransaction(minerTransaction);
    if (block.getNonce() === undefined) {
        block.setNonce(getNextNonce(0, nonceGeneration));
    }
    const startTime = getNanoTime();
    let lastLog = getNanoTime();
    let totalCalculated = 0;
    while (!hashIsValid(block.generateHash(), difficulty)) {
        if ((getNanoTime() - lastLog) > 100000000) {
            const average = (totalCalculated / (((getNanoTime() - startTime) / 1000000) / 1000));
            const avg = convertToSI(average);
            lastLog = getNanoTime();
            console.log(`Calculated a total of: ${totalCalculated}, averaging: ${avg}`);
        } else if ((getNanoTime() - lastLog) > 2000000) {
            await delay(100);
        }
        //@ts-ignore
        block.setNonce(getNextNonce(block.getNonce(), nonceGeneration));
        totalCalculated++;
        //console.log(`Created a new hash; ${block.generateHash()} from nonce: ${block.getNonce()}`)
    }
    //console.log(`Found valid hash: ${block.generateHash()}`);
    //console.log(`From nonce: ${block.getNonce()}`);
    return Promise.resolve(block);
}

function delay(milli: number): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, milli / 2);
    });
}

/**
 * Generates a new nonce based on which NonceGeneration is chosen
 */
function getNextNonce(currentNonce: number, nonceGeneration: NonceGeneration): number {
    switch (nonceGeneration) {
        case NonceGeneration.BruteForce:
            return currentNonce + 1;

        case NonceGeneration.RNG:
            //console.log(`Creating a new nonce, old nonce: ${currentNonce}, random number: ${random}, parsed: ${parsed}`);
            return Math.floor(Math.random() * MAX_48BIT_NUMBER);
        
        default:
            //No NonceGeneration set, but instead of throwing an error, we will default to BruteForce
            return currentNonce + 1;
    }
}

/**
 * Checks if a given hash is valid against the current difficulty on the network
 * @param hash The hash that is being tested
 * @param difficulty The amount of leading zeroes
 */
export function hashIsValid(hash: string, difficulty: number) {
    for (let i = 0; i < difficulty; i++) {
        //console.log(`Checking hash: ${hash}, with difficulty: ${difficulty}`);
        if (hash.charAt(i) !== '0') {
            return false;
        }
    }
    return true;
}

export function calculateDifficulty(height: number | Block) {
    height = (typeof(height) === 'number' ? height : height.getHeight());
    
}

/**
 * Returns the current time in nanoseconds
 */
function getNanoTime() {
    var hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
}

const TERA = 1000 * 1000 * 1000 * 1000;
const GIGA = 1000 * 1000 * 1000;
const MEGA = 1000 * 1000;

function convertToSI(number: number): string {
    if (number > TERA) {
        //Tera
        return `${(number / TERA).toFixed(2)}Th/s`;
    } else if (number > GIGA) {
        //Giga
        return `${(number / GIGA).toFixed(2)}Gh/s`;
    } else if (number > MEGA) {
        //Mega
        return `${(number / MEGA).toFixed(2)}Mh/s`;
    } else if (number > 1000) {
        //K
        return `${(number / 1000).toFixed(2)}Kh/s`;
    }
    return `${number.toFixed(2)}h/s`
}