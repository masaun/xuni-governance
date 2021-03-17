/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

/// Artifact of smart contracts 
const GovernorAlphaWithXUni = artifacts.require("GovernorAlphaWithXUni")
const Timelock = artifacts.require("Timelock")
const XUniFactory = artifacts.require("XUniFactory")
const UniToken = artifacts.require("Uni")


/**
 * @notice - This is the test of GovernorAlphaWithXUni.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/GovernorAlphaWithXUni.test.js
 */
contract("GovernorAlphaWithXUni", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let minter = accounts[1]
    let admin = accounts[2]
    let user1 = accounts[3]
    let user2 = accounts[4]

    /// Global contract instance
    let uniToken
    let xUniFactory
    let timelock
    let governorAlphaWithXUni

    /// Global variable for each contract addresses
    let UNI_TOKEN
    let XUNI_FACTORY
    let TIMELOCK
    let GOVERNOR_ALPHA_WITH_XUNI

    /// Parameter
    const DELAY = 60 * 60 * 24 * 2


    /// Converter
    function roundedAmount(weiAmount) {
        const fromWeiAmount = String(web3.utils.fromWei(weiAmount, 'ether'))
        const roundedAmount = Math.round(Number(fromWeiAmount))  /// Rounded
        return roundedAmount
    }

    describe("Setup smart-contracts", () => {
        it("Deploy the UniToken contract instance", async () => {
            const now = await time.latest()

            // @param account The initial account to grant all the tokens
            // @param minter_ The account with minting ability
            // @param mintingAllowedAfter_ The timestamp after which minting may occur
            const account = deployer
            const minter_ = minter
            const mintingAllowedAfter_ = Number(now) + 3600  /// [Note]: The latest timestamp + 1 hour (3600 seconds)
            console.log('=== mintingAllowedAfter_ ===', mintingAllowedAfter_)
            
            uniToken = await UniToken.new(account, minter_, mintingAllowedAfter_, { from: deployer })
            UNI_TOKEN = uniToken.address
        })

        it("Deploy the XUniFactory contract instance", async () => {
            xUniFactory = await XUniFactory.new(UNI_TOKEN, { from: deployer })
            XUNI_FACTORY = xUniFactory.address
        })

        it("Deploy the Timelock contract instance", async () => {
            timelock = await Timelock.new(admin, DELAY, { from: deployer })
            TIMELOCK = timelock.address
        })

        it("Deploy the GovernorAlphaWithXUni contract instance", async () => {
            governorAlphaWithXUni = await GovernorAlphaWithXUni.new(TIMELOCK, XUNI_FACTORY, { from: deployer })
            GOVERNOR_ALPHA_WITH_XUNI = governorAlphaWithXUni.address
        })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("\n=== UNI_TOKEN ===", UNI_TOKEN)
            console.log("=== XUNI_FACTORY (xUNI) ===", XUNI_FACTORY)
            console.log("=== TIMELOCK ===", TIMELOCK)
            console.log("=== GOVERNOR_ALPHA_WITH_XUNI ===",GOVERNOR_ALPHA_WITH_XUNI)
        })
    })

    describe("Governor", () => {
        it("governor", async () => {
            const votingPeriod = await governorAlphaWithXUni .votingPeriod()
            const timelockAddress = await governorAlphaWithXUni.timelock()
            const xuniFromGovernor = await governorAlphaWithXUni.xUni()

            assert.equal(votingPeriod, 40320, "votingPeriod should be 40320")
            assert.equal(timelockAddress, TIMELOCK, `timelockAddress should be ${ TIMELOCK }`)
            assert.equal(xuniFromGovernor, XUNI_FACTORY, `timelockAddress should be ${ XUNI_FACTORY }`)
        })
    })

})
