import { BotContext } from '../models/bot-context';
import { MachineService } from '../services/machine-service';
import { sendShowExecutionResultView } from '../views/command/show-execution-result-view';

export class CommandController {
  constructor(
    private machine: MachineService,
  ) { }

  async showExecutionResult(ctx: BotContext) {
    const command = 'echo 123 & echo 456 1>&2';
    try {
      const result = await this.machine.executeCommand(command);

      return sendShowExecutionResultView(ctx, { success: true, command, result });
    } catch (e) {
      return sendShowExecutionResultView(ctx, { success: false, command });
    }
  }
}
