"use client";

import React, { useState } from "react";
import { BITCOIN_CONFIG } from "@/config/contracts";
import { ExternalLink, Copy, Check } from "lucide-react";

export function BitcoinVoting() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyAddress = (addr: string, label: string) => {
    navigator.clipboard.writeText(addr);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="mb-6">
        <span className="text-xs font-semibold px-2.5 py-1 bg-amber-950 text-amber-400 border border-amber-800 rounded-full">
          Bitcoin Testnet UTXO
        </span>
        <h2 className="text-xl font-bold mt-2 text-white">Bitcoin On-Chain Poll</h2>
        <p className="text-slate-400 text-sm mt-1">
          Vote by sending a micro-transaction (1,000 – 10,000 sats) from Unisat or Leather to the candidate address.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="p-5 border border-slate-700 bg-slate-800/60 rounded-xl">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">Option A (Yes)</div>
          <div className="text-lg font-bold text-white mt-1">Ordinals / BRC-20 Tracker</div>
          <p className="text-xs text-slate-400 mt-2 font-mono break-all">{BITCOIN_CONFIG.optionAAddress}</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => copyAddress(BITCOIN_CONFIG.optionAAddress, "A")}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white flex items-center gap-1.5 transition"
            >
              {copied === "A" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied === "A" ? "Copied" : "Copy Address"}
            </button>
            <a
              href={`${BITCOIN_CONFIG.mempoolExplorerUrl}${BITCOIN_CONFIG.optionAAddress}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-lg text-xs flex items-center gap-1"
            >
              Mempool <ExternalLink size={12} />
            </a>
          </div>
        </div>

        <div className="p-5 border border-slate-700 bg-slate-800/60 rounded-xl">
          <div className="text-amber-400 text-xs font-bold uppercase tracking-wider">Option B (No)</div>
          <div className="text-lg font-bold text-white mt-1">Bitcoin Stacks Smart Contract</div>
          <p className="text-xs text-slate-400 mt-2 font-mono break-all">{BITCOIN_CONFIG.optionBAddress}</p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => copyAddress(BITCOIN_CONFIG.optionBAddress, "B")}
              className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs text-white flex items-center gap-1.5 transition"
            >
              {copied === "B" ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
              {copied === "B" ? "Copied" : "Copy Address"}
            </button>
            <a
              href={`${BITCOIN_CONFIG.mempoolExplorerUrl}${BITCOIN_CONFIG.optionBAddress}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 rounded-lg text-xs flex items-center gap-1"
            >
              Mempool <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}