const BN = require("bn.js");
const { sendEther, pow } = require("../util");
const { WETH, SHIBA, WETH_WHALE, SHIBA_WHALE } = require("../configETH");

describe("TestUniswapLiquidity", () => {
  let CALLER;
  const TOKEN_A = WETH;
  const TOKEN_A_WHALE = WETH_WHALE;
  const TOKEN_B = SHIBA;
  const TOKEN_B_WHALE = SHIBA_WHALE;
  const TOKEN_A_AMOUNT = ethers.utils.parseUnits("10", 18);
  const TOKEN_B_AMOUNT = ethers.utils.parseUnits("10", 18);

  let testUniswapLiquidity;
  let testUniswap;
  let tokenA;
  let tokenB;
  beforeEach(async () => {
    accounts = await ethers.getSigners();
    CALLER = accounts[0].address;

    tokenA = await ethers.getContractAt("IERC20", TOKEN_A);
    tokenB = await ethers.getContractAt("IERC20", TOKEN_B);

    const TestUniswapLiquidity = await ethers.getContractFactory(
      "TestUniswapLiquidity"
    );
    testUniswapLiquidity = await TestUniswapLiquidity.deploy();
    await testUniswapLiquidity.deployed();

    const TestUniswap = await ethers.getContractFactory("TestUniswap");
    testUniswap = await TestUniswap.deploy();
    await testUniswap.deployed();

    let sender = await ethers.provider.getSigner(CALLER);

    // send ETH to cover tx fee
    await sender.sendTransaction({
      to: TOKEN_A_WHALE,
      value: ethers.utils.parseEther("1.0"),
    });
    await sender.sendTransaction({
      to: TOKEN_B_WHALE,
      value: ethers.utils.parseEther("1.0"),
    });

    sender = await ethers.provider.getSigner(TOKEN_A_WHALE);
    tokenA = await tokenA.connect(sender);
    sender = await ethers.provider.getSigner(TOKEN_B_WHALE);
    tokenB = await tokenB.connect(sender);

    let tx = await tokenA.transfer(CALLER, TOKEN_A_AMOUNT);
    tx = await tx.wait();

    let bal = await tokenA.balanceOf(CALLER);
    console.log(`${CALLER}: ${ethers.utils.formatEther(bal)} WETH`);

    tx = await tokenB.transfer(CALLER, TOKEN_B_AMOUNT);
    tx = await tx.wait();

    bal = await tokenB.balanceOf(CALLER);
    console.log(`${CALLER}: ${ethers.utils.formatEther(bal)} SHIBA`);

    sender = await ethers.provider.getSigner(CALLER);
    tokenA = await tokenA.connect(sender);
    tokenB = await tokenB.connect(sender);

    await tokenA.approve(
      testUniswapLiquidity.address,
      ethers.utils.parseUnits("1", 18)
    );
    await tokenB.approve(
      testUniswapLiquidity.address,
      ethers.utils.parseUnits("1", 18)
    );
    await tokenA.approve(testUniswap.address, ethers.utils.parseUnits("1", 18));
    await tokenB.approve(testUniswap.address, ethers.utils.parseUnits("1", 18));
  });

  it("add liquidity and remove liquidity", async () => {
    console.log("=== add liquidity 1 ===");
    let sender = await ethers.provider.getSigner(CALLER);
    testUniswapLiquidity = await testUniswapLiquidity.connect(sender);

    let tx = await testUniswapLiquidity.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseUnits("1", 18),
      ethers.utils.parseUnits("1", 18)
    );
    tx = await tx.wait();
    let liquidity;
    for (const log of tx.events) {
      try {
        console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
        if (log.args.message == "liquidity") {
          liquidity = {
            address: log.args.add,
            value: log.args.val,
            token0: tokenA.address,
            token1: tokenB.address,
          };
        }
      } catch (error) {}
    }

    let bal = await tokenA.balanceOf(liquidity.address);
    console.log(`out WETH liquidity: ${ethers.utils.formatEther(bal)}`);
    bal = await tokenB.balanceOf(liquidity.address);
    console.log(`out SHIB liquidity: ${ethers.utils.formatEther(bal)}`);

    bal = await tokenA.balanceOf(CALLER);
    console.log(`out WETH CALLER ${ethers.utils.formatEther(bal)}`);
    bal = await tokenB.balanceOf(CALLER);
    console.log(`out SHIB CALLER ${ethers.utils.formatEther(bal)}`);

    console.log("=== swap token 1 ===");
    testUniswap = await testUniswap.connect(sender);

    await testUniswap.swap(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseUnits("1", 18),
      1,
      CALLER
    );

    tx = await testUniswapLiquidity.removeLiquidity(
      tokenA.address,
      tokenB.address
    );
    tx = await tx.wait();
    console.log("=== remove liquidity ===");
    for (const log of tx.events) {
      try {
        console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
      } catch (error) {}
    }
  });

  it("add and remove liquidity 2", async () => {
    console.log("=== add liquidity 2 ===");
    let tx = await testUniswapLiquidity.addLiquidity(
      tokenA.address,
      tokenB.address,
      ethers.utils.parseUnits("1", 18),
      ethers.utils.parseUnits("1", 18)
    );
    tx = await tx.wait();
    for (const log of tx.events) {
      try {
        console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
      } catch (error) {}
    }

    console.log("=== remove liquidity ===");
    tx = await testUniswapLiquidity.removeLiquidity(
      tokenA.address,
      tokenB.address
    );
    tx = await tx.wait();
    for (const log of tx.events) {
      try {
        console.log(`${log.args.message} ${log.args.add} ${log.args.val}`);
      } catch (error) {}
    }
  });
});
