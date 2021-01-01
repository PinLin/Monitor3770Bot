import { TelegrafContext } from 'telegraf/typings/context';
import { MachineService } from '../services/machine-service';
import { sendKeyboardView } from '../views/keyborad-view';
import { sendPowerOffView } from '../views/power-off-view';
import { sendPowerOnView } from '../views/power-on-view';
import { editPowerStatusView, sendPowerStatusView } from '../views/power-status-view';

export class PowerStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: TelegrafContext) {
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

  async refresh(ctx: TelegrafContext) {
    const isPowerOn = await this.machine.isPowerOn();
    const upTime = await this.machine.getUpTime();

    return editPowerStatusView(ctx, { isPowerOn, upTime });
  }

  async powerOn(ctx: TelegrafContext) {
    const success = await this.machine.powerOn();

    return sendPowerOnView(ctx, { success });
  }

  async powerOff(ctx: TelegrafContext) {
    return sendPowerOffView(ctx);
  }
}
