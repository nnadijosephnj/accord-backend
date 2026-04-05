const pinata = require('../services/pinataService');
const supabase = require('../services/supabaseService');

exports.uploadFiles = async (req, res) => {
    try {
        const { agreement_id } = req.body;
        const uploadWallet = req.wallet?.toLowerCase();

        // Check if agreement exists and user is the freelancer
        const { data: agreement, error: fetchError } = await supabase
            .from('agreements')
            .select('*')
            .eq('id', agreement_id)
            .single();

        if (fetchError || !agreement) return res.status(404).json({ error: "Agreement not found" });
        
        if (agreement.freelancer_wallet.toLowerCase() !== uploadWallet) {
            return res.status(403).json({ error: "Only the freelancer can upload files to this agreement" });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const uploadedData = [];

        for (const file of req.files) {
            // Convert multer buffer to Web API File (Pinata v2 SDK requires File object)
            const webFile = new File([file.buffer], file.originalname, { type: file.mimetype });
            const response = await pinata.upload.public.file(webFile);
            
            const fileType = req.body.file_type || (file.fieldname === 'preview' ? 'preview' : 'final');
            
            // Save metadata to supabase
            const { data, error } = await supabase.from('files').insert([{
                agreement_id,
                file_type: fileType,
                ipfs_hash: response.cid,
                file_name: file.originalname,
                mime_type: file.mimetype,
                uploaded_by: uploadWallet
            }]).select();
            
            if (error) throw error;
            uploadedData.push(data[0]);
        }

        res.json(uploadedData);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: e.message });
    }
};
