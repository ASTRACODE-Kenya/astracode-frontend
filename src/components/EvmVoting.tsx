"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useConnect, useDisconnect, useWriteContract, useReadContract } from "wagmi";
import { EVM_CONFIG } from "@/config/contracts";

const OPTIONS = [
  {
    key: 1 as const,
    title: "Web3 Tip Jar",
    description: "Fans send testnet tokens and leave public messages. Covers token transfers and frontend state.",
    accent: "#3B82F6", // Ethereum Blue
    accentSoft: "rgba(59, 130, 246, 0.12)",
  },
  {
    key: 2 as const,
    title: "On-Chain Wall of Fame",
    description: "A decentralized guestbook where builders engrave their names permanently on the blockchain.",
    accent: "#8B5CF6", // Ethereum Purple
    accentSoft: "rgba(139, 92, 246, 0.12)",
  },
];

export function EvmVoting() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending: isConnecting } = useConnect();
  const { disconnect } = useDisconnect();
  const { writeContractAsync } = useWriteContract();

  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);

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

  const handleConnect = () => {
    setStatus("Requesting wallet connection...");
    
    if (!connectors || connectors.length === 0) {
      setStatus("Error: No compatible Web3 wallet found in your browser.");
      return;
    }

    // Connect using the standard injected wallet (MetaMask)
    connect(
      { connector: connectors[0] },
      {
        onError: (err) => {
          console.error("Connect error:", err);
          setStatus(`Connection Error: ${err.message.split('\n')[0]}`);
        },
        onSuccess: () => {
          setStatus("Wallet connected successfully!");
        }
      }
    );
  };

  const castVote = async (option: 1 | 2) => {
    if (!isConnected) {
      setStatus("Error: Please connect your wallet first.");
      return;
    }
    try {
      setLoading(true);
      setStatus("Please confirm the transaction in your wallet...");

      const txHash = await writeContractAsync({
        address: EVM_CONFIG.contractAddress,
        abi: EVM_CONFIG.abi,
        functionName: "castVote",
        args: [BigInt(option)],
      });

      setStatus(`Vote Sent! 🎉 Tx: ${txHash.slice(0, 8)}... Waiting for block confirmation.`);
      setTimeout(() => {
        refetchA();
        refetchB();
      }, 4000);
    } catch (error: any) {
      console.error(error);
      if (error.message?.includes("User rejected") || error.message?.includes("rejected")) {
        setStatus("Error: You rejected the transaction.");
      } else {
        setStatus(`Error: Transaction failed. Ensure you have Sepolia ETH.`);
      }
    } finally {
      setLoading(false);
    }
  };

  const valA = votesA ? Number(votesA) : 0;
  const valB = votesB ? Number(votesB) : 0;
  const total = valA + valB;
  const pctA = total > 0 ? Math.round((valA / total) * 100) : 0;
  const pctB = total > 0 ? 100 - pctA : 0;
  const counts: Record<1 | 2, number> = { 1: valA, 2: valB };
  const leadingKey: 1 | 2 | null = total === 0 || valA === valB ? null : valA > valB ? 1 : 2;

  if (!mounted) return null;

  return (
    <div className="bg-[#0B0E14] border border-white/[0.06] rounded-3xl p-6 sm:p-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 mb-8 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3B82F6]" />
            </span>
            <span className="text-[13px] text-[#7D8496]">Live on Ethereum Sepolia</span>
          </div>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-white tracking-tight leading-none">
            Sprint 2 selection
          </h2>
          <p className="text-sm text-[#7D8496] mt-2 max-w-[46ch]">
            One vote per wallet decides which project the team builds next.
          </p>
        </div>
        <div className="shrink-0">
          {isConnected ? (
            <button
              onClick={() => disconnect()}
              className="px-6 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.08] text-white rounded-xl text-sm font-medium transition-colors"
            >
              {address?.slice(0, 6)}...{address?.slice(-4)} (Disconnect)
            </button>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isConnecting || connectors.length === 0}
              className="px-6 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl text-sm font-medium disabled:opacity-50 transition-colors"
            >
              {isConnecting ? "Check Wallet..." : "Connect MetaMask"}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        <div>
          {total > 0 ? (
            <>
              <div className="flex justify-between text-sm mb-2">
                <span style={{ color: OPTIONS[0].accent }} className="font-medium tabular-nums">{pctA}%</span>
                <span style={{ color: OPTIONS[1].accent }} className="font-medium tabular-nums">{pctB}%</span>
              </div>
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden flex">
                <div className="h-full transition-all duration-500" style={{ width: `${pctA}%`, backgroundColor: OPTIONS[0].accent }} />
                <div className="h-full transition-all duration-500" style={{ width: `${pctB}%`, backgroundColor: OPTIONS[1].accent }} />
              </div>
            </>
          ) : (
            <>
              <div className="h-2 rounded-full bg-white/[0.06]" />
              <p className="text-xs text-[#7D8496] mt-2">No votes yet — be the first.</p>
            </>
          )}
        </div>

        <div className="border-y border-white/[0.06] divide-y divide-white/[0.06]">
          {OPTIONS.map((opt) => {
            const isLeading = opt.key === leadingKey;
            return (
              <div
                key={opt.key}
                className="flex flex-col sm:flex-row sm:items-center gap-4 py-6 pl-4 transition-colors"
                style={{ borderLeft: `2px solid ${isLeading ? opt.accent : "transparent"}` }}
              >
                <div
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                  style={{ backgroundColor: opt.accentSoft, color: opt.accent }}
                >
                  {opt.key}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-semibold">{opt.title}</h3>
                  <p className="text-sm text-[#7D8496] mt-1 max-w-[52ch]">{opt.description}</p>
                </div>
                <div className="flex items-center gap-6 sm:pl-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-white tabular-nums">{counts[opt.key]}</div>
                    <div className="text-xs text-[#7D8496]">votes</div>
                  </div>
                  <button
                    onClick={() => castVote(opt.key)}
                    disabled={loading || !isConnected}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ backgroundColor: opt.accent }}
                  >
                    {loading ? "..." : "Vote"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {status && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-[#D8DCE3]">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: status.includes("Error") ? "#FF5C72" : status.includes("!") ? "#14F195" : "#3B82F6" }}
          />
          <span>{status}</span>
        </div>
      )}
    </div>
  );
}