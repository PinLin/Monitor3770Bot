import { config } from 'dotenv';
import { Telegraf } from 'telegraf';
import { PowerStatusController } from './controllers/power-status-controller';
import { UserStatusController } from './controllers/user-status-controller';
import { MachineService } from './services/machine-service';

config();

const IP_ADDRESS = process.env.TARGET_IP_ADDRESS;
const USERNAME = process.env.TARGET_USERNAME;
const PASSWORD = process.env.TARGET_PASSWORD;
const SSH_PORT = process.env.TARGET_SSH_PORT;

const bot = new Telegraf(process.env.BOT_TOKEN);

const machine = new MachineService(IP_ADDRESS, USERNAME, PASSWORD, Number(SSH_PORT));
const powerStatusController = new PowerStatusController(machine);
const userStatusController = new UserStatusController(machine);

bot.command('powerStatus', (ctx) => powerStatusController.main(ctx));
bot.action('refreshPowerStatus', (ctx) => powerStatusController.refresh(ctx));
bot.command('userStatus', (ctx) => userStatusController.main(ctx));
bot.action('refreshUserStatus', (ctx) => userStatusController.refresh(ctx));

bot.catch((err) => {
  console.log("Oops, an error occured: ", err);
});

bot.launch();
console.log("Bot launched successfully!");
