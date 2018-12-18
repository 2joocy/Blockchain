import crypto from 'crypto';
const secureRandom = require('secure-random');

interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export function createKeyPairs(): KeyPair {
    const max = Buffer.from("0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEBAAEDCE6AF48A03BBFD25E8CD0364140", 'hex');
    let isInvalid = true;
    let privateKey;
    while (isInvalid) {
        privateKey = secureRandom.randomBuffer(32);
        console.log(privateKey);
        console.log(max);
        if (Buffer.compare(max, privateKey) === 1) {
            isInvalid = false;
        } else {
            console.log(`${Buffer.compare(max, privateKey)}`);
        }
    }
    console.log(`Found new private key: ${privateKey}`);
    /*
    let sha256 = crypto.createHash('sha256').update(randomData).digest('hex');
    let convertedNumber = parseInt(sha256, 16);
    console.log(convertedNumber);
    */
    return {
        privateKey: '2222',
        publicKey: '234'
    }
    /*
    return crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        privateKeyEncoding: {
            type: 'pkcs8',
            cipher: 'aes-256-cbc',
            format: 'pem',
            passphrase: passphrase
        },
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        }
    })
    */
}

export function createWallet(privateKey: string) {
    
    return "01BBFF123";
}

createKeyPairs();