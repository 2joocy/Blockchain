import {Block} from './types/Block'

let block = new Block(undefined, "");
let block2 = new Block(block, "");
let block3 = new Block(block2, "");
// @ts-ignore
console.log(block3.previous.previous);