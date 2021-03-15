// SPDX-License-Identifier: MIT
pragma solidity 0.6.12;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

// XUniFactory is the coolest bar in town. You come in with some UNI, and leave with more! The longer you stay, the more UNI you get.
//
// This contract handles swapping to and from xUNI, UNISwap's staking token.
contract XUniFactory is ERC20 {
    using SafeMath for uint256;
    IERC20 public uni;

    // Define the UNI token contract
    constructor(IERC20 _uni) public ERC20("xUNI Token", "xUNI") {
        uni = _uni;
    }

    // Enter the bar. Pay some UNIs. Earn some shares.
    // Locks UNI and mints xUNI
    function enter(uint256 _amount) public {}

    // Leave the bar. Claim back your UNIs.
    // Unlocks the staked + gained UNI and burns xUNI
    function leave(uint256 _share) public {}
}
