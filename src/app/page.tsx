"use client";

import React, { useState } from "react";
import { SolanaVoting } from "@/components/SolanaVoting";
import { EvmVoting } from "@/components/EvmVoting";
import { BitcoinVoting } from "@/components/BitcoinVoting";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"solana" | "evm" | "bitcoin">("solana");

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <span className="text-xs uppercase font-bold tracking-widest text-indigo-400 bg-indigo-950/80 border border-indigo-800 px-3 py-1 rounded-full">
          Sprint 1 Alpha Demo
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-3">
          Astra<span className="text-indigo-500">Vote</span>
        </h1>
        <p className="text-slate-400 text-base max-w-lg mx-auto mt-2">
          Multichain decentralized consensus for AstraCode builders across Solana, Ethereum, and Bitcoin.
        </p>
      </div>

      <div className="flex justify-center border-b border-slate-800 mb-8">
        <button
          onClick={() => setActiveTab("solana")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "solana"
              ? "border-purple-500 text-purple-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Solana Devnet
        </button>
        <button
          onClick={() => setActiveTab("evm")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "evm"
              ? "border-blue-500 text-blue-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Ethereum Sepolia
        </button>
        <button
          onClick={() => setActiveTab("bitcoin")}
          className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "bitcoin"
              ? "border-amber-500 text-amber-400"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Bitcoin UTXO
        </button>
      </div>

      <div>
        {activeTab === "solana" && <SolanaVoting />}
        {activeTab === "evm" && <EvmVoting />}
        {activeTab === "bitcoin" && <BitcoinVoting />}
      </div>

      <footer className="mt-16 text-center text-xs text-slate-500 border-t border-slate-900 pt-6">
        Built by AstraCode Kenya Builders • Open Source • Sprint 1
      </footer>
    </main>
  );
}