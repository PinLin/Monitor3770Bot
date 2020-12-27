import { TelegrafContext } from "telegraf/typings/context";
import { MachineService } from "../services/machine-service";
import { editOverviewView, sendOverviewView } from "../views/overview-view";

export class OverviewController {
  constructor(
    private machineService: MachineService,
  ) { }

  async main(ctx: TelegrafContext) {
    const ipAddress = this.machineService.ipAddress;
    const [isPowerOn, onlineUsers] = await Promise.all([
      this.machineService.isPowerOn(),
      this.machineService.getOnlineUsers(),
    ]);

    return sendOverviewView(ctx, {
      ip: ipAddress, isPowerOn,
      onlineUserNumber: onlineUsers.length,
    });
  }

  async refresh(ctx: TelegrafContext) {
    const ipAddress = this.machineService.ipAddress;
    const [isPowerOn, onlineUsers] = await Promise.all([
      this.machineService.isPowerOn(),
      this.machineService.getOnlineUsers(),
    ]);

    return editOverviewView(ctx, {
      ip: ipAddress, isPowerOn,
      onlineUserNumber: onlineUsers.length,
    });
  }
}
