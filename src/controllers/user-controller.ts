import { SessionState } from '../enums/session-state';
import { BotContext } from '../models/bot-context';
import { MachineService } from '../services/machine-service';
import { getMachineNameView } from '../views/machine-name-view';
import { getSendMessageView } from '../views/user/send-message-view';
import { getSetMessageTextView } from '../views/user/set-message-text-view';
import { getUserStatusView } from '../views/user/user-status-view';

export class UserController {
  constructor(
    private machine: MachineService,
  ) { }

  async showUserStatus(ctx: BotContext) {
    const machineName = this.machine.name;
    const onlineUsers = await this.machine.getOnlineUsers();

    const machineNameView = getMachineNameView({ machineName });
    const userStatusView = getUserStatusView({ onlineUsers });

    await ctx.reply(machineNameView.text, {
      parse_mode: 'Markdown',
      reply_markup: {
        resize_keyboard: true,
        keyboard: userStatusView.keyboard,
      },
    });
    return ctx.reply(userStatusView.text, {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: userStatusView.inlineKeyboard,
      },
    });
  }

  async refreshUserStatus(ctx: BotContext) {
    const onlineUsers = await this.machine.getOnlineUsers();

    const userStatusView = getUserStatusView({ onlineUsers });

    try {
      return await ctx.editMessageText(userStatusView.text, {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: userStatusView.inlineKeyboard,
        },
      });
    } catch (e) {
    } finally {
      ctx.answerCbQuery("重新整理完畢");
    }
  }

  setMessageText(ctx: BotContext) {
    ctx.session.state = SessionState.SetMessageText;

    const username = ctx.message.text.replace('/message_', '');
    ctx.session.sendMessageUser = username;

    const setMessageTextView = getSetMessageTextView({ username });

    return ctx.replyWithMarkdown(setMessageTextView.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: setMessageTextView.keyboard,
      },
    });
  }

  async sendMessage(ctx: BotContext) {
    ctx.session.state = SessionState.None;

    const username = ctx.session.sendMessageUser;
    const messageText = ctx.message.text.split('\n').join(' ');
    const success = await this.machine.sendMessage(username, messageText);

    const sendMessageView = getSendMessageView({ success });

    return ctx.reply(sendMessageView.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: sendMessageView.keyboard,
      },
    });
  }
}
