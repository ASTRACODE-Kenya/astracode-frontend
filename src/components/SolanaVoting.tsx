"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor";
import { SOLANA_CONFIG } from "@/config/contracts";
import { IDL } from "@/config/idl";

const WalletMultiButtonDynamic = dynamic(
  async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

const OPTIONS = [
  {
    key: 1 as const,
    title: "Web3 Tip Jar",
    description:
      "Fans send testnet tokens and leave public messages. Covers token transfers and frontend state.",
    accent: "#9945FF",
    accentSoft: "rgba(153, 69, 255, 0.12)",
  },
  {
    key: 2 as const,
    title: "On-Chain Wall of Fame",
    description:
      "A decentralized guestbook where builders engrave their names permanently on the blockchain.",
    accent: "#14F195",
    accentSoft: "rgba(20, 241, 149, 0.12)",
  },
];

export function SolanaVoting() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const [tally, setTally] = useState<{ optionA: number; optionB: number }>({ optionA: 0, optionB: 0 });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string>("");
  const [isInitialized, setIsInitialized] = useState<boolean | null>(null);

  const pollId = new BN(SOLANA_CONFIG.pollId);

  const fetchTally = async () => {
    try {
      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
        SOLANA_CONFIG.programId
      );

      const accountInfo = await connection.getAccountInfo(pollPda);
      if (accountInfo) {
        setIsInitialized(true);
        const optionA = Number(accountInfo.data.readBigUInt64LE(8));
        const optionB = Number(accountInfo.data.readBigUInt64LE(16));
        setTally({ optionA, optionB });
      } else {
        setIsInitialized(false);
      }
    } catch (err) {
      console.error("Error fetching poll tally:", err);
    }
  };

  useEffect(() => {
    fetchTally();
  }, [connection]);

  // ADMIN: Initialize the poll if it doesn't exist
  const initializePoll = async () => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setStatus("Please connect your wallet to initialize.");
      return;
    }
    try {
      setLoading(true);
      setStatus("Initializing Poll on Devnet...");

      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: "processed" });
      const program = new Program(IDL as any, provider);

      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const tx = await program.methods
        .initializePoll(pollId)
        .accounts({
          poll: pollPda,
          payer: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus(`Poll Initialized! Tx: ${tx.slice(0, 8)}...`);
      setIsInitialized(true);
    } catch (err: any) {
      console.error(err);
      setStatus(`Init Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // USER: Cast Vote
  const castVote = async (option: 1 | 2) => {
    if (!wallet.publicKey || !wallet.signTransaction) {
      setStatus("Please connect your Solana wallet first.");
      return;
    }
    try {
      setLoading(true);
      setStatus("Confirm transaction in your wallet...");

      const provider = new AnchorProvider(connection, wallet as any, { preflightCommitment: "processed" });
      const program = new Program(IDL as any, provider);

      const [pollPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
        program.programId
      );

      const [voterRecordPda] = PublicKey.findProgramAddressSync(
        [Buffer.from("voter_record"), pollId.toArrayLike(Buffer, "le", 8), wallet.publicKey.toBuffer()],
        program.programId
      );

      const tx = await program.methods
        .castVote(option)
        .accounts({
          poll: pollPda,
          voterRecord: voterRecordPda,
          voter: wallet.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      setStatus(`Vote Confirmed! 🎉 Tx: ${tx.slice(0, 8)}...${tx.slice(-8)}`);
      await fetchTally();
    } catch (err: any) {
      console.error(err);
      if (err.toString().includes("already in use")) {
        setStatus("❌ Error: You have already voted on this poll!");
      } else if (err.toString().includes("0x1")) {
        setStatus("❌ Error: Insufficient Devnet SOL for gas fees.");
      } else {
        setStatus(`❌ Error: ${err.message || "Transaction failed"}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const total = tally.optionA + tally.optionB;
  const pctA = total > 0 ? Math.round((tally.optionA / total) * 100) : 0;
  const pctB = total > 0 ? 100 - pctA : 0;
  const counts: Record<1 | 2, number> = { 1: tally.optionA, 2: tally.optionB };
  const leadingKey: 1 | 2 | null =
    total === 0 || tally.optionA === tally.optionB ? null : tally.optionA > tally.optionB ? 1 : 2;

  return (
    <div className="bg-[#0B0E14] border border-white/[0.06] rounded-3xl p-6 sm:p-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-8 mb-8 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#14F195] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#14F195]" />
            </span>
            <span className="text-[13px] text-[#7D8496]">Live on Solana Devnet</span>
          </div>
          <h2 className="text-3xl sm:text-[2.5rem] font-bold text-white tracking-tight leading-none">
            Sprint 2 selection
          </h2>
          <p className="text-sm text-[#7D8496] mt-2 max-w-[46ch]">
            One vote per wallet decides which project the team builds next.
          </p>
        </div>
        <div className="shrink-0">
          <WalletMultiButtonDynamic className="!bg-white/[0.06] hover:!bg-white/[0.1] !border !border-white/[0.08] !rounded-xl !h-11 !px-6 !text-sm !font-medium !transition-colors" />
        </div>
      </div>

      {/* Uninitialized state */}
      {isInitialized === false && (
        <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] pl-6 pr-6 py-6 mb-8 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FFB454]" />
          <h3 className="text-base font-semibold text-white mb-1">Poll not initialized yet</h3>
          <p className="text-sm text-[#7D8496] mb-5 max-w-[52ch]">
            The program is deployed, but this poll&apos;s account hasn&apos;t been created on-chain. Initialize
            it once before voting opens.
          </p>
          <button
            onClick={initializePoll}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-black bg-[#FFB454] hover:bg-[#ffc276] transition-colors disabled:opacity-50"
          >
            {loading ? "Initializing…" : "Initialize poll"}
          </button>
        </div>
      )}

      {/* Voting */}
      {isInitialized === true && (
        <div className="space-y-8">
          {/* Vote share bar */}
          <div>
            {total > 0 ? (
              <>
                <div className="flex justify-between text-sm mb-2">
                  <span style={{ color: OPTIONS[0].accent }} className="font-medium tabular-nums">
                    {pctA}%
                  </span>
                  <span style={{ color: OPTIONS[1].accent }} className="font-medium tabular-nums">
                    {pctB}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden flex">
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${pctA}%`, backgroundColor: OPTIONS[0].accent }}
                  />
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: `${pctB}%`, backgroundColor: OPTIONS[1].accent }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="h-2 rounded-full bg-white/[0.06]" />
                <p className="text-xs text-[#7D8496] mt-2">No votes yet — be the first.</p>
              </>
            )}
          </div>

          {/* Ballot */}
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
                      disabled={loading}
                      className="px-5 py-2.5 rounded-xl text-sm font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ backgroundColor: opt.accent }}
                    >
                      {loading ? "…" : "Vote"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Status */}
      {status && (
        <div className="mt-6 flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3 text-sm text-[#D8DCE3]">
          <span
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{
              backgroundColor: status.includes("Error") ? "#FF5C72" : status.includes("!") ? "#14F195" : "#7D8496",
            }}
          />
          <span>{status}</span>
        </div>
      )}
    </div>
  );
}