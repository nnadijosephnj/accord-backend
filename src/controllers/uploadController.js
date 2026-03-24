const pinata = require('../services/pinataService');
const supabase = require('../services/supabaseService');

exports.uploadFiles = async (req, res) => {
    try {
        const { agreement_id } = req.body;
        const uploadWallet = req.wallet; // available because of authMiddleware

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const uploadedData = [];

        for (const file of req.files) {
            // Convert multer buffer to Web API File (Pinata v2 SDK requires File object)
            const webFile = new File([file.buffer], file.originalname, { type: file.mimetype });
            const response = await pinata.upload.public.file(webFile);
            
            const fileType = file.fieldname === 'preview' ? 'preview' : 'final';
            
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
