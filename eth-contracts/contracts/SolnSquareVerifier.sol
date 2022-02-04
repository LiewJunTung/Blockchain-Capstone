// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.7;

import "./ERC721Mintable.sol";
import "./verifier.sol";

// define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract SquareVerifier is Verifier {
    function verify(
        uint256 aX,
        uint256 aY,
        uint256[2] memory bX,
        uint256[2] memory bY,
        uint256 cX,
        uint256 cY,
        uint256[2] memory input
    ) public view returns (bool r) {
        Verifier.Proof memory proof = Verifier.Proof(
            Pairing.G1Point(aX, aY),
            Pairing.G2Point(bX, bY),
            Pairing.G1Point(cX, cY)
        );
        return super.verifyTx(proof, input);
    }
}

// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {
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
    SquareVerifier public nSquareVerifier;

    constructor(
        address _verifierContractAddress,
        string memory name,
        string memory symbol,
        string memory uri
    ) ERC721MintableComplete(name, symbol, uri) {
        nSquareVerifier = SquareVerifier(_verifierContractAddress);
    }

    // Create a function to add the solutions to the array and emit the event
    function addSolution(address _to, uint256 _index, bytes32 key) internal {
        Solution memory solution = Solution(_index, _to);
        solutions.push(solution);
        uniqueSubmittedSolutions[key] = solution;
        emit SolutionAdded(_to, _index);
    }

    // Create a function to mint new NFT only after the solution has been verified
    //
    function mintNewNFT(
        address _to,
        uint256 tokenId,
        uint256 aX,
        uint256 aY,
        uint256[2] memory bX,
        uint256[2] memory bY,
        uint256 cX,
        uint256 cY,
        uint256[2] memory input
    ) public {
        bytes32 key = keccak256(abi.encode(tokenId, aX, aY, bX, bY, cX, cY, input));
        //  - make sure the solution is unique (has not been used before)
        require(
            uniqueSubmittedSolutions[key].to == address(0),
            "make sure the solution is unique and has not been used before"
        );

        bool isProved = nSquareVerifier.verify(aX, aY, bX, bY, cX, cY, input);
        require(isProved, "proof verification: Invalid");
        //  - make sure you handle metadata as well as tokenSupply
        addSolution(_to, tokenId, key);
        mint(_to, tokenId);
    }
}
