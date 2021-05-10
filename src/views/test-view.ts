import { BotContext } from '../models/bot-context';
import { SshExecutionResult } from '../models/ssh-execution-result';

export interface TestViewProps {
  success: boolean;
  command: string;
  result?: SshExecutionResult;
}

export function sendTestView(ctx: BotContext, props: TestViewProps) {
  let text: string;
  if (props.success) {
    text = "🛠 測試\n" +
      "\n" +
      "STDIN:\n" +
      `\`${props.command}\`\n` +
      "\n" +
      "STDOUT:\n" +
      `\`${props.result.stdout}\`\n` +
      "STDERR:\n" +
      `\`${props.result.stderr}\`\n` +
      "Code:\n" +
      `\`${props.result.code}\`\n` +
      "\n" +
      "SSH 連線成功 ✅\n";

  } else {
    text = "🛠 測試\n" +
      "\n" +
      "SSH 連線失敗 ❌\n";
  }
  return ctx.replyWithMarkdown(text);
}
