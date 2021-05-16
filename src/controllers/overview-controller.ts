import { BotContext } from '../models/bot-context';
import { MachineService } from '../services/machine-service';
import { getMachineNameView } from '../views/machine-name-view';
import { getOverviewView } from '../views/overview/overview-view';

export class OverviewController {
  constructor(
    private machine: MachineService,
  ) { }

  async showOverview(ctx: BotContext) {
    const { name: machineName, ipAddress, macAddress } = this.machine;
    const [isPowerOn, upTime, onlineUsers] = await Promise.all([
      this.machine.isPowerOn(),
      this.machine.getUpTime(),
      this.machine.getOnlineUsers(),
    ]);

    const machineNameView = getMachineNameView({ machineName });
    const overviewView = getOverviewView({
      ipAddress, macAddress, isPowerOn, upTime,
      onlineUserNumber: onlineUsers.length,
    });

    ctx.reply(machineNameView.text, {
      parse_mode: 'Markdown',
      reply_markup: {
        resize_keyboard: true,
        keyboard: overviewView.keyboard,
      },
    });
    return ctx.reply(overviewView.text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: overviewView.inlineKeyboard,
      },
    });
  }

  async refreshOverview(ctx: BotContext) {
    const { ipAddress, macAddress } = this.machine;
    const [isPowerOn, upTime, onlineUsers] = await Promise.all([
      this.machine.isPowerOn(),
      this.machine.getUpTime(),
      this.machine.getOnlineUsers(),
    ]);

    const overviewView = getOverviewView({
      ipAddress, macAddress, isPowerOn, upTime,
      onlineUserNumber: onlineUsers.length,
    });

    try {
      return await ctx.editMessageText(overviewView.text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: overviewView.inlineKeyboard,
        },
      });
    } catch (e) {
    } finally {
      ctx.answerCbQuery("重新整理完畢");
    }
  }
}
