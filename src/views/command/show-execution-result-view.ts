import { SshExecutionResult } from '../../daemons/ssh-daemon/models/ssh-execution-result';

export interface ShowExecutionResultViewProps {
  success: boolean;
  command: string;
  result?: SshExecutionResult;
}

export function getShowExecutionResultView(props: ShowExecutionResultViewProps) {
  return { text: getText(props) };
}

function getText(props: ShowExecutionResultViewProps) {
  const builder = [] as string[];
  builder.push("🖥️ 命令");
  builder.push("");
  builder.push(`\`${props.command}\``);
  builder.push("");
  if (props.success) {
    builder.push("STDOUT:");
    builder.push(`\`${props.result.stdout}\``);
    builder.push("STDERR:");
    builder.push(`\`${props.result.stderr}\``);
    builder.push("Code:");
    builder.push(`\`${props.result.code}\``);
  } else {
    builder.push("命令執行失敗 ❌");
  }
  return builder.join('\n');
}
