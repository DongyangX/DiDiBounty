// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.2 <0.9.0;
import "./HunterBountiesContract.sol";

contract Bounty {
  address public manager;// 发起人
  string public title;// 主题
  string public content;// 内容
  string public mainPic;// 主图
  uint256 public targetMoney;// 悬赏金额
  uint256 public joinMoney;// 参与金额
  address public platformManager;// 平台管理员
  uint256 public status;// 状态 0-进行中 1-已结束
  
  Hunting[] public allHuntings;// 猎人集合

  HunterBountiesContract hunterBountiesContract;

  constructor(string memory _title, string memory _content, string memory _mainPic,
              uint256 _targetMoney, uint256 _joinMoney,
              address _creator, address _platformManager,
              HunterBountiesContract _hunterBountiesContract) payable {
    manager = _creator;
    title = _title;
    content = _content;
    mainPic = _mainPic;
    targetMoney = _targetMoney;
    joinMoney = _joinMoney;
    platformManager = _platformManager;
    status = 0;
    hunterBountiesContract = _hunterBountiesContract;
  }

  // 参与悬赏实体
  struct Hunting {
    string prove;// 证明内容
    string pic;// 证明附件
    address hunter;// 猎人
  }

  // 参与悬赏
  function hunt(string memory _prove, string memory _pic) payable public {
    require(msg.value == joinMoney);

    // 创建参与猎人
    Hunting memory hunting = Hunting({ 
      prove: _prove,
      pic: _pic,
      hunter: msg.sender
    });
    allHuntings.push(hunting);

    hunterBountiesContract.setBounty(msg.sender, address(this));
  }

  // 结束悬赏结款
  function finishBounty(uint256 i) onlyManager public {
    Hunting storage hunting = allHuntings[i];

    // 平台抽成
    uint256 platformPay = targetMoney / 10;
    payable(platformManager).transfer(platformPay);

    // 转账给猎人
    uint256 hunterPay = targetMoney - platformPay;
    payable(hunting.hunter).transfer(hunterPay);

    // 修改状态
    status = 1;
  }

  modifier onlyManager {
    require(msg.sender == manager);
    _;
  }

  function getHuntingsCount() public view returns(uint256) {
    return allHuntings.length;
  }

  function getBalance() public view returns(uint256) {
    return address(this).balance;
  }

  function getHuntingByIndex(uint256 i) public view returns(string memory, string memory, address) {
    Hunting memory h = allHuntings[i];
    return (h.prove, h.pic, h.hunter);
  }

}