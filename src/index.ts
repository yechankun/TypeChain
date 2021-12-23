import * as CryptoJS from "crypto-js";

class Block {
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    timestamp: number,
    nonce: number,
    data: string
  ): string =>
    CryptoJS.SHA256(index + previousHash + timestamp + nonce + data).toString();

  static validateStructure = (aBlock: Block): boolean =>
    typeof aBlock.index === "number" &&
    typeof aBlock.hash === "string" &&
    typeof aBlock.previousHash === "string" &&
    typeof aBlock.timestamp === "number" &&
    typeof aBlock.nonce === "number" &&
    typeof aBlock.data === "string";

  public index: number;
  public hash: string;
  public previousHash: string;
  public nonce: number;
  public data: string;
  public timestamp: number;

  //인스턴스를 만드는 방식 = 생성자
  constructor(
    index: number,
    hash: string,
    previousHash: string,
    nonce: number,
    data: string,
    timestamp: number
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.nonce = nonce;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(
  0,
  "10120202010",
  "",
  0,
  "genesisBlock",
  123456
);

let blockchain: Block[] = [genesisBlock];

const getBlockchian = (): Block[] => blockchain;

const getLatestBlock = (): Block => blockchain[blockchain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (nonce: number, data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const newIndex: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newHash: string = Block.calculateBlockHash(
    newIndex,
    previousBlock.hash,
    newTimestamp,
    nonce,
    data
  );
  const newBlock: Block = new Block(
    newIndex,
    newHash,
    previousBlock.hash,
    nonce,
    data,
    newTimestamp
  );
  if (addBlock(newBlock)) return newBlock;
  else return null;
};

const getHashforBlock = (aBlock: Block): string =>
  Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.timestamp,
    aBlock.nonce,
    aBlock.data
  );

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.validateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (!candidateBlock.hash.startsWith("00000")) {
    return false;
  } else if (getHashforBlock(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): boolean => {
  if (isBlockValid(candidateBlock, getLatestBlock())) {
    blockchain.push(candidateBlock);
    return true;
  }
  return false;
};

console.log(getLatestBlock());
var last_nonce = getLatestBlock().nonce;
while (getLatestBlock().index < 3) {
  if (createNewBlock(last_nonce + 1, getLatestBlock().index + 1 + "rd"))
    console.log(getLatestBlock());
  else last_nonce += 1;
}
console.log("완료");
export {};
