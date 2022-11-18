// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

interface IMyERC20Token {
    function mint(address to, uint256 amount) external;

    function burnFrom(address account, uint256 amount) external;
}

interface IMyERC721Token {
    function safeMint(address to, uint256 tokenId) external;

    function burn(uint256 tokenId) external;
}

contract TokenSale {
    uint256 public ratio;
    IMyERC20Token public paymentToken;
    IMyERC721Token public nftContract;

    constructor(
        uint256 _ratio,
        address _paymentToken,
        address _nftContract
    ) {
        ratio = _ratio;
        paymentToken = IMyERC20Token(_paymentToken);
        nftContract = IMyERC721Token(_nftContract);
    }

    function purchaseTokens() external payable {
        // the amount of the money that is
        //going to be sent for this function regardless of gas
        //External call. We use an interface to make external call
        paymentToken.mint(msg.sender, msg.value / ratio);
    }

    function burnTokens(uint256 amount) external {
        paymentToken.burnFrom(msg.sender, amount);
        payable(msg.sender).transfer(amount * ratio);
    }
}
