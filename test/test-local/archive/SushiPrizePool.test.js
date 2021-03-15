/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Artifact of smart contracts 
const SushiPrizePool = artifacts.require("SushiPrizePool")
const PrizeStrategy = artifacts.require("PeriodicPrizeStrategy")
//const Erc20Token = artifacts.require("ERC20")
const SushiToken = artifacts.require("SushiToken")
const Registry = artifacts.require("Registry")
const ControlledToken = artifacts.require("ControlledToken")


/**
 * @notice - Test of SushiPrizePool.sol that reference from test of StakePrizePool.sol
 */
contract("SushiPrizePool", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let sushiPrizePool
    let erc20token
    let sushiToken
    let prizeStrategy
    let registry
    let controlledToken

    /// Global variable for each contract addresses
    let SUSHI_PRIZE_POOL
    let SUSHI_TOKEN
    let REGISTRY
    //let ticket

    /// Paramaters for initializing
    let poolMaxExitFee = web3.utils.toWei('0.5')
    let poolMaxTimelockDuration = 10000

    let initializeTxPromise

    describe("Setup smart-contracts", () => {
        // it("Deploy the ERC20Token contract instance", async () => {
        //     erc20Token = await Erc20Token.new("Token", "TOKE", { from: deployer })
        // })

        // it("Deploy the PrizeStrategy contract instance", async () => {
        //     prizeStrategy = await PrizeStrategy.new({ from: deployer })
        // })

        it("Deploy the SushiToken contract instance", async () => {
            sushiToken = await SushiToken.new({ from: deployer })
            SUSHI_TOKEN = sushiToken.address
            console.log("\n=== SUSHI_TOKEN ===", SUSHI_TOKEN)
        })

        it("Deploy the Registry contract instance", async () => {
            registry = await Registry.new({ from: deployer })
            REGISTRY = registry.address;
        })

        it("Deploy the ControlledToken (Ticket) contract instance", async () => {
            /// [Note]: This is "ticket"
            controlledToken = await ControlledToken.new({ from: deployer })
        })

        it("Deploy the SushiPrizePool contract instance", async () => {
            const _reserveRegistry = REGISTRY
            const _controlledTokens = [SUSHI_TOKEN]  /// [Note]: Deposited-Token (=ticket) is the SushiToken
            const _maxExitFeeMantissa = poolMaxExitFee
            const _maxTimelockDuration = poolMaxTimelockDuration
            const _sushiToken = sushiToken

            sushiPrizePool = await SushiPrizePool.new(_reserveRegistry, 
                                                      _controlledTokens, 
                                                      _maxExitFeeMantissa, 
                                                      _maxTimelockDuration,
                                                      _sushiToken, 
                                                      { from: deployer })

            SUSHI_PRIZE_POOL = sushiPrizePool.address
            console.log("\n=== SUSHI_PRIZE_POOL ===", SUSHI_PRIZE_POOL)

            /// [Note]: Retrieve an event log of "SushiPrizePoolInitialized" (via web3.js v1.0.0)
            let events = await sushiPrizePool.getPastEvents('SushiPrizePoolInitialized', {
                filter: {},  /// [Note]: If "index" is used for some event property, index number is specified
                fromBlock: 0,
                toBlock: 'latest'
            })
            console.log("\n=== Event log: SushiPrizePoolInitialized ===", events[0])
            //console.log("\n=== Event log: SushiPrizePoolInitialized ===", events[0].returnValues)
        })

    })

    describe('_redeem()', () => {
        it('should return amount staked-SushiToken', async () => {
            let redeemAmount = web3.utils.toWei('500')

            let sushiTokenBalance = await sushiToken.balanceOf(SUSHI_PRIZE_POOL, { from: deployer })
            await sushiPrizePool.redeem(redeemAmount)
        })
    })

    describe('canAwardExternal()', () => {
        it('should not allow the SushiToken award', async () => {
            const result = await sushiPrizePool.canAwardExternal(SUSHI_TOKEN) 
            assert.equal(result, false, "should not allow the SushiToken award")
        })
    })

    describe('balance()', () => {
        it('should return the staked-SushiToken balance', async () => {
            let sushiTokenBalance = await sushiToken.balanceOf(SUSHI_PRIZE_POOL, { from: deployer })
            //expect(await sushiPrizePool.callStatic.balance()).to.equal(toWei('32'))
        })
    })

    describe('_token()', () => {
        it('should return the staked-SushiToken', async () => {
            let stakedTokenAddress = await sushiPrizePool.token()
            assert.equal(stakedTokenAddress, SUSHI_TOKEN, "should return the staked-SushiToken")
        })
    })
});
