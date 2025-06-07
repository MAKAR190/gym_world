// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GWCToken.sol";

contract WorkoutRewards {
  GWCToken public gwcToken;
  address public owner;

  uint256 public repsRewardRate = 1 * 10 ** 18;
  uint256 public weightRewardRate = 2 * 10 ** 18;
  uint256 public timeRewardRate = 5 * 10 ** 18;
  uint256 public distanceRewardRate = 10 * 10 ** 18;

  event WorkoutRewarded(
    address user,
    uint256 totalReps,
    uint256 totalWeight,
    uint256 totalTime,
    uint256 totalDistance,
    uint256 tokens
  );

  constructor(address _gwcToken) {
    gwcToken = GWCToken(_gwcToken);
    owner = msg.sender;
  }

  function calculateReward(
    uint256 reps,
    uint256 weight,
    uint256 time,
    uint256 distance
  ) public view returns (uint256) {
    uint256 repsReward = reps * repsRewardRate;
    uint256 weightReward = weight * weightRewardRate;
    uint256 timeReward = (time / 60) * timeRewardRate;
    uint256 distanceReward = (distance / 1000) * distanceRewardRate;
    return repsReward + weightReward + timeReward + distanceReward;
  }

  function rewardWorkout(
    address user,
    uint256 reps,
    uint256 weight,
    uint256 time,
    uint256 distance
  ) external onlyOwner {
    uint256 reward = calculateReward(reps, weight, time, distance);
    require(reward > 0, "No reward for this workout");

    gwcToken.transfer(user, reward);
    emit WorkoutRewarded(user, reps, weight, time, distance, reward);
  }

  modifier onlyOwner() {
    require(msg.sender == owner, "Not authorized");
    _;
  }
}
