const BN = require("bn.js");
const { THG, THG_WHALE } = require("../configBSC");
const { ethers, upgrades } = require("hardhat");

describe("BEPC20", () => {
  const TOKEN = THG;
  const WHALE = THG_WHALE;
  let token;
  let accounts;

  it("Setup contract", async () => {
    token = await ethers.getContractAt("IERC20", TOKEN);
    accounts = await ethers.getSigners();
    for (const account of accounts) {
      console.log(account.address);
    }
  });

  it("Check BNB balance", async function () {
    let bal = await ethers.provider.getBalance(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} BNB`);

    bal = await ethers.provider.getBalance(accounts[0].address);
    console.log(`${accounts[0].address}: ${ethers.utils.formatEther(bal)} BNB`);
  });

  it("Check Thetan Arena balanceOf before transfer", async function () {
    let bal = await token.balanceOf(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatUnits(bal, 18)} THG`);

    bal = await token.balanceOf(accounts[0].address);
    console.log(
      `${accounts[0].address}: ${ethers.utils.formatUnits(bal, 18)} THG`
    );
  });

  it("should transfer", async () => {
    let sender = await ethers.provider.getSigner(WHALE);
    token = await token.connect(sender);

    console.log("Transfer", ethers.utils.parseUnits("11", 18).toString());
    let tx = await token.transfer(
      accounts[0].address,
      ethers.utils.parseUnits("11", 18)
    );
    tx = await tx.wait();
    console.log("gasUsed", tx.gasUsed.toString());
    console.log("transactionHash", tx.transactionHash);
  });

  it("Check Thetan Arena balanceOf after transfer successful", async function () {
    let bal = await token.balanceOf(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatUnits(bal, 18)} THG`);

    bal = await token.balanceOf(accounts[0].address);
    console.log(
      `${accounts[0].address}: ${ethers.utils.formatUnits(bal, 18)} THG`
    );
  });
});
