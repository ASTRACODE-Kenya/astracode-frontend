export const IDL = {
  address: "CBfua9WfUgaoWyjyyPs4xQbDNPpzUPdwpaGvR3x1yHGt",
  metadata: {
    name: "voting",
    version: "0.1.0",
    spec: "0.1.0",
    description: "Created with Anchor",
  },
  instructions: [
    {
      name: "cast_vote",
      discriminator: [20, 212, 15, 189, 69, 180, 69, 151],
      accounts: [
        { name: "voter", writable: true, signer: true },
        { name: "poll", writable: true },
        {
          name: "voter_record",
          writable: true,
          pda: {
            seeds: [
              { kind: "const", value: [118, 111, 116, 101, 114, 95, 114, 101, 99, 111, 114, 100] },
              { kind: "account", path: "poll.counter", account: "Poll" },
              { kind: "account", path: "voter" },
            ],
          },
        },
        { name: "system_program", address: "11111111111111111111111111111111" },
      ],
      args: [{ name: "vote_option", type: "u8" }],
    },
    {
      name: "initialize_poll",
      discriminator: [193, 22, 99, 197, 18, 33, 115, 117],
      accounts: [
        {
          name: "poll",
          writable: true,
          pda: {
            seeds: [
              { kind: "const", value: [112, 111, 108, 108] },
              { kind: "arg", path: "poll_id" },
            ],
          },
        },
        { name: "system_program", address: "11111111111111111111111111111111" },
        { name: "payer", writable: true, signer: true },
      ],
      args: [{ name: "poll_id", type: "u64" }],
    },
  ],
  accounts: [
    { name: "Poll", discriminator: [110, 234, 167, 188, 231, 136, 153, 111] },
    { name: "VoterRecord", discriminator: [178, 96, 138, 116, 143, 202, 115, 33] },
  ],
  errors: [
    { code: 6000, name: "Overflow", msg: "Math Overflow error" },
    { code: 6001, name: "InvalidVoteOption", msg: "invalid vote option" },
  ],
  types: [
    {
      name: "Poll",
      type: {
        kind: "struct",
        fields: [
          { name: "optionA", type: "u64" },
          { name: "optionB", type: "u64" },
          { name: "counter", type: "u64" },
        ],
      },
    },
    {
      name: "VoterRecord",
      type: {
        kind: "struct",
        fields: [
          { name: "voter", type: "pubkey" },
          { name: "poll_id", type: "u64" },
          { name: "bump", type: "u8" },
        ],
      },
    },
  ],
} as const;