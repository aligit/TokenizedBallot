// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

import "./ERC20Votes.sol";

contract Ballot {
    GroupTenToken public voteToken;
    // An address type variable is used to store ethereum accounts.
    address public owner;
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
        voteToken = GroupTenToken(_voteToken);
        owner = msg.sender;
        for (uint256 i = 0; i < proposalNames.length; i++) {
            proposals.push(Proposal({name: proposalNames[i], voteCount: 0}));
        }
    }

    function vote(uint256 proposal, uint256 amount) external {
        require(votePower(msg.sender) >= amount, "Not enough vote power");
        proposals[proposal].voteCount += amount;
        votePowerSpent[msg.sender] += amount;
    }

    function winnerVoteCount() external view returns (uint256 winnerVoteCount) {
        winnerVoteCount = proposals[winningProposal()].voteCount;
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

    function getProposals() external view returns (Proposal[] memory) {
        return proposals;
    }

    function winnerName() external view returns (bytes32 winnerName_) {
        winnerName_ = proposals[winningProposal()].name;
    }

    function changeTargetBlock(uint256 _targetBlock) external {
        require(msg.sender == owner, "Only owner can change the targetBlock");
        targetBlock = _targetBlock;
    }
}
