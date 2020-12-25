import { config } from 'dotenv';
import { Telegraf } from 'telegraf';

config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));

bot.launch();
console.log("Bot launched successfully!")
