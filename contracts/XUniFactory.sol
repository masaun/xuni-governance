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

    address UNI;

    // Define the UNI token contract
    constructor(IERC20 _uni) public ERC20("xUNI Token", "xUNI") {
        uni = _uni;
        UNI = address(uni);
    }

    // Stake the UNIs into this contract. Earn some UNIs.
    // Locks UNI and mints xUNI
    function stakeUNI(uint256 _stakeUNIAmount) public {
        // Gets the amount of UNI locked in the contract
        uint256 totalUni = uni.balanceOf(address(this));

        // Gets the amount of xUNI in existence
        uint256 totalXUni = totalSupply();
        
        // If no xUNI exists, mint it 1:1 to the amount put in
        if (totalXUni == 0 || totalUni == 0) {
            _mint(msg.sender, _stakeUNIAmount);
        } 
        // Calculate and mint the amount of xUNI the UNI is worth. The ratio will change overtime, as xUNI is burned/minted and UNI deposited + gained from fees / withdrawn.
        else {
            uint256 mintAmount = _stakeUNIAmount.mul(totalXUni).div(totalUni);
            _mint(msg.sender, mintAmount);
        }
        
        // Lock the UNI in the contract
        uni.transferFrom(msg.sender, address(this), _stakeUNIAmount);
    }

    // Stake the UNI-LP tokens into this contract. Earn some UNIs (?)
    // Locks UNI and mints xUNI
    function stakeLP(IERC20 _lpToken, uint256 _amount) public {
        // Gets the amount of UNI locked in the contract
        uint256 totalLP = _lpToken.balanceOf(address(this));

        // Gets the amount of xUNI in existence
        uint256 totalXUni = totalSupply();
        
        // If no xUNI exists, mint it 1:1 to the amount put in
        if (totalXUni == 0 || totalLP == 0) {
            _mint(msg.sender, _amount);
        } 
        // Calculate and mint the amount of xUNI the UNI is worth. The ratio will change overtime, as xUNI is burned/minted and UNI deposited + gained from fees / withdrawn.
        else {
            uint256 mintAmount = _amount.mul(totalXUni).div(totalLP);
            _mint(msg.sender, mintAmount);
        }
        
        // Lock the UNI in the contract
        _lpToken.transferFrom(msg.sender, address(this), _amount);
    }


    // Unstake the UNIs and burn xUNIs. Claim back your UNIs.
    // Unlocks the staked + gained UNI and burns xUNI
    function unStakeXUNI(uint256 _unStakeXUNIAmount) public {
        // Gets the amount of xUNI in existence
        uint256 totalXUni = totalSupply();

        // Calculates the amount of UNI the xUNI is worth
        uint256 redeemAmount = _unStakeXUNIAmount.mul(uni.balanceOf(address(this))).div(totalXUni);
        _burn(msg.sender, _unStakeXUNIAmount);
        uni.transfer(msg.sender, redeemAmount);
    }
}
