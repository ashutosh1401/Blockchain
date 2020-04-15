const SHA256 = require('crypto-js/sha256');
/*class Transaction {
  constructor(fromAddress, toAddress, amount){
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}*/
class Block {
  constructor(index, timestamp, /*transactions ,*/previousHash=''){
    this.index = index;
    this.timestamp = timestamp;
    //this.transactions = transactions;
    this.previousHash = previousHash;
    this.Hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash(){
    return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce).toString();
  }
  mineBlock(difficulty){
    while(this.Hash.substring(0,difficulty)!== Array(difficulty + 1).join("0")){
      this.nonce++;
      this.Hash = this.calculateHash();
    }
    console.log("Block mined is : " + this.Hash);
  }
}

class Blockchain {
  constructor(){
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 3;
    this.pendingTransaction = [];
    this.miningReward = 100;
  }
  createGenesisBlock(){
    return new Block(0,"14-04-2020 21:50","Initial Block","0");
  }

  latestBlock(){
    return this.chain[this.chain.length - 1];
  }
/*  minePendingTransaction(miningRewardAddress){
    let block = new Block(Date.now(), this.pendingTransaction);
    block.mineBlock(this.difficulty);
    console.log("Block mined successfully");
    this.chain.push(block);
    this.pendingTransaction = [
      new Transaction(null,miningRewardAddress,this.miningReward);
    ];
  }
  createTransaction(transaction){
    this.pendingTransaction.push(transaction);

  }*/
  addNewBlock(newBlock){
    newBlock.previousHash = this.latestBlock().Hash;
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }
  isChainValid(){
    for(let i=0;i<this.chain.length;i++){
        const currentBlock = this.chain[i];
        const prevBlock = this.chain[i-1];
        if(currentBlock.Hash !== currentBlock.calculateHash())
          return false;
        if(currentBlock.previousHash !== prevBlock.calculateHash())
          return false;
    }
    return true;
  }
}


let MyCoin = new Blockchain();
MyCoin.addNewBlock(new Block(1,"14-04-2020 22:02",{amount: "1000 coins" ,from: "ashutosh",to:"PMcares" }));
MyCoin.addNewBlock(new Block(2,"14-04-2020 22:04",{amount: "2000 coins" ,from: "ashutosh",to: " SBI Bank"}));

console.log(JSON.stringify(MyCoin, null, 4));
