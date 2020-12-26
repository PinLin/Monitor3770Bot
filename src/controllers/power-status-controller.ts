import { TelegrafContext } from 'telegraf/typings/context';
import { MachineService } from '../services/machine-service';

export class PowerStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: TelegrafContext) {
    const isPowerOn = await this.machine.isPowerOn();
    const upTime = await this.machine.getUpTime();

    return ctx.reply("⚡️ 電源狀態\n" +
      "\n" +
      `電源狀態：${isPowerOn ? "已開機 ☀️" : "已關機 🌙"}\n` +
      `運作時間：${upTime.days} 天 ${upTime.hours} 時 ${upTime.minutes} 分 ${upTime.seconds} 秒\n`);
  }
}
