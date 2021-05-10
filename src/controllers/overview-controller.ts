import { BotContext } from '../interfaces/bot-context';
import { MachineService } from '../services/machine-service';
import { sendCancelPowerOffView } from '../views/power/cancel-power-off-view';
import { editOverviewView, sendOverviewView } from '../views/overview/overview-view';
import { sendPowerOffView } from '../views/power/power-off-view';
import { sendPowerOnView } from '../views/power/power-on-view';
import { sendSetPowerOffDelayView } from '../views/power/set-power-off-delay-view';

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

    return sendOverviewView(ctx, {
      machineName, ipAddress, macAddress, isPowerOn, upTime,
      onlineUserNumber: onlineUsers.length,
    });
  }

  async refreshOverview(ctx: BotContext) {
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
}
