import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Round } from "../target/types/round";
import { SystemProgram, Keypair, PublicKey, Transaction, SYSVAR_RENT_PUBKEY, SYSVAR_CLOCK_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, createAccount, createAssociatedTokenAccount, getAssociatedTokenAddress , ASSOCIATED_TOKEN_PROGRAM_ID,createMint, mintTo, mintToChecked, getAccount, getMint, getAssociatedTokenAddressSync } from "@solana/spl-token";

describe("round", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Round as Program<Round>;

  let owner = Keypair.fromSecretKey(
    Uint8Array.from([93,241,149,127,150,75,40,131,222,198,214,225,84,78,102,157,181,245,231,106,49,111,65,167,50,214,55,136,120,176,205,183,235,107,145,1,68,46,115,54,118,167,44,241,173,67,177,80,0,131,118,118,218,31,93,138,157,168,128,60,50,7,130,21])
  );

  let user = Keypair.fromSecretKey(
    Uint8Array.from([40,99,26,70,105,80,7,101,254,157,6,15,246,207,151,29,5,142,33,154,246,128,6,190,239,191,147,115,241,217,13,169,63,7,158,42,242,198,39,230,40,85,41,68,22,57,86,10,229,14,159,81,159,159,3,218,116,30,3,106,54,57,221,134])
  );

  

  const GLOBAL_STATE_SEED = "GLOBAL-STATE-SEED";
  const VAULT_SEED = "VAULT-SEED";
  const ROUND_SEED = "ROUND-SEED";
  const ROUN_USER_INFO_SEED = "ROUND-USER-INFO-SEED";

  let globalState, vault: PublicKey;
  let globalStateBump, vaultBump: number;
  let roundIndex = 1;

  it("GET PDA", async() => {
    [globalState, globalStateBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(GLOBAL_STATE_SEED)
      ],
      program.programId
    );

    [vault, vaultBump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(VAULT_SEED)
      ],
      program.programId
    );

  })
  it("Is initialized!", async () => {
    // Add your test here.
    const slotTokenPrice = 100000000; // 0.1SOL
    const tx = await program.rpc.initialize(
      new anchor.BN(slotTokenPrice),
      {
        accounts: {
          owner: owner.publicKey,
          globalState,
          vault,
          tokenProgram: TOKEN_PROGRAM_ID,
          systemProgram: SystemProgram.programId
        },
        signers: [owner]
      }
    );
    const globalStateData = await program.account.globalState.fetch(globalState);
    console.log(globalStateData);
  });

 
  it("create round 1", async() => {
    // Round 1
    const [round, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUND_SEED),
        new anchor.BN(roundIndex).toBuffer('le', 4)
      ],
      program.programId
    );
    const tx = await program.rpc.createRound(
      roundIndex,
      {
        accounts: {
          owner: owner.publicKey,
          globalState,
          round,
          systemProgram:SystemProgram.programId
        },
        signers: [owner]
      }
    );
    const roundData = await program.account.round.fetch(round);
    console.log("roundData->", roundData);
  });
 
  it("buy 1 slot in round 1 and it is finish", async() => {
    roundIndex = 1;
    const [round, bump1] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUND_SEED),
        new anchor.BN(roundIndex).toBuffer('le', 4)
      ],
      program.programId
    );

    const [roundUserInfo, bump2] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUN_USER_INFO_SEED),
        new anchor.BN(roundIndex).toBuffer('le', 4),
        user.publicKey.toBuffer()
      ],
      program.programId
    );

    const amount = 1;

    const tx = await program.rpc.buySlot(
      roundIndex,
      new anchor.BN(amount),
      {
        accounts: {
          user: user.publicKey,
          globalState,
          round,
          vault,
          roundUserInfo,
          systemProgram: SystemProgram.programId
        },
        signers: [user]
      }
    );
    const roundData = await program.account.round.fetch(round);
    console.log("roundData->", roundData);

    const roundUserInfoData = await program.account.roundUserInfo.fetch(roundUserInfo);
    console.log("roundData->", roundUserInfoData);

  });

  it("create round 2", async() => {
    // Round 2
    roundIndex = 2;
    const [round, bump] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUND_SEED),
        new anchor.BN(roundIndex).toBuffer('le', 4)
      ],
      program.programId
    );
    const tx = await program.rpc.createRound(
      roundIndex,
      {
        accounts: {
          owner: owner.publicKey,
          globalState,
          round,
          systemProgram:SystemProgram.programId
        },
        signers: [owner]
      }
    );
    const roundData = await program.account.round.fetch(round);
    console.log("roundData->", roundData);
  });
 
  it("buy 2 slot in round 2 and it is finish", async() => {
    roundIndex = 2;
    const [round, bump1] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUND_SEED),
        new anchor.BN(roundIndex).toBuffer('le', 4)
      ],
      program.programId
    );

    const [roundUserInfo, bump2] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUN_USER_INFO_SEED),
        new anchor.BN(roundIndex).toBuffer('le', 4),
        user.publicKey.toBuffer()
      ],
      program.programId
    );

    const amount = 2;

    const tx = await program.rpc.buySlot(
      roundIndex,
      new anchor.BN(amount),
      {
        accounts: {
          user: user.publicKey,
          globalState,
          round,
          vault,
          roundUserInfo,
          systemProgram: SystemProgram.programId
        },
        signers: [user]
      }
    );
    const roundData = await program.account.round.fetch(round);
    console.log("roundData->", roundData);

    const roundUserInfoData = await program.account.roundUserInfo.fetch(roundUserInfo);
    console.log("roundData->", roundUserInfoData);

  });

  it("claim slot in round 1", async() => {
    roundIndex = 1;
    const nextRoundIndex = roundIndex + 1;

    const [round, bump1] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUND_SEED),
        new anchor.BN(roundIndex).toBuffer('le', 4)
      ],
      program.programId
    );

    const [nextRound, bump2] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUND_SEED),
        new anchor.BN(nextRoundIndex).toBuffer('le', 4)
      ],
      program.programId
    );

    const [roundUserInfo, bump3] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from(ROUN_USER_INFO_SEED),
        new anchor.BN(roundIndex).toBuffer('le', 4),
        user.publicKey.toBuffer()
      ],
      program.programId
    );

    
    const tx = await program.rpc.claimSlot(
      roundIndex,
      {
        accounts: {
          user: user.publicKey,
          globalState,
          nextRound,
          round,
          vault,
          roundUserInfo,
          systemProgram: SystemProgram.programId
        },
        signers: [user]
      }
    );
    const roundData = await program.account.round.fetch(round);
    console.log("roundData->", roundData);
  
    const roundUserInfoData = await program.account.roundUserInfo.fetch(roundUserInfo);
    console.log("roundData->", roundUserInfoData);
  
  });


});
