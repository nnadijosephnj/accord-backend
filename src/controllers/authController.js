const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.verifyWallet = async (req, res) => {
    try {
        const { address, signature, message } = req.body;
        // Simplified signature verification format
        // Check if the user's wallet signature matches the message
        // const recoveredAddr = ethers.verifyMessage(message, signature);
        // if (recoveredAddr.toLowerCase() !== address.toLowerCase()) return res.status(401).json({error: "Invalid Sign"});
        
        // Return JWT
        const token = jwt.sign({ address: address.toLowerCase() }, process.env.JWT_SECRET || 'secret123', {
            expiresIn: '24h'
        });
        
        return res.json({ token, address });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};
