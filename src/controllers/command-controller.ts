import { BotContext } from '../models/bot-context';
import { SshExecutionResult } from '../models/ssh-execution-result';
import { MachineService } from '../services/machine-service';
import { getShowExecutingView } from '../views/command/show-executing-view';
import { getShowExecutionResultView } from '../views/command/show-execution-result-view';
import { getStartInputCommandView } from '../views/command/start-input-command-view';

export class CommandController {
  constructor(
    private machine: MachineService,
  ) { }

  async startInputCommand(ctx: BotContext) {
    ctx.session.state = 'startInputCommand';

    const startInputCommandView = getStartInputCommandView();

    return ctx.reply(startInputCommandView.text, {
      reply_markup: {
        resize_keyboard: true,
        keyboard: startInputCommandView.keyboard,
      },
    });
  }

  async showExecutionResult(ctx: BotContext) {
    const command = ctx.message.text;

    const showExecutingView = getShowExecutingView({ command });

    const message = await ctx.replyWithMarkdown(showExecutingView.text);

    let result: SshExecutionResult;
    let success = false;
    try {
      result = await this.machine.executeCommand(command);
      success = true;
    } catch (e) {
    }
    const showExecutionResultView = getShowExecutionResultView({ success, command, result })

    return ctx.telegram.editMessageText(ctx.chat.id, message.message_id, null, showExecutionResultView.text, {
      parse_mode: 'Markdown',
    });
  }
}
