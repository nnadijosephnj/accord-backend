const supabase = require('../services/supabaseService');

/**
 * Validates if a wallet is a participant in an agreement and the agreement status allows messaging.
 */
const validateParticipant = async (agreementId, wallet) => {
    const { data: agreement, error } = await supabase
        .from('agreements')
        .select('client_wallet, freelancer_wallet, status')
        .eq('id', agreementId)
        .single();

    if (error || !agreement) return { error: "Agreement not found", valid: false };

    const isParticipant = agreement.client_wallet.toLowerCase() === wallet.toLowerCase() || 
                          agreement.freelancer_wallet.toLowerCase() === wallet.toLowerCase();
    
    if (!isParticipant) return { error: "You are not a participant in this agreement", valid: false };

    // Allowed statuses for messaging: FUNDED, SUBMITTED, REVISION, COMPLETED
    const allowedStatuses = ['FUNDED', 'SUBMITTED', 'REVISION', 'COMPLETED'];
    if (!allowedStatuses.includes(agreement.status.toUpperCase())) {
        return { error: `Messaging is not available while agreement is ${agreement.status}`, valid: false };
    }

    return { valid: true, agreement };
};

exports.getMessages = async (req, res) => {
    try {
        const { id: agreementId } = req.params;
        const wallet = req.wallet;

        const validation = await validateParticipant(agreementId, wallet);
        if (!validation.valid) {
            return res.status(403).json({ error: validation.error });
        }

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('agreement_id', agreementId)
            .order('created_at', { ascending: true });

        if (error) throw error;
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};

exports.postMessage = async (req, res) => {
    try {
        const { agreement_id, content } = req.body;
        const wallet = req.wallet;

        if (!content || !agreement_id) {
            return res.status(400).json({ error: "Agreement ID and content are required" });
        }

        const validation = await validateParticipant(agreement_id, wallet);
        if (!validation.valid) {
            return res.status(403).json({ error: validation.error });
        }

        const { data, error } = await supabase.from('messages').insert([{
            agreement_id,
            sender: wallet.toLowerCase(),
            content
        }]).select();

        if (error) throw error;
        res.json(data[0]);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
};
