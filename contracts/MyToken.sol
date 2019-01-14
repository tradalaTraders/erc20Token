pragma solidity ^0.5.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-solidity/contracts/token/ERC20/ERC20Detailed.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract MyToken is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 10000000;
    string public name = "MyToken";
    string public symbol = "VRK";
    uint public decimals = 18;
    constructor () public{
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    function transfer(address _to, uint256 _value)  public returns (bool success){
        //check whether account have enough balance or not
        require(balanceOf(msg.sender)>=_value);
        _transfer(msg.sender,_to,_value);
        return true;
    }
    function approve(address _spender , uint256 _value) public returns (bool success) {
        increaseAllowance(_spender,_value);    
        // emit Approval(msg.sender,_spender, _value);
        return true;
    }
    function transferFromMyToken(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf(_from));
        require(_value <= allowance(_from, msg.sender));
        transferFrom(_from, _to, _value);
        return true;
    }
}