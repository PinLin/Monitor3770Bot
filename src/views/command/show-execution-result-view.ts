import { SshExecutionResult as SshExecutionResult } from '../../models/ssh-execution-result';

export interface ShowExecutionResultViewProps {
  success: boolean;
  command: string;
  result?: SshExecutionResult;
}

export function getShowExecutionResultView(props: ShowExecutionResultViewProps) {
  let text: string;
  if (props.success) {
    text = "🖥️ 命令\n" +
      "\n" +
      `\`${props.command}\`\n` +
      "\n" +
      "STDOUT:\n" +
      `\`${props.result.stdout}\`\n` +
      "STDERR:\n" +
      `\`${props.result.stderr}\`\n` +
      "Code:\n" +
      `\`${props.result.code}\`\n`;

  } else {
    text = "🖥️ 命令\n" +
      "\n" +
      `\`${props.command}\`\n` +
      "\n" +
      "命令執行失敗 ❌\n";
  }

  return { text };
}
