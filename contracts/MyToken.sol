pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyToken is ERC20, ERC20Detailed, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1000000000000000;

    constructor () public ERC20Detailed("MyToken", "VRK",18){
        _mint(msg.sender, INITIAL_SUPPLY);
        emit Transfer(address(0), msg.sender, totalSupply());
    }

}