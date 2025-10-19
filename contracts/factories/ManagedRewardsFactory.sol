// SPDX-License-Identifier: BUSL-1.1 OR GPL-3.0-or-later
// NOTE: The upstream Business Source License change date has passed; this fork is distributed under GPL terms. See LICENSE.md and NOTICE.md for details.
pragma solidity 0.8.19;

import {IManagedRewardsFactory} from "../interfaces/factories/IManagedRewardsFactory.sol";
import {FreeManagedReward} from "../rewards/FreeManagedReward.sol";
import {LockedManagedReward} from "../rewards/LockedManagedReward.sol";

contract ManagedRewardsFactory is IManagedRewardsFactory {
    /// @inheritdoc IManagedRewardsFactory
    function createRewards(
        address _forwarder,
        address _voter
    ) external returns (address lockedManagedReward, address freeManagedReward) {
        lockedManagedReward = address(new LockedManagedReward(_forwarder, _voter));
        freeManagedReward = address(new FreeManagedReward(_forwarder, _voter));
        emit ManagedRewardCreated(_voter, lockedManagedReward, freeManagedReward);
    }
}
