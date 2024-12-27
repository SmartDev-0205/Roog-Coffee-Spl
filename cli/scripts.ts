import { Program, web3 } from "@coral-xyz/anchor";
import * as anchor from "@coral-xyz/anchor";
import { Keypair, ParsedAccountData, PublicKey, SYSVAR_RENT_PUBKEY, SystemProgram, Transaction } from "@solana/web3.js";
const idl = require('../target/idl/roog_contract.json');

const PROGRAM_ID = new PublicKey("FZg4UhJbmeCJCpj3GCx6f1LZeFqt7fUZ2jEFJWx78kwS");

export const GLOBAL_STATE_SEED = "GLOBAL_STATE_SEED";
export const VAULT_SEED = "VAULT_SEED";
export const USER_STATE_SEED = "USER_STATE_SEED";

export const TOKEN_ADDRESS = new PublicKey("6oo65YcDAo33XKZxxKMgheuGa2QLX95C5tcgmM7XjEEX");

export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

anchor.setProvider(anchor.AnchorProvider.local(web3.clusterApiUrl('devnet')));
const solConnection = anchor.getProvider().connection;
const wallet = anchor.AnchorProvider.local().wallet as anchor.Wallet;
const payer = wallet.payer;
const authority = payer.publicKey;
const provider = anchor.getProvider();

console.log("payer : ", payer.publicKey.toBase58());

let program: Program = null;

// Address of the deployed program.
const programId = new anchor.web3.PublicKey(PROGRAM_ID);

// Generate the program client from IDL.
program = new anchor.Program(idl, programId);
console.log('ProgramId: ', program.programId.toBase58());

const main = async () => {
  await initialize();
}

const initialize = async() => {
  await program
    .methods
    .initialize(wallet.publicKey)
    .accounts({
      authority: wallet.publicKey,
      globalState: await getGlobalStateKey(),
      treasury: await getAssociatedTokenAccount(wallet.publicKey),
      vault: await getVaultKey(),
      mint: TOKEN_ADDRESS,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY
    })
    .rpc()
    .catch((error) => {
      console.log(error);
    })
}

// export const buyRoogs = async (
//   referralKey: PublicKey,
//   tokenAmount: number
// ): Promise<string | null> => {
//   let globalStateKey = await getGlobalStateKey();
//   let globalData = await program.account.globalState.fetch(globalStateKey);
//   let vaultKey = await getVaultKey();
//   let buyIx = await program.methods
//     .buyRoogs(new anchor.BN(tokenAmount * 1))
//     .accounts({
//       user: wallet.publicKey,
//       globalState: globalStateKey,
//       treasury: globalData.treasury,
//       vault: vaultKey,
//       mint: TOKEN_ADDRESS,
//       userState: await getUserStateKey(wallet.publicKey),
//       account: await getAssociatedTokenAccount(wallet.publicKey),
//       tokenProgram: TOKEN_PROGRAM_ID,
//       systemProgram: SystemProgram.programId,
//       rent: SYSVAR_RENT_PUBKEY
//     })
//     .instruction();
  
//   let hatchIx = await getHatchIx(program, wallet.publicKey, referralKey);
//   let tx = new Transaction();
//   tx.add(buyIx);
//   tx.add(hatchIx);
//   return await send(connection, wallet, tx);
// };

// export const getHatchIx = async (
//   program: any,
//   userKey: PublicKey,
//   referralKey: PublicKey
// ): Promise<> => {
//   let r = referralKey;
//   if (referralKey.equals(userKey)) {
//     let globalStateKey = await getGlobalStateKey();
//     let globalData = await program.account.globalState.fetch(globalStateKey);
//     r = globalData.treasury;
//   }
//   let ix = await program.methods
//     .hatchRoogs()
//     .accounts({
//       user: userKey,
//       globalState: await getGlobalStateKey(),
//       userState: await getUserStateKey(userKey),
//       referral: r,
//       referralState: await getUserStateKey(r),
//       SystemProgram: SystemProgram.programId,
//       rent: SYSVAR_RENT_PUBKEY
//     })
//     .instruction()
//   return ix;
// };

// export const hatchRoogs = async (
//   wallet: WalletContextState,
//   referralKey: PublicKey
// ): Promise<string | null> => {
//   if (wallet.publicKey === null || wallet.publicKey === undefined) throw new WalletNotConnectedError();
  
