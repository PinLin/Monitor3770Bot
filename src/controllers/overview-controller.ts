import { BotContext } from '../interfaces/bot-context';
import { MachineService } from '../services/machine-service';
import { sendCancelPowerOffView } from '../views/cancel-power-off-view';
import { editOverviewView, sendOverviewView } from '../views/overview-view';
import { sendPowerOffView } from '../views/power-off-view';
import { sendPowerOnView } from '../views/power-on-view';
import { sendSetPowerOffDelayView } from '../views/set-power-off-delay-view';

export class OverviewController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: BotContext) {
    const { name: machineName, ipAddress, macAddress } = this.machine;
    const [isPowerOn, upTime, onlineUsers] = await Promise.all([
      this.machine.isPowerOn(),
      this.machine.getUpTime(),
      this.machine.getOnlineUsers(),
    ]);

    return sendOverviewView(ctx, {
      machineName, ipAddress, macAddress, isPowerOn, upTime,
      onlineUserNumber: onlineUsers.length,
    });
  }

  async refresh(ctx: BotContext) {
    const { ipAddress, macAddress } = this.machine;
    const [isPowerOn, upTime, onlineUsers] = await Promise.all([
      this.machine.isPowerOn(),
      this.machine.getUpTime(),
      this.machine.getOnlineUsers(),
    ]);

    return editOverviewView(ctx, {
      ipAddress, macAddress, isPowerOn, upTime,
      onlineUserNumber: onlineUsers.length,
    });
  }

  async powerOn(ctx: BotContext) {
    const success = await this.machine.powerOn();

    return sendPowerOnView(ctx, { success });
  }

  async setPowerOffDelay(ctx: BotContext) {
    ctx.session.state = 'setPowerOffDelay';

    return sendSetPowerOffDelayView(ctx);
  }

  async powerOff(ctx: BotContext) {
    ctx.session.state = '';

    const { text } = ctx.message;
    if (text == '🔄 重設') {
      const success = await this.machine.cancelPowerOff();

      return sendCancelPowerOffView(ctx, { success });
    }
    let minutes = NaN;
    if (text == '🚨 馬上') {
      minutes = 0;
    } else {
      minutes = Number(text.split('分鐘')[0]);
    }
    if (Number.isNaN(minutes)) {
      return sendPowerOffView(ctx, { success: false });
    }
    const success = await this.machine.powerOff(minutes);

    return sendPowerOffView(ctx, { success, minutes });
  }
}
