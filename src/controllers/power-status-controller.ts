import { MachineService } from '../services/machine-service';
import { sendKeyboardView } from '../views/keyborad-view';
import { sendSetPowerOffDelayView } from '../views/set-power-off-delay-view';
import { sendPowerOnView } from '../views/power-on-view';
import { editPowerStatusView, sendPowerStatusView } from '../views/power-status-view';
import { BotContext } from '../interfaces/bot-context';
import { sendPowerOffView } from '../views/power-off-view';

export class PowerStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: BotContext) {
    const isPowerOn = await this.machine.isPowerOn();
    const upTime = await this.machine.getUpTime();

    await sendKeyboardView(ctx, {
      computerName: this.machine.name,
      keyboard: [
        [{ text: '🏙 開機' }, { text: '🌆 關機' }],
        [{ text: '📊 總覽' }],
      ],
    });
    return sendPowerStatusView(ctx, { isPowerOn, upTime });
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
    let minutes = NaN;
    if (text == '🚨 馬上') {
      minutes = 0;
    } else {
      minutes = Number(text.split('分鐘')[0]);
    }
    if (Number.isNaN(minutes)) {
      return sendPowerOffView(ctx, { success: false, minutes });
    }
    const success = await this.machine.powerOff(minutes);

    return sendPowerOffView(ctx, { success, minutes });
  }
}
