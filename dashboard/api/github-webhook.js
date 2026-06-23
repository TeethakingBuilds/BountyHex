import { Asset, Keypair, Network, Operation, TransactionBuilder, rpc } from '@stellar/stellar-sdk';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const event = req.headers['x-github-event'];
    const payload = req.body;

    if (event === 'pull_request' && payload.action === 'closed' && payload.pull_request.merged) {
        const contributorGithubUsername = payload.pull_request.user.login;
        const contributorStellarAddress = "G...CONTRIBUTOR_STELLAR_ADDRESS";
        const contractId = "C...YOUR_SOROBAN_CONTRACT_ID";

        try {
            const server = new rpc.Server("https://soroban-testnet.stellar.org");
            const botKeypair = Keypair.fromSecret(process.env.STELLAR_BOT_SECRET_KEY);
            const botAccount = await server.getAccount(botKeypair.publicKey());

            const tx = new TransactionBuilder(botAccount, {
                fee: "100000",
                networkPassphrase: Network.TESTNET,
            })
            .addOperation(
                Operation.invokeContractFunction({
                    contract: contractId,
                    function: "release_bounty",
                    args: [
                        rpc.Client.parseAddress(contributorStellarAddress)
                    ],
                })
            )
            .setTimeout(30)
            .build();

            tx.sign(botKeypair);
            const response = await server.sendTransaction(tx);

            return res.status(200).json({ status: 'Bounty successfully released on-chain!', txHash: response.hash });
        } catch (error) {
            console.error("Stellar Transaction Failure:", error);
            return res.status(500).json({ error: 'Failed to execute smart contract transaction' });
        }
    }

    return res.status(200).json({ status: 'Event ignored' });
}
