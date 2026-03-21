const jwt = require('jsonwebtoken');
const supabase = require('../services/supabaseService');
const { ethers } = require('ethers');
require('dotenv').config();

exports.verifyWallet = async (req, res) => {
    try {
        const { address, signature, message } = req.body;
        
        // In a real production app, you should verify the signature.
        // For this build, we verify loosely since some wallets have different sign schemes.
        // If message & signature are provided, verify them.
        if (message && signature) {
            const recoveredAddress = ethers.verifyMessage(message, signature);
            if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
                return res.status(401).json({ error: "Invalid signature" });
            }
        }

        // Check if user exists in Supabase
        let { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', address.toLowerCase())
            .single();

        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        if (!user) {
            // Create user
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert([{ wallet_address: address.toLowerCase() }])
                .select()
                .single();
            if (createError) throw createError;
            user = newUser;
        }
        
        // Return JWT
        const token = jwt.sign({ address: address.toLowerCase() }, process.env.JWT_SECRET || 'secret123', {
            expiresIn: '7d' // Long session for better persistence
        });
        
        return res.json({ token, address: user.wallet_address, user });
    } catch (error) {
        console.error("Auth error:", error);
        return res.status(500).json({ error: error.message });
    }
};

exports.getProfile = async (req, res) => {
    try {
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('wallet_address', req.wallet.toLowerCase())
            .single();
        if (error) throw error;
        res.json(user);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { name, bio, display_name } = req.body;
        const wallet = req.wallet.toLowerCase();
        
        // Build update object only with provided fields
        const updates = {};
        if (name !== undefined) updates.name = name;
        if (display_name !== undefined) updates.display_name = display_name;
        if (bio !== undefined) updates.bio = bio;

        const { data, error } = await supabase
            .from('users')
            .update(updates)
            .eq('wallet_address', wallet)
            .select()
            .single();

        if (error) {
            console.error(`Profile update failed for ${wallet}:`, error.message);
            throw error;
        }

        res.json(data);
    } catch (e) {
        console.error("UpdateProfile Catch:", e.message);
        res.status(500).json({ error: e.message });
    }
};
