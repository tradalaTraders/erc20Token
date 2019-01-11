var MyToken = artifacts.require("./MyToken.sol");

module.exports = function (deployer) {
    const _name= "My Token";
    const _symbol = "VRK";
    const _decimals = 18;
    deployer.deploy(MyToken, _name, _symbol, _decimals);
};