// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ERC20Votes.sol";

contract TokenizedBallot {
    MyToken public voteToken;

    uint256 public targetBlock;

    struct Proposal {
        bytes32 name;
        uint256 voteCount;
    }

    Proposal[] public proposals;

    mapping(address => uint256) public votePowerSpent;

    constructor(
        bytes32[] memory proposalNames,
        address _voteToken,
        uint256 _targetBlock
    ) {
        targetBlock = _targetBlock;
        voteToken = MyToken(_voteToken);
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        require(votePower(msg.sender) >= amount, "Not enough vote power");
        proposals[proposal].voteCount += amount;
        votePowerSpent[msg.sender] += amount;
    }

    function votePower(address account) public view returns (uint256) {
        return
            voteToken.getPastVotes(account, targetBlock) -
            votePowerSpent[account];
    }

    function winningProposal() public view returns (uint256 winningProposal_) {
        uint256 winningVoteCount = 0;
        for (uint256 p = 0; p < proposals.length; p++) {
            if (proposals[p].voteCount > winningVoteCount) {
                winningVoteCount = proposals[p].voteCount;
                winningProposal_ = p;
            }
        }
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }
}
