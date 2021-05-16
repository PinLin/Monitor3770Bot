export interface SetMessageTextViewProps {
  username: string;
}

export function getSetMessageTextView(props: SetMessageTextViewProps) {
  const text = '✉️ 訊息傳送\n' +
    '\n' +
    `要傳送什麼訊息給 *${props.username}* 呢？`;
  const keyboard = [
    [{ text: '🔙 取消' }],
  ];

  return { text, keyboard };
}
