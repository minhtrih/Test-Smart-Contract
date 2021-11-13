const process = require("process");
const myArgs = process.argv[process.argv.length - 1];
console.log("myArgs", myArgs);

const { SHIBA, HOGE, WETH, WETH_WHALE } = require("../configETH");

const { ethers, upgrades } = require("hardhat");

describe("TestUniswap", async (accounts) => {
  const WHALE = WETH_WHALE;
  const AMOUNT_IN = 10000000000000;
  const AMOUNT_OUT_MIN = 1;
  const TOKEN_IN = WETH;

  let TOKEN_OUT;
  switch (myArgs) {
    case "HOGE":
      TOKEN_OUT = HOGE;
      break;
    case "MELON":
      TOKEN_OUT = MELON;
      break;
    default:
      TOKEN_OUT = SHIBA;
  }
  console.log("TOKEN_OUT: ", TOKEN_OUT);

  let TO;

  let testUniswap;
  let tokenIn;
  let tokenOut;
  it("Setup contract", async () => {
    accounts = await ethers.getSigners();
    TO = accounts[0].address;

    tokenIn = await ethers.getContractAt("IERC20", TOKEN_IN);
    tokenOut = await ethers.getContractAt("IERC20", TOKEN_OUT);

    const TestUniswap = await ethers.getContractFactory("TestUniswap");
    testUniswap = await TestUniswap.deploy();
    await testUniswap.deployed();

    let sender = await ethers.provider.getSigner(WHALE);
    tokenIn = await tokenIn.connect(sender);

    await tokenIn.approve(testUniswap.address, AMOUNT_IN);

    let tx = await tokenIn.transfer(TO, ethers.utils.parseUnits("1", 18));
    tx = await tx.wait();
  });

  it("Check SHIBA balanceOf before swap", async function () {
    let bal = await tokenIn.balanceOf(TO);
    console.log(`${TO}: ${ethers.utils.formatEther(bal)} WETH`);

    bal = await tokenOut.balanceOf(TO);
    console.log(`${TO}: ${ethers.utils.formatEther(bal)} SHIBA`);

    bal = await tokenIn.balanceOf(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} WETH`);

    bal = await tokenOut.balanceOf(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} SHIBA`);
  });

  it("should pass", async () => {
    let sender = await ethers.provider.getSigner(WHALE);
    testUniswap = await testUniswap.connect(sender);

    await testUniswap.swap(
      tokenIn.address,
      tokenOut.address,
      AMOUNT_IN,
      AMOUNT_OUT_MIN,
      TO
    );

    console.log(`in ${AMOUNT_IN}`);
  });

  it("Check SHIBA balanceOf after swap successful", async function () {
    let bal = await tokenIn.balanceOf(TO);
    console.log(`${TO}: ${ethers.utils.formatEther(bal)} WETH`);

    bal = await tokenOut.balanceOf(TO);
    console.log(`${TO}: ${ethers.utils.formatEther(bal)} SHIBA`);

    bal = await tokenIn.balanceOf(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} WETH`);

    bal = await tokenOut.balanceOf(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} SHIBA`);
  });
});
