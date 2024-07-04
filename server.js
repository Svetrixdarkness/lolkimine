require('dotenv').config();

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;
const bot = new TelegramBot(botToken, { polling: true });

function generateTransactionId() {
    return `#${Math.floor(Math.random() * 1000000)}`;
}

app.post('/connectWallet', (req, res) => {
    const { walletAddress } = req.body;
    const transactionId = generateTransactionId();
    bot.sendMessage(chatId, `${transactionId} A user has connected to the wallet: ${walletAddress}`)
        .catch(err => console.error("Failed to send connection message:", err));
    res.sendStatus(200);
});

app.post('/transactionApproved', (req, res) => {
    const { walletAddress, txHash, amount } = req.body;
    const transactionId = generateTransactionId();
    bot.sendMessage(chatId, `${transactionId} Transaction approved from wallet: ${walletAddress}. TxHash: ${txHash}, Amount: ${amount}`)
        .catch(err => console.error("Failed to send approved transaction message:", err));
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
