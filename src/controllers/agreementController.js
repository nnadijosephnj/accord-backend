const supabase = require('../services/supabaseService');

exports.createAgreement = async (req, res) => {
    try {
        const {
            title,
            description,
            amount_usdt,
            amount,
            token_address,
            max_revisions,
            deadline,
            client_wallet,
            freelancer_wallet,
            contract_agreement_id
        } = req.body;
        
        // Support legacy frontend structure and new multi-token structure
        const finalAmount = amount || amount_usdt;
        const finalTokenAddress = token_address || process.env.USDT_CONTRACT_ADDRESS;
        const normalizedClientWallet = client_wallet?.toLowerCase();
        const normalizedFreelancerWallet = freelancer_wallet?.toLowerCase() || req.wallet?.toLowerCase();
        const requesterWallet = req.wallet?.toLowerCase();

        if (!normalizedClientWallet || !normalizedFreelancerWallet) {
            return res.status(400).json({ error: "Client and freelancer wallet addresses are required" });
        }

        if (requesterWallet !== normalizedClientWallet && requesterWallet !== normalizedFreelancerWallet) {
            return res.status(403).json({ error: "Authenticated wallet must be a participant in the agreement" });
        }

        const { data, error } = await supabase.from('agreements').insert([{
            title,
            description,
            freelancer_wallet: normalizedFreelancerWallet,
            client_wallet: normalizedClientWallet,
            amount_usdt: finalAmount, token_address: finalTokenAddress, max_revisions, revision_count: 0, status: 'PENDING',
            contract_agreement_id,
            deadline: deadline ? new Date(deadline) : null
        }]).select();
        
        if (error) throw error;
        res.json(data[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getAgreement = async (req, res) => {
    try {
        const { data, error } = await supabase.from('agreements')
            .select('*, files(*)')
            .eq('id', req.params.id).single();
        if (error) throw error;
        
        // Security: Filter out final IPFS hashes until completed
        if (data.status !== 'COMPLETED' && data.files) {
            data.files = data.files.map(f => {
                if (f.file_type === 'final') {
                    return { ...f, ipfs_hash: 'HIDDEN_UNTIL_COMPLETED' };
                }
                return f;
            });
        }
        
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getAgreementsByWallet = async (req, res) => {
    try {
        const wallet = req.wallet.toLowerCase();
        if (!wallet) return res.status(401).json({ error: "Unauthorized" });
        
        const { data, error } = await supabase.from('agreements')
            .select('*')
            .or(`freelancer_wallet.eq.${wallet},client_wallet.eq.${wallet}`)
            .order('created_at', { ascending: false });
            
        if (error) throw error;
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const wallet = req.wallet.toLowerCase();
        
        // 1. Fetch current agreement to check permissions
        const { data: agreement, error: fetchError } = await supabase
            .from('agreements')
            .select('*')
            .eq('id', req.params.id)
            .single();
            
        if (fetchError || !agreement) return res.status(404).json({ error: "Agreement not found" });

        // 2. Simple Authorization: User must be a participant
        const isClient = agreement.client_wallet.toLowerCase() === wallet;
        const isFreelancer = agreement.freelancer_wallet.toLowerCase() === wallet;

        if (!isClient && !isFreelancer) {
            return res.status(403).json({ error: "Not authorized to update this agreement" });
        }

        // 3. Status Transition Rules (Loose but helpful)
        // Only internal backend logic/contract events should ideally set these,
        // but for this MVP we'll just ensure the caller is relevant.
        
        const { data, error } = await supabase.from('agreements')
            .update({ status })
            .eq('id', req.params.id)
            .select();
            
        if (error) throw error;
        res.json(data[0]);
    } catch(e) {
        res.status(500).json({ error: e.message });
    }
}
