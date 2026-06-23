# Contributing to BountyHex

Thanks for considering a contribution. BountyHex is small and focused right now, which means there's real room to shape it — from the contract itself to the automation and frontend layers described in the [roadmap](./README.md#roadmap).

## Ways to contribute

- **Smart contract** (`contracts/bounty_escrow`) — new functionality, additional test coverage, gas/resource optimization, security review.
- **GitHub Action** (planned) — the merge-triggered settlement bot described in the roadmap.
- **Dashboard** (planned) — the React/Freighter maintainer UI described in the roadmap.
- **Docs** — clarifying setup steps, writing guides, fixing anything confusing in this repo.

If you're looking for a place to start, check issues tagged [`good first issue`](https://github.com/TeethakingBuilds/BountyHex/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). If nothing's tagged yet, open an issue describing what you'd like to work on before sending a PR — it saves everyone time if the approach gets agreed on first.

## Local setup

You'll need:

- [Rust](https://www.rust-lang.org/tools/install) (stable) with the `wasm32-unknown-unknown` target:
  ```bash
  rustup target add wasm32-unknown-unknown
  ```
- [`stellar-cli`](https://developers.stellar.org/docs/tools/cli) if you want to deploy to testnet/futurenet, not required just to build and test.

```bash
git clone https://github.com/TeethakingBuilds/BountyHex.git
cd BountyHex
cargo build --target wasm32-unknown-unknown --release
cargo test --package bounty_escrow
```

## Making a contract change

1. Open an issue first for anything beyond a small fix — contract changes affect fund safety, so it's worth agreeing on the approach before code is written.
2. Every new code path needs a test. The existing suite in [`src/test.rs`](./contracts/bounty_escrow/src/test.rs) covers happy paths, auth requirements, and double-settlement guards — follow that pattern (one fixture via `setup()`, one behavior per test).
3. Run `cargo test --package bounty_escrow` locally before opening a PR. CI runs the same command on every push and PR — it must be green before merge.
4. Keep `unsafe`, panics-as-control-flow, and storage layout changes to a minimum, and call them out explicitly in your PR description if unavoidable — these are the things a security reviewer will look at first.

## Pull requests

- Reference the issue your PR addresses.
- Describe *what changed* and *why*, not just *what the diff says* — the why matters more for contract code.
- Keep PRs scoped to one concern. A contract fix and a README typo fix should be two PRs.
- Be patient — this is a small project maintained part-time, but every PR gets a response.

## Code of conduct

Be respectful, be constructive, assume good faith. Disagreements about approach are normal and welcome; personal attacks aren't.
