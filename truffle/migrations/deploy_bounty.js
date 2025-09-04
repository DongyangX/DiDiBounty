const HunterBountiesContract = artifacts.require("HunterBountiesContract");
const BountyFactory = artifacts.require("BountyFactory");

module.exports = function (deployer) {
  deployer.deploy(HunterBountiesContract);
  deployer.deploy(BountyFactory);
};
