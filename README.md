# BountyHex ⬢

[![Soroban Contract CI](https://github.com/TeethakingBuilds/BountyHex/actions/workflows/rust-ci.yml/badge.svg)](https://github.com/TeethakingBuilds/BountyHex/actions/workflows/rust-ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Stellar Soroban](https://img.shields.io/badge/Stellar-Soroban-7D00FF)](https://developers.stellar.org/docs/build/smart-contracts)

**BountyHex is a trustless escrow protocol for open-source bounties, built on Stellar with Soroban smart contracts.** Maintainers lock funds against a GitHub issue; contributors get paid automatically — no invoices, no "trust me," no manual payouts.

---

## The problem

Open-source bounty programs today run on spreadsheets and good faith. A maintainer promises a reward in an issue, a contributor does the work, and then someone has to remember to actually pay up — across timezones, platforms, and currencies. There's no escrow, no guaranteed payout, and no on-chain record that the bounty was ever honored.

## How BountyHex solves it

1. **Fund** — A maintainer deploys a `bounty_escrow` contract instance for an issue and locks a token amount (any Stellar asset, including USDC) into it.
2. **Build** — A contributor does the work and opens a PR referencing the issue.
3. **Settle** — Once the PR is merged, an authorized oracle releases the locked funds directly to the contributor's Stellar address. If the issue is closed without a merge, the maintainer can reclaim the funds via refund.

Every bounty is a single-use, single-purpose escrow: one bounty, one settlement, no ambiguity about where the funds went.

## What's built today

This repo currently ships the **on-chain escrow contract** — the trust-minimized core of the protocol — written in Rust against the Soroban SDK.

| Component | Status | Location |
|---|---|---|
| `bounty_escrow` Soroban contract | ✅ Implemented, tested, CI-enforced | [`contracts/bounty_escrow`](./contracts/bounty_escrow) |
| Contract test suite | ✅ 14 tests — happy paths, auth checks, double-settlement guards, edge cases | [`contracts/bounty_escrow/src/test.rs`](./contracts/bounty_escrow/src/test.rs) |
| CI (build + test on every push/PR) | ✅ Live | [`.github/workflows/rust-ci.yml`](./.github/workflows/rust-ci.yml) |
| GitHub Action (auto-release on PR merge) | 🚧 Planned | — |
| Maintainer dashboard (React) | 🚧 Planned | — |

### Contract design

The contract is intentionally minimal — one job, done correctly:

- `initialize(maintainer, oracle_bot, token_address, amount)` — one-time setup; locks in who can release, who can refund, and what's escrowed. Reverts if called twice.
- `release_bounty(contributor)` — callable only by the authorized `oracle_bot` address. Transfers the escrowed amount to the contributor and marks the bounty settled. Reverts if already settled.
- `refund_bounty()` — callable only by the `maintainer`. Returns the escrowed funds to the maintainer and marks the bounty settled. Reverts if already settled.

Settlement is a one-way, one-time state transition (`IsSettled`) — neither path can be invoked again afterward, and they can't be invoked against each other (no refund after release, no release after refund).

## Roadmap

The contract is the foundation; the next two pieces make it usable end-to-end without anyone touching the Soroban CLI directly:

- **GitHub Action** (Node.js/TypeScript, `@stellar/stellar-sdk`) — watches for merged PRs linked to a funded issue and signs the `release_bounty` call as the `oracle_bot`, so settlement happens automatically the moment a maintainer merges.
- **Maintainer dashboard** (React + TypeScript + `@stellar/freighter-api`) — lets a maintainer connect a Freighter wallet, fund an issue, and watch bounty status without writing a transaction by hand.

Tracking issues for both are open — see [Contributing](#-contributing) if you want to pick one up.

## 🛠️ Tech stack

- **Smart contract**: Rust, [Soroban SDK](https://developers.stellar.org/docs/build/smart-contracts) `26.1.0`
- **CI**: GitHub Actions, `cargo build --target wasm32-unknown-unknown --release` + `cargo test --workspace`
- **Planned automation layer**: Node.js/TypeScript, `@stellar/stellar-sdk`
- **Planned frontend**: React, TypeScript, Tailwind CSS, `@stellar/freighter-api`

## Getting started

```bash
git clone https://github.com/TeethakingBuilds/BountyHex.git
cd BountyHex

# Compile the contract to Wasm
cargo build --target wasm32-unknown-unknown --release

# Run the test suite
cargo test --package bounty_escrow
```

Requires the Rust toolchain with the `wasm32-unknown-unknown` target and the [`stellar-cli`](https://developers.stellar.org/docs/tools/cli) for deploying to testnet/mainnet.

## 🤝 Contributing

Contributions are welcome at every layer — Rust contract improvements, the GitHub Action, or the dashboard. See [CONTRIBUTING.md](./CONTRIBUTING.md) for setup details, coding conventions, and the PR process. Good first issues are tagged [`good first issue`](https://github.com/TeethakingBuilds/BountyHex/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

## 📜 License

[MIT](./LICENSE)
