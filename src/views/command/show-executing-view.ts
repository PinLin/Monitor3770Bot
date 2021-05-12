import { BotContext } from '../../models/bot-context';
import { SshExecutionResult as SshExecutionResult } from '../../models/ssh-execution-result';

export interface ShowExecutingViewProps {
  command: string;
}

export function sendShowExecutingView(ctx: BotContext, props: ShowExecutingViewProps) {
  let text: string;
  text = "🖥️ 命令\n" +
    "\n" +
    `\`${props.command}\`\n` +
    "\n" +
    "命令執行中，請稍候 🔁\n";
  return ctx.replyWithMarkdown(text);
}
