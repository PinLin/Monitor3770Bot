import { BotContext } from '../models/bot-context';
import { MachineService } from '../services/machine-service';
import { sendShowExecutingView } from '../views/command/show-executing-view';
import { sendShowExecutionResultView } from '../views/command/show-execution-result-view';
import { sendStartInputCommandView } from '../views/command/start-input-command-view';

export class CommandController {
  constructor(
    private machine: MachineService,
  ) { }

  async startInputCommand(ctx: BotContext) {
    ctx.session.state = 'startInputCommand';

    return sendStartInputCommandView(ctx);
  }

  async showExecutionResult(ctx: BotContext) {
    const command = ctx.message.text;

    await sendShowExecutingView(ctx, { command });

    try {
      const result = await this.machine.executeCommand(command);

      return sendShowExecutionResultView(ctx, { success: true, command, result });
    } catch (e) {
      return sendShowExecutionResultView(ctx, { success: false, command });
    }
  }
}
