import { TelegrafContext } from 'telegraf/typings/context';
import { MachineService } from '../services/machine-service';
import { sendKeyboardView } from '../views/keyborad-view';
import { editUserStatusView, sendUserStatusView } from '../views/user-status-view';

export class UserStatusController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: TelegrafContext) {
    const onlineUsers = await this.machine.getOnlineUsers();

    await sendKeyboardView(ctx, {
      computerName: this.machine.name,
      keyboard: [
        [{ text: '📊 總覽' }],
      ],
    });
    return sendUserStatusView(ctx, { onlineUsers });
  }

  async refresh(ctx: TelegrafContext) {
    const onlineUsers = await this.machine.getOnlineUsers();

    return editUserStatusView(ctx, { onlineUsers });
  }
}
