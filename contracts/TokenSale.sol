// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IMyERC20Token {
    function mint(address to, uint256 amount) external;
}

contract TokenSale {
    uint256 public ratio;
    IMyERC20Token public paymentToken;

    constructor(uint256 _ratio, address _paymentToken) {
        ratio = _ratio;
        paymentToken = IMyERC20Token(_paymentToken);
    }

    function purchaseTokens() external payable {
        // the amount of the money that is
        //going to be sent for this function regardless of gas
        //External call. We use an interface to make external call
        paymentToken.mint(msg.sender, msg.value / ratio);
    }
}
