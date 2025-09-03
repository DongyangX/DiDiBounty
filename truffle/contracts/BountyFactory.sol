// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.2 <0.9.0;
import "./Bounty.sol";
import "./HunterBountiesContract.sol";

contract BountyFactory {

    address public platformManager;
    address[] allBounties;// 所有悬赏集合
    mapping(address => address[]) creatorBounties;// 创建人的悬赏集合
    HunterBountiesContract hunterBountiesContract;

    constructor() {
        platformManager = msg.sender;
        hunterBountiesContract = new HunterBountiesContract();
    }

    function createBounty(string memory _title, string memory _content, string memory _mainPic,
        uint256 _targetMoney, uint256 _joinMoney) public payable {
        Bounty bounty = new Bounty{value: _targetMoney}(_title, _content, _mainPic, _targetMoney, _joinMoney, msg.sender, platformManager, hunterBountiesContract);
        // 加入所有悬赏集合
        allBounties.push(address(bounty));
        // 加入创建人悬赏集合
        creatorBounties[msg.sender].push(address(bounty));
    }

    // 返回所有悬赏
    function getAllBounties() public view returns(address[] memory) {
        return allBounties;
    }

    // 返回当前账户所创建的悬赏
    function getCreatorBounties() public view returns(address[] memory) {
        return creatorBounties[msg.sender];
    }
}