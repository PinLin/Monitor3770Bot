import { TelegrafContext } from 'telegraf/typings/context';
import { MachineService } from '../services/machine-service';
import { sendKeyboardView } from '../views/keyborad-view';
import { editPowerStatusView, sendPowerStatusView } from '../views/power-status-view';

export class PowerStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: TelegrafContext) {
    await sendKeyboardView(ctx, {
      computerName: this.machine.name,
      keyboard: [
        [{ text: '📊 總覽' }],
      ],
    });

    const isPowerOn = await this.machine.isPowerOn();
    const upTime = await this.machine.getUpTime();

    return sendPowerStatusView(ctx, { isPowerOn, upTime });
  }

  async refresh(ctx: TelegrafContext) {
    const isPowerOn = await this.machine.isPowerOn();
    const upTime = await this.machine.getUpTime();

    return editPowerStatusView(ctx, { isPowerOn, upTime });
  }
}
