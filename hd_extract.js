// Extended private key >> HD Wallets extractor
// please use at your own risk. I have written this for a custom BIP44 path for my use, 
// you may want to check your coin path to get ths working. "1" is for testnet coins only. 
// Also, paths are non-hardened, so you may want to change that too.
// For coin types please refer to SLIP-0044 : Registered coin types for BIP-0044

// Update per pr by D.H.


// recover_addresses.js
const { HDNodeWallet } = require("ethers/wallet");
const fs = require("fs");

// specify the number of address indexes to extract (0 through totalClients -1)
// Pass this via command line; default is 5
const defaultWalletCount = 5
const totalHDwallets = process.argv[2] ? process.argv[2] : defaultWalletCount
console.log(`Creating this many private/public keys: ${totalHDwallets}`)

// FB xprv here
const xprv = "add your extended private key here";

// Output filenames for segeration of public vs priv material
const privFile = "recovery_private.csv";
const pubFile  = "recovery_public.csv";

// headers
const privHeader = "ClientIndex,Path,PrivateKey\n";
const pubHeader  = "ClientIndex,Path,Address\n";

async function recoverHDWallets(total) {
try{
xprv = await fs.readFileSync('./privateKey/privateKey.pem', 'utf8').trim();
}catch(err){
console.log(err)
console.log("Issue reading the private key are you sure it is in the right format");
return
}
const masterNode = HDNodeWallet.fromExtendedKey(xprv);

let privCsv = privHeader;
let pubCsv = pubHeader;

for (let i = 0; i < total; i++) {
//Sep ETH: const path = `m/44/1/${i}/0/0`;
const path = `m/44/60/${i}/0/0`;
const node = masterNode.derivePath(path);

// crete each each line
privCsv += `${i},${path},${node.privateKey}\n`;
pubCsv += `${i},${path},${node.address}\n`;
}

// write to files
fs.writeFileSync(privFile, privCsv);
fs.writeFileSync(pubFile, pubCsv);

console.log(`✅ recovery_private.csv (path + private keys)`);
console.log(`✅ recovery_public.csv (path + addresses)`);
}

recoverHDWallets(totalHDwallets);
