"use client";

import React from "react";
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract } from "wagmi";
import { injected } from "wagmi/connectors";
import { EVM_CONFIG } from "@/config/contracts";

export function EvmVoting() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContract, isPending } = useWriteContract();

  const { data: votesA, refetch: refetchA } = useReadContract({
    address: EVM_CONFIG.contractAddress,
    abi: EVM_CONFIG.abi,
    functionName: "votesOptionA",
  });

  const { data: votesB, refetch: refetchB } = useReadContract({
    address: EVM_CONFIG.contractAddress,
    abi: EVM_CONFIG.abi,
    functionName: "votesOptionB",
  });

  const handleVote = (option: number) => {
    writeContract({
      address: EVM_CONFIG.contractAddress,
      abi: EVM_CONFIG.abi,
      functionName: "castVote",
      args: [BigInt(option)],
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-blue-950 text-blue-400 border border-blue-800 rounded-full">
            Ethereum Sepolia
          </span>
          <h2 className="text-xl font-bold mt-2 text-white">EVM AstraVote Station</h2>
        </div>
        {isConnected ? (
          <button
            onClick={() => disconnect()}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm border border-slate-700"
          >
            {address?.slice(0, 6)}...{address?.slice(-4)} (Disconnect)
          </button>
        ) : (
          <button
            onClick={() => connect({ connector: injected() })}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-semibold"
          >
            Connect MetaMask
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <button
          onClick={() => handleVote(1)}
          disabled={!isConnected || isPending}
          className="p-5 border border-slate-700 bg-slate-800/60 hover:border-blue-500 rounded-xl text-left transition disabled:opacity-50"
        >
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Option A</div>
          <div className="text-lg font-bold text-white mt-1">Smart Contract Auditor Toolkit</div>
          <div className="text-2xl font-extrabold text-blue-400 mt-4">{votesA ? votesA.toString() : "0"} Votes</div>
        </button>

        <button
          onClick={() => handleVote(2)}
          disabled={!isConnected || isPending}
          className="p-5 border border-slate-700 bg-slate-800/60 hover:border-blue-500 rounded-xl text-left transition disabled:opacity-50"
        >
          <div className="text-slate-400 text-xs font-medium uppercase tracking-wider">Option B</div>
          <div className="text-lg font-bold text-white mt-1">Decentralized P2P Lending Pool</div>
          <div className="text-2xl font-extrabold text-blue-400 mt-4">{votesB ? votesB.toString() : "0"} Votes</div>
        </button>
      </div>
    </div>
  );
}