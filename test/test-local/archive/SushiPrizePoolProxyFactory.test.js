/// Using local network
const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Artifact of smart contracts 
const SushiPrizePoolProxyFactory = artifacts.require("SushiPrizePoolProxyFactory")


/**
 * @notice - Test of SushiPrizePoolProxyFactory.sol that reference from test of SushiPrizePoolProxyFactory.sol
 * @notice - [Command]: $ truffle test ./test/test-local/SushiPrizePoolProxyFactory.test.js
 */
contract("SushiPrizePoolProxyFactory", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let sushiPrizePoolProxyFactory

    /// Global variable for each contract addresses
    let SUSHI_PRIZE_POOL_PROXY_FACTORY

    describe("Setup smart-contracts", () => {
        it("Deploy the SushiPrizePoolProxyFactory contract instance", async () => {
            sushiPrizePoolProxyFactory = await SushiPrizePoolProxyFactory.new({ from: deployer })
            SUSHI_PRIZE_POOL_PROXY_FACTORY = sushiPrizePoolProxyFactory.address
        })
    })

    describe('create()', () => {
        it('should create a new prize strategy', async () => {
            let txReceipt = await sushiPrizePoolProxyFactory.create({ from: deployer })

            /// [Note]: Retrieve an event log via web3.js v1.0.0
            let events = await sushiPrizePoolProxyFactory.getPastEvents('ProxyCreated', {
                filter: {},  /// [Note]: If "index" is used for some event property, index number is specified
                fromBlock: 0,
                toBlock: 'latest'
            })
            console.log("\n=== Event log of ProxyCreated ===", events[0].returnValues)
        })
    })
})
