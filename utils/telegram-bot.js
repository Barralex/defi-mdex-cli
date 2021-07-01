process.env.NTBA_FIX_319 = 1;

const { token, chatId } = require("../config").telegramConfig;

const TelegramBot = require("node-telegram-bot-api");

const bot = new TelegramBot(token, { polling: false });

const telegrambot = async (message, body) => {
  try {
    await bot.sendMessage(chatId, message + body, {
      parse_mode: "html",
    });
  } catch (err) {
    console.log(
      "Something went wrong when trying to send a Telegram notification",
      err
    );
  }
};

const ACTIONS = {
  DEPOSIT: "⬆️ New MDX Deposit",
  WITHDRAW: "⬇️ New MDX Withdraw",
  ERROR: "🚨 Execution Error",
};

module.exports = {
  telegrambot,
  ACTIONS,
};
