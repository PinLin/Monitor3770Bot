import { BotContext } from '../interfaces/bot-context';
import { MachineService } from '../services/machine-service';
import { sendTestView } from '../views/test-view';

export class TestController {
  constructor(
    private machine: MachineService,
  ) { }

  async main(ctx: BotContext) {
    const command = 'echo 123 & echo 456 1>&2';
    try {
      const result = await this.machine.executeCommand(command);

      return sendTestView(ctx, { success: true, command, result });
    } catch (e) {
      return sendTestView(ctx, { success: false, command });
    }
  }
}
