const supabase = require('../services/supabaseService');

exports.createAgreement = async (req, res) => {
    try {
        const { title, description, amount_usdt, max_revisions, deadline, client_wallet, contract_agreement_id } = req.body;
        
        const { data, error } = await supabase.from('agreements').insert([{
            title, description, freelancer_wallet: req.wallet, client_wallet: client_wallet.toLowerCase(),
            amount_usdt, max_revisions, revision_count: 0, status: 'PENDING',
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
        
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.getAgreementsByWallet = async (req, res) => {
    try {
        const wallet = req.params.addr.toLowerCase();
        
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
        const { status } = req.body; // Status: FUNDED, SUBMITTED, REVISION, COMPLETED, CANCELLED
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
