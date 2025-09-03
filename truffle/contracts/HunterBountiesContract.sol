// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.2 <0.9.0;

contract HunterBountiesContract {

    mapping(address => address[]) hunterBounties;// 当前人参与的悬赏

    function setBounty(address _hunter, address _bounty) public {
        hunterBounties[_hunter].push(_bounty);
    }

    function getBounties(address _hunter) public view returns(address[] memory) {
        return hunterBounties[_hunter];
    }
}