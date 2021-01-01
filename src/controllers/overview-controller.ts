import { BotContext } from '../interfaces/bot-context';
import { MachineService } from '../services/machine-service';
import { editOverviewView, sendOverviewView } from '../views/overview-view';

export class OverviewController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: BotContext) {
    const { name: machineName, ipAddress, macAddress } = this.machine;
    const [isPowerOn, onlineUsers] = await Promise.all([
      this.machine.isPowerOn(),
      this.machine.getOnlineUsers(),
    ]);

    return sendOverviewView(ctx, {
      machineName, ipAddress, macAddress, isPowerOn,
      onlineUserNumber: onlineUsers.length,
    });
  }

  async refresh(ctx: BotContext) {
    const { ipAddress, macAddress } = this.machine;
    const [isPowerOn, onlineUsers] = await Promise.all([
      this.machine.isPowerOn(),
      this.machine.getOnlineUsers(),
    ]);

    return editOverviewView(ctx, {
      ipAddress, macAddress, isPowerOn,
      onlineUserNumber: onlineUsers.length,
    });
  }
}
