const BigNumber = web3.BigNumber;
const MyToken = artifacts.require("./MyToken");

require('chai')
    .use(require('chai-bignumber')(BigNumber))
    .should();

contract('MyToken', accounts => {
    const _name = "My Token";
    const _symbol = "VRK";
    const _decimals = 18;
    beforeEach(async function () {
        this.token = await MyToken.new(_name, _symbol, _decimals);
    })
    describe('token attributes', function () {
        it('has the correct name', async function () {
            const name = await this.token.name();
            name.should.equals(_name);
        });
        it('has the correct symbol', async function () {
            const symbol = await this.token.symbol();
            symbol.should.equals(_symbol);
        });
        it('has the correct decimals', async function () {
            const decimals = await this.token.decimals();
            decimals.should.be.bignumber.equals(_decimals);
        });
    });
})