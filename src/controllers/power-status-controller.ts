import { MachineService } from '../services/machine-service';
import { sendSetPowerOffDelayView } from '../views/set-power-off-delay-view';
import { sendPowerOnView } from '../views/power-on-view';
import { editPowerStatusView, sendPowerStatusView } from '../views/power-status-view';
import { BotContext } from '../interfaces/bot-context';
import { sendPowerOffView } from '../views/power-off-view';
import { sendCancelPowerOffView } from '../views/cancel-power-off-view';

export class PowerStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: BotContext) {
    const machineName = this.machine.name;
    const isPowerOn = await this.machine.isPowerOn();
    const upTime = await this.machine.getUpTime();

    return sendPowerStatusView(ctx, { machineName, isPowerOn, upTime });
  }

  async refresh(ctx: BotContext) {
    const isPowerOn = await this.machine.isPowerOn();
    const upTime = await this.machine.getUpTime();

    return editPowerStatusView(ctx, { isPowerOn, upTime });
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
