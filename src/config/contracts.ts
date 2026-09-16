import { PublicKey } from "@solana/web3.js";

export const SOLANA_CONFIG = {
  network: "devnet",
  endpoint: "https://api.devnet.solana.com",
  programId: new PublicKey("CBfua9WfUgaoWyjyyPs4xQbDNPpzUPdwpaGvR3x1yHGt"),
  pollId: 1,
};

export const EVM_CONFIG = {
  chainId: 11155111, // Sepolia
  contractAddress: "0x39eac7944a1b7b5ef1f91bc7ea1cf9b5a1704383" as `0x${string}`,
  abi: [
    {
      inputs: [{ internalType: "uint256", name: "_option", type: "uint256" }],
      name: "castVote",
      outputs: [],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      inputs: [],
      name: "votesOptionA",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
    {
      inputs: [],
      name: "votesOptionB",
      outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
      stateMutability: "view",
      type: "function",
    },
  ] as const,
};

export const BITCOIN_CONFIG = {
  network: "Testnet",
  optionAAddress: "tb1qastravoteoptiona000000000000000000000yes",
  optionBAddress: "tb1qastravoteoptionb0000000000000000000000no",
  mempoolExplorerUrl: "https://blockstream.info/testnet/address/",
};