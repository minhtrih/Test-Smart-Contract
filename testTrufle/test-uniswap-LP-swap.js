const BN = require("bn.js");
const { sendEther, pow } = require("../util");
const { WETH, SHIBA, WETH_WHALE, SHIBA_WHALE } = require("../config");

const IERC20 = artifacts.require("IERC20");
const TestUniswapLiquidity = artifacts.require("TestUniswapLiquidity");
const TestUniswap = artifacts.require("TestUniswap");

contract("TestUniswapLiquidity", (accounts) => {
  const CALLER = accounts[0];
  const TOKEN_A = WETH;
  const TOKEN_A_WHALE = WETH_WHALE;
  const TOKEN_B = SHIBA;
  const TOKEN_B_WHALE = SHIBA_WHALE;
  const TOKEN_A_AMOUNT = pow(10, 19);
  const TOKEN_B_AMOUNT = pow(10, 19);

  let testUniswapLiquidity;
  let testUniswap;
  let tokenA;
  let tokenB;
  beforeEach(async () => {
    tokenA = await IERC20.at(TOKEN_A);
    tokenB = await IERC20.at(TOKEN_B);
    testUniswapLiquidity = await TestUniswapLiquidity.new();
    testUniswap = await TestUniswap.new();

    // send ETH to cover tx fee
    await sendEther(web3, CALLER, TOKEN_A_WHALE, 0.2);
    await sendEther(web3, CALLER, TOKEN_B_WHALE, 0.2);

    await tokenA.transfer(CALLER, TOKEN_A_AMOUNT, { from: TOKEN_A_WHALE });
    await tokenB.transfer(CALLER, TOKEN_B_AMOUNT, { from: TOKEN_B_WHALE });

    await tokenA.approve(testUniswapLiquidity.address, pow(10, 18), {
      from: CALLER,
    });
    await tokenB.approve(testUniswapLiquidity.address, pow(10, 18), {
      from: CALLER,
    });

    await tokenA.approve(testUniswap.address, pow(10, 18), { from: CALLER });
  });

  it("add liquidity and remove liquidity", async () => {
    console.log("=== add liquidity 1 ===");
    let tx = await testUniswapLiquidity.addLiquidity(
      tokenA.address,
      tokenB.address,
      pow(10, 18),
      pow(10, 18),
      {
        from: CALLER,
      }
    );
    let liquidity;
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
      if (log.args.message == "liquidity") {
        liquidity = {
          address: log.args.add,
          value: log.args.val,
          token0: tokenA.address,
          token1: tokenB.address,
        };
      }
    }

    console.log(
      `out WETH liquidity: ${await tokenA.balanceOf(liquidity.address)}`
    );
    console.log(
      `out SHIB liquidity: ${await tokenB.balanceOf(liquidity.address)}`
    );
    console.log(`out WETH CALLER ${await tokenA.balanceOf(CALLER)}`);
    console.log(`out SHIB CALLER ${await tokenB.balanceOf(CALLER)}`);

    console.log("=== swap token 1 ===");
    await testUniswap.swap(
      tokenA.address,
      tokenB.address,
      pow(10, 18),
      1,
      CALLER,
      {
        from: CALLER,
      }
    );

    tx = await testUniswapLiquidity.removeLiquidity(
      tokenA.address,
      tokenB.address,
      {
        from: CALLER,
      }
    );
    console.log("=== remove liquidity ===");
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
    }
  });

  it("add and remove liquidity 2", async () => {
    console.log("=== add liquidity 2 ===");
    let tx = await testUniswapLiquidity.addLiquidity(
      tokenA.address,
      tokenB.address,
      pow(10, 18),
      pow(10, 18),
      {
        from: CALLER,
      }
    );
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
    }

    console.log("=== remove liquidity ===");
    tx = await testUniswapLiquidity.removeLiquidity(
      tokenA.address,
      tokenB.address,
      {
        from: CALLER,
      }
    );
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
    }
  });
});
