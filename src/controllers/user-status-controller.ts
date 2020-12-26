import { TelegrafContext } from 'telegraf/typings/context';
import { MachineService } from '../services/machine-service';
import { editUserStatusView, sendUserStatusView } from '../views/user-status-view';

export class UserStatusController {
  constructor(
    private machine: MachineService,
  ) {}

  async main(ctx: TelegrafContext) {
    return sendUserStatusView(ctx, {
      onlineUsers: await this.machine.getOnlineUsers(),
    });
  }

  async refresh(ctx: TelegrafContext) {
    return editUserStatusView(ctx, {
      onlineUsers: await this.machine.getOnlineUsers(),
    });
  }
}
