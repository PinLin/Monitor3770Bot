import { BotContext } from '../interfaces/bot-context';
import { MachineService } from '../services/machine-service';
import { editUserStatusView, sendUserStatusView } from '../views/user-status-view';

export class UserStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: BotContext) {
    const machineName = this.machine.name;
    const onlineUsers = await this.machine.getOnlineUsers();

    return sendUserStatusView(ctx, { machineName, onlineUsers });
  }

  async refresh(ctx: BotContext) {
    const onlineUsers = await this.machine.getOnlineUsers();

    return editUserStatusView(ctx, { onlineUsers });
  }
}
