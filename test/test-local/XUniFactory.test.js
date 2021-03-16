/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Artifact of smart contracts 
const XUniFactory = artifacts.require("XUniFactory")
const UniToken = artifacts.require("Uni")


/**
 * @notice - This is the test of XUniFactory.sol
 * @notice - [Execution command]: $ truffle test ./test/test-local/XUniFactory.test.js
 */
contract("XUniFactory", function(accounts) {
    /// Acccounts
    let deployer = accounts[0]
    let user1 = accounts[1]
    let user2 = accounts[2]

    /// Global contract instance
    let uniToken
    let xUniFactory

    /// Global variable for each contract addresses
    let UNI_TOKEN
    let XUNI_FACTORY

    describe("Setup smart-contracts", () => {
        it("Deploy the UniToken contract instance", async () => {
            const account = deployer
            const minter_ = user1
            const mintingAllowedAfter_ = 1

            uniToken = await UniToken.new(account, minter_, mintingAllowedAfter_, { from: deployer })
            UNI_TOKEN = uniToken.address
        })

        it("Deploy the XUniFactory contract instance", async () => {
            xUniFactory = await XUniFactory.new(uniToken, { from: deployer })
            XUNI_FACTORY = xUniFactory.address
        })

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("\n=== UNI_TOKEN ===", UNI_TOKEN)
            console.log("\n=== XUNI_FACTORY (xUNI) ===", XUNI_FACTORY)
        })
    })

})
