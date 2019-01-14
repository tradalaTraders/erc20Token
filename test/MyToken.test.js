// const web3 = require('web3');
const MyToken = artifacts.require("./MyToken");
// let BigNumber = require('bignumber.js');
const BigNumber = web3.BigNumber;

// const BigNumber = web3.BigNumber;

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('MyToken', accounts => {
    const _name = "MyToken";
    const _symbol = "VRK";
    const _decimals = 18;
    const _totalSupply = 10000000;
    var tokenInstance;

    beforeEach(async function () {
        this.token = await MyToken.new();
    })
    it('initializes the contract with the correct values', function () {
        return MyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.name();
        }).then(function (name) {
            assert.equal(name, _name, 'has the correct name');
            return tokenInstance.symbol();
        }).then(function (symbol) {
            assert.equal(symbol, _symbol, 'has the correct symbol');
            return tokenInstance.decimals();
        }).then(function (decimal) {
            //   assert.equal(decimal, 'DApp Token v1.0', 'has the correct standard');
            assert.equal(decimal.toNumber(), _decimals, 'it has correct decimals');

        });
    })

    it('allocates the initial supply upon deployment', function () {
        return MyToken.deployed().then(function (instance) {
            tokenInstance = instance;
            return tokenInstance.totalSupply();
        }).then(function (totalSupply) {
            assert.equal(totalSupply.toNumber(), _totalSupply, 'sets the total supply to 1,000,000');
            return tokenInstance.balanceOf(accounts[0]);
        }).then(function (adminBalance) {
            // assert.equal(adminBalance.toNumber(), _totalSupply, 'it allocated total Supply to admin');
            // console.log('type:', adminBalance.toNumber());
            var nim = adminBalance.toNumber();
            assert.equal(nim, _totalSupply, 'it allocates the initial supply to the admin account');

        })

    })
    it('transfers token ownership', () => {
        return MyToken.deployed().then((instance) => {
            tokenInstance = instance;
            return tokenInstance.transfer.call(accounts[1], 100000000000000);
        }).then(assert.fail).catch(function (error) {
            assert(error.message.indexOf('revert') >= 0, 'error message must contain revert');
            return tokenInstance.transfer(accounts[1], 25000, {
                from: accounts[0]
            })
        }).then(function (success) {
            // console.log('success', success);

            // assert.equal(success, true, 'it returns true');
            return tokenInstance.transfer(accounts[1], 25000, {
                from: accounts[0]
            });
        }).then((receipt) => {
            assert.equal(receipt.logs.length, 1, 'triggered an event');
            assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
            assert.equal(receipt.logs[0].args.from, accounts[0], 'logs the account the tokens are transferred from');
            assert.equal(receipt.logs[0].args.to, accounts[1], 'logs the account the tokens are transferred to');
            assert.equal(receipt.logs[0].args.value, 25000, 'logs the transfer amount');
            return tokenInstance.balanceOf(accounts[1]);
        }).then((balance) => {
            assert.equal(balance.toNumber(), 50000, 'adds amount to the receivers account');
            return tokenInstance.balanceOf(accounts[0])
        }).then((balance) => {
            assert.equal(balance.toNumber(), 9950000, 'deducts amount');
        })
    })
    it('approves tokens for delegated transfer', function() {
        return MyToken.deployed().then(function(instance) {
          tokenInstance = instance;
          return tokenInstance.approve.call(accounts[1], 100);
        }).then(function(success) {
          assert.equal(success, true, 'it returns true');
          return tokenInstance.approve(accounts[1], 100, { from: accounts[0] });
        }).then(function(receipt) {
            // console.log('receipt:-',receipt);
            
          assert.equal(receipt.logs.length, 1, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Approval', 'should be the "Approval" event');
          assert.equal(receipt.logs[0].args.owner, accounts[0], 'logs the account the tokens are authorized by');
          assert.equal(receipt.logs[0].args.spender, accounts[1], 'logs the account the tokens are authorized to');
          assert.equal(receipt.logs[0].args.value, 100, 'logs the transfer amount');
          return tokenInstance.allowance(accounts[0], accounts[1]);
        }).then(function(allowance) {
          assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated trasnfer');
        });
      });
    it('handles delegated token transfers', function() {
        return MyToken.deployed().then(function(instance) {
          tokenInstance = instance;
          fromAccount = accounts[2];
          toAccount = accounts[3];
          spendingAccount = accounts[4];
          // Transfer some tokens to fromAccount
          return tokenInstance.transfer(fromAccount, 100, { from: accounts[0] });
        }).then(function(receipt) {
          // Approve spendingAccount to spend 10 tokens form fromAccount
          return tokenInstance.approve(spendingAccount, 10, { from: fromAccount });
        }).then(function(receipt) {
          // Try transferring something larger than the sender's balance
          return tokenInstance.transferFromMyToken(fromAccount, toAccount, 9999, { from: spendingAccount });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than balance');
          // Try transferring something larger than the approved amount
          return tokenInstance.transferFromMyToken(fromAccount, toAccount, 20, { from: spendingAccount });
        }).then(assert.fail).catch(function(error) {
          assert(error.message.indexOf('revert') >= 0, 'cannot transfer value larger than approved amount');
          return tokenInstance.transferFromMyToken.call(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(success) {
          assert.equal(success, true);
          return tokenInstance.transferFromMyToken(fromAccount, toAccount, 10, { from: spendingAccount });
        }).then(function(receipt) {
            // console.log(receipt);
            
          assert.equal(receipt.logs.length, 2, 'triggers one event');
          assert.equal(receipt.logs[0].event, 'Transfer', 'should be the "Transfer" event');
          assert.equal(receipt.logs[0].args.from, fromAccount, 'logs the account the tokens are transferred from');
          assert.equal(receipt.logs[0].args.to, toAccount, 'logs the account the tokens are transferred to');
          assert.equal(receipt.logs[0].args.value, 10, 'logs the transfer amount');
          return tokenInstance.balanceOf(fromAccount);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 90, 'deducts the amount from the sending account');
          return tokenInstance.balanceOf(toAccount);
        }).then(function(balance) {
          assert.equal(balance.toNumber(), 10, 'adds the amount from the receiving account');
          return tokenInstance.allowance(fromAccount, spendingAccount);
        }).then(function(allowance) {
          assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
        });
      });
 
})