# BountyHex ⬢

BountyHex is a trustless, automated open-source bounty protocol built on the Stellar network using Soroban smart contracts. It enables project maintainers to lock funds (USDC or XLM) directly to GitHub issues and automatically distributes rewards to contributors the moment their Pull Request is merged.

---

## 🚀 How It Works

1. **Fund**: A project maintainer creates an issue and locks a bounty amount into a dedicated Soroban escrow contract using their Stellar wallet.
2. **Build**: An open-source contributor claims the issue, writes the code, and submits a Pull Request linking to the issue.
3. **Merge & Pay**: Once the maintainer approves and merges the PR, a automated GitHub Action verifies the merge and triggers the Soroban contract to release the locked tokens directly to the contributor's Stellar address.

## 🛠️ Architecture & Tech Stack

BountyHex utilizes a hybrid on-chain/off-chain model:

*   **On-Chain Layer (`/contracts`)**: Built in **Rust** using the **Soroban SDK**. It handles secure escrow states, maintainer refunds, and cryptographic multi-auth triggers for releasing bounties.
*   **Automation Layer (`/github-action`)**: Built in **JavaScript/TypeScript** using the Node.js GitHub Actions toolkit and `@stellar/stellar-sdk`. It signs the automated release payloads upon successful PR mergers.
*   **Frontend Dashboard (`/dashboard`)**: A **React/TypeScript** and **Tailwind CSS** application implementing `@stellar/freighter-api` for seamless maintainer interactions.

---

## 🤝 Contributing

We love open-source contributions! Whether you want to optimize our Rust contracts, enhance the JavaScript automation scripts, or improve the UI, you are welcome here.

### Local Development Setup

1. **Clone the repository:**
```bash
   git clone [https://github.com/TeethakingBuilds/BountyHex.git](https://github.com/TeethakingBuilds/BountyHex.git)
   cd BountyHex
Compile the Soroban Smart Contracts:
Ensure you have stellar-cli installed, then run:

Bash
   cargo build --target wasm32-unknown-unknown --release
Run Contract Tests:

Bash
   cargo test --package bounty_escrow
Please read our CONTRIBUTING.md (coming soon) for details on our code of conduct and the process for submitting pull requests to us.

📜 License
This project is licensed under the MIT License.
