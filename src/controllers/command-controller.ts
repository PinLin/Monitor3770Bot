import { SessionState } from '../enums/session-state';
import { BotContext } from '../models/bot-context';
import { MachineService } from '../services/machine-service';
import { getShowExecutingView } from '../views/command/show-executing-view';
import { getShowExecutionResultView } from '../views/command/show-execution-result-view';
import { getStartInputCommandView } from '../views/command/start-input-command-view';

export class CommandController {
  constructor(
    private machine: MachineService,
  ) { }

  async startInputCommand(ctx: BotContext) {
    ctx.session.state = SessionState.StartInputCommand;

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

    const firstMessage = await ctx.replyWithMarkdown(showExecutingView.text);

    const result = await this.machine.executeCommand(command);

    const showExecutionResultView = getShowExecutionResultView({
      success: result != null,
      command,
      result,
    })

    return ctx.telegram.editMessageText(ctx.chat.id, firstMessage.message_id, null, showExecutionResultView.text, {
      parse_mode: 'Markdown',
    });
  }
}
