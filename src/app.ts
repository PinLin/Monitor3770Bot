import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { ping } from './utils/ping';

config();

const IP_ADDRESS = process.env.TARGET_IP_ADDRESS;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));
bot.hears('/ping', async (ctx) => ctx.reply(`Alive: ${await ping(IP_ADDRESS)}`));

bot.launch();
console.log("Bot launched successfully!")
