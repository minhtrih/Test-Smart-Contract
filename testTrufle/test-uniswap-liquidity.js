const BN = require("bn.js");
const { sendEther, pow } = require("../test/util");
const { WETH, SHIBA, WETH_WHALE, SHIBA_WHALE } = require("../config");

const IERC20 = artifacts.require("IERC20");
const TestUniswapLiquidity = artifacts.require("TestUniswapLiquidity");

contract("TestUniswapLiquidity", (accounts) => {
  const CALLER = accounts[0];
  const TOKEN_A = WETH;
  const TOKEN_A_WHALE = WETH_WHALE;
  const TOKEN_B = SHIBA;
  const TOKEN_B_WHALE = SHIBA_WHALE;
  const TOKEN_A_AMOUNT = pow(10, 18);
  const TOKEN_B_AMOUNT = pow(10, 18);

  let testUniswapLiquidity;
  let tokenA;
  let tokenB;
  beforeEach(async () => {
    tokenA = await IERC20.at(TOKEN_A);
    tokenB = await IERC20.at(TOKEN_B);
    testUniswapLiquidity = await TestUniswapLiquidity.new();

    // send ETH to cover tx fee
    await sendEther(web3, CALLER, TOKEN_A_WHALE, 1);
    await sendEther(web3, CALLER, TOKEN_B_WHALE, 1);

    await tokenA.transfer(CALLER, TOKEN_A_AMOUNT, { from: TOKEN_A_WHALE });
    await tokenB.transfer(CALLER, TOKEN_B_AMOUNT, { from: TOKEN_B_WHALE });

    await tokenA.approve(testUniswapLiquidity.address, TOKEN_A_AMOUNT, {
      from: CALLER,
    });
    await tokenB.approve(testUniswapLiquidity.address, TOKEN_B_AMOUNT, {
      from: CALLER,
    });
  });

  it("add liquidity and remove liquidity", async () => {
    console.log("=== add liquidity 1 ===");
    let tx = await testUniswapLiquidity.addLiquidity(
      tokenA.address,
      tokenB.address,
      TOKEN_A_AMOUNT,
      TOKEN_B_AMOUNT,
      {
        from: CALLER,
      }
    );
    for (const log of tx.logs) {
      console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
    }

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
});
