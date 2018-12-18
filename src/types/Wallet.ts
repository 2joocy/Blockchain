const keypair = require('keypair');

interface KeyPair {
    privateKey: string;
    publicKey: string;
}

export function createKeyPairs(): KeyPair {
    const options = {
        bits: 512
    };
    let pairs = keypair(options);
    return {
        privateKey: pairs.private,
        publicKey: pairs.public
    }
}