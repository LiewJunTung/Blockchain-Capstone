// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./ERC721Mintable.sol";
import "./verifier.sol";

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>

// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is RealEstateToken {
    using Pairing for *;
    // define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address to;
    }

    // define an array of the above struct
    Solution[] solutions;

    // define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private uniqueSubmittedSolutions;

    // Create an event to emit when a solution is added
    event SolutionAdded(address to, uint256 index);

    // need for verify new nft
    Verifier public nSquareVerifier;

    constructor(address _verifierContractAddress){
        nSquareVerifier = Verifier(_verifierContractAddress);
    }

    // Create a function to add the solutions to the array and emit the event
    function addSolution(address _to, uint256 _index) internal {
        Solution memory solution = Solution(_index, _to);
        solutions.push(solution);
       
        emit SolutionAdded(_to, _index);
    }


    
    // TODO Create a function to mint new NFT only after the solution has been verified
    // 
    function mintNewNFT(
    address _to, 
    uint256 tokenId,
    uint aX,
    uint aY,
    uint[2] memory bX,
    uint[2] memory bY,
    uint cX,
    uint cY,
    uint[2] memory input
    ) public {
        bytes32 key = keccak256(abi.encode(aX, aY, bX, bY, cX, cY, input));
//  - make sure the solution is unique (has not been used before)
        require(uniqueSubmittedSolutions[key].to == address(0), "make sure the solution is unique and has not been used before");

        Verifier.Proof memory proof = Verifier.Proof(
            Pairing.G1Point(aX, aY),
            Pairing.G2Point(bX, bY),
            Pairing.G1Point(cX, cY)
        );
        bool isProved = nSquareVerifier.verifyTx(proof, input);
        require(isProved, "proof verification: Invalid");
        //  - make sure you handle metadata as well as tokenSupply 
        addSolution(_to, tokenId);
        mint(_to, tokenId);
    }
}
