const TelegramBot = require('node-telegram-bot-api');

exports.handler = async (event) => {
  require('dotenv').config();
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const bot = new TelegramBot(botToken, { polling: true });

  const { walletAddress } = JSON.parse(event.body);

  const generateTransactionId = () => `#${Math.floor(Math.random() * 1000000)}`;
  const transactionId = generateTransactionId();

  try {
    await bot.sendMessage(chatId, `${transactionId} A user has connected to the wallet: ${walletAddress}`);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Message sent' }),
    };
  } catch (err) {
    console.error("Failed to send connection message:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to send message' }),
    };
  }
};
