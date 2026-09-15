"use client";

import React, { useState } from "react";
import { BITCOIN_CONFIG } from "@/config/contracts";
import { ExternalLink, Copy, Check } from "lucide-react";

const OPTIONS = [
  {
    key: 1 as const,
    title: "Web3 Tip Jar",
    description: "Fans send testnet tokens and leave public messages. Covers token transfers and frontend state.",
    accent: "#F7931A", // Bitcoin Orange
    accentSoft: "rgba(247, 147, 26, 0.12)",
    address: BITCOIN_CONFIG.optionAAddress,
  },
  {
    key: 2 as const,
    title: "On-Chain Wall of Fame",
    description: "A decentralized guestbook where builders engrave their names permanently on the blockchain.",
    accent: "#FCD34D", // Bitcoin Yellow
    accentSoft: "rgba(252, 211, 77, 0.12)",
    address: BITCOIN_CONFIG.optionBAddress,
  },
];

export function BitcoinVoting() {
  const [copied, setCopied] = useState<number | null>(null);

  const copyAddress = (addr: string, key: number) => {
    navigator.clipboard.writeText(addr);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="bg-[#0B0E14] border border-white/[0.06] rounded-3xl p-6 sm:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 mb-8 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7931A] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F7931A]" />
            </span>
            <span className="text-[13px] text-[#7D8496]">Live on Bitcoin Testnet</span>
          </div>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-white tracking-tight leading-none">
            Sprint 2 selection
          </h2>
          <p className="text-sm text-[#7D8496] mt-2 max-w-[46ch]">
            Vote by sending a micro-transaction (1,000 – 10,000 sats) from your wallet to the candidate address.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Ballot */}
        <div className="border-y border-white/[0.06] divide-y divide-white/[0.06]">
          {OPTIONS.map((opt) => (
            <div
              key={opt.key}
              className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 pl-4 transition-colors"
              style={{ borderLeft: `2px solid transparent` }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                style={{ backgroundColor: opt.accentSoft, color: opt.accent }}
              >
                {opt.key}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold">{opt.title}</h3>
                <p className="text-sm text-[#7D8496] mt-1 mb-3 max-w-[52ch]">{opt.description}</p>
                <div className="flex items-center gap-2 bg-black/40 rounded-lg border border-white/[0.05] p-2 inline-flex">
                  <span className="text-xs text-slate-400 font-mono tracking-wider">{opt.address}</span>
                  <button
                    onClick={() => copyAddress(opt.address, opt.key)}
                    className="p-1.5 hover:bg-white/[0.1] rounded-md transition-colors text-slate-400"
                    title="Copy Address"
                  >
                    {copied === opt.key ? <Check size={14} className="text-[#14F195]" /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center sm:pl-4 mt-4 sm:mt-0">
                <a
                  href={`${BITCOIN_CONFIG.mempoolExplorerUrl}${opt.address}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium text-black transition-opacity hover:opacity-90 flex items-center gap-2"
                  style={{ backgroundColor: opt.accent }}
                >
                  Mempool <ExternalLink size={14} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}