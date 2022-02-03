const fs = require("fs");
const ownerAddress = "0x114bB3Ba12B3934C3C9c3027c3e33DA85A6639f4";
const contractAddress = "0x06cc9a867e959db12b6f0a65afd470691e0e06dd";
const HDWalletProvider = require("@truffle/hdwallet-provider");
const web3 = require("web3");
const contractAbi = require("./build/contracts/SolnSquareVerifier.json");
const mnemonic = fs.readFileSync(".mnemonic").toString().trim();
const proof = require("../zokrates/code/square/proof.json");

const provider = new HDWalletProvider(
  mnemonic,
  "https://rinkeby.infura.io/v3/7ed0669e93bc49fb998603dee7787d37"
);
const instance = new web3(provider);

const nftContract = new instance.eth.Contract(
  contractAbi["abi"],
  contractAddress,
  { gasLimit: "1000000" }
);

async function mint() {
  try {
    const result = await nftContract.methods
      .mintNewNFT(
        ownerAddress,
        5, // update this
        proof["proof"]["a"][0],
        proof["proof"]["a"][1],
        proof["proof"]["b"][0],
        proof["proof"]["b"][1],
        proof["proof"]["c"][0],
        proof["proof"]["c"][1],
        proof["inputs"]
      )
      .send({ from: ownerAddress });
    console.log("MINT: ");
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

async function getBaseTokenURI() {
  try {
    const result = await nftContract.methods
      .getBaseTokenURI()
      .call({ from: ownerAddress });
    console.log(result);
  } catch (e) {
    console.error(e);
  }
}

async function getTokenURI() {
  const result = await nftContract.methods
    .tokenURI(1)
    .call({ from: ownerAddress });
  console.log(result);
}

mint();
// getBaseTokenURI();
// getTokenURI();
