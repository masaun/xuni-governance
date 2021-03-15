/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Artifact of smart contracts 
const SushiYieldSource = artifacts.require("SushiYieldSource")
const SushiToken = artifacts.require("SushiToken")
const SushiBar = artifacts.require("SushiBar")  /// [Note]: SushiBar contract also works as xSushiToken


/**
 * @notice - This is the test of SushiYieldSource.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/SushiYieldSource.test.js
 */
contract("SushiYieldSource", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]
    let user3 = accounts[3]

    /// Global contract instance
    let sushiYieldSource
    let sushiToken
    let sushiBar

    /// Global variable for each contract addresses
    let SUSHI_YIELD_SOURCE
    let SUSHI_TOKEN
    let SUSHI_BAR

    describe("Setup smart-contracts", () => {
        it("Deploy the SushiToken contract instance", async () => {
            sushiToken = await SushiToken.new({ from: deployer })
            SUSHI_TOKEN = sushiToken.address
        })

        it("Deploy the SushiBar (xSushi) contract instance", async () => {
            sushiBar = await SushiBar.new(SUSHI_TOKEN, { from: deployer })
            SUSHI_BAR = sushiBar.address
        })

        it("Deploy the SushiYieldSource contract instance", async () => {
            sushiYieldSource = await SushiYieldSource.new(SUSHI_TOKEN, SUSHI_BAR, { from: deployer })
            SUSHI_YIELD_SOURCE = sushiYieldSource.address

            /// [Note]: Retrieve an event log of "XSushiYieldSourceInitialized" (via web3.js v1.0.0)
            let events = await sushiYieldSource.getPastEvents("XSushiYieldSourceInitialized", {
                filter: {},  /// [Note]: If "index" is used for some event property, index number is specified
                fromBlock: 0,
                toBlock: 'latest'
            })
            console.log("\n=== [Event log]: XSushiYieldSourceInitialized ===", events[0].returnValues)
        })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("\n=== SUSHI_TOKEN ===", SUSHI_TOKEN)
            console.log("\n=== SUSHI_BAR (XSUSHI) ===", SUSHI_BAR)
            console.log("\n=== SUSHI_YIELD_SOURCE ===", SUSHI_YIELD_SOURCE)
        })
    })

    describe("Preparation", () => {
        it("1000 SushiToken should be minted to user1", async () => {
            const mintAmount = web3.utils.toWei("1000", "ether")
            const to = user1
            let txReceipt = await sushiToken.mint(to, mintAmount, { from: deployer })

            const sushiBalance = await sushiToken.balanceOf(user1, { from: user1 })
            assert.equal(mintAmount, String(sushiBalance), "1000 SushiToken should be minted to user1")
        })
    })

    describe("Check basic methods", () => {
        it("Token to be deposited should be SushiToken", async () => {
            const TOKEN = await sushiYieldSource.token({ from: deployer })
            assert.equal(TOKEN, SUSHI_TOKEN, "Token to be deposited should be SushiToken")
        })

        //it("Before starting, xSushi balance of the SushiYieldSource contract should be ~~", async () => {
            //const xSushiBalance = await sushiYieldSource.balanceOf(user1, { from: deployer })
            //assert.equal(xSushiBalance, 0, "Before starting, xSushi balance of the SushiYieldSource contract should be ~~");
        //})
    })

    describe("Process from supply (deposit) to redeem", () => {
        it("User1 supply 100 SushiToken to an account", async () => {
            const depositAmount = web3.utils.toWei("100", "ether")  /// [Note]: This amount to be deposited is SushiToken amount
            const to = user1  /// [Note]: "to" is the account to be credited
            let txReceipt1 = await sushiToken.approve(SUSHI_YIELD_SOURCE, depositAmount, { from: user1 })
            let txReceipt2 = await sushiYieldSource.supplyTo(depositAmount, to, { from: user1 })
        })

        it("User1 redeem 50 xSushi from the SushiYieldSource contract", async () => {
            const redeemAmount = web3.utils.toWei("50", "ether")   /// [Note]: This amount to be redeemed is xSushiToken amount
            const to = SUSHI_YIELD_SOURCE
            let txReceipt = await sushiYieldSource.redeem(redeemAmount, { from: user1 })
        })
    })

})