//   const program = getProgram(wallet);
//   const tx = new Transaction().add(
//     await getHatchIx(program, wallet.publicKey, referralKey)
//   );
//   return await send(connection, wallet, tx);
// };


// export const sellRoogs = async (
//   wallet: WalletContextState,
// ): Promise<string | null> => {
//   if (wallet.publicKey === null || wallet.publicKey === undefined) throw new WalletNotConnectedError();
  
//   const program = getProgram(wallet);
//   let globalStateKey = await getGlobalStateKey();
//   let globalData = await program.account.globalState.fetch(globalStateKey);
//   let vaultKey = await getVaultKey();
//   const tx = new Transaction().add(
//     await program.methods
//       .sellRoogs()
//       .accounts({
//         user: wallet.publicKey,
//         globalState: globalStateKey,
//         treasury: globalData.treasury,
//         vault: vaultKey,
//         mint: TOKEN_ADDRESS,
//         userState: await getUserStateKey(wallet.publicKey),
//         account: await getAssociatedTokenAccount(wallet.publicKey),
//         tokenProgram: TOKEN_PROGRAM_ID,
//         associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//       })
//       .instruction()
//   );
//   return await send(connection, wallet, tx);
// };

// async function send(
//   connection: Connection,
//   wallet: WalletContextState,
//   transaction: Transaction
// ) {
//   const txHash = await sendTransaction(connection, wallet, transaction);
//   if (txHash != null) {
//     let confirming_id = showToast("Confirming Transaction ...", -1, 2);
//     let res = await connection.confirmTransaction(txHash);
//     console.log(txHash);
//     toast.dismiss(confirming_id);
//     if (res.value.err) showToast("Transaction Failed", 2000, 1);
//     else showToast("Transaction Confirmed", 2000);
//   } else {
//     showToast("Transaction Failed", 2000, 1);
//   }
//   return txHash;
// }


// export async function sendTransaction(
//   connection: Connection,
//   wallet: WalletContextState,
//   transaction: Transaction
// ) {
//   if (wallet.publicKey === null || wallet.signTransaction === undefined)
//     return null;
//   try {
//     transaction.recentBlockhash = (
//       await connection.getLatestBlockhash()
//     ).blockhash;
//     transaction.feePayer = wallet.publicKey;
//     const signedTransaction = await wallet.signTransaction(transaction);
//     const rawTransaction = signedTransaction.serialize();

//     showToast("Sending Transaction ...", 500);
//     // notify({
//     //   message: "Transaction",
//     //   description: "Sending Transaction ...",
//     //   duration: 0.5,
//     // });

//     const txid: TransactionSignature = await connection.sendRawTransaction(
//       rawTransaction,
//       {
//         skipPreflight: true,
//         preflightCommitment: "processed",
//       }
//     );
//     return txid;
//   } catch (e) {
//     console.log("tx e = ", e);
//     return null;
//   }
// }

const getAssociatedTokenAccount = async (ownerPubkey: PublicKey): Promise<PublicKey> => {
  let associatedTokenAccountPubkey = (await PublicKey.findProgramAddress(
      [
          ownerPubkey.toBuffer(),
          TOKEN_PROGRAM_ID.toBuffer(),
          TOKEN_ADDRESS.toBuffer(), // mint address
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
  ))[0];
  return associatedTokenAccountPubkey;
}

export const getGlobalStateKey = async () => {
  const [globalStateKey] = await asyncGetPda(
    [Buffer.from(GLOBAL_STATE_SEED)],
    PROGRAM_ID
  );
  return globalStateKey;
};

export const getVaultKey = async () => {
  const [vaultKey] = await asyncGetPda(
    [Buffer.from(VAULT_SEED), TOKEN_ADDRESS.toBuffer()],
    PROGRAM_ID
  );
  return vaultKey;
};

export const getUserStateKey = async (userKey: PublicKey) => {
  const [userStateKey] = await asyncGetPda(
    [Buffer.from(USER_STATE_SEED), userKey.toBuffer()],
    PROGRAM_ID
  );
  return userStateKey;
};

const asyncGetPda = async (
  seeds: Buffer[],
  programId: PublicKey
): Promise<[PublicKey, number]> => {
  const [pubKey, bump] = await PublicKey.findProgramAddress(seeds, programId);
  return [pubKey, bump];
};


main();