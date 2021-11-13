const BN = require("bn.js");
const { KNIGHT, KNIGHT_WHALE } = require("../configBSC");
const { ethers, upgrades } = require("hardhat");

describe("ERC721", () => {
  const TOKEN = KNIGHT;
  const WHALE = KNIGHT_WHALE;
  let token;
  let accounts;

  it("Setup contract", async () => {
    token = await ethers.getContractAt("IERC721", TOKEN);
    accounts = await ethers.getSigners();
  });

  it("Check BNB balance", async function () {
    let bal = await ethers.provider.getBalance(WHALE);
    console.log(`${WHALE}: ${ethers.utils.formatEther(bal)} BNB`);

    bal = await ethers.provider.getBalance(accounts[0].address);
    console.log(`${accounts[0].address}: ${ethers.utils.formatEther(bal)} BNB`);
  });

  it("Check KNIGHT balanceOf before transfer", async function () {
    let bal = await token.balanceOf(WHALE);
    console.log(`${WHALE}: ${bal.toNumber()}  KNIGHT`);

    bal = await token.balanceOf(accounts[0].address);
    console.log(`${accounts[0].address}: ${bal.toNumber()} KNIGHT`);
  });

  it("Check owner KIGHT NFT before transfer", async function () {
    let owner = await token.ownerOf(4145);
    console.log(`${owner} is owning token 12749`);
  });

  it("should transfer", async () => {
    let sender = await ethers.provider.getSigner(WHALE);
    token = await token.connect(sender);

    let tx = await token.transferFrom(WHALE, accounts[0].address, 4145);
    tx = await tx.wait();
    console.log("gasUsed", tx.gasUsed.toString());
    console.log("transactionHash", tx.transactionHash);
  });

  it("Check owner KIGHT NFT after transfer successful", async function () {
    let owner = await token.ownerOf(4145);
    console.log(`${owner} is owning token 12749`);
  });

  it("Check KNIGHT balanceOf after transfer successful", async function () {
    let bal = await token.balanceOf(WHALE);
    console.log(`${WHALE}: ${bal.toNumber()}  KNIGHT`);

    bal = await token.balanceOf(accounts[0].address);
    console.log(`${accounts[0].address}: ${bal.toNumber()} KNIGHT`);
  });
});
