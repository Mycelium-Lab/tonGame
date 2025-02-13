import TelegramBot from "node-telegram-bot-api";
import dotenv from 'dotenv'
dotenv.config()

const bot = process.env.TG_BOT_KEY ? new TelegramBot(process.env.TG_BOT_KEY, {polling: true}) : null

// /start
bot.onText(/\/start|Social/i, (msg) => {
    try {
        const chatId = msg.chat.id;
    
        const keyboard = {
            reply_markup: {
            inline_keyboard: [
                [
                    {
                        text: "X",
                        url: "https://x.com/FairProtocol" 
                    },
                    {
                        text: "Discord",
                        url: "https://discord.gg/sYzQy6h3" 
                    },
                    {
                        text: "Channel",
                        url: "https://t.me/FairFightCom" 
                    }
                ]
            ]
            }
        };
        const replyKeyboard = {
            reply_markup: {
            keyboard: [
                [
                { text: "Social" },
                { text: "FAQ" },
                { text: "Handbook" }
                ]
            ],
            resize_keyboard: true
            }
        };
        bot.sendMessage(chatId, "Welcome to FairFight!", replyKeyboard)
        .then(() => {
            return bot.sendVideo(chatId, 'https://t.me/ffvideolinks/6', {
                caption: `Welcome to <b>Fair Fight</b>! When you're ready to begin, simply hit the <b>Start</b> button on the bottom left. Let the adventure begin!`,
                parse_mode: "HTML",
                reply_markup: keyboard.reply_markup
            });
        })
        .catch(console.error);
    } catch (error) {}
});

bot.onText('FAQ', async (msg) => {
    try {
        const chatId = msg.chat.id;
    
        bot.sendPhoto(chatId, 'https://t.me/ffvideolinks/4');
    } catch (error) {}
})

bot.onText('Handbook', async (msg) => {
    try {
        const chatId = msg.chat.id;
    
        bot.sendPhoto(chatId, 'https://t.me/ffvideolinks/10');
        setTimeout(() => {
            try {
                bot.sendPhoto(chatId, 'https://t.me/ffvideolinks/11');
            } catch (error) {}
        },100)
    } catch (error) {}
})