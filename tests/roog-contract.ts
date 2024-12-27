import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getMint, getAccount, Mint, Account, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { RoogContract } from "../target/types/roog_contract";
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';

import {
  getAssociatedTokenAddress,
  getOrCreateAssociatedTokenAccount,
  createMint,
  transfer,
  mintTo
} from "@solana/spl-token"
import { bytes } from "@project-serum/anchor/dist/cjs/utils";

const GLOBAL_STATE_SEED = Buffer.from("GLOBAL_STATE_SEED");
const VAULT_SEED = Buffer.from("VAULT_SEED");
const USER_STATE_SEED = Buffer.from("USER_STATE_SEED");

const systemProgram = anchor.web3.SystemProgram.programId;
const tokenProgram = TOKEN_PROGRAM_ID;
const associatedTokenProgram = ASSOCIATED_TOKEN_PROGRAM_ID
const rent = anchor.web3.SYSVAR_RENT_PUBKEY;
const clock = anchor.web3.SYSVAR_CLOCK_PUBKEY;


const pepeTokenMint = new anchor.web3.PublicKey("EUdP7XScSit96rdZGALuBAendca1Vtkgu3kBANV81DNv");
const solpg = new anchor.web3.PublicKey("7gCbxJrESDDq4oZ99zSK6hXueKspxX1y2jCn1VA5Hcg1");

export const pda = (
  seeds: (Buffer | Uint8Array)[],
  programId: anchor.web3.PublicKey
): anchor.web3.PublicKey => {
  const [pdaKey] = anchor.web3.PublicKey.findProgramAddressSync(
    seeds,
    programId
  );
  return pdaKey;
}

describe("roog-contract", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  let connection = provider.connection;
  const program = anchor.workspace.RoogContract as Program<RoogContract>;
  console.log("program id", program.programId);

  it("Is initialized!", async () => {
    console.log("provider.wallet.publicKey", provider.wallet.publicKey);
    const globalState = await pda([GLOBAL_STATE_SEED], program.programId);
    const treasury = getAssociatedTokenAddressSync(pepeTokenMint, solpg);
    const vault = await pda([VAULT_SEED, pepeTokenMint.toBuffer()], program.programId);
    console.log("treasury", treasury);
    return


    const txid = await program.methods.initialize(provider.wallet.publicKey).accounts({
      authority: provider.wallet.publicKey,
      globalState: globalState,
      treasury: treasury,
      vault: vault,
      mint: pepeTokenMint,
      tokenProgram,
      systemProgram,
      rent
    }).rpc({ skipPreflight: true });

    console.log(txid);
  });

  // it("buy and hatch eggs", async () => {

  //   const user = Keypair.fromSecretKey(
  //     Uint8Array.from([31, 31, 86, 251, 160, 172, 193, 185, 28, 176, 139, 123, 89, 224, 169, 208, 83, 86, 70, 121, 108, 179, 205, 228, 181, 189, 179, 70, 242, 157, 131, 92, 62, 42, 14, 24, 8, 231, 41, 23, 36, 150, 49, 17, 50, 250, 126, 80, 95, 218, 15, 238, 239, 255, 235, 109, 130, 95, 220, 252, 245, 253, 186, 66]));

  //   console.log("provider.wallet.publicKey", provider.wallet.publicKey);
  //   const globalState = await pda([GLOBAL_STATE_SEED], program.programId);
  //   const treasury = getAssociatedTokenAddressSync(pepeTokenMint, provider.wallet.publicKey);
  //   const vault = await pda([VAULT_SEED, pepeTokenMint.toBuffer()], program.programId);
  //   const userStateKey = await pda([USER_STATE_SEED, user.publicKey.toBuffer()], program.programId);
  //   let globalData = await program.account.globalState.fetch(globalState);
  //   const account = getAssociatedTokenAddressSync(pepeTokenMint, user.publicKey);

  //   console.log("globalState", globalState);
  //   console.log("treasury", treasury);
  //   console.log("vault", vault);
  //   console.log("userStateKey", userStateKey);
  //   console.log("account", account);
  //   console.log(new anchor.BN(5).mul(new anchor.BN(LAMPORTS_PER_SOL)))
  //   console.log("tokenprogram", tokenProgram);
  //   return

  //   const tx = await program.methods.buyRoogs(new anchor.BN(5).mul(new anchor.BN(LAMPORTS_PER_SOL)))
  //     .accounts({
  //       user: user.publicKey,
  //       globalState: globalState,
  //       treasury: globalData.treasury,
  //       vault: vault,
  //       mint: pepeTokenMint,
  //       userState: userStateKey,
  //       account: account,
  //       tokenProgram,
  //       systemProgram,
  //       rent,
  //       clock
  //     })
  //     .signers([user])
  //     .rpc({ skipPreflight: true });;
  //   console.log("buy tx==>", tx);
  // });
})
