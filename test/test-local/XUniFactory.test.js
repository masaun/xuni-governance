/// Using local network
const Web3 = require('web3');
const web3 = new Web3(new Web3.providers.WebsocketProvider('ws://localhost:8545'))

/// Openzeppelin test-helper
const { time } = require('@openzeppelin/test-helpers');

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
    let minter = accounts[1]
    let user1 = accounts[2]
    let user2 = accounts[3]
    let user3 = accounts[4]

    /// Global contract instance
    let uniToken
    let xUniFactory

    /// Global variable for each contract addresses
    let UNI_TOKEN
    let XUNI_FACTORY

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

        it("[Log]: Deployed-contracts addresses", async () => {
            console.log("\n=== UNI_TOKEN ===", UNI_TOKEN)
            console.log("\n=== XUNI_FACTORY (xUNI) ===", XUNI_FACTORY)
        })
    })

    describe("Preparation", () => {
        it("Mint 100 UNI token to 3 users", async () => {
            const mintAmount = web3.utils.toWei('100', 'ether')

            /// [Note]: Every time UNI is minted, value of "mintingAllowedAfter" is updated.
            const mintingAllowedAfter1 = await uniToken.mintingAllowedAfter()
            await time.increaseTo(Number(mintingAllowedAfter1) + 600)         
            txReceipt1 = await uniToken.mint(user1, mintAmount, { from: minter })

            const mintingAllowedAfter2 = await uniToken.mintingAllowedAfter()
            await time.increaseTo(Number(mintingAllowedAfter2) + 600)     
            txReceipt2 = await uniToken.mint(user2, mintAmount, { from: minter })

            const mintingAllowedAfter3 = await uniToken.mintingAllowedAfter()
            await time.increaseTo(Number(mintingAllowedAfter3) + 1800)
            txReceipt3 = await uniToken.mint(user3, mintAmount, { from: minter })
        })
    })

    describe("Stake", () => {
        it("User1 stake 20 UNI token into the xUniFactory contract and receive xUNI token", async () => {
            const stakeAmount = web3.utils.toWei('20', 'ether')
            txReceipt1 = await uniToken.approve(XUNI_FACTORY, stakeAmount, { from: user1 })

            /// User1 stake and gets 20 shares.
            txReceipt2 = await xUniFactory.stakeUNI(stakeAmount, { from: user1 })
        })
    })

    describe("Un-Stake", () => {
        it("User1 un-stake 5 xUNI token and receive UNI token", async () => {
            const unStakeAmount = web3.utils.toWei('5', 'ether')
            txReceipt = await xUniFactory.unStake(unStakeAmount, { from: user1 })
        })
    })
})
