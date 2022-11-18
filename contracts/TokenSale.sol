// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

contract TokenSale {
    uint256 public ratio;
    address public paymentToken;

    constructor(uint256 _ratio, address _paymentToken) {
        ratio = _ratio;
        paymentToken = _paymentToken;
    }
}
