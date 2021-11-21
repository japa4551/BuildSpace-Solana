const anchor = require('@project-serum/anchor');
const { SystemProgram } = require('@solana/web3.js');

const main = async () => {
  console.log('🚀 Starting test...');

  // Create and set our provider
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  
  // Load the program
  const program = anchor.workspace.Myepicproject;
  
  // Create an account keypair
  const baseAcc = anchor.web3.Keypair.generate();

  // Initialize the account
  const tx = await program.rpc.initialize({
    accounts: {
      baseAccount: baseAcc.publicKey,
      user: provider.wallet.publicKey,
      systemProgram: SystemProgram.programId
    },
    signers: [ baseAcc ]
  });
  console.log('📝 Your transaction signature', tx);

  // Fetch data from the account
  let account = await program.account.baseAccount.fetch(baseAcc.publicKey);
  console.log(`👀 GIF Count: ${account.totalGifs.toString()}`);

  // Call `add_gif`
  await program.rpc.addGif({
    accounts: {
      baseAccount: baseAcc.publicKey
    }
  });
  console.log('✔️  Called `add_gif`');

  // Check what changed
  account = await program.account.baseAccount.fetch(baseAcc.publicKey);
  console.log(`👀 GIF Count: ${account.totalGifs.toString()}`);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

runMain();
