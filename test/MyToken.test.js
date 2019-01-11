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
    beforeEach(async function () {
        this.token = await MyToken.new();
    })
    describe('token attributes', function () {
        it('has the correct name', async function () {
            const name = await this.token.name();
            name.should.equal(_name);
        });
        it('has the correct symbol', async function () {
            const symbol = await this.token.symbol();
            symbol.should.equal(_symbol);
        });
        it('has the correct decimals', async function () {
            const decimals = await this.token.decimals();
            decimals.should.be.bignumber.equal(_decimals);
        });
    });
})