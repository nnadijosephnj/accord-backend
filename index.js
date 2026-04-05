const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./src/routes/auth');
const agreementRoutes = require('./src/routes/agreements');
const uploadRoutes = require('./src/routes/upload');
const messageRoutes = require('./src/routes/messages');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/agreements', agreementRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/messages', messageRoutes);

app.get('/', (req, res) => res.json({ status: "Accord Backend Live", time: new Date() }));
app.get('/health', (req, res) => res.status(200).send('OK'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Accord backend running on port ${PORT}`);
});
