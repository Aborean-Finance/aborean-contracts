# Aborean Finance Notice

## Project Overview

This repository contains the Aborean Finance fork of the Aerodrome Finance core
contracts. The codebase includes substantial original work as well as modified
components that continue to inherit upstream licensing obligations.

## Licensing Summary

- Primary license: GNU General Public License v3.0 or later for all Aborean
  Finance authored source files. The full text is provided in
  `LICENSES/ABOREAN_FINANCE_GPL-3.0-OR-LATER.md`.
- Upstream license: Business Source License 1.1 (Perpetual Cyclist Services
  LLC, Velodrome Smart Contracts). The verbatim text is retained in `LICENSE.md`.
  The version we forked has passed its change date (see
  `v2-license-date.velodrome.eth`), so the GPL v2.0-or-later change license now
  governs alongside our GPL v3.0-or-later grant.
- This repository is distributed as a combined work. Redistribution must
  satisfy the requirements of both licenses wherever applicable.

## License Compliance Statement

**Aborean Finance forked the Aerodrome Finance contracts after the Business
Source License 1.1 change date specified in the upstream license had elapsed.**

The original Velodrome/Aerodrome contracts were released under Business Source
License 1.1 with the following key parameters:
- Change Date: The earlier of 2025-06-01 or a date specified at
  `v2-license-date.velodrome.eth`
- Change License: GNU General Public License v2.0 or later

**The change date has passed, which means:**
1. The upstream code automatically transitioned from BUSL-1.1 to GPL-2.0-or-later
2. Aborean Finance forked the code only after this transition occurred
3. All inherited code is now governed by GPL-2.0-or-later terms
4. All Aborean modifications and new code are released under GPL-3.0-or-later
5. GPL-3.0-or-later is compatible with and upgrades GPL-2.0-or-later

**Therefore, this entire codebase is available under GPL open source terms.**
While we retain the BUSL-1.1 SPDX identifiers and license text in individual
files for historical accuracy and attribution to the original authors, the
operative license for all code in this repository is GPL (v2.0-or-later for
upstream code, v3.0-or-later for Aborean contributions).

This fork complies fully with all upstream licensing obligations. The BUSL-1.1
license included an explicit provision for automatic conversion to GPL after
the change date, and that conversion has occurred.

## Third-Party Components

The following third-party dependencies are included or referenced and remain
subject to their respective licenses:

- OpenZeppelin Contracts (MIT License) — retrieved via Foundry/NPM.
- forge-std (MIT License) — Foundry standard library.
- ds-test (AGPL-3.0-or-later) — DappTools testing utilities.
- Uniswap V3 core (Business Source License 1.1 with GPL change license).
- OpenGSN contracts (LGPL-3.0-or-later) — if pulled via submodule.

Refer to the upstream repositories for the complete and most current license
texts for these dependencies. When distributing binaries or source that include
any of the above components, ensure the applicable license texts accompany the
distribution. Text copies of the MIT-licensed third-party components embedded in
this repository are stored in `LICENSES/THIRD_PARTY_MIT_LICENSES.md`.

## Attribution

Aborean Finance is responsible for all new and modified code within the
`contracts/` directory unless otherwise stated. Please preserve existing
copyright notices, SPDX identifiers, and license references.
