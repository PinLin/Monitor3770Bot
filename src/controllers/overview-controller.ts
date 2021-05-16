import { BotContext } from '../models/bot-context';
import { MachineService } from '../services/machine-service';
import { editOverviewView, sendOverviewView } from '../views/overview/overview-view';

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
