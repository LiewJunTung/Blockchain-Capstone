// Test if a new solution can be added for contract - SolnSquareVerifier

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier

const SquareVerifier = artifacts.require('SquareVerifier');
const SolnSquareVerifier = artifacts.require('SolnSquareVerifier');
const proof = require('../../zokrates/code/square/proof.json');


contract('TestERC721Mintable', accounts => {

    const accountOne = accounts[0];
    const accountTwo = accounts[1];
    const accountThree = accounts[2];


    beforeEach(async function () { 
        const squareVerifier = await SquareVerifier.new({from: accountOne});

        this.contract = await SolnSquareVerifier.new(squareVerifier.address, "REAL ESTATE NFT", "RET", "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/", {from: accountOne});
    })

    it("able to mint new NFT only after the solution has been verified", async function() {
        
        const result = await this.contract.mintNewNFT(accountTwo,
             1, 
            proof['proof']['a'][0], 
            proof['proof']['a'][1], 
            proof['proof']['b'][0], 
            proof['proof']['b'][1], 
            proof['proof']['c'][0], 
            proof['proof']['c'][1], 
            proof['inputs'],
            {from: accountOne})
        const tokenBalance = await this.contract.balanceOf.call(accountTwo, { from: accountTwo })
        assert.equal(tokenBalance.toNumber(), 1)
    })
});