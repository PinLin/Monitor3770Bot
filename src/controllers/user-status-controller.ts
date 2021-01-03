import { BotContext } from '../interfaces/bot-context';
import { MachineService } from '../services/machine-service';
import { sendSendMessageView } from '../views/send-message-view';
import { sendSetMessageTextView } from '../views/set-message-text-view';
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

  setMessageText(ctx: BotContext) {
    ctx.session.state = 'setMessageText';

    const username = ctx.message.text.replace('/message_', '');
    ctx.session.sendMessageUser = username;

    return sendSetMessageTextView(ctx, { username });
  }

  async sendMessage(ctx: BotContext) {
    ctx.session.state = '';

    const username = ctx.session.sendMessageUser;
    const messageText = ctx.message.text.split('\n').join(' ');
    const success = await this.machine.sendMessage(username, messageText);

    return sendSendMessageView(ctx, { success });
  }
}
