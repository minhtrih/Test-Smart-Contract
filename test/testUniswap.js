const UniswapV2Factory = require("@uniswap/v2-core/build/UniswapV2Factory.json");

contract("UniswapV2Factory", async (accounts) => {
  it("...creat Pair Address", async () => {
    const token0 = "0x1997830B5beB723f5089bb8fc38766d419a0444d";
    const token1 = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
    const newContract = "0xCA16DA34e0f88B0d925C176B21E9A5De321c133d";
    const uniswapV2Factory = new web3.eth.Contract(
      UniswapV2Factory.abi,
      newContract
    );
    await uniswapV2Factory.methods
      .createPair(token0, token1)
      .send({ from: accounts[0], gas: 3000000 });
  });
  it("...get Pair Address", async () => {
    const token0 = "0x1997830B5beB723f5089bb8fc38766d419a0444d";
    const token1 = "0xB8c77482e45F1F44dE1745F52C74426C631bDD52";
    const newContract = "0xCA16DA34e0f88B0d925C176B21E9A5De321c133d";
    const uniswapV2Factory = new web3.eth.Contract(
      UniswapV2Factory.abi,
      newContract
    );
    const getPair = await uniswapV2Factory.methods
      .getPair(token0, token1)
      .call();
    console.log("getPair", getPair);
  });
});
