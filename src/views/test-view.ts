import { BotContext } from '../interfaces/bot-context';
import { SshExecResult } from '../utils/ssh';

export interface TestViewProps {
  success: boolean;
  command: string;
  result?: SshExecResult;
}

export function sendTestView(ctx: BotContext, props: TestViewProps) {
  let text: string;
  if (props.success) {
    text = "🛠 測試\n" +
      "\n" +
      "STDIN\n" +
      `\`${props.command}\`\n` +
      "\n" +
      "STDOUT：\n" +
      `\`${props.result.stdout}\`\n` +
      "STDERR：\n" +
      `\`${props.result.stderr}\`\n` +
      "SSH 連線成功 ✅\n";

  } else {
    text = "🛠 測試\n" +
      "\n" +
      "SSH 連線失敗 ❌\n";
  }
  return ctx.replyWithMarkdown(text);
}
