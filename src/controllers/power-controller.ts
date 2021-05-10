import { BotContext } from '../models/bot-context';
import { MachineService } from '../services/machine-service';
import { sendCancelPowerOffView } from '../views/power/cancel-power-off-view';
import { sendPowerOffView } from '../views/power/power-off-view';
import { sendPowerOnView } from '../views/power/power-on-view';
import { sendSetPowerOffDelayView } from '../views/power/set-power-off-delay-view';

export class PowerController {
  constructor(
    private machine: MachineService,
  ) { }

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
