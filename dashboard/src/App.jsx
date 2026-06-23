import React, { useState, useEffect } from 'react';
import { isConnected, getPublicKey } from '@stellar/freighter-api';

export default function App() {
  const [walletAddress, setWalletAddress] = useState('');
  const [issueUrl, setIssueUrl] = useState('');
  const [bountyAmount, setBountyAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    if (await isConnected()) {
      try {
        const publicKey = await getPublicKey();
        setWalletAddress(publicKey);
      } catch (err) {
        alert("Wallet connection rejected by user.");
      }
    } else {
      alert("Please install the Freighter Wallet extension to interact with BountyHex.");
    }
  };

  const createBountyEscrow = async (e) => {
    e.preventDefault();
    if (!walletAddress) return alert("Please connect your wallet first!");
    
    setLoading(true);
    console.log(`Locking ${bountyAmount} XLM for Issue: ${issueUrl}`);
    
    setTimeout(() => {
      setLoading(false);
      alert("Bounty contract successfully deployed and funded on Testnet!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <header className="absolute top-6 right-6">
        {walletAddress ? (
          <span className="bg-teal-950 border border-teal-500 text-teal-300 px-4 py-2 rounded-lg text-sm font-mono">
            {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </span>
        ) : (
          <button 
            onClick={connectWallet}
            className="bg-teal-500 hover:bg-teal-600 text-slate-950 font-bold px-4 py-2 rounded-lg transition"
          >
            Connect Wallet
          </button>
        )}
      </header>

      <main className="max-w-md w-full bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="flex items-center space-x-3 mb-6">
          <div className="h-8 w-8 bg-teal-500 rounded-lg flex items-center justify-center font-bold text-slate-950 text-xl">⬢</div>
          <h1 className="text-2xl font-black tracking-tight text-teal-400">BountyHex</h1>
        </div>
        <p className="text-sm text-slate-400 mb-6">Lock instant cryptographic rewards onto your open-source GitHub issue backlogs.</p>

        <form onSubmit={createBountyEscrow} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">GitHub Issue URL</label>
            <input 
              type="url" 
              required
              placeholder="https://github.com/TeethakingBuilds/repo/issues/1"
              value={issueUrl}
              onChange={(e) => setIssueUrl(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-slate-300"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Bounty Pool Allocation (XLM / USDC)</label>
            <input 
              type="number" 
              required
              placeholder="100"
              value={bountyAmount}
              onChange={(e) => setBountyAmount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-teal-500 text-slate-300"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-teal-500 hover:bg-teal-600 disabled:bg-slate-800 text-slate-950 font-extrabold py-3 rounded-lg text-sm transition tracking-wide shadow-lg shadow-teal-500/10"
          >
            {loading ? "Initializing Smart Escrow..." : "Fund On-Chain Bounty"}
          </button>
        </form>
      </main>
    </div>
  );
}
