const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    
    if(!token) return res.status(401).json({ error: "No token provided" });
    
    jwt.verify(token, process.env.JWT_SECRET || 'secret123', (err, decoded) => {
        if(err) return res.status(401).json({ error: "Token invalid or expired" });
        req.wallet = decoded.address; // Expose decoded address to route handler
        next();
    });
};
