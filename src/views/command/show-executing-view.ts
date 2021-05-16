export interface ShowExecutingViewProps {
  command: string;
}

export function getShowExecutingView(props: ShowExecutingViewProps) {
  return {
    text: "🖥️ 命令\n" +
      "\n" +
      `\`${props.command}\`\n` +
      "\n" +
      "命令執行中，請稍候 🔁\n",
  };
}
