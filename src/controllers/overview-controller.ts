import { TelegrafContext } from "telegraf/typings/context";
import { MachineService } from "../services/machine-service";
import { sendKeyboardView } from "../views/keyborad-view";
import { editOverviewView, sendOverviewView } from "../views/overview-view";

export class OverviewController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: TelegrafContext) {
    const { ipAddress, macAddress } = this.machine;
    const [isPowerOn, onlineUsers] = await Promise.all([
      this.machine.isPowerOn(),
      this.machine.getOnlineUsers(),
    ]);

    await sendKeyboardView(ctx, {
      computerName: this.machine.name,
      keyboard: [
        [{ text: '⚡️ 電源' }, { text: '👤 使用者' }],
      ],
    });
    return sendOverviewView(ctx, {
      ipAddress, macAddress, isPowerOn,
      onlineUserNumber: onlineUsers.length,
    });
  }

  async refresh(ctx: TelegrafContext) {
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
