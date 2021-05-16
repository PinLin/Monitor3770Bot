import { BotContext } from '../models/bot-context';
import { MachineService } from '../services/machine-service';
import { getCancelPowerOffView } from '../views/power/cancel-power-off-view';
import { getPowerOffView } from '../views/power/power-off-view';
import { getPowerOnView } from '../views/power/power-on-view';
import { getSetPowerOffDelayView } from '../views/power/set-power-off-delay-view';

export class PowerController {
  constructor(
    private machine: MachineService,
  ) { }

  async powerOn(ctx: BotContext) {
    const success = await this.machine.powerOn();

    const powerOnView = getPowerOnView({ success });

    return ctx.reply(powerOnView.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: powerOnView.keyboard,
      },
    });
  }

  async setPowerOffDelay(ctx: BotContext) {
    ctx.session.state = 'setPowerOffDelay';

    const setPowerOffDelayView = getSetPowerOffDelayView();

    return ctx.reply(setPowerOffDelayView.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: setPowerOffDelayView.keyboard,
      },
    });
  }

  async powerOff(ctx: BotContext) {
    ctx.session.state = '';

    const { text } = ctx.message;
    if (text == '🔄 重設') {
      const success = await this.machine.cancelPowerOff();

      const cancelPowerOffView = getCancelPowerOffView({ success });

      return ctx.reply(cancelPowerOffView.text, {
        reply_markup: {
          resize_keyboard: true,
          keyboard: cancelPowerOffView.keyboard,
        },
      });
    }
    let minutes = NaN;
    if (text == '🚨 馬上') {
      minutes = 0;
    } else {
      minutes = Number(text.split('分鐘')[0]);
    }
    let success = false;
    if (Number.isNaN(minutes)) {
      success = false;
    } else {
      success = await this.machine.powerOff(minutes);
    }

    const powerOffView = getPowerOffView({ success, minutes });

    return ctx.reply(powerOffView.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: powerOffView.keyboard,
      },
    });
  }
}
