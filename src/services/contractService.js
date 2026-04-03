const ethers = require('ethers');
require('dotenv').config();

// Backend MUST use JsonRpcProvider, not BrowserProvider
// RPC URL should point to testnet/mainnet endpoint
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Contract addresses and ABI
const ACCORD_CONTRACT_ADDRESS = process.env.ACCORD_CONTRACT_ADDRESS;
const USDT_CONTRACT_ADDRESS = process.env.USDT_CONTRACT_ADDRESS;
const USDC_CONTRACT_ADDRESS = process.env.USDC_CONTRACT_ADDRESS;

if (!ACCORD_CONTRACT_ADDRESS || !process.env.RPC_URL) {
    console.warn("WARNING: ACCORD_CONTRACT_ADDRESS or RPC_URL not configured in backend");
}

const contractABI = [
    "function deposit(address token, uint256 amount) external",
    "function withdraw(address token, uint256 amount) external",
    "function getVaultBalance(address user, address token) external view returns (uint256)",
    "function createAgreement(bytes32 id, address freelancer, address token, uint256 amount) external",
    "function createAgreementFromVault(bytes32 id, address freelancer, address token, uint256 amount) external",
    "function deliverWork(bytes32 id, string previewIpfsHash) external",
    "function approveWork(bytes32 id, string cleanIpfsHash) external",
    "function raiseDispute(bytes32 id) external",
    "function resolveDispute(bytes32 id, bool payFreelancer) external",
    "function cancelAgreement(bytes32 id) external",
    "function getAgreement(bytes32 id) external view returns (tuple(bytes32 id, address freelancer, address client, address token, uint256 amount, uint8 status, string previewIpfsHash, string cleanIpfsHash))"
];

// Fallback to zero address to prevent ethers crash if ACCORD_CONTRACT_ADDRESS is empty currently
const contract = new ethers.Contract(ACCORD_CONTRACT_ADDRESS || "0x0000000000000000000000000000000000000000", contractABI, provider);

// Exporting provider/contract and addresses if needed for reading blockchain state
module.exports = { provider, contract, ACCORD_CONTRACT_ADDRESS, USDT_CONTRACT_ADDRESS, USDC_CONTRACT_ADDRESS };
