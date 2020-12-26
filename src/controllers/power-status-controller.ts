import { TelegrafContext } from 'telegraf/typings/context';
import { MachineService } from '../services/machine-service';

export class PowerStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: TelegrafContext) {
    return ctx.reply(`Alive: ${await this.machine.isPowerOn()}`);
  }
}
