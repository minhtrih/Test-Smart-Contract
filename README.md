# How To Audit or Test Smart Contracts

There are many ways to audit smart contract solidity, below I will list some of the audit tools/ways that I usually do it

- [RemixIDE](https://remix.ethereum.org/)
- [Ganache](https://www.npmjs.com/package/ganache-cli)
- [Slither](https://github.com/crytic/slither)
- [Infura](https://infura.io/)
- [Quicknode](https://www.quicknode.com/chains/bsc)
- [Ankr](https://docs.ankr.com/ankr-protocol/public-rpcs)
- [Moralis](https://moralis.io/)

## I. Testing Smart Contracts

Currently, to run a contract we usually deploy on the following blockchain networks

### 1. Local Enviroment

We can use TestRPC, Ganache CLI uses ethereumjs to simulate full client behavior. We can setup time mining faster or slower. Here we will have 10 address to use in this testRPC

<h2 align="center">
  <img src="./images/ganache-window.png" alt="Ganache" width="500"/>
</h2>

### 2. Testnet blockchain

If you don't want to use ganache, then instead really want to use testnet. We can use Rinkeby or Rospten of ethereum, or the Binance Smart Chain side that has bsc tesnet.

To connect this network testnet is quite simple, currently, there are 2 common libraries for developers: [web3](https://github.com/ChainSafe/web3.js) and [etherjs](https://github.com/ethers-io/ethers.js). In the docx, there are specific instructions on how to connect to node RPC.

### 3. Mainnet blockchain

## II. Audit Smart Contracts

I often use [Slither](https://github.com/crytic/slither), it will report security errors in my contract, even gas fees if high.

```
$ slither .
```

<h2 align="center">
  <img src="./images/slither2.png" alt="Slither"/>
</h2>

## III. Fork Mainnet to test contract

This part I quite usually use because it is convenient for testing when there is a need for a lot of real data quickly. Simply when there are errors on the contract that cause the user to lose money or lose nft or I want to optimize gas when data is increased.

To fork from mainnet, I currently use [Ganache](https://www.npmjs.com/package/ganache-cli) and get data from a specific blockchain that provides RPC. Currently, there are many node rpc providers for different blockchains

### 1. [Moralis](https://moralis.io/)

<h2 align="center">
  <img src="./images/moralis.png" alt="Moralis"/>
</h2>
<h2 align="center">
  <img src="./images/moralis2.png" alt="Moralis2" width="500px"/>
</h2>

### 2. [Quicknode](https://www.quicknode.com/chains/bsc)

<h2 align="center">
  <img src="./images/quicknode.png" alt="Quicknode"/>
</h2>

### 3. [Ankr](https://docs.ankr.com/ankr-protocol/public-rpcs)

<h2 align="center">
  <img src="./images/ankr.png" alt="Ankr"/>
</h2>

### 4. [Infura](https://infura.io/)

## IV. Demo

### 1. Install ganache-cli

I will use node archive to get data from eth mainnet and bsc mainnet

```
$ npm -i ganache-cli -g
$ ganache-cli --fork <Node_RPC> --unlock <Wallet> --networkId <chainID>

i.e. $ ganache-cli \
--fork https://speedy-nodes-nyc.moralis.io/<id>/bsc/mainnet/archive \
--unlock 0xb31e82ff4a6e593018fcd2f0784fb2162ed0a3a3 \
--unlock 0xb9b9926dfb2c021fcd8f2366961186a2760716e3 \
--unlock 0x6e12f983fc1ef11cd77273f19ff8e747458588b7 \
--networkId 56
```

In addition to choosing the node, we need to unlock the wallets that we need to test. That wallet will become mine and run like I am the wallet owner. In Ganache there is support to select specific blockNumber when we use node archive

<h2 align="center">
  <img src="./images/ganache-cli.png" alt="Ganache"/>
</h2>

### 2. Install [Hardhat](https://hardhat.org/getting-started/)

```
$ npm install --save-dev hardhat
$ npx hardhat
```

### 3. Test Transfer ERC20

Below, we will test with SHIBA token on the ETH mainnet that follows the erc20 standard. We transfer funds from a whale holder to our own wallet.

```
$ npx hardhat --network localhost test test/testUniswap/test-erc20.js
```

<h2 align="center">
  <img src="./images/erc20-transfer.png" alt="ERC20"/>
</h2>

With BSC

```
$ npx hardhat --network localhost test test/testBSC/test-bep20.js
```

<h2 align="center">
  <img src="./images/bep20-transfer.png" alt="BEP20"/>
</h2>

### 4. Test ERC721

Test ví whale [0x6e12f983FC1eF11Cd77273f19ff8e747458588b7](https://bscscan.com/token/0xa7a9a8156c24c4b0ca910c3ba842d1f1ac7200ef?a=0x6e12f983fc1ef11cd77273f19ff8e747458588b7)

```
$ npx hardhat --network localhost test test/testBSC/test-bep721.js
```

<h2 align="center">
  <img src="./images/bep721-transfer.png" alt="BEP721"/>
</h2>

### 5. Test Uniswap

```
$ npx hardhat --network localhost test test/testUniswap/test-uniswap.js
```

<h2 align="center">
  <img src="./images/uniswap.png" alt="Uniswap"/>
</h2>

### 6. Test Uniswap Liquidity

```
$ npx hardhat --network localhost test test/testUniswap/test-uniswap-liquidity.js
```

<h2 align="center">
  <img src="./images/liquidity.png" alt="Liquidity"/>
</h2>

### 7. Test Uniswap Liquidity vs uniswap

```
$ npx hardhat --network localhost test test/testUniswap/test-uniswap-LP-swap.js
```

<h2 align="center">
  <img src="./images/uniswap-liquidity.png" alt="UniswapLiquidity"/>
</h2>
