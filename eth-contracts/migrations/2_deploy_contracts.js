// migrating the appropriate contracts
var SquareVerifier = artifacts.require("./SquareVerifier.sol");
var SolnSquareVerifier = artifacts.require("./SolnSquareVerifier.sol");

module.exports = function(deployer) {
  deployer.deploy(SquareVerifier).then(()=>{
    deployer.deploy(SolnSquareVerifier, 
      SquareVerifier.address, 
      "UdacityRealEstateToken", 
      "URET", 
      "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/");
    
  })
};
