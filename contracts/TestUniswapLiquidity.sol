// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router01.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Factory.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";

contract TestUniswapLiquidity {
  address private constant FACTORY = 0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f;
  address private constant ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

  event Log(string message, address add, uint256 val);

  function addLiquidity(
    address _tokenA,
    address _tokenB,
    uint256 _amountA,
    uint256 _amountB
  ) external {
    IERC20(_tokenA).transferFrom(msg.sender, address(this), _amountA);
    IERC20(_tokenB).transferFrom(msg.sender, address(this), _amountB);

    IERC20(_tokenA).approve(ROUTER, _amountA);
    IERC20(_tokenB).approve(ROUTER, _amountB);

    (uint256 amountA, uint256 amountB, uint256 liquidity) = IUniswapV2Router01(
      ROUTER
    ).addLiquidity(
        _tokenA,
        _tokenB,
        _amountA,
        _amountB,
        1,
        1,
        address(this),
        block.timestamp
      );

    address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);

    emit Log("amountA", _tokenA, amountA);
    emit Log("amountB", _tokenB, amountB);
    emit Log("liquidity", pair, liquidity);
  }

  function removeLiquidity(address _tokenA, address _tokenB) external {
    address pair = IUniswapV2Factory(FACTORY).getPair(_tokenA, _tokenB);

    uint256 liquidity = IERC20(pair).balanceOf(address(this));
    IERC20(pair).approve(ROUTER, liquidity);

    (uint256 amountA, uint256 amountB) = IUniswapV2Router01(ROUTER)
      .removeLiquidity(
        _tokenA,
        _tokenB,
        liquidity,
        1,
        1,
        address(this),
        block.timestamp
      );

    emit Log("amountA", _tokenA, amountA);
    emit Log("amountB", _tokenB, amountB);
  }
}
