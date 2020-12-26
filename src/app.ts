import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { ping } from './utils/ping';
import { ssh } from './utils/ssh';

config();

const IP_ADDRESS = process.env.TARGET_IP_ADDRESS;
const USERNAME = process.env.TARGET_USERNAME;
const PASSWORD = process.env.TARGET_PASSWORD;
const SSH_PORT = process.env.TARGET_SSH_PORT;

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome'));
bot.hears('/ping', async (ctx) => ctx.reply(`Alive: ${await ping(IP_ADDRESS)}`));
bot.hears('/hi', async (ctx) => {
  const { stdout } = await ssh({
    host: IP_ADDRESS,
    port: Number(SSH_PORT),
    username: USERNAME,
    password: PASSWORD,
  }, 'echo hi');
  return ctx.reply(`STDOUT: ${stdout}`);
});

bot.catch((err) => {
  console.log("Oops, an error occured: ", err);
});

bot.launch();
console.log("Bot launched successfully!");
