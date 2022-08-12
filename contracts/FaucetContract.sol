// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import './Owned.sol';
import './Logger.sol';
import './IFaucet.sol';

contract Faucet is Owned, Logger, IFaucet {
    uint public numOfFunders;

    mapping(address => bool) private funders;
    mapping(uint => address) private lutFunders;

    modifier limitWithdraw(uint amount) {
        require(amount <= 1000000000000000000, 'Cannot withdraw more than 0.1 ether');
        _;
    }

    receive() external payable {}

    function transferOwnership(address newOwner) external onlyOwner {
        owner = newOwner;
    }

    function emitLog() public override pure returns(bytes32) {
        return "asdasd";
    }

    function addFunds() override external payable {
        address funder = msg.sender;

        if (!funders[funder]) {
            lutFunders[numOfFunders++] = funder;
            funders[funder] = true;
        }
    }

    function withdraw(uint amount) override external limitWithdraw(amount) {
        payable(msg.sender).transfer(amount);
    }

    function getAllFunders() external view returns(address[] memory) {
        address[] memory _funders = new address[](numOfFunders);

        for (uint i = 0; i < numOfFunders; i++) {
            _funders[i] = lutFunders[i];
        }

        return _funders;
    }

    function getFunderAtIndex(uint8 index) external view returns(address) {
        return lutFunders[index];
    }
}

// const instance = await Faucet.deployed()
// instance.addFunds({ from: accounts[0], value: "200000000" })
// instance.addFunds({ from: accounts[1], value: "200000000" })
// instance.getFunderAtIndex(0)
// instance.getAllFunders()
