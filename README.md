# xUNI Governance

***
## 【Introduction of the xUNI Governance🦄】
- This is a smart contract to incentivize UNI holders to participate Uniswap's governance activities (e.g. voting) by which:
  - allow UNI token holders to stake their UNI tokens and receive xUNI tokens in return.
  - and then they can stake it in the xUNI token pool. (By doing this process, staker earn some interest)

<br>

- xUNI tokens are used for Uniswap's governance activities (e.g. voting) instead of UNI tokens
  (Note: This specification has not been implemented in this repo yet)


&nbsp;

***

## 【Workflow】
- Diagram of workflow  
![【Diagram】xUNI Governance](https://user-images.githubusercontent.com/19357502/113312465-484d8b00-9345-11eb-8bba-3099325287c1.jpg)

&nbsp;

***

## 【Remarks】
- Version for following the `Uniswap V2` smart contract
  - Solidity (Solc): v0.6.12
  - Truffle: v5.1.60
  - web3.js: v1.2.9
  - openzeppelin-solidity: v3.2.0
  - ganache-cli: v6.9.1 (ganache-core: 2.10.2)


&nbsp;

***

## 【Setup】
### ① Install modules
- Install npm modules in the root directory
```
$ npm install
```

<br>

### ② Compile & migrate contracts (on local)
```
$ npm run migrate:local
```

<br>

### ③ Test
- 1: Start ganache-cli
```
$ ganache-cli -d
```
(※ `-d` option is the option in order to be able to use same address on Ganache-CLI every time)

<br>

- 2: Execute test of the smart-contracts (on the local)  
  - Test for the XUniFactory contract  
    `$ npm run test:XUniFactory`  
    ($ truffle test ./test/test-local/XUniFactory.test.js)     

  - Test for the GovernorAlphaWithXUni contract   
    `$ npm run test:GovernorAlphaWithXUni`    
    ($ truffle test ./test/test-local/GovernorAlphaWithXUni.test.js)  

<br>

***

## 【References】
- Uniswap V2 (Governance)
  https://github.com/Uniswap/governance

- SushiSwap
  https://github.com/sushiswap/sushiswap

- GR9 Prize (UNI Grants Program - Innovation and Focus Area Bounties)
  https://gitcoin.co/issue/unigrants/ugp-hacks/1/100025056
