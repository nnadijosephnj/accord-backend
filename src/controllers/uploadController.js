const pinata = require('../services/pinataService');
const supabase = require('../services/supabaseService');
const { Readable } = require('stream');

exports.uploadFiles = async (req, res) => {
    try {
        const { agreement_id } = req.body;
        const uploadWallet = req.wallet; // available because of authMiddleware

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No files uploaded" });
        }

        const uploadedData = [];

        for (const file of req.files) {
            // Buffer to stream
            const stream = Readable.from(file.buffer);
            stream.path = file.originalname; 

            // Upload directly to IPFS
            const response = await pinata.upload.stream(stream);
            
            // Assume first file is preview, second is final (in a real app, do better logic)
            // Or expect frontend to specify the type
            const fileType = file.fieldname === 'preview' ? 'preview' : 'final';
            
            // Save metadata to supabase
            const { data, error } = await supabase.from('files').insert([{
                agreement_id,
                file_type: fileType,
                ipfs_hash: response.IpfsHash,
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
