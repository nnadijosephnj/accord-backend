const ethers = require('ethers');
require('dotenv').config();

// Backend MUST use JsonRpcProvider, not BrowserProvider
// RPC URL should point to QuickNode testnet (avoid public endpoint rate limits)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Contract address and ABI
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!CONTRACT_ADDRESS || !process.env.RPC_URL) {
    console.warn("WARNING: CONTRACT_ADDRESS or RPC_URL not configured in backend");
}

const contractABI = [
    "function getAgreement(uint256 _id) external view returns (tuple(uint256 id, address freelancer, address client, uint256 amount, uint8 maxRevisions, uint8 revisionCount, uint8 status, uint256 cancelRequestedAt))",
    "event AgreementCreated(uint256 indexed id, address indexed freelancer, address indexed client, uint256 amount)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, provider);

// Exporting provider/contract if needed for reading blockchain state
module.exports = { provider, contract };
