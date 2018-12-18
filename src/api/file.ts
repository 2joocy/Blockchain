import { Block } from "../types/Block";
import zlib from 'zlib';
import fs from 'fs';
import path from 'path';

const FILE_NAME = "Blockchain.blk"

export function saveBlockchain(block: Block) {
    if (!fs.existsSync(path.resolve(__dirname, `../data/`))) {
        fs.mkdirSync(path.resolve(__dirname, `../data/`), {
            recursive: true
        });
    }
    let deflated = deflateBlockchain(block);
    fs.writeFileSync(path.resolve(__dirname, `../data/${FILE_NAME}`), deflated);
    return deflated;
}

export function deflateBlockchain(block: Block) {
    const base64 = Buffer.from(JSON.stringify(block)).toString('base64');
    return zlib.deflateSync(base64);
}

export function inflateBlockchain(buf: Buffer): Block {
    let inflated = zlib.inflateSync(buf).toString();
    const parsable = Buffer.from(inflated, 'base64').toString('utf8');
    let blockArray = <Array<Block>> JSON.parse(parsable);
    return recreateBlockchain(blockArray);
}

export function loadBlockchain(): Block {
    const buffer = fs.readFileSync(path.resolve(__dirname, `../data/${FILE_NAME}`));
    return inflateBlockchain(buffer);
}

function recreateBlockchain(nestedBlock: any): Block {
    if (nestedBlock['previous']) {
        return new Block(recreateBlockchain(nestedBlock['previous']), nestedBlock.transactions, nestedBlock.nonce);
    }
    return new Block(undefined, nestedBlock.transactions, nestedBlock.nonce);
}
