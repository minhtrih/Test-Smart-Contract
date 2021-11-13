const BN = require("bn.js");
const { SHIBA, SHIBA_WHALE } = require("../configETH");
const { ethers, upgrades } = require("hardhat");

describe("IERC20", () => {
  const TOKEN = SHIBA;
  const WHALE = SHIBA_WHALE;
  let token;
  let accounts;

  it("Setup contract", async () => {
    token = await ethers.getContractAt("IERC20", TOKEN);
    accounts = await ethers.getSigners();
    for (const account of accounts) {
      console.log(account.address);
    }
  });

  it("Check ETH balance", async function () {
    let bal = await ethers.provider.getBalance(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} ETH`);

    bal = await ethers.provider.getBalance(accounts[0].address);
    console.log(`${accounts[0].address}: ${ethers.utils.formatEther(bal)} ETH`);
  });

  it("Check SHIBA balanceOf before transfer", async function () {
    let bal = await token.balanceOf(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} SHIBA`);

    bal = await token.balanceOf(accounts[0].address);
    console.log(
      `${accounts[0].address}: ${ethers.utils.formatEther(bal)} SHIBA`
    );
  });

  it("should transfer", async () => {
    let sender = await ethers.provider.getSigner(WHALE);
    token = await token.connect(sender);

    console.log(ethers.utils.parseUnits("11", 18).toString());
    let tx = await token.transfer(
      accounts[0].address,
      ethers.utils.parseUnits("11", 18)
    );
    tx = await tx.wait();
    console.log("gasUsed", tx.gasUsed.toString());
    console.log("transactionHash", tx.transactionHash);
  });

  it("Check SHIBA balanceOf after transfer successful", async function () {
    let bal = await token.balanceOf(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} SHIBA`);

    bal = await token.balanceOf(accounts[0].address);
    console.log(
      `${accounts[0].address}: ${ethers.utils.formatEther(bal)} SHIBA`
    );
  });
});
