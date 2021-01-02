import { config } from 'dotenv';
import { session, Telegraf } from 'telegraf';
import { OverviewController } from './controllers/overview-controller';
import { PowerStatusController } from './controllers/power-status-controller';
import { TestController } from './controllers/test-controller';
import { UserStatusController } from './controllers/user-status-controller';
import { BotContext } from './interfaces/bot-context';
import { MachineService } from './services/machine-service';

config();

const TOKEN = process.env.BOT_TOKEN;
const ALLOW_LIST = process.env.BOT_ALLOW_LIST ?? '';
const NAME = process.env.TARGET_NAME || 'Unnamed';
const IP_ADDRESS = process.env.TARGET_IP_ADDRESS;
const MAC_ADDRESS = process.env.TARGET_MAC_ADDRESS;
const USERNAME = process.env.TARGET_USERNAME;
const PASSWORD = process.env.TARGET_PASSWORD;
const SSH_PORT = process.env.TARGET_SSH_PORT ?? '22';

const bot = new Telegraf<BotContext>(TOKEN);

bot.use(session());

bot.use((ctx, next) => {
  const id = ctx.from.id;
  const allowList = ALLOW_LIST.split(',').map((s) => Number(s));
  if (allowList.includes(id)) {
    next();
  } else {
    const username = ctx.from.username ?? ctx.from.first_name + " " + ctx.from.last_name;
    console.log(`Denied actions by ${username} (${id})`);
    ctx.reply(`🔒 此帳號（ \`${id}\` ）不在允許清單內，沒有權限使用。`, {
      parse_mode: 'Markdown',
      reply_markup: {
        remove_keyboard: true,
      },
    });
  }
});

const machine = new MachineService(NAME, IP_ADDRESS, MAC_ADDRESS, USERNAME, PASSWORD, Number(SSH_PORT));
const testController = new TestController(machine);
const overviewController = new OverviewController(machine);
const powerStatusController = new PowerStatusController(machine);
const userStatusController = new UserStatusController(machine);

bot.action('refreshOverview', (ctx) => overviewController.refresh(ctx));
bot.action('refreshPowerStatus', (ctx) => powerStatusController.refresh(ctx));
bot.action('refreshUserStatus', (ctx) => userStatusController.refresh(ctx));
bot.command('test', (ctx) => testController.main(ctx));
bot.hears('🔙 取消', (ctx) => {
  ctx.session.state = '';
  return overviewController.main(ctx);
});
bot.command('cancel', (ctx) => {
  ctx.session.state = '';
  return overviewController.main(ctx);
});
bot.on('message', (ctx, next) => {
  const { state } = ctx.session;
  if (state == 'setPowerOffDelay') {
    return powerStatusController.powerOff(ctx);
  }
  next();
});
bot.start((ctx) => overviewController.main(ctx));
bot.hears('📊 總覽', (ctx) => overviewController.main(ctx));
bot.command('powerstatus', (ctx) => powerStatusController.main(ctx));
bot.hears('⚡️ 電源', (ctx) => powerStatusController.main(ctx));
bot.command('poweron', (ctx) => powerStatusController.powerOn(ctx));
bot.hears('🏙 開機', (ctx) => powerStatusController.powerOn(ctx));
bot.command('poweroff', (ctx) => powerStatusController.setPowerOffDelay(ctx));
bot.hears('🌆 關機', (ctx) => powerStatusController.setPowerOffDelay(ctx));
bot.command('userstatus', (ctx) => userStatusController.main(ctx));
bot.hears('👤 使用者', (ctx) => userStatusController.main(ctx));

bot.catch((err) => {
  console.log("Oops, an error occured: ", err);
});

bot.launch();
console.log("Bot launched successfully!");
