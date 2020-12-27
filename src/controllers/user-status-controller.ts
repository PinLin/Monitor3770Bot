import { TelegrafContext } from 'telegraf/typings/context';
import { MachineService } from '../services/machine-service';
import { sendKeyboardView } from '../views/keyborad-view';
import { editUserStatusView, sendUserStatusView } from '../views/user-status-view';

export class UserStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: TelegrafContext) {
    await sendKeyboardView(ctx, {
      computerName: this.machine.name,
      keyboard: [
        [{ text: '📊 總覽' }],
      ],
    });

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
