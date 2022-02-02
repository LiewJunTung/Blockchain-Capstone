var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const accountOne = accounts[0];
    const accountTwo = accounts[1];
    const accountThree = accounts[2];

    describe('match erc721 spec', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("REAL ESTATE NFT", "RET", "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/", {from: accountOne});

            // mint multiple tokens
            const result = await this.contract.mint(accountTwo, 1, {from: accountOne})
            await this.contract.mint(accountThree, 2, {from: accountOne})
        })

        it('should return total supply', async function () { 
            const totalSupply = await this.contract.totalSupply.call({from: accountOne})
            assert.equal(totalSupply.toNumber(), 2)
        })

        it('should get token balance', async function () { 
            const tokenBalance = await this.contract.balanceOf.call(accountTwo, { from: accountTwo })
            assert.equal(tokenBalance.toNumber(), 1)
        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () { 
            const tokenUri = await this.contract.getBaseTokenURI.call({ from: accountTwo })
            assert.equal(tokenUri, "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/")
        })

        it('should transfer token from one owner to another', async function () { 
            await this.contract.transferFrom(accountTwo, accountThree, 1, {from: accountTwo})
            const tokenBalance = await this.contract.balanceOf.call(accountTwo, { from: accountTwo })
            assert.equal(tokenBalance.toNumber(), 0)
            const accountThreeTokenBalance = await this.contract.balanceOf.call(accountThree, { from: accountThree })
            assert.equal(accountThreeTokenBalance.toNumber(), 2)
        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () { 
            this.contract = await ERC721MintableComplete.new("REAL ESTATE NFT", "RET", "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/", {from: accountOne});
        })

        it('should fail when minting when address is not contract owner', async function () { 
            let result = await this.contract.mint(accountThree, 2, {from: accountTwo})
            assert.isTrue(typeof(result.tx) === "undefined")
        })

        it('should return contract owner', async function () { 
            let owner = await this.contract.getOwner.call({ from: accountOne });
            assert.equal(owner, accountOne);
        })

    });
})