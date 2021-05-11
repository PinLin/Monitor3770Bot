import { config } from 'dotenv';
import { session, Telegraf } from 'telegraf';
import { OverviewController } from './controllers/overview-controller';
import { PowerController } from './controllers/power-controller';
import { CommandController } from './controllers/command-controller';
import { UserController } from './controllers/user-controller';
import { BotContext } from './models/bot-context';
import { MachineService } from './services/machine-service';
import { sendNoPermissionView } from './views/no-permission-view';

config();

const TOKEN = process.env.BOT_TOKEN;
const ALLOW_LIST = process.env.BOT_ALLOW_LIST ?? '';
const NAME = process.env.TARGET_NAME || 'Unnamed';
const IP_ADDRESS = process.env.TARGET_IP_ADDRESS;
const MAC_ADDRESS = process.env.TARGET_MAC_ADDRESS;

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
    sendNoPermissionView(ctx, { id });
  }
});

const machine = new MachineService(NAME, IP_ADDRESS, MAC_ADDRESS);
const overviewController = new OverviewController(machine);
const commandController = new CommandController(machine);
const powerController = new PowerController(machine);
const userController = new UserController(machine);

bot.action('refreshOverview', (ctx) => overviewController.refreshOverview(ctx));
bot.action('refreshUserStatus', (ctx) => userController.refreshUserStatus(ctx));
bot.hears('🔙 取消', (ctx) => {
  ctx.session.state = '';
  return overviewController.showOverview(ctx);
});
bot.command('cancel', (ctx) => {
  ctx.session.state = '';
  return overviewController.showOverview(ctx);
});
bot.on('message', (ctx, next) => {
  const { state } = ctx.session;
  if (state == 'setPowerOffDelay') {
    return powerController.powerOff(ctx);
  }
  if (state == 'setMessageText') {
    return userController.sendMessage(ctx);
  }
  if (state == 'startInputCommand') {
    return commandController.showExecutionResult(ctx);
  }
  next();
});
bot.start((ctx) => overviewController.showOverview(ctx));
bot.hears('📊 總覽', (ctx) => overviewController.showOverview(ctx));
bot.command('poweron', (ctx) => powerController.powerOn(ctx));
bot.hears('🖥️ 命令', (ctx) => commandController.startInputCommand(ctx));
bot.command('command', (ctx) => commandController.startInputCommand(ctx));
bot.hears('🏙 開機', (ctx) => powerController.powerOn(ctx));
bot.command('poweroff', (ctx) => powerController.setPowerOffDelay(ctx));
bot.hears('🌆 關機', (ctx) => powerController.setPowerOffDelay(ctx));
bot.command('user', (ctx) => userController.showUserStatus(ctx));
bot.hears('👤 使用者', (ctx) => userController.showUserStatus(ctx));
bot.hears(/^\/message_/, (ctx) => userController.setMessageText(ctx));

bot.catch((err) => {
  console.log("Oops, an error occured: ", err);
});

bot.launch();
console.log("Bot launched successfully!\n");
